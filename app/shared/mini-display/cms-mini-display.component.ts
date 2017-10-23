/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, OnDestroy, EventEmitter, ElementRef } from "@angular/core";
import { Router } from "@angular/router";

import { CmsResource } from "./../../cms/models/cms-resource";
import { Tile } from "../../cms/models/cms-tile";
import { TileContent } from "../../cms/models/cms-tile-content";
import { ISize } from "../../cms/models/cms-size";
import { CmsEventEmitterService } from "../../cms/api/cms-event-emitter.service";
import { CMS_EVENTS } from "../../cms/api/cms-events.enum";
import { CmsMiniDisplayService } from "./cms-mini-display.service";
import { CMS_SESSION_STORAGE_ITEM } from "../../cms/models/cms-session-storage-item";
import { Display } from "./../../cms/models/cms-display";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { DomManager } from "../../utils/dom-manager.util";
import { EventManager } from "../../utils/event-manager.util";
import { AppConfig } from "../../config";
import { Subscription, Observable } from "rxjs/Rx";



/**
 * This is a mini-display component that will load the selected display from the display list.
 */
@Component({
    //moduleId: module.id,
    selector: "cms-mini-display",
    template: require("to-string!./cms-mini-display.component.html"),
    styles: [require("to-string!./cms-mini-display.component.scss")]
})
export class CmsMiniDisplayComponent implements OnInit, OnChanges, OnDestroy {
    /**
     * Properties
     */

    // the input property will contain the selected display information
    @Input() display: Display;

    // keep counter of fit height to listen its change
    @Input() fitHeight: number;

    // required for zooming, sets and gets zoom level in integer
    @Output("onZoom") zoomLevelEventEmitter: EventEmitter<number> = new EventEmitter<number>();

    /**
     * This will reponsible to commmunicate to its parent component once
     * display get update from event coming server
     * @Output {EventEmitter<any>} displayUpdate
     */
    @Output("displayUpdate") displayUpdateEventEmitter: EventEmitter<any> = new EventEmitter<any>();

    // it will contain mini display style
    mMiniDisplayStyle = {
        width: "98%",
        height: "98%",
        margin: "20px"
    };

    // it will contain mini display size
    private mMiniDisplaySize: ISize;

    // the array will contain tiler list converted for mini display
    miniDisplayTilerList: Tile[] = [];

    // the array will contain tiler content list converted for mini display
    miniDisplayContentList: TileContent[] = [];

    // the array will contain tiler list coming from display
    displayTilerList: Tile[] = [];

    // it will contain actual display size
    private mDisplaySize: ISize;

    // if true, it will show grid on mini-display based on tiler and content information
    private mShowDisplayContent: boolean = false;

    // it saves the CMS events subscription and unsubscribe them on component destruction
    private mMiniDisplayCmsEvent: EventEmitter<any>;

    // required for zooming, gets zoom level in integer
    private get zoomLevel(): number {
        return this.miniDisplayHelper.zoomLevel;
    };

    // required for zooming, sets zoom level in integer
    private set zoomLevel(zoom: number) {
        this.miniDisplayHelper.zoomLevel = zoom;
        this.zoomLevelEventEmitter.emit(100 + this.zoomLevel);
    };

    //Define domManager variable of DomaManager type to handle dom related stuff
    private domManager: DomManager;

    // mini display scroll subscription
    private scrollSubscription: Subscription;

    // window resize subscription
    private windowResizeSubscription: Subscription;

    /**
     * Touch subscriptions on document for pinch zoom gesture on mini display
     */
    private touchstartSubscription: Subscription;
    private touchendSubscription: Subscription;

    /**
     * Public Methods
     */

    constructor(private element: ElementRef, private miniDisplayHelper: CmsMiniDisplayService, private router: Router, private storageManager: StorageManager, private appConfig: AppConfig) {
        //Initating the domManager instance
        this.domManager = new DomManager(this.element);
    }

    /**
     * Initialize the component.
     * Here we are fetching the display tile and content information from CMS API and
     * subscribing for the CMS events for mini-display component.
     */
    public ngOnInit() {
        if (this.miniDisplayHelper.display && this.miniDisplayHelper.display.id !== this.display.id) {
            this.miniDisplayHelper.init();
        }
        this.miniDisplayHelper.display = this.display;

        this.initDisplayTileInfoWithContent();
        this.subscribeCMSEvents();
        this.addMiniDisplayEventListeners();
        this.configureTouchGestures();
        this.subscribeScroller();
        this.subscribeWindowResize();
    }

