
/**
 * This is a mini-display component that will load the selected display from the display list.
 */
import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, OnDestroy, EventEmitter, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
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
import { Validation } from "../../core/util/Validation";

@Component({
    selector: "cms-mini-display",
    template: require("./cms-mini-display.component.html"),
    styles: [require("./cms-mini-display.component.scss")]
})
/**
 * This class holds the behaviour for mini-display component, comprise of logic for zooming, Hammer zoom
 * keyboard zooming zoom outs, restructuring of tile size with zoom events and other mini-display events
 * @class CmsMiniDisplayComponent
 * @property {Display} display
 * @property {number} fitHeight
 * @property {EventEmitter<number>} zoomLevelEventEmitter
 * @property {EventEmitter<number>} displayUpdateEventEmitter
 * @property {any} miniDisplayStyle
 * @property {ISize} miniDisplaySize
 * @property {Tile[]} miniDisplayTilerList
 * @property {TileContent[]} miniDisplayContentList
 * @property {ISize} displaySize
 * @property {number} outController
 * @property {EventEmitter<any>} miniDisplayCmsEvent
 * @property {DomManager} domManager
 * @property {Subscription} scrollSubscription
 * @property {Subscription} windowResizeSubscription
 * @property {Subscription} touchstartSubscription
 * @property {Subscription} touchendSubscription
 * @constructor injects the components's required dependencies.
 */
export class CmsMiniDisplayComponent implements OnInit, OnChanges, OnDestroy {
    // required for zooming, sets and gets zoom level in integer
    @Output("onZoom") public zoomLevelEventEmitter: EventEmitter<number> = new EventEmitter<number>();
    // the input property will contain the selected display information
    @Input() public display: Display;
    // keep counter of fit height to listen its change
    @Input() public fitHeight: number;

    // it will contain mini display style
    private miniDisplayStyle: any = {
        width: "98%",
        height: "98%",
        margin: "20px"
    };
    // it will contain mini display size
    private miniDisplaySize: ISize;
    // the array will contain tiler list converted for mini display
    private miniDisplayTilerList: Tile[] = [];
    // the array will contain tiler content list converted for mini display
    private miniDisplayContentList: TileContent[] = [];
    // the array will contain tiler list coming from display
    private displayTilerList: Tile[] = [];
    // it will contain actual display size
    private displaySize: ISize;
    private outController: number = 0;
    // if true, it will show grid on mini-display based on tiler and content information
    private showDisplayContent: boolean = false;
    // it saves the CMS events subscription and unsubscribe them on component destruction
    private miniDisplayCmsEvent: EventEmitter<any>;
    // required for zooming, gets zoom level in integer
    private get zoomLevel(): number {
        return this.miniDisplayHelper.zoomLevel;
    }
    // required for zooming, sets zoom level in integer
    private set zoomLevel(zoom: number) {
        this.miniDisplayHelper.zoomLevel = zoom;
        this.zoomLevelEventEmitter.emit(100 + this.zoomLevel);
    }
    //Define domManager variable of DomaManager type to handle dom related stuff
    private domManager: DomManager;
    // mini display scroll subscription
    private scrollSubscription: Subscription;
    // window resize subscription
    private windowResizeSubscription: Subscription;
    // Touch subscriptions on document for pinch zoom gesture on mini display
    private touchstartSubscription: Subscription;
    private touchendSubscription: Subscription;

    constructor(
        private element: ElementRef,
        private miniDisplayHelper: CmsMiniDisplayService,
        private router: Router,
        private storageManager: StorageManager,
        private appConfig: AppConfig
    ) {
        //Initating the domManager instance
        this.domManager = new DomManager(this.element);
    }

