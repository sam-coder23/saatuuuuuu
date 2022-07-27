/**
 * This is a mini-display component that will load the selected display from the display list.
 */
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from "@angular/core";
import { Router } from "@angular/router";
import { Subscription, fromEvent, map, timer, debounce } from "rxjs";

import { CmsEventEmitterService } from "../../cms/api/cms-event-emitter.service";
import { CMS_EVENTS } from "../../cms/api/cms-events.enum";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { CmsSessionStorageItem } from "../../cms/models/cms-session-storage-item";
import { ISize } from "../../cms/models/cms-size";
import { Tile } from "../../cms/models/cms-tile";
import { TileContent } from "../../cms/models/cms-tile-content";
import { AppConfig } from "../../config";
import { Validation } from "../../core/util/Validation";
import { DomManager } from "../../utils/dom-manager.util";
import { EventManager } from "../../utils/event-manager.util";
import { ParsingManager } from "../../utils/parsing-manager-util";
import { Display } from "./../../cms/models/cms-display";
import { CmsMiniDisplayService } from "./cms-mini-display.service";
import Hammer from 'hammerjs';

@Component({
    selector: 'cms-mini-display',
    templateUrl: './cms-mini-display.component.html',
    styleUrls: ['./cms-mini-display.component.scss']
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
    public miniDisplayStyle: any = {
        width: "98%",
        height: "98%",
        margin: "20px"
    };
    // it will contain mini display size
    private miniDisplaySize: ISize;
    // the array will contain tiler list converted for mini display
    public miniDisplayTilerList: Tile[] = [];
    // the array will contain tiler content list converted for mini display
    public miniDisplayContentList: TileContent[] = [];
    // the array will contain tiler list coming from display
    public displayTilerList: Tile[] = [];
    // it will contain actual display size
    private displaySize: ISize;
    private outController: number = 0;
    // if true, it will show grid on mini-display based on tiler and content information
    public showDisplayContent: boolean = false;
    // it saves the CMS events subscription and unsubscribe them on component destruction
    private miniDisplayCmsEvent: any;
    // required for zooming, gets zoom level in integer
    private get zoomLevel(): number {
        return this.miniDisplayHelper.zoomLevel;
    }
    // required for zooming, sets zoom level in integer
    private set zoomLevel(zoom: number) {
        const defaultZoomLevel: number = 100;
        this.miniDisplayHelper.zoomLevel = zoom;
        this.zoomLevelEventEmitter.emit(defaultZoomLevel + this.zoomLevel);
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
        if (!Validation.IS_UNDEFINED(this.miniDisplayCmsEvent)) {
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
        const display: any = this.storageManager.getItem(CmsSessionStorageItem.DISPLAY);
        this.display = JSON.parse(display);

        if (!Validation.IS_UNDEFINED(this.display) && !Validation.IS_NULL(this.display)) {
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
                    const defaultZoomLevel: number = 100;
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
                    this.zoom(undefined);
                    this.zoomLevelEventEmitter.emit(defaultZoomLevel + this.zoomLevel);
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
        const timeValue: number = 200;
        this.scrollSubscription = fromEvent(miniDisplayContainer, "scroll").pipe(
            map((e: UIEvent) => {
                const element: HTMLElement = <HTMLElement>(e.target || e.srcElement);

                return {
                    Left: element.scrollLeft,
                    Top: element.scrollTop
                };
            }),
            debounce(() => timer(timeValue))
            )
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
     * Handles TilerAndContentUpdated event
     * @method handleTilerAndContentUpdated
     * @return {void}
     */
    private handleTilerAndContentUpdated(responseBody: any): void {
        if (!Validation.IS_UNDEFINED(responseBody.tiles)) {
            if (responseBody.tiles.length > 0) {
                this.miniDisplayTilerList = this.miniDisplayHelper.calculateAdjustedViewTilerRectangles(responseBody.tiles);
                this.displayTilerList = responseBody.tiles;
            } else {
                this.miniDisplayTilerList = [];
                this.displayTilerList = [];
            }
        }
        if (!Validation.IS_UNDEFINED(responseBody.content)) {
            if (responseBody.content.length > 0) {
                this.miniDisplayContentList = this.miniDisplayHelper.calculateAdjustedViewSourceRectangles(
                    responseBody.content,
                    this.miniDisplayContentList, false
                );
            } else {
                this.miniDisplayContentList = [];
            }
        }
    }

    /**
     * Handles ContentUpdated event
     * @method handleContentUpdated
     * @return {void}
     */
    private handleContentUpdated(responseBody: any): void {
        if (!Validation.IS_UNDEFINED(this.miniDisplayContentList) && this.miniDisplayContentList.length > 0) {
            const newContentList: TileContent[] = new Array(this.miniDisplayContentList.length);
            this.miniDisplayContentList.forEach((tileContent: TileContent, index: number) => {
                newContentList[index] = tileContent;
            });

            const newContentIndex: number = newContentList.findIndex((tileContent: TileContent) => {
                return tileContent.id === responseBody.content.id;
            });

            if (newContentIndex > -1) {
                newContentList[newContentIndex] = this.miniDisplayHelper
                    .calculateAdjustedViewSourceRectangle(responseBody.content, [], true);
            }

            this.miniDisplayContentList = newContentList;
            this.appConfig.log(`CmsMiniDisplayComponent: handleMiniDisplayChangeEvent::
                        Content [id: ${responseBody.content.id}] size or position updated.`);
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
                this.handleTilerAndContentUpdated(responseBody);
                this.checkDisplayContentVisibility();
                this.appConfig.log("CmsMiniDisplayComponent: handleMiniDisplayChangeEvent:: Tiler and/or content updated.");
                break;

            // This event is received when content is repositioned on CMS mini-display tile or without tile
            case "ContentUpdated":
                this.handleContentUpdated(responseBody);
                break;

            // This event is received when current display property is updated
            case "DisplayUpdated":

                const display: Display = new Display(JSON.parse(this.storageManager.getItem(CmsSessionStorageItem.DISPLAY)));
                const displayResponse: Display = new Display(responseBody);
                // Re-initialize mini display when width or height of mini-display is changed
                if (display.width !== displayResponse.width || display.height !== displayResponse.height) {
                    this.initDisplayTileInfoWithContent();
                }
                // update display stored in session storage
                this.storageManager.setItem(CmsSessionStorageItem.DISPLAY, JSON.stringify(displayResponse));
                break;

            // This event is received when current display is deleted
            case "DisplayDeleted":

                if (this.display.id === responseBody.id) {
                    this.appConfig.log(`CmsMiniDisplayComponent: handleMiniDisplayChangeEvent::
                    Current display [id: ${responseBody.id}] deleted. Routing to display list.`);
                    // remove display from session storage and route to display list
                    this.storageManager.removeItem(CmsSessionStorageItem.DISPLAY);
                    this.router.navigate(["/displays-panel"]);
                }
                break;

            // This event is received when source on tile is updated
            case "ResourceUpdated":

                if (!Validation.IS_UNDEFINED(this.miniDisplayContentList) && this.miniDisplayContentList.length > 0) {
                        const newContentList: TileContent[] = new Array(this.miniDisplayContentList.length);
                        this.miniDisplayContentList.forEach((tileContent: TileContent, index: number) => {
                            newContentList[index] = tileContent;
                        });
                        for (const content of newContentList) {
                            if (content.resourceId === responseBody.id
                                && content.type === responseBody.type) {
                                content.name = responseBody.name;
                                content.snapshotPath = responseBody.snapshotPath;
                                content.lastModified = Date.now().toString();
                                break;
                            }
                        }
                        this.miniDisplayContentList = newContentList;
                        this.appConfig.log(`CmsMiniDisplayComponent: handleMiniDisplayChangeEvent::
                        Content source [id: ${responseBody.id}] updated with name or snapshot path.`);
                }
                break;

            // This event is received when source on tile is deleted
            case "ResourceDeleted":
                if (!Validation.IS_UNDEFINED(this.miniDisplayContentList)) {
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
            !Validation.IS_UNDEFINED(this.miniDisplayTilerList) && this.miniDisplayTilerList.length > 0)
            || (!Validation.IS_UNDEFINED(this.miniDisplayContentList) && this.miniDisplayContentList.length > 0);
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
            const touchLength: number = 2;
            if (event.touches.length === touchLength) {
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
        this.touchstartSubscription = fromEvent(document, "touchstart").subscribe(() => enablePinch);
        this.touchendSubscription = fromEvent(document, "touchend").subscribe(() => disablePinch);

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
            return true;
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
        const eventCtrlKeys: any = {
            numAddKey: 107,
            numMinusKey: 109,
            minKey: 173,
            plusKey: 61,
            defaultKey: 187,
            default2Key: 189,
            ctrlrKey: 82
        };
        const defaultZoomIn: number = 100;
        const defaultZoomOut: number = -100;
        // perform zoom out on CTRL++
        if (event.which === eventCtrlKeys.plusKey || event.which === eventCtrlKeys.numAddKey || event.which === eventCtrlKeys.defaultKey) {
            this.zoom(defaultZoomOut);
        } else if (event.which === eventCtrlKeys.minKey || event.which === eventCtrlKeys.numMinusKey || event.which === eventCtrlKeys.default2Key) {
            // perform zoom in on CTRL--
            this.zoom(defaultZoomIn);
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
        const currentWidth: number = ParsingManager.TO_INTEGER(this.miniDisplayStyle.width);
        const currentHeight: number = ParsingManager.TO_INTEGER(this.miniDisplayStyle.height);
        // container is the first div of component template
        const container: HTMLElement = document.getElementById("mini-display-container");
        const containerWidth: number = container.getBoundingClientRect().width;
        const containerHeight: number = container.getBoundingClientRect().height;
        const deltaZoom: number = 10;
        const scrollWidth: number = 23;
        const minimumZoomLevel: number = 0;
        const maximumZoomLevel: number = 900;
        const defaultPercent: number = 100;
        const marginDivisor: number = 2;
        const defaultMargin: number = 20;

        // perform zoom in
        if (deltaY < minimumZoomLevel && this.zoomLevel < maximumZoomLevel) {
            this.zoomLevel += deltaZoom;
        } else if (deltaY > minimumZoomLevel && this.zoomLevel > minimumZoomLevel) {
            // perform zoom out
            this.zoomLevel -= deltaZoom;
        }

        this.miniDisplayStyle.width = `${this.miniDisplaySize.width + (this.miniDisplaySize.width
            * this.zoomLevel / defaultPercent)}px`;
        const newHeight: number = this.miniDisplaySize.height + (this.miniDisplaySize.height * this.zoomLevel / defaultPercent);
        this.miniDisplayStyle.height = `${Math.floor(newHeight)}px`;
        const margin: number = (container.getBoundingClientRect().height - scrollWidth - newHeight) / marginDivisor;
        this.miniDisplayStyle.margin = `${margin > defaultMargin ? margin : defaultMargin}px 20px`;
    }

    /**
     * Add event listeners related to this component
     * @method addMiniDisplayEventListeners
     * @return {void}
     */
    private addMiniDisplayEventListeners(): void {
        // add WheelEvent listener for zoom in and out
        const container: HTMLElement[] = this.domManager
            .getElementsByClassName("cms-mini-display-container");
        if (container.length > 0) {
            EventManager.ADD_EVENT_ON_ELEMENT(
                container[0],
                "wheel",
                this.zoomMiniDisplayOnBrowser.bind(this)
            );
            EventManager.ADD_EVENT_ON_ELEMENT(
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
            .getElementsByClassName("cms-mini-display-container");
        if (container.length > 0) {
            EventManager.REMOVE_EVENT_ON_ELEMENT(
                container[0],
                "wheel",
                this.zoomMiniDisplayOnBrowser.bind(this)
            );
            EventManager.REMOVE_EVENT_ON_ELEMENT(
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
    public setFocusOnMiniDisplayContainer(): void {
        document.getElementById("mini-display-container").focus();
    }

    /**
     * set mini-display to be fit by height on the scree
     * @method fitByHeight
     * @return {void}
     */
    private fitByHeight(): void {
        this.zoomLevel = this.miniDisplayHelper.fitHeightZoomLevel;
        this.zoom(undefined);
    }

    /**
     * Gives the subcription to the min-display events, based on the event type fired by the user.
     * @method subscribeCMSEvents
     * @return {void}
     */
    private subscribeCMSEvents(): void {
        this.miniDisplayCmsEvent = CmsEventEmitterService.REGISTER(CMS_EVENTS.MiniDisplay)
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