    /**
     * This method is called when input property changes.
     */
    public ngOnChanges(change: SimpleChanges) {
        if (change["fitHeight"] && !change["fitHeight"].isFirstChange()) {
            this.fitByHeight();
        }
    }

    /**
     * Cleanup just before Angular destroys the component. 
     * Unsubscribe observables and detach event handlers to avoid memory leaks.
     */
    public ngOnDestroy() {
        // Unsubscribe cms events for mini-display component
        if (this.mMiniDisplayCmsEvent !== undefined) {
            this.mMiniDisplayCmsEvent.unsubscribe();
        }

        this.removeEventListeners();
        this.unsubscribeScroller();
        this.unsubscribeWindowResize();
        this.unsubscribeTouchSubscriptions();
    }

    /**
     * This method fetches tiler and content info for selected display.
     * If tiler or tiler data is available, then grid will be shown on mini-display.
     * Otherwise, load layout button is shown.
     */
    public initDisplayTileInfoWithContent() {
        this.miniDisplayTilerList = [];
        this.miniDisplayContentList = [];
        this.displayTilerList = [];
        this.mShowDisplayContent = false;

        // get selected display from session storage
        let display = this.storageManager.get(CMS_SESSION_STORAGE_ITEM.Display);
        this.display = JSON.parse(display);

        this.appConfig.log(`CmsMiniDisplayComponent: initDisplayTileInfoWithContent:: Display loaded on mini-display with Id = ${this.display.id}, Name = ${this.display.name}`);

        if (this.display !== null && this.display !== undefined) {
            let container: HTMLElement = this.domManager.NthChild(0);
            this.miniDisplayHelper.getMiniDisplayTilerInfoWithContent(this.display.id, container)
                .subscribe((response: {
                    displaySize: ISize,
                    miniDisplayTilerList: Tile[],
                    miniDisplayContentList: TileContent[],
                    displayTilerList: Tile[],
                    miniDisplaySize: ISize
                }) => {
                    this.appConfig.log("CmsMiniDisplayComponent: initDisplayTileInfoWithContent");

                    // initialize details to be sent to grid
                    this.miniDisplayTilerList = response.miniDisplayTilerList;
                    this.miniDisplayContentList = response.miniDisplayContentList;

                    this.displayTilerList = response.displayTilerList;

                    this.mDisplaySize = response.displaySize;
                    this.mMiniDisplaySize = response.miniDisplaySize;

                    // Set  mini-display dimensions
                    this.mMiniDisplayStyle.width = `${this.mMiniDisplaySize.width}px`;
                    this.mMiniDisplayStyle.height = `${this.mMiniDisplaySize.height}px`;

                    this.checkDisplayContentVisibility();

                    // init as per zoom level
                    this.zoom(null);
                    this.zoomLevelEventEmitter.emit(100 + this.zoomLevel);

                    // Immediately after mini-display content is rendered, set the scroll position
                    window.setTimeout(() => {
                        container.scrollLeft = this.miniDisplayHelper.scrollPosition.Left;
                        container.scrollTop = this.miniDisplayHelper.scrollPosition.Top;
                    }, 0);

                },
                error => {
                    this.mShowDisplayContent = false;
                });
        }
    }

    /**
     * Subscribe for mini display scroll events to store scroll positions
     */
    private subscribeScroller() {
        let miniDisplayContainer = document.getElementById("mini-display-container");
        this.scrollSubscription = Observable.fromEvent(miniDisplayContainer, "scroll")
            .map((e: UIEvent) => {
                let element = <HTMLElement>(e.target || e.srcElement);
                return {
                    Left: element.scrollLeft,
                    Top: element.scrollTop
                }
            })
            .debounce(() => Observable.timer(200))
            .subscribe((v) => {
                this.miniDisplayHelper.scrollPosition = v;
            });
    }

    /**
     * Unsubscribe for mini display scroll events
     */
    private unsubscribeScroller() {
        if (this.scrollSubscription) {
            this.scrollSubscription.unsubscribe();
        }
    }