    public ngOnInit(): void {
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

    public ngOnChanges(change: SimpleChanges): void {
        if (change["fitHeight"] && !change["fitHeight"].isFirstChange()) {
            this.fitByHeight();
        }
    }

    public ngOnDestroy(): void {
        // Unsubscribe cms events for mini-display component
        if (!Validation.IsUndefined(this.miniDisplayCmsEvent)) {
            this.miniDisplayCmsEvent.unsubscribe();
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
     * @method initDisplayTileInfoWithContent
     * @returns {void}
     */
    private initDisplayTileInfoWithContent(): void {
        this.miniDisplayTilerList = [];
        this.miniDisplayContentList = [];
        this.displayTilerList = [];
        this.showDisplayContent = false;
        // get selected display from session storage
        const display: any = this.storageManager.get(CMS_SESSION_STORAGE_ITEM.DISPLAY);
        this.display = JSON.parse(display);

        if (!Validation.IsUndefined(this.display) && !Validation.IsNull(this.display)) {
            this.appConfig.log(`CmsMiniDisplayComponent: initDisplayTileInfoWithContent::
             Display loaded on mini-display with Id = ${this.display.id}, Name = ${this.display.name}`);
            const container: HTMLElement = document.getElementById("mini-display-container");
            this.miniDisplayHelper.getMiniDisplayTilerInfoWithContent(this.display.id, container)
                .subscribe(
                (response: {
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
                    this.displaySize = response.displaySize;
                    this.miniDisplaySize = response.miniDisplaySize;
                    // Set  mini-display dimensions
                    this.miniDisplayStyle.width = `${this.miniDisplaySize.width}px`;
                    this.miniDisplayStyle.height = `${this.miniDisplaySize.height}px`;
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
                (error: any) => {
                    this.showDisplayContent = false;
                });
        }
    }

    /**
     * Subscribe for mini display scroll events to store scroll positions
     * @method subscribeScroller
     * @return {void}
     */
    private subscribeScroller(): void {
        const miniDisplayContainer: HTMLElement = document.getElementById("mini-display-container");
        this.scrollSubscription = Observable.fromEvent(miniDisplayContainer, "scroll")
            .map((e: UIEvent) => {
                const element: HTMLElement = <HTMLElement>(e.target || e.srcElement);

                return {
                    Left: element.scrollLeft,
                    Top: element.scrollTop
                };
            })
            .debounce(() => Observable.timer(200))
            .subscribe((v: any) => {
                this.miniDisplayHelper.scrollPosition = v;
            });
    }

    /**
     * Unsubscribe for mini display scroll events
     * @method unsubscribeScroller
     * @return {void}
     */
    private unsubscribeScroller(): void {
        if (this.scrollSubscription) {
            this.scrollSubscription.unsubscribe();
        }
    }

    /**
     * Unsubscribe touchstart and touchend subscriptions
     * @method unsubscribeTouchSubscriptions
     */
    private unsubscribeTouchSubscriptions(): void {
        if (this.touchstartSubscription) {
            this.touchstartSubscription.unsubscribe();
        }
        if (this.touchendSubscription) {
            this.touchendSubscription.unsubscribe();
        }
    }

    /**
     * Subscribe for window resize events
     * @method subscribeWindowResize
     * @return {void}
     */
    private subscribeWindowResize(): void {
        this.windowResizeSubscription = this.miniDisplayHelper.windowResizeEndEvent
            .subscribe(() => {
                this.initDisplayTileInfoWithContent();
            });
    }

    /**
     * Unsubscribe for window resize events
     * @method unsubscribeWindowResize
     * @return {void}
     */
    private unsubscribeWindowResize(): void {
        if (this.windowResizeSubscription) {
            this.windowResizeSubscription.unsubscribe();
        }
    }

    /**
     * This method handles various events corresponding to mini-display tiler and content.
     * @method handleMiniDisplayChangeEvent
     * @param {string} anEventType Specifies the type of the event.
     * @param {any} responseBody speciefies the body Object for the event.
     * @return {void}
     */
    private handleMiniDisplayChangeEvent(anEventType: string, responseBody: any): void {
        switch (anEventType) {
            // This event is received when tiles list and content list is updated on changing layout,
            // changing tiler, addition/deletion of content and updation of z-order.
            case "TilerAndContentUpdated":
                if (!Validation.IsUndefined(responseBody.tiles)) {
                    if (responseBody.tiles.length > 0) {
                        this.miniDisplayTilerList = this.miniDisplayHelper.calculateAdjustedViewTilerRectangles(responseBody.tiles);
                        this.displayTilerList = responseBody.tiles;
                    } else {
                        this.miniDisplayTilerList = [];
                        this.displayTilerList = [];
                    }
                }
                if (!Validation.IsUndefined(responseBody.content)) {
                    if (responseBody.content.length > 0) {
                        this.miniDisplayContentList = this.miniDisplayHelper.calculateAdjustedViewSourceRectangles(
                            responseBody.content,
                            this.miniDisplayContentList, false
                        );
                    } else {
                        this.miniDisplayContentList = [];
                    }
                }

                this.checkDisplayContentVisibility();
                this.appConfig.log("CmsMiniDisplayComponent: handleMiniDisplayChangeEvent:: Tiler and/or content updated.");
                break;

            // This event is received when content is repositioned on CMS mini-display tile or without tile
            case "ContentUpdated":

                if (!Validation.IsUndefined(this.miniDisplayContentList)) {
                    if (this.miniDisplayContentList.length > 0) {
                        const newContentList: TileContent[] = new Array(this.miniDisplayContentList.length);
                        for (let index: number = 0; index < this.miniDisplayContentList.length; index++) {
                            newContentList[index] = this.miniDisplayContentList[index];
                        }
                        for (let index: number = 0; index < newContentList.length; index++) {
                            if (newContentList[index].id === responseBody.content.id) {
                                newContentList[index] = this.miniDisplayHelper
                                    .calculateAdjustedViewSourceRectangle(responseBody.content, [], true);
                                break;
                            }
                        }

                        this.miniDisplayContentList = newContentList;
                        this.appConfig.log(`CmsMiniDisplayComponent: handleMiniDisplayChangeEvent::
                        Content [id: ${responseBody.content.id}] size or position updated.`);
                    }
                }
                break;

            // This event is received when current display property is updated
            case "DisplayUpdated":

                const display: Display = new Display(JSON.parse(this.storageManager.get(CMS_SESSION_STORAGE_ITEM.DISPLAY)));
                const displayResponse: Display = new Display(responseBody);
                // Re-initialize mini display when width or height of mini-display is changed
                if (display.width !== displayResponse.width || display.height !== displayResponse.height) {
                    this.initDisplayTileInfoWithContent();
                }
                // update display stored in session storage
                this.storageManager.set(CMS_SESSION_STORAGE_ITEM.DISPLAY, JSON.stringify(displayResponse));
                break;

            // This event is received when current display is deleted
            case "DisplayDeleted":

                if (this.display.id === responseBody.id) {
                    this.appConfig.log(`CmsMiniDisplayComponent: handleMiniDisplayChangeEvent::
                    Current display [id: ${responseBody.id}] deleted. Routing to display list.`);
                    // remove display from session storage and route to display list
                    this.storageManager.remove(CMS_SESSION_STORAGE_ITEM.DISPLAY);
                    this.router.navigate(["/displays-panel"]);
                }
                break;

            // This event is received when source on tile is updated
            case "ResourceUpdated":

                if (!Validation.IsUndefined(this.miniDisplayContentList)) {
                    if (this.miniDisplayContentList.length > 0) {
                        const newContentList: TileContent[] = new Array(this.miniDisplayContentList.length);
                        for (let index: number = 0; index < this.miniDisplayContentList.length; index++) {
                            newContentList[index] = this.miniDisplayContentList[index];
                        }
                        for (let index: number = 0; index < newContentList.length; index++) {
                            if (newContentList[index].resourceId === responseBody.id
                                && newContentList[index].type === responseBody.type) {
                                newContentList[index].name = responseBody.name;
                                newContentList[index].snapshotPath = responseBody.snapshotPath;
                                newContentList[index].lastModified = Date.now().toString();
                                break;
                            }
                        }
                        this.miniDisplayContentList = newContentList;
                        this.appConfig.log(`CmsMiniDisplayComponent: handleMiniDisplayChangeEvent::
                        Content source [id: ${responseBody.id}] updated with name or snapshot path.`);
                    }
                }
                break;

            // This event is received when source on tile is deleted
            case "ResourceDeleted":
                if (!Validation.IsUndefined(this.miniDisplayContentList)) {
                    this.miniDisplayContentList = this.miniDisplayContentList
                        .filter((content: TileContent) => content.resourceId !== responseBody.id);
                    this.appConfig.log(`CmsMiniDisplayComponent: handleMiniDisplayChangeEvent::
                    Content source [id: ${responseBody.id}] removed.`);
                    this.checkDisplayContentVisibility();
                }
                break;
            default:
        }
    }

    /**
     * This method checks if display content has to be shown or not.
     * If true, display content is shown otherwise load layout button is shown.
     * @method checkDisplayContentVisibility
     * @return {void}
     */
    private checkDisplayContentVisibility(): void {
        this.showDisplayContent = (
            !Validation.IsUndefined(this.miniDisplayTilerList) && this.miniDisplayTilerList.length > 0)
            || (!Validation.IsUndefined(this.miniDisplayContentList) && this.miniDisplayContentList.length > 0);
    }

    /**
     * This method creates a manager for registering "PAN" and "PINCH" touch gestures.
     * Various other touch gestures (such as TAP, DOUBLE-TAP) can also be created and added as
     * reconizers in manager.
     * @method configureTouchGestures
     * @return {void}
     */
    private configureTouchGestures(): void {
        // get reference to an element
        const miniDisplayContainer: HTMLElement = this.element.nativeElement.children[0];
        const manager: HammerManager = new Hammer.Manager(miniDisplayContainer, {
            recognizers: [
                // RecognizerClass, [options], [recognizeWith, ...], [requireFailure, ...]
                [Hammer.Pinch, { enable: false }]
            ],
            domEvents: false
        });
        this.configurePinchZoomOnMiniDisplay(manager);
    }

    /**
     * This method calculate zoom level of mini-display on tablet browser.
     * @method configurePinchZoomOnMiniDisplay
     * @param {HammerManager} manager specifies Hammer JS instance for handling complex touch events.
     * @return {void}
     */
    private configurePinchZoomOnMiniDisplay(manager: HammerManager): void {
        //enable pinch zoom when touched with two fingers
        const enablePinch: any = (event: TouchEvent): void => {
            if (event.touches.length === 2) {
                manager.get("pinch").set({
                    enable: true
                });
            }
        };
        // disable pinch zoom on touchend
        const disablePinch: any = (event: TouchEvent): void => {
            manager.get("pinch").set({
                enable: false
            });
        };
        this.touchstartSubscription = Observable.fromEvent(document, "touchstart")
            .subscribe(enablePinch);
        this.touchendSubscription = Observable.fromEvent(document, "touchend")
            .subscribe(disablePinch);

        manager.on("pinchin", (e: any) => {
            this.outController = 0;
            this.zoom(1);
        });

        manager.on("pinchout", (e: any) => {
            if (this.outController === 0) {
                this.outController = 1;
                e.preventDefault();

                return false;
            }
            this.zoom(-1);
        });
    }

    /**
     * This method calculate zoom level of mini-display on desktop browser.
     * @method zoomMiniDisplayOnBrowser
     * @param {Event} event Browser event [keyboard].
     * @returns {void}
     */
    private zoomMiniDisplayOnBrowser(event: any): void {
        if (!event.ctrlKey) {
            return;
        }
        // perform zoom out on CTRL++
        if (event.which === 61 || event.which === 107 || event.which === 187) {
            this.zoom(-100);
        } else if (event.which === 173 || event.which === 109 || event.which === 189) {
            // perform zoom in on CTRL--
            this.zoom(100);
        } else {
            // perform zoom in or out on CTRL + MouseWheel
            this.zoom(event.deltaY);
        }
    }

    /**
     * This method resizes mini-display based on zoom level.
     * @method zoom
     * @param {number} deltaY, specifies the marginal zooming value on the scrolls or pinch.
     * @returns {void}
     */
    private zoom(deltaY: number): void {
        const currentWidth: number = parseInt(this.miniDisplayStyle.width, 10);
        const currentHeight: number = parseInt(this.miniDisplayStyle.height, 10);
        // container is the first div of component template
        const container: HTMLElement = document.getElementById("mini-display-container");
        const containerWidth: number = container.getBoundingClientRect().width;
        const containerHeight: number = container.getBoundingClientRect().height;
        const deltaZoom: number = 10;
        const scrollWidth: number = 23;

        // perform zoom in
        if (deltaY < 0 && this.zoomLevel < 900) {
            this.zoomLevel += deltaZoom;
        } else if (deltaY > 0 && this.zoomLevel > 0) {
            // perform zoom out
            this.zoomLevel -= deltaZoom;
        }

        this.miniDisplayStyle.width = `${this.miniDisplaySize.width + (this.miniDisplaySize.width
            * this.zoomLevel / 100)}px`;
        const newHeight: number = this.miniDisplaySize.height + (this.miniDisplaySize.height * this.zoomLevel / 100);
        this.miniDisplayStyle.height = `${Math.floor(newHeight)}px`;
        const margin: number = (container.getBoundingClientRect().height - scrollWidth - newHeight) / 2;
        this.miniDisplayStyle.margin = `${margin > 20 ? margin : 20}px 20px`;
    }

    /**
     * Add event listeners related to this component
     * @method addMiniDisplayEventListeners
     * @return {void}
     */
    private addMiniDisplayEventListeners(): void {
        // add WheelEvent listener for zoom in and out
        const container: HTMLElement[] = this.domManager
            .GetElementsByClassName("cms-mini-display-container");
        if (container.length > 0) {
            EventManager.addEventOnElement(
                container[0],
                "wheel",
                this.zoomMiniDisplayOnBrowser.bind(this)
            );
            EventManager.addEventOnElement(
                container[0],
                "keydown",
                this.zoomMiniDisplayOnBrowser.bind(this)
            );
        }
    }

    /**
     * Remove event listeners related to this component
     * @method removeEventListeners
     * @return {void}
     */
    private removeEventListeners(): void {
        // remove WheelEvent listener for zoom in and out on desktop browser
        const container: HTMLElement[] = this.domManager
            .GetElementsByClassName("cms-mini-display-container");
        if (container.length > 0) {
            EventManager.removeEventOnElement(
                container[0],
                "wheel",
                this.zoomMiniDisplayOnBrowser.bind(this)
            );
            EventManager.removeEventOnElement(
                container[0],
                "keydown",
                this.zoomMiniDisplayOnBrowser.bind(this)
            );
        }
    }

    /**
     * This method sets focus on mini-display container. It is required for zooming in browser
     * using CTRL++ and CTRL-- options.
     * @method setFocusOnMiniDisplayContainer
     * @return {void}
     */
    private setFocusOnMiniDisplayContainer(): void {
        document.getElementById("mini-display-container").focus();
    }

    /**
     * set mini-display to be fit by height on the scree
     * @method fitByHeight
     * @return {void}
     */
    private fitByHeight(): void {
        this.zoomLevel = this.miniDisplayHelper.fitHeightZoomLevel;
        this.zoom(null);
    }

    /**
     * Gives the subcription to the min-display events, based on the event type fired by the user.
     * @method subscribeCMSEvents
     * @return {void}
     */
    private subscribeCMSEvents(): void {
        this.miniDisplayCmsEvent = CmsEventEmitterService.get(CMS_EVENTS.MiniDisplay)
            .subscribe((res: { eventType: string, body: any, displayId: number }) => {
                // return if event received is for other display
                if (res.displayId !== this.display.id && res.eventType !== "ResourceUpdated"
                    && res.eventType !== "ResourceDeleted") {
                    return;
                }
                this.appConfig.log("CmsMiniDisplayComponent: Display change event received.");
                this.handleMiniDisplayChangeEvent(res.eventType, res.body);
            });
    }
}
