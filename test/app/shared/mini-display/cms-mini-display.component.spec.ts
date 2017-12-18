import { MiniDisplay, MockDisplay, MockElementRef, mockDisplay, mockDisplayForService, miniDisplay, CmsMiniDisplayServiceStub, RouterStub, MockCmsEventEmitterService, EventCases, reFactoredTile, reFactoredSource, reFactoredTileContent } from "./cms-mini-display.component.mock";
import { ComponentFixture, TestBed, async, inject } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ElementRef, SimpleChanges } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Router } from "@angular/router";
import { HttpModule, Http } from "@angular/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { CmsMiniDisplayComponent } from "../../../../app/shared/mini-display/cms-mini-display.component";
import { AppConfig } from "../../../../app/config";
import { CmsMiniDisplayService } from "../../../../app/shared/mini-display/cms-mini-display.service";
import { EventManager } from "../../../../app/utils/event-manager.util";
import { StorageManager } from "../../../../app/cms/api/cms-storagemanager.service";
import { CMS_SESSION_STORAGE_ITEM } from "../../../../app/cms/models/cms-session-storage-item";

describe("CmsMiniDisplayComponent", () => {
    let component: CmsMiniDisplayComponent;
    let fixture: ComponentFixture<CmsMiniDisplayComponent>;
    let debugInstance, nativeElement;
    let element: ElementRef;
    let appConfig: AppConfig;
    let cmsMiniDisplayService: CmsMiniDisplayService;
    let cmsEventManager: EventManager;
    let fitHeight: number;
    let router: Router;
    let change: any = {
        "fitHeight": {
            "isFirstChange": function () { return null; }
        }
    };
    let logSpy: jasmine.Spy, navigateSpy, addEventSpy, deleteEventSpy, hammerOnSpy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CmsMiniDisplayComponent],
            providers: [
                { provide: ElementRef, useClass: MockElementRef },
                { provide: CmsMiniDisplayService, useClass: CmsMiniDisplayServiceStub },
                { provide: Router, useClass: RouterStub },
                { provide: EventManager },
                StorageManager,
                AppConfig,
            ],
            imports: [
                HttpModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: (http: Http) => new TranslateHttpLoader(http, "/app/i18n", ".json"),
                        deps: [Http]
                    }
                })
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(CmsMiniDisplayComponent);
            component = fixture.componentInstance;
            nativeElement = fixture.nativeElement;
            debugInstance = fixture.debugElement.componentInstance;
            component.display = mockDisplay;
            cmsMiniDisplayService = fixture.debugElement.injector.get(CmsMiniDisplayService);
            appConfig = fixture.debugElement.injector.get(AppConfig);
            router = fixture.debugElement.injector.get(Router);
            logSpy = spyOn(appConfig, "log").and.returnValue(Observable.of(null));
            addEventSpy = spyOn(EventManager, "addEventOnElement").and.returnValue(Observable.of(null));
            navigateSpy = spyOn(router, "navigate").and.returnValue(Observable.of(null));
            sessionStorage.setItem(CMS_SESSION_STORAGE_ITEM.DISPLAY, JSON.stringify(mockDisplay));
        });
    }));

    beforeEach(() => {
        sessionStorage.setItem(CMS_SESSION_STORAGE_ITEM.DISPLAY, JSON.stringify(mockDisplay));
        debugInstance.zoomlevel = 0;
        hammerOnSpy = spyOn(Hammer, "on").and.returnValue(Observable.of(null));
        component.fitHeight = 100;
    }
    );

    it("should set a base style for mini display at start", () => {
        expect(debugInstance.miniDisplayStyle.height).toEqual("98%");
        expect(debugInstance.miniDisplayStyle.width).toEqual("98%");
        expect(debugInstance.miniDisplayStyle.margin).toEqual("20px");
    });

    it("should unsubscribe all the events on Destroy", () => {
        cmsMiniDisplayService.init();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
        });
        component.ngOnDestroy();
        expect(debugInstance.miniDisplayCmsEvent.closed).toBeTruthy();
        expect(debugInstance.windowResizeSubscription.closed).toBeTruthy();
        expect(debugInstance.scrollSubscription.closed).toBeTruthy();
        expect(debugInstance.touchstartSubscription.closed).toBeTruthy();
        expect(debugInstance.touchendSubscription.closed).toBeTruthy();
    });

    it("should fit mini display to fit screen with no zoom on Changes", () => {
        cmsMiniDisplayService.init();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
        });
        component.ngOnChanges(change);
        expect(debugInstance.miniDisplayHelper.fitHeightZoomLevel).toEqual(100);
        expect(debugInstance.zoomlevel).toEqual(0);
    });

    it("should handle DisplayUpdated event", () => {
        let spyInitDisplayTileInfoWithContent = spyOn(debugInstance, "initDisplayTileInfoWithContent").and.returnValue(Observable.of(null));
        debugInstance.subscribeCMSEvents();
        debugInstance.miniDisplayCmsEvent.next(
            {
                "eventType": "DisplayUpdated",
                "body": EventCases.DisplayUpdated,
                "displayId": component.display.id,
            }
        );
        expect(spyInitDisplayTileInfoWithContent.calls.count()).toEqual(1);
        expect(JSON.parse(sessionStorage.getItem(CMS_SESSION_STORAGE_ITEM.DISPLAY))).toEqual(EventCases.DisplayUpdated);
    });

    it("should handle DisplayDeleted event", () => {
        debugInstance.subscribeCMSEvents();
        debugInstance.miniDisplayCmsEvent.next(
            {
                "eventType": "DisplayDeleted",
                "body": EventCases.DisplayDeleted,
                "displayId": component.display.id,
            }
        );
        let args = navigateSpy.calls.mostRecent().args;
        expect(args[0]).toEqual(["/displays-panel"]);
        expect(appConfig.log).toHaveBeenCalled();
        expect(sessionStorage.getItem(CMS_SESSION_STORAGE_ITEM.DISPLAY)).toBeNull();
    });

    it("should handle TilerAndContentUpdated event", () => {
        debugInstance.subscribeCMSEvents();
        debugInstance.miniDisplayCmsEvent.next(
            {
                "eventType": "TilerAndContentUpdated",
                "body": EventCases.TilerAndContentUpdated,
                "displayId": component.display.id,
            }
        );
        expect(debugInstance.miniDisplayTilerList).toEqual(reFactoredTile);
        expect(debugInstance.displayTilerList).toEqual(EventCases.TilerAndContentUpdated.tiles);
        expect(debugInstance.miniDisplayContentList).toEqual(reFactoredSource);
        expect(debugInstance.showDisplayContent).toBeTruthy();
        expect(appConfig.log).toHaveBeenCalled();
    });

    it("should handle ContentUpdated event", () => {
        debugInstance.miniDisplayContentList = reFactoredSource;
        debugInstance.subscribeCMSEvents();
        debugInstance.miniDisplayCmsEvent.next(
            {
                "eventType": "ContentUpdated",
                "body": EventCases.ContentUpdated,
                "displayId": component.display.id,
            }
        );
        expect(debugInstance.miniDisplayContentList[0]).toEqual(reFactoredTileContent);
        expect(appConfig.log).toHaveBeenCalled();
    });

    it("should handle ResourceUpdated event", () => {
        debugInstance.miniDisplayContentList = reFactoredSource;
        debugInstance.subscribeCMSEvents();
        debugInstance.miniDisplayCmsEvent.next(
            {
                "eventType": "ResourceUpdated",
                "body": EventCases.ResourceUpdated,
                "displayId": component.display.id,
            }
        );
        expect(debugInstance.miniDisplayContentList[0].name).toEqual(EventCases.ResourceUpdated.name);
        expect(debugInstance.miniDisplayContentList[0].snapshotPath).toEqual(EventCases.ResourceUpdated.snapshotPath);
        expect(appConfig.log).toHaveBeenCalled();
    });

    it("should handle ResourceDeleted event", () => {
        debugInstance.miniDisplayContentList = reFactoredSource;
        debugInstance.subscribeCMSEvents();
        debugInstance.miniDisplayCmsEvent.next(
            {
                "eventType": "ResourceDeleted",
                "body": EventCases.TilerAndContentUpdated,
                "displayId": component.display.id,
            }
        );
        expect(debugInstance.showDisplayContent).toBeTruthy();
    });

    it("should check for empty responseBody tiles and content in case of TilerAndContentUpdated event", () => {
        debugInstance.subscribeCMSEvents();
        EventCases.TilerAndContentUpdated.tiles.length = 0;
        EventCases.TilerAndContentUpdated.content.length = 0;
        debugInstance.miniDisplayCmsEvent.next(
            {
                "eventType": "TilerAndContentUpdated",
                "body": EventCases.TilerAndContentUpdated,
                "displayId": component.display.id,
            }
        );
        expect(debugInstance.miniDisplayContentList).toEqual([]);
        expect(debugInstance.miniDisplayTilerList).toEqual([]);
        expect(debugInstance.displayTilerList).toEqual([]);
    });

    it("should set keydown events for zooming on container", () => {
        let container = document.getElementsByClassName("cms-mini-display-container");
        expect(container.length).toEqual(1);

        debugInstance.addMiniDisplayEventListeners();
        expect(EventManager.addEventOnElement).toHaveBeenCalled();
        let args = addEventSpy.calls.mostRecent().args;
        expect(args[0]).toEqual(container[0]);
        expect(args[1]).toEqual("keydown");
    });

    it("should set the miniDisplay zoom in and out on pinching events", () => {
        debugInstance.configureTouchGestures();
        expect(debugInstance.touchstartSubscription).toBeDefined();
        expect(debugInstance.touchendSubscription).toBeDefined();
    });

    it("should scroll to new Left and Top position on scrolling", () => {
        cmsMiniDisplayService.init();
        let container = document.getElementById("mini-display-container");
        debugInstance.subscribeScroller();
        expect(debugInstance.scrollSubscription).toBeDefined();
        expect(debugInstance.miniDisplayHelper.scrollPosition.Left).toEqual(0);
        expect(debugInstance.miniDisplayHelper.scrollPosition.Top).toEqual(0);
        debugInstance.scrollSubscription.next({
            Left: 100,
            Top: 200
        });
        expect(debugInstance.miniDisplayHelper.scrollPosition.Left).toEqual(100);
        expect(debugInstance.miniDisplayHelper.scrollPosition.Top).toEqual(200);
    });

    it("should set the miniDisplay initial values on resizing the window", () => {
        cmsMiniDisplayService.init();
        debugInstance.subscribeWindowResize();
        expect(debugInstance.windowResizeSubscription).toBeDefined();
        debugInstance.windowResizeSubscription.next();
        expect(JSON.stringify(component.display)).toEqual(sessionStorage.getItem(CMS_SESSION_STORAGE_ITEM.DISPLAY));
        expect(appConfig.log).toHaveBeenCalled();
        expect(debugInstance.miniDisplayStyle.height).toEqual(miniDisplay.miniDisplaySize.height + "px");
        expect(debugInstance.miniDisplayStyle.width).toEqual(miniDisplay.miniDisplaySize.width + "px");
        //zoom to stay same as we are only reinitializing values.
        expect(debugInstance.zoomlevel).toBe(0);
        expect(debugInstance.miniDisplayTilerList).toEqual(miniDisplay.miniDisplayTilerList);
        expect(debugInstance.miniDisplayContentList).toEqual(miniDisplay.miniDisplayContentList);
        expect(debugInstance.displayTilerList).toEqual(miniDisplay.displayTilerList);
        expect(debugInstance.displaySize).toEqual(miniDisplay.displaySize);
        expect(debugInstance.miniDisplaySize).toEqual(miniDisplay.miniDisplaySize);
    });

    it("should throw error while invoking getMiniDisplayTilerInfoWithContent API", () => {
        sessionStorage.setItem(CMS_SESSION_STORAGE_ITEM.DISPLAY, JSON.stringify({ "id": -1 }));
        debugInstance.initDisplayTileInfoWithContent();
        expect(debugInstance.showDisplayContent).toBeFalsy();
    });

    it("should call init method of cmsMiniDisplayService on ngOnInit when there is a different display in miniDisplayService", () => {
        cmsMiniDisplayService.display = mockDisplayForService;
        component.ngOnInit();
        expect(cmsMiniDisplayService.zoomLevel).toEqual(0);
    });

    it("should call zoomMiniDisplayOnBrowser method and return without invoking zoom method when ctrlKey is false", () => {
        let spyZoom = spyOn(debugInstance, "zoom").and.returnValue(Observable.of(null));
        let eventKeyDown = new KeyboardEvent("keydown", { ctrlKey: false });
        debugInstance.zoomMiniDisplayOnBrowser(eventKeyDown);
        expect(spyZoom.calls.count()).toEqual(0);
    });

    it("should perform zoom out on CTRL++", () => {
        let spyZoom = spyOn(debugInstance, "zoom").and.returnValue(Observable.of(null));
        let whichList = [61, 107, 187];
        for (let whichListIndex = 0; whichListIndex < whichList.length; whichListIndex++) {
            let eventKeyDown = new KeyboardEvent("keydown", { ctrlKey: true });
            Object.defineProperty(eventKeyDown, "which", { get: function () { return whichList[whichListIndex]; } });
            debugInstance.zoomMiniDisplayOnBrowser(eventKeyDown);
            expect(spyZoom).toHaveBeenCalledWith(-100);
        }
    });

    it("should perform zoom in on CTRL--", () => {
        let spyZoom = spyOn(debugInstance, "zoom").and.returnValue(Observable.of(null));
        let whichList = [173, 109, 189];
        for (let whichListIndex = 0; whichListIndex < whichList.length; whichListIndex++) {
            let eventKeyDown = new KeyboardEvent("keydown", { ctrlKey: true });
            Object.defineProperty(eventKeyDown, "which", { get: function () { return whichList[whichListIndex]; } });
            debugInstance.zoomMiniDisplayOnBrowser(eventKeyDown);
            expect(spyZoom).toHaveBeenCalledWith(100);
        }
    });

    it("should perform zoom in or out on CTRL + MouseWheel", () => {
        let spyZoom = spyOn(debugInstance, "zoom").and.returnValue(Observable.of(null));
        let wheelEvent = new WheelEvent("syntheticWheel", { "deltaY": 4, ctrlKey: true });
        debugInstance.zoomMiniDisplayOnBrowser(wheelEvent);
        expect(spyZoom).toHaveBeenCalledWith(4);
    });

    it("should return if event received is for other display", () => {
        let spyHandleMiniDisplayChangeEvent = spyOn(debugInstance, "handleMiniDisplayChangeEvent").and.returnValue(Observable.of(null));
        debugInstance.subscribeCMSEvents();
        debugInstance.miniDisplayCmsEvent.next(
            {
                "eventType": "DisplayUpdated",
                "body": EventCases.DisplayUpdated,
                "displayId": -1,
            }
        );
        expect(spyHandleMiniDisplayChangeEvent.calls.count()).toEqual(0);
    });

    it("should perform zoom in and zoom out", () => {
        cmsMiniDisplayService.init();
        fixture.detectChanges();

        debugInstance.zoomLevel = 500;
        debugInstance.zoom(-1);
        expect(debugInstance.zoomLevel).toEqual(510);

        debugInstance.zoomLevel = 500;
        debugInstance.zoom(1);
        expect(debugInstance.zoomLevel).toEqual(490);
    });

    it("should set focus on mini-display container", () => {
        let spyOnFocus = spyOn(document.getElementById("mini-display-container"), 'focus').and.returnValue(Observable.of(null));
        debugInstance.setFocusOnMiniDisplayContainer();
        expect(spyOnFocus.calls.count()).toEqual(1);
    });

});