    /**
     * Unsubscribe touchstart and touchend subscriptions
     */
    private unsubscribeTouchSubscriptions() {
        if (this.touchstartSubscription)
            this.touchstartSubscription.unsubscribe();

        if (this.touchendSubscription)
            this.touchendSubscription.unsubscribe();
    }


    /**
    * Subscribe for window resize events
    */
    private subscribeWindowResize() {
        this.windowResizeSubscription = this.miniDisplayHelper.windowResizeEndEvent
            .subscribe(() => {
                this.initDisplayTileInfoWithContent()
            });
    }


    /**
     * Unsubscribe for window resize events
     */
    private unsubscribeWindowResize() {
        if (this.windowResizeSubscription)
            this.windowResizeSubscription.unsubscribe();
    }


    /**
     * Get mini-display size
     */
    private getMiniDisplaySize(): ClientRect {
        let miniDisplay: HTMLElement[] = this.domManager.GetElementsByClassName("cms-mini-display");
        if (miniDisplay.length > 0) {
            return miniDisplay[0].getBoundingClientRect();
        }
    }

    /**
     * This method handles various events corresponding to mini-display tiler and content.
     */
    private handleMiniDisplayChangeEvent(anEventType: string, aResponseBody: any) {

        switch (anEventType) {
            // This event is received when tiles list and content list is updated on changing layout,
            // changing tiler, addition/deletion of content and updation of z-order.
            case "TilerAndContentUpdated":
                if (aResponseBody.tiles !== undefined) {
                    if (aResponseBody.tiles.length > 0) {
                        this.miniDisplayTilerList = this.miniDisplayHelper.calculateAdjustedViewTilerRectangles(aResponseBody.tiles);
                        this.displayTilerList = aResponseBody.tiles;
                    }
                    else {
                        this.miniDisplayTilerList = [];
                        this.displayTilerList = [];
                    }
                }
                if (aResponseBody.content !== undefined) {
                    if (aResponseBody.content.length > 0) {
                        this.miniDisplayContentList = this.miniDisplayHelper.calculateAdjustedViewSourceRectangles(aResponseBody.content, this.miniDisplayContentList, false);
                    }
                    else {
                        this.miniDisplayContentList = [];
                    }
                }

                this.checkDisplayContentVisibility();
                this.appConfig.log("CmsMiniDisplayComponent: handleMiniDisplayChangeEvent:: Tiler and/or content updated.");
                break;

            // This event is received when content is repositioned on CMS mini-display tile or without tile
            case "ContentUpdated":

                if (this.miniDisplayContentList !== undefined) {
                    if (this.miniDisplayContentList.length > 0) {
                        var newContentList = new Array(this.miniDisplayContentList.length);
                        for (var i = 0; i < this.miniDisplayContentList.length; i++) {
                            newContentList[i] = this.miniDisplayContentList[i];
                        }

                        for (var i = 0; i < newContentList.length; i++) {
                            if (newContentList[i].id === aResponseBody.content.id) {
                                newContentList[i] = this.miniDisplayHelper.calculateAdjustedViewSourceRectangle(aResponseBody.content, [], true);
                                break;
                            }
                        }

                        this.miniDisplayContentList = newContentList;
                        this.appConfig.log(`CmsMiniDisplayComponent: handleMiniDisplayChangeEvent:: Content [id: ${aResponseBody.content.id}] size or position updated.`);
                    }
                }
                break;

            // This event is received when current display property is updated
            case "DisplayUpdated":

                let display = JSON.parse(this.storageManager.get(CMS_SESSION_STORAGE_ITEM.Display));

                // update display name in the toolbar
                if (display.name !== aResponseBody.name) {
                    this.displayUpdateEventEmitter.emit(aResponseBody);
                }

                // Re-initialize mini display when width or height of mini-display is changed
                if (display.width !== aResponseBody.width || display.height !== aResponseBody.height) {
                    this.initDisplayTileInfoWithContent();
                }

                // update display stored in session storage
                this.storageManager.set(CMS_SESSION_STORAGE_ITEM.Display, JSON.stringify(aResponseBody));

                break;

            // This event is received when current display is deleted
            case "DisplayDeleted":

                if (this.display.id === aResponseBody.id) {
                    this.appConfig.log(`CmsMiniDisplayComponent: handleMiniDisplayChangeEvent:: Current display [id: ${aResponseBody.id}] deleted. Routing to display list.`);

                    // remove display from session storage and route to display list
                    this.storageManager.remove(CMS_SESSION_STORAGE_ITEM.Display);
                    this.router.navigate(["/displays-panel"]);
                }
                break;

            // This event is received when source on tile is updated
            case "ResourceUpdated":
                if (this.miniDisplayContentList !== undefined) {
                    if (this.miniDisplayContentList.length > 0) {
                        let newContentList: TileContent[] = new Array(this.miniDisplayContentList.length);
                        for (let i = 0; i < this.miniDisplayContentList.length; i++) {
                            newContentList[i] = this.miniDisplayContentList[i];
                        }

                        for (let i = 0; i < newContentList.length; i++) {
                            if (newContentList[i].resourceId === aResponseBody.id && newContentList[i].type === aResponseBody.type) {
                                newContentList[i].name = aResponseBody.name;
                                newContentList[i].snapshotPath = aResponseBody.snapshotpath;
                                newContentList[i].lastModified = Date.now().toString();
                                break;
                            }
                        }

                        this.miniDisplayContentList = newContentList;
                        this.appConfig.log(`CmsMiniDisplayComponent: handleMiniDisplayChangeEvent:: Content source [id: ${aResponseBody.id}] updated with name or snapshot path.`);
                    }
                }
                break;

            // This event is received when source on tile is deleted
            case "ResourceDeleted":

                if (this.miniDisplayContentList !== undefined) {
                    this.miniDisplayContentList = this.miniDisplayContentList.filter(content => content.resourceId !== aResponseBody.id);
                    this.appConfig.log(`CmsMiniDisplayComponent: handleMiniDisplayChangeEvent:: Content source [id: ${aResponseBody.id}] removed.`);

                    this.checkDisplayContentVisibility();
                }
                break;

            default:
        }
    }

