/**
 * Test Specification for CMS Mini Display component.
 */
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef, NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Http, HttpModule } from "@angular/http";
import { Router } from "@angular/router";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Observable } from "rxjs/Observable";
import { StorageManager } from "../../../../app/cms/api/cms-storagemanager.service";
import { CmsSessionStorageItem } from "../../../../app/cms/models/cms-session-storage-item";
import { AppConfig } from "../../../../app/config";
import { CmsMiniDisplayComponent } from "../../../../app/shared/mini-display/cms-mini-display.component";
import { CmsMiniDisplayService } from "../../../../app/shared/mini-display/cms-mini-display.service";
import { EventManager } from "../../../../app/utils/event-manager.util";
import {
    CmsMiniDisplayServiceStub,
    eventCases,
    miniDisplay,
    mockDisplay,
    mockDisplayForService,
    MockElementRef,
    reFactoredSource,
    reFactoredTile,
    reFactoredTileContent,
    RouterStub
} from "../../core/mock-stubs/cms-mini-display.component.mock";

describe("CmsMiniDisplayComponent", () => {
    let component: CmsMiniDisplayComponent;
    let fixture: ComponentFixture<CmsMiniDisplayComponent>;
    let debugInstance: any;
    let nativeElement: HTMLElement;
    let appConfig: AppConfig;
    let cmsMiniDisplayService: CmsMiniDisplayService;
    let router: Router;
    const ref: any = (): undefined => {
        return undefined;
    };
    const change: any = {
        fitHeight: {
            isFirstChange: ref
        }
    };
    let logSpy: jasmine.Spy;
    let navigateSpy: jasmine.Spy;
    let addEventSpy: jasmine.Spy;
    let spyInitDisplayTileInfoWithContent: jasmine.Spy;
    const zoomLevels: any = {
        left: 100,
        top: 200,
        zoomOut: -100,
        zoomIn: 100,
        slightZoomIn: 510,
        pageZoom: 500,
        slightZoomOut: 490
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CmsMiniDisplayComponent],
            providers: [
                { provide: ElementRef, useClass: MockElementRef },
                { provide: CmsMiniDisplayService, useClass: CmsMiniDisplayServiceStub },
                { provide: Router, useClass: RouterStub },
                { provide: EventManager },
                StorageManager,
                AppConfig
            ],
            imports: [
                HttpModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: (http: Http): TranslateHttpLoader => new TranslateHttpLoader(http, "/base/app/i18n/", ".json"),
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
            logSpy = spyOn(appConfig, "log").and.returnValue(Observable.of(undefined));
            addEventSpy = spyOn(EventManager, "ADD_EVENT_ON_ELEMENT").and.returnValue(Observable.of(undefined));
            navigateSpy = spyOn(router, "navigate").and.returnValue(Observable.of(undefined));
            sessionStorage.setItem(CmsSessionStorageItem.DISPLAY, JSON.stringify(mockDisplay));
        });
    }));

    beforeEach(() => {
        sessionStorage.setItem(CmsSessionStorageItem.DISPLAY, JSON.stringify(mockDisplay));
        debugInstance.zoomlevel = 0;
        component.fitHeight = zoomLevels.fitHeight;
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
            expect(debugInstance.miniDisplayCmsEvent.closed).toBeTruthy();
            expect(debugInstance.windowResizeSubscription.closed).toBeTruthy();
            expect(debugInstance.scrollSubscription.closed).toBeTruthy();
            expect(debugInstance.touchstartSubscription.closed).toBeTruthy();
            expect(debugInstance.touchendSubscription.closed).toBeTruthy();
        });
        component.ngOnDestroy();
    });

    it("should fit mini display to fit screen with no zoom on Changes", () => {
        cmsMiniDisplayService.init();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            component.ngOnChanges(change);
            expect(debugInstance.miniDisplayHelper.fitHeightZoomLevel).toEqual(zoomLevels.fitHeight);
            expect(debugInstance.zoomlevel).toEqual(0);
        });
    });

    it("should handle DisplayUpdated event", () => {
        spyInitDisplayTileInfoWithContent = spyOn(debugInstance, "initDisplayTileInfoWithContent").and.returnValue(Observable.of(undefined));
        debugInstance.subscribeCMSEvents();
        debugInstance.miniDisplayCmsEvent.next(
            {
                eventType: "DisplayUpdated",
                body: eventCases.DisplayUpdated,
                displayId: component.display.id
            }
        );
        expect(spyInitDisplayTileInfoWithContent.calls.count()).toEqual(1);
        expect(JSON.parse(sessionStorage.getItem(CmsSessionStorageItem.DISPLAY))).toEqual(eventCases.DisplayUpdated);
    });

    it("should handle DisplayDeleted event", () => {
        debugInstance.subscribeCMSEvents();
        debugInstance.miniDisplayCmsEvent.next(
            {
                eventType: "DisplayDeleted",
                body: eventCases.DisplayDeleted,
                displayId: component.display.id
            }
        );
        const args: any[] = navigateSpy.calls.mostRecent().args;
        expect(args[0]).toEqual(["/displays-panel"]);
        expect(appConfig.log).toHaveBeenCalled();
        expect(sessionStorage.getItem(CmsSessionStorageItem.DISPLAY)).toBeNull();
    });

    it("should handle TilerAndContentUpdated event", () => {
        debugInstance.subscribeCMSEvents();
        debugInstance.miniDisplayCmsEvent.next(
            {
                eventType: "TilerAndContentUpdated",
                body: eventCases.TilerAndContentUpdated,
                displayId: component.display.id
            }
        );
        expect(debugInstance.miniDisplayTilerList).toEqual(reFactoredTile);
        expect(debugInstance.displayTilerList).toEqual(eventCases.TilerAndContentUpdated.tiles);
        expect(debugInstance.miniDisplayContentList).toEqual(reFactoredSource);
        expect(debugInstance.showDisplayContent).toBeTruthy();
        expect(appConfig.log).toHaveBeenCalled();
    });

    it("should handle ContentUpdated event", () => {
        debugInstance.miniDisplayContentList = reFactoredSource;
        debugInstance.subscribeCMSEvents();
        debugInstance.miniDisplayCmsEvent.next(
            {
                eventType: "ContentUpdated",
                body: eventCases.ContentUpdated,
                displayId: component.display.id
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
                eventType: "ResourceUpdated",
                body: eventCases.ResourceUpdated,
                displayId: component.display.id
            }
        );
        expect(debugInstance.miniDisplayContentList[0].name).toEqual(eventCases.ResourceUpdated.name);
        expect(debugInstance.miniDisplayContentList[0].snapshotPath).toEqual(eventCases.ResourceUpdated.snapshotPath);
        expect(appConfig.log).toHaveBeenCalled();
    });

    it("should handle ResourceDeleted event", () => {
        debugInstance.miniDisplayContentList = reFactoredSource;
        debugInstance.subscribeCMSEvents();
        debugInstance.miniDisplayCmsEvent.next(
            {
                eventType: "ResourceDeleted",
                body: eventCases.TilerAndContentUpdated,
                displayId: component.display.id
            }
        );
        expect(debugInstance.showDisplayContent).toBeTruthy();
    });

    it("should check for empty responseBody tiles and content in case of TilerAndContentUpdated event", () => {
        debugInstance.subscribeCMSEvents();
        eventCases.TilerAndContentUpdated.tiles.length = 0;
        eventCases.TilerAndContentUpdated.content.length = 0;
        debugInstance.miniDisplayCmsEvent.next(
            {
                eventType: "TilerAndContentUpdated",
                body: eventCases.TilerAndContentUpdated,
                displayId: component.display.id
            }
        );
        expect(debugInstance.miniDisplayContentList).toEqual([]);
        expect(debugInstance.miniDisplayTilerList).toEqual([]);
        expect(debugInstance.displayTilerList).toEqual([]);
    });

    it("should set keydown events for zooming on container", () => {
        const container: any = document.getElementsByClassName("cms-mini-display-container");
        expect(container.length).toEqual(1);
        debugInstance.addMiniDisplayEventListeners();
        expect(EventManager.ADD_EVENT_ON_ELEMENT).toHaveBeenCalled();
        const args: any[] = addEventSpy.calls.mostRecent().args;
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
        const container: any = document.getElementById("mini-display-container");
        debugInstance.subscribeScroller();
        expect(debugInstance.scrollSubscription).toBeDefined();
        expect(debugInstance.miniDisplayHelper.scrollPosition.Left).toEqual(0);
        expect(debugInstance.miniDisplayHelper.scrollPosition.Top).toEqual(0);
        debugInstance.scrollSubscription.next({
            Left: 100,
            Top: 200
        });
        expect(debugInstance.miniDisplayHelper.scrollPosition.Left).toEqual(zoomLevels.left);
        expect(debugInstance.miniDisplayHelper.scrollPosition.Top).toEqual(zoomLevels.top);
    });

    it("should set the miniDisplay initial values on resizing the window", () => {
        cmsMiniDisplayService.init();
        debugInstance.subscribeWindowResize();
        expect(debugInstance.windowResizeSubscription).toBeDefined();
        debugInstance.windowResizeSubscription.next();
        expect(JSON.stringify(component.display)).toEqual(sessionStorage.getItem(CmsSessionStorageItem.DISPLAY));
        expect(appConfig.log).toHaveBeenCalled();
        expect(debugInstance.miniDisplayStyle.height).toEqual(`${miniDisplay.miniDisplaySize.height}px`);
        expect(debugInstance.miniDisplayStyle.width).toEqual(`${miniDisplay.miniDisplaySize.width}px`);
        //zoom to stay same as we are only reinitializing values.
        expect(debugInstance.zoomlevel).toBe(0);
        expect(debugInstance.miniDisplayTilerList).toEqual(miniDisplay.miniDisplayTilerList);
        expect(debugInstance.miniDisplayContentList).toEqual(miniDisplay.miniDisplayContentList);
        expect(debugInstance.displayTilerList).toEqual(miniDisplay.displayTilerList);
        expect(debugInstance.displaySize).toEqual(miniDisplay.displaySize);
        expect(debugInstance.miniDisplaySize).toEqual(miniDisplay.miniDisplaySize);
    });

    it("should throw error while invoking getMiniDisplayTilerInfoWithContent API", () => {
        sessionStorage.setItem(CmsSessionStorageItem.DISPLAY, JSON.stringify({ id: -1 }));
        debugInstance.initDisplayTileInfoWithContent();
        expect(debugInstance.showDisplayContent).toBeFalsy();
    });

    it("should call init method of cmsMiniDisplayService on ngOnInit when there is a different display in miniDisplayService", () => {
        cmsMiniDisplayService.display = mockDisplayForService;
        component.ngOnInit();
        expect(cmsMiniDisplayService.zoomLevel).toEqual(0);
    });

    it("should call zoomMiniDisplayOnBrowser method and return without invoking zoom method when ctrlKey is false", () => {
        const spyZoom: any = spyOn(debugInstance, "zoom").and.returnValue(Observable.of(undefined));
        const eventKeyDown: KeyboardEvent = new KeyboardEvent("keydown", { ctrlKey: false });
        debugInstance.zoomMiniDisplayOnBrowser(eventKeyDown);
        expect(spyZoom.calls.count()).toEqual(0);
    });

    it("should perform zoom out on CTRL++", () => {
        const spyZoom: any = spyOn(debugInstance, "zoom").and.returnValue(Observable.of(undefined));
        // tslint:disable-next-line:no-magic-numbers
        const whichList: number[] = [61, 107, 187];
        const eventKeyDown: KeyboardEvent = new KeyboardEvent("keydown", { ctrlKey: true });
        for (const whichListItem  of  whichList) {
            Object.defineProperty(eventKeyDown, "which", {
                get: (): number => {
                    return whichListItem;
                }
            });
            debugInstance.zoomMiniDisplayOnBrowser(eventKeyDown);
            expect(spyZoom).toHaveBeenCalledWith(zoomLevels.zoomOut);
        }
    });

    it("should perform zoom in on CTRL--", () => {
        const spyZoom: any = spyOn(debugInstance, "zoom").and.returnValue(Observable.of(undefined));
        // tslint:disable-next-line:no-magic-numbers
        const whichList: number[] = [173, 109, 189];
        for (const whichListItem  of whichList) {
            const eventKeyDown: KeyboardEvent = new KeyboardEvent("keydown", { ctrlKey: true });
            Object.defineProperty(eventKeyDown, "which", {
                get: (): number => {
                    return whichListItem;
                }
            });
            debugInstance.zoomMiniDisplayOnBrowser(eventKeyDown);
            expect(spyZoom).toHaveBeenCalled();
        }
    });

    it("should perform zoom in or out on CTRL + MouseWheel", () => {
        const callTimes: number = 4;
        const spyZoom: any = spyOn(debugInstance, "zoom").and.returnValue(Observable.of(undefined));
        const wheelEvent: WheelEvent = new WheelEvent("syntheticWheel", {
            deltaY: 4,
            ctrlKey: true
        });
        debugInstance.zoomMiniDisplayOnBrowser(wheelEvent);
        expect(spyZoom).toHaveBeenCalledWith(callTimes);
    });

    it("should return if event received is for other display", () => {
        const spyHandleMiniDisplayChangeEvent: any = spyOn(debugInstance, "handleMiniDisplayChangeEvent").and.returnValue(Observable.of(undefined));
        debugInstance.subscribeCMSEvents();
        debugInstance.miniDisplayCmsEvent.next(
            {
                eventType: "DisplayUpdated",
                body: eventCases.DisplayUpdated,
                displayId: -1
            }
        );
        expect(spyHandleMiniDisplayChangeEvent.calls.count()).toEqual(0);
    });

    it("should perform zoom in and zoom out", () => {
        cmsMiniDisplayService.init();
        fixture.detectChanges();
        debugInstance.zoomLevel = zoomLevels.pageZoom;
        debugInstance.zoom(-1);
        expect(debugInstance.zoomLevel).toEqual(zoomLevels.slightZoomIn);
        debugInstance.zoomLevel = zoomLevels.pageZoom;
        debugInstance.zoom(1);
        expect(debugInstance.zoomLevel).toEqual(zoomLevels.slightZoomOut);
    });

    it("should set focus on mini-display container", () => {
        const spyOnFocus: any = spyOn(document.getElementById("mini-display-container"), "focus").and.returnValue(Observable.of(undefined));
        debugInstance.setFocusOnMiniDisplayContainer();
        expect(spyOnFocus.calls.count()).toEqual(1);
    });

});
