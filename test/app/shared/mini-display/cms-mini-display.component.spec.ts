import { MiniDisplay,MockDisplay,MockElementRef, mDisplay, miniDisplay, CmsMiniDisplayServiceStub, RouterStub, MockCmsEventEmitterService, EventCases, reFactoredTile, reFactoredSource} from "./cms-mini-display.component.mock";
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
            "isFirstChange": function(){return null;}
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
            component.display = mDisplay;
            cmsMiniDisplayService = fixture.debugElement.injector.get(CmsMiniDisplayService);
            appConfig = fixture.debugElement.injector.get(AppConfig);
            router = fixture.debugElement.injector.get(Router);
            logSpy = spyOn(appConfig, "log").and.returnValue(Observable.of(null));
            addEventSpy = spyOn(EventManager, "addEventOnElement").and.returnValue(Observable.of(null));
            navigateSpy = spyOn(router, "navigate").and.returnValue(Observable.of(null));
            sessionStorage.setItem(CMS_SESSION_STORAGE_ITEM.DISPLAY, JSON.stringify(mDisplay));
        });
    }));

    beforeEach(() => {
        sessionStorage.setItem(CMS_SESSION_STORAGE_ITEM.DISPLAY, JSON.stringify(mDisplay));
        debugInstance.zoomlevel = 0;
        hammerOnSpy =  spyOn(Hammer, "on").and.returnValue(Observable.of(null));
        component.fitHeight = 100;
    }
    );

    it("should set a base style for mini display at start", () => {
        expect(component.mMiniDisplayStyle.height).toEqual("98%");
        expect(component.mMiniDisplayStyle.width).toEqual("98%");
        expect(component.mMiniDisplayStyle.margin).toEqual("20px");
    });

    it("should unsubscribe all the events on Destroy", ()=>{
      cmsMiniDisplayService.init();
      fixture.detectChanges();
      fixture.whenStable().then(()=>{
      });
      component.ngOnDestroy();
      expect(debugInstance.mMiniDisplayCmsEvent.closed).toBeTruthy();
      expect(debugInstance.windowResizeSubscription.closed).toBeTruthy();
      expect(debugInstance.scrollSubscription.closed).toBeTruthy();
      expect(debugInstance.touchstartSubscription.closed).toBeTruthy();
      expect(debugInstance.touchendSubscription.closed).toBeTruthy();
    });

    it("should fit mini display to fit screen with no zoom on Changes", ()=>{
        cmsMiniDisplayService.init();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
        });
        component.ngOnChanges(change);
        expect(debugInstance.miniDisplayHelper.fitHeightZoomLevel).toEqual(100);
        expect(debugInstance.zoomlevel).toEqual(0);
    });

    it("should increase or decrease zoom when ever ctrl+ key is pressed", ()=>{
        cmsMiniDisplayService.init();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            let whichList = [61, 173, 107, 109, 187, 189];
            for (let whichListIndex = 0; whichListIndex < whichList.length; whichListIndex++) {
                let evtKeyDown = new KeyboardEvent("keydown", { ctrlKey: true });
                Object.defineProperty(evtKeyDown, "which", { 
                    get: function () { return whichList[whichListIndex]; } 
                });
                window.document.dispatchEvent(evtKeyDown);
            }
            expect(debugInstance.zoomlevel).toBeDefined();
            expect(debugInstance.zoomlevel).toEqual(100);
        });   
        
        fixture.whenStable().then(() => {
            let evtWheel = new MouseEvent("wheel", { "ctrlKey": true });
            spyOn(evtWheel, "preventDefault");
            window.document.dispatchEvent(evtWheel);
            expect(evtWheel.preventDefault).toHaveBeenCalled();
        });
    });
    
    it("should add zoom and increase dimensions of the container on calling zoom", ()=>{
        cmsMiniDisplayService.init();
        component.ngOnInit();
        debugInstance.zoomlevel = 1;
        debugInstance.zoom(100);
        expect(debugInstance.zoomlevel).toEqual(1);
    });

    it("should set the session storage if the changes are being made to the display on subscription", () => {
        cmsMiniDisplayService.init();
        debugInstance.subscribeCMSEvents();
        debugInstance.mMiniDisplayCmsEvent.next(
            {
                "eventType": "DisplayUpdated",
                "body": EventCases.DisplayUpdated,
                "displayId": component.display.id,
            }
        );
        expect(sessionStorage.getItem(CMS_SESSION_STORAGE_ITEM.DISPLAY)).toEqual(JSON.stringify(EventCases.DisplayUpdated));
        debugInstance.mMiniDisplayCmsEvent.next(
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
        debugInstance.mMiniDisplayCmsEvent.next(
            {
                "eventType": "TilerAndContentUpdated",
                "body": EventCases.TilerAndContentUpdated,
                "displayId": component.display.id,
            }
        );
        expect(debugInstance.miniDisplayTilerList).toEqual(reFactoredTile);
        expect(debugInstance.displayTilerList).toEqual(EventCases.TilerAndContentUpdated.tiles);
        expect(debugInstance.miniDisplayContentList).toEqual(reFactoredSource);
        expect(debugInstance.mShowDisplayContent).toBeTruthy();
        expect(appConfig.log).toHaveBeenCalled();
        debugInstance.mMiniDisplayCmsEvent.next(
            {
                "eventType": "ContentUpdated",
                "body": EventCases.TilerAndContentUpdated,
                "displayId": component.display.id,
            }
        );
        expect(debugInstance.miniDisplayContentList).toEqual(reFactoredSource);
        expect(appConfig.log).toHaveBeenCalled();
        debugInstance.mMiniDisplayCmsEvent.next(
            {
                "eventType": "ResourceUpdated",
                "body": EventCases.TilerAndContentUpdated,
                "displayId": component.display.id,
            }
        );
        expect(debugInstance.miniDisplayContentList).toEqual(reFactoredSource);
        expect(appConfig.log).toHaveBeenCalled();
        debugInstance.mMiniDisplayCmsEvent.next(
            {
                "eventType": "ResourceDeleted",
                "body": EventCases.TilerAndContentUpdated,
                "displayId": component.display.id,
            }
        );
        expect(debugInstance.mShowDisplayContent).toBeTruthy();
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

    it("should set the miniDisplay zoom in and out on pinching events", ()=>{
        debugInstance.configureTouchGestures();
        expect(debugInstance.touchstartSubscription).toBeDefined();
        expect(debugInstance.touchendSubscription).toBeDefined();
    });

    it("should scroll to new Left and Top position on scrolling", ()=>{
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

    it("should set the miniDisplay initial values on resizing the window", ()=>{
        cmsMiniDisplayService.init();
        debugInstance.subscribeWindowResize();
        expect(debugInstance.windowResizeSubscription).toBeDefined();
        debugInstance.windowResizeSubscription.next();
        expect(JSON.stringify(component.display)).toEqual(sessionStorage.getItem(CMS_SESSION_STORAGE_ITEM.DISPLAY));
        expect(appConfig.log).toHaveBeenCalled();
        expect(component.mMiniDisplayStyle.height).toEqual(miniDisplay.miniDisplaySize.height + "px");
        expect(component.mMiniDisplayStyle.width).toEqual(miniDisplay.miniDisplaySize.width + "px");
        //zoom to stay same as we are only reinitializing values.
        expect(debugInstance.zoomlevel).toBe(0);
        expect(debugInstance.miniDisplayTilerList).toEqual(miniDisplay.miniDisplayTilerList);
        expect(debugInstance.miniDisplayContentList).toEqual(miniDisplay.miniDisplayContentList);
        expect(debugInstance.displayTilerList).toEqual(miniDisplay.displayTilerList);
        expect(debugInstance.mDisplaySize).toEqual(miniDisplay.displaySize);
        expect(debugInstance.mMiniDisplaySize).toEqual(miniDisplay.miniDisplaySize); 
    });

});