    /**
     * This method checks if mini-display content list already updated with new content. 
     */
    private isContentAlreadyExist(contentId: number): boolean {
        for (let i = 0; i < this.miniDisplayContentList.length; i++) {
            if (this.miniDisplayContentList[i].id === contentId) {
                return true;
            }
        }
        return false;
    }

    /**
     * This method checks if display content has to be shown or not.
     * If true, display content is shown otherwise load layout button is shown.
     */
    private checkDisplayContentVisibility() {
        this.mShowDisplayContent = (this.miniDisplayTilerList !== undefined && this.miniDisplayTilerList.length > 0) || (this.miniDisplayContentList !== undefined && this.miniDisplayContentList.length > 0);
    }

    /**
     * This method creates a manager for registering "PAN" and "PINCH" touch gestures.
     * Various other touch gestures (such as TAP, DOUBLE-TAP) can also be created and added as
     * recocnizers in manager. 
     */
    private configureTouchGestures() {
        // get reference to an element
        var miniDisplayContainer: HTMLElement = this.element.nativeElement.children[0];
        var manager = new Hammer.Manager(miniDisplayContainer, {
            recognizers: [
                // RecognizerClass, [options], [recognizeWith, ...], [requireFailure, ...]
                [Hammer.Pinch, { enable: false }]
            ],

            domEvents: false,

        });

        this.configurePinchZoomOnMiniDisplay(manager);
    }

    private outController: Number = 0;
    /**
     * This method calculate zoom level of mini-display on tablet browser.
     */
    private configurePinchZoomOnMiniDisplay(manager: HammerManager) {
        /**
         * enable pinch zoom when touched with two fingers
         */
        function enablePinch(e: TouchEvent) {
            if (e.touches.length === 2) {
                manager.get("pinch").set({
                    enable: true
                });
            }
        }
        /**
         * disable pinch zoom on touchend
         */
        function disablePinch(e: TouchEvent) {
            manager.get("pinch").set({
                enable: false
            });
        }

        /**
         * Check for restrictions
         
        function check(e: HammerInput): boolean {
            if (e.type === "pinchin" && e.deltaY < 0) {
                return false;
            } else if (e.type === "pinchout" && e.deltaY > 0) {
                return false;
            }

            if (e.deltaY === this.deltaY) {
                return false;
            }
            this.deltaY = e.deltaY;

            return true;
        }
        */

        this.touchstartSubscription = Observable.fromEvent(document, "touchstart").subscribe(enablePinch);

        this.touchendSubscription = Observable.fromEvent(document, "touchend").subscribe(disablePinch);

        manager.on("pinchin", (e) => {
            this.outController = 0;
            this.zoom(1);
        });

        manager.on("pinchout", (e) => {
            if (this.outController == 0) {
                this.outController = 1;
                e.preventDefault();
                return false;
            }
            this.zoom(-1);
        });
    }

    /**
     * This method calculate zoom level of mini-display on desktop browser.
     */
    private zoomMiniDisplayOnBrowser(event) {
        if (!event.ctrlKey) {
            return;
        }

        // perform zoom out on CTRL++
        if (event.which === 61 || event.which === 107 || event.which === 187) {
            this.zoom(-100);
        }
        // perform zoom in on CTRL--
        else if (event.which === 173 || event.which === 109 || event.which === 189) {
            this.zoom(100);
        }
        // perform zoom in or out on CTRL + MouseWheel
        else {
            this.zoom(event.deltaY);
        }
    }

    /**
     * This method resizes mini-display based on zoom level.
     */
    private zoom(deltaY: number) {
        let currentWidth = parseInt(this.mMiniDisplayStyle.width);
        let currentHeight = parseInt(this.mMiniDisplayStyle.height);

        // container is the first div of component template
        let container: HTMLElement = this.domManager.NthChild(0),
            containerWidth = container.getBoundingClientRect().width,
            containerHeight = container.getBoundingClientRect().height,
            deltaZoom = 10, scrollWidth = 23;

        // perform zoom in
        if (deltaY < 0 && this.zoomLevel < 900) {
            this.zoomLevel += deltaZoom;
        }
        // perform zoom out
        else if (deltaY > 0 && this.zoomLevel > 0) {
            this.zoomLevel -= deltaZoom;
        }

        this.mMiniDisplayStyle.width = `${this.mMiniDisplaySize.width + (this.mMiniDisplaySize.width * this.zoomLevel / 100)}px`;
        let newHeight = this.mMiniDisplaySize.height + (this.mMiniDisplaySize.height * this.zoomLevel / 100);
        this.mMiniDisplayStyle.height = `${Math.floor(newHeight)}px`;

        let margin = (container.getBoundingClientRect().height - scrollWidth - newHeight) / 2;
        this.mMiniDisplayStyle.margin = `${margin > 20 ? margin : 20}px 20px`;
    }

    /**
     * Add event listeners related to this component 
     */
    private addMiniDisplayEventListeners(): void {
        // add WheelEvent listener for zoom in and out
        let container: HTMLElement[] = this.domManager.GetElementsByClassName("cms-mini-display-container");
        if (container.length > 0) {
            EventManager.addEventOnElement(container[0], "wheel", this.zoomMiniDisplayOnBrowser.bind(this));
            EventManager.addEventOnElement(container[0], "keydown", this.zoomMiniDisplayOnBrowser.bind(this));
        }
    }

    /**
     * Remove event listeners related to this component 
     */
    private removeEventListeners(): void {
        // remove WheelEvent listener for zoom in and out on desktop browser
        let container: HTMLElement[] = this.domManager.GetElementsByClassName("cms-mini-display-container");
        if (container.length > 0) {
            EventManager.removeEventOnElement(container[0], "wheel", this.zoomMiniDisplayOnBrowser.bind(this));
            EventManager.removeEventOnElement(container[0], "keydown", this.zoomMiniDisplayOnBrowser.bind(this));
        }

    }

    /**
     * This method sets focus on mini-display container. It is required for zooming in browser
     * using CTRL++ and CTRL-- options.
     */
    private setFocusOnMiniDisplayContainer() {
        document.getElementById("mini-display-container").focus();
    }

    /**
     * set mini-display to be fit by height on the screen
     */
    private fitByHeight() {
        this.zoomLevel = this.miniDisplayHelper.fitHeightZoomLevel;
        this.zoom(null);
    }


    private subscribeCMSEvents() {
        this.mMiniDisplayCmsEvent = CmsEventEmitterService.get(CMS_EVENTS.MiniDisplay).subscribe((res: { eventType: string, body: any, displayId: number }) => {
            // return if event received is for other display
            if (res.displayId !== this.display.id && res.eventType !== "ResourceUpdated" && res.eventType !== "ResourceDeleted") {
                return;
            }

            this.appConfig.log("CmsMiniDisplayComponent: Display change event received.");
            this.handleMiniDisplayChangeEvent(res.eventType, res.body);
        });
    }
}