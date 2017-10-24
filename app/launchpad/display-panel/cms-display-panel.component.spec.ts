/** 
 * Test cases:
 * 
 * ## Constructor ##
 * Option menu should be hidden;
 * Zoom level should be 100%;
 * Don't allow user to save a new ;
 * 
 * 
 * ## loadDisplay ##
 * 
 * expect storage manager provides selected display info;
 * expect if no display is set then router navigates;
 * else display and displayName is set;
 * 
 *
 * ## ngOnInit ##
 * 
 * Display id should be defined from the route params;
 * if 
 *      display id is not "nodisplay" then isDisplaySelected flag should be set to true 
 *      and display should be loaded;
 * else 
 *      isDisplaySelected flag should be set to false;
 *      displayName be set as per no display;
 *      Check mDisplayPanelCmsEvent is set for CMS_EVENTS.DisplayPanel 
 *          and on event router navigates to "/displays-panel" ;
 * 
 * expect longPressSubcription is set and on next isLongPressed is set;
 * 
 * 
 * ## ngOnDestroy ##
 * 
 * expect mDisplayPanelCmsEvent && longPressSubcription are unsubscribed;
 * 
 * 
 * ## fitHeight ##
 * 
 * expect fitHeightCount is incremented after each time fitHeight is called
 * 
 * 
 * ## backToDisplayPanel ## 
 * expect updateIsLongPress(false) to be called;
 * 
 * 
 * ## onDisplayUpdate ##
 * expect a new name to be set for display after event from server
 * 
 * 
 * ## clearMiniDisplayWall ## 
 * expect the API to clear display wall is called and it is resolved;
 * 
 * 
 * $$ Test cases for template $$
 * 
 * If isLongPressed is true
 *      #display-panel-back-button should be visible
 * Else
 *      #dashboard-options-button should be visible
 *      #dashboard-displayList-button should be visible
 *      
 *      If isDisplaySelected is true
 *          #dashboard-clear-wall-button should be visible
 *          <cms-mini-display> should be visible
 *      Else 
 *          .display-unavailable should be visible;
 *          Check its translated text content;
 * 
 * If viewOptions is true
 *      <cms-options> should be visible
 * 
 * If showClearWallPopup is true
 *      #display-panel-clear-wall-popup should be visible;
 */


import { ComponentFixture, TestBed, async, fakeAsync, tick } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA, Injector } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { HttpModule, Http } from "@angular/http";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { CmsDisplayPanelComponent } from "./cms-display-panel.component";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { MockRouterStub } from "../../core/mock-stubs/mock-router-stub";
import { AppConfig } from "../../config";
import { MockLogger } from "../../core/mock-stubs/mock-logger";
import { CmsSettingsService } from "../settings/cms-settings.service";
import { MockCmsSettingsServiceStub } from "../../core/mock-stubs/mock-cms-settings-service";
import { CmsApiService } from "../../cms/api/cms-api.service";
import { CmsClipboardService } from "../../shared/clipboard/cms-clipboard.service";
import { CMS_SESSION_STORAGE_ITEM } from "../../cms/models/cms-session-storage-item";
import { Subscriber } from "rxjs";



/**
 * Fake CmsApiService Service with the below stub
 */
class MockCmsApiServiceStub {
    putContentsOnDisplay(displayId: number, tilerId: number, body: any) {
        return Observable.of(null);
    }
}


/**
 * Fake CmsClipboardService with the below stub
 */
class MockCmsClipboardServiceStub {
    selectedSources = [];
}


describe("CmsDisplayPanelComponent - Test Suite", () => {

    let component: CmsDisplayPanelComponent;
    let fixture: ComponentFixture<CmsDisplayPanelComponent>;
    let debugInstance, nativeElement;
    let injector: Injector;
    let activatedRoute = new ActivatedRoute();

    let display = {
        name: "My display",
        id: 1
    };

    let mockSettings = new MockCmsSettingsServiceStub();

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CmsDisplayPanelComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: activatedRoute
                },
                {
                    provide: Router,
                    useClass: MockRouterStub
                },
                StorageManager,
                {
                    provide: AppConfig,
                    useClass: MockLogger
                },
                TranslateService,
                {
                    provide: CmsSettingsService,
                    useValue: mockSettings
                },
                {
                    provide: CmsApiService,
                    useClass: MockCmsApiServiceStub
                },
                {
                    provide: CmsClipboardService,
                    useClass: MockCmsClipboardServiceStub
                }
            ],
            imports: [
                HttpModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: (http: Http) => new TranslateHttpLoader(http, "base/app/i18n/", ".json"),
                        deps: [Http]
                    }
                }),
                RouterModule
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(CmsDisplayPanelComponent);
            component = fixture.componentInstance;
            nativeElement = fixture.nativeElement;
            debugInstance = fixture.debugElement.componentInstance;
            injector = fixture.debugElement.injector;

            activatedRoute.params = Observable.of({
                id: 1
            });


            let translate: TranslateService = injector.get(TranslateService);
            translate.use("en");

            setDisplay();
        });
    }));


    afterEach(() => {
        removeDisplay();
        component.ngOnDestroy();
    });


    it("Component should be instantiated", () => {
        expect(component instanceof CmsDisplayPanelComponent).toBeTruthy();

        expect(component.viewOptions).toBeFalsy();
        expect(component.zoomLevel).toEqual(100);
        expect(component.isSaveLayoutEnabled).toBeFalsy();
        expect(component.fitHeightCount).toEqual(0);
    });


    it("should load a saved display", () => {
        /**
         * Negative case - should navigate to displays-panel if no display is selected
         */

        removeDisplay();

        let router: Router = injector.get(Router);
        let spyNavigate = spyOn(router, "navigate").and.returnValue(null);
        component.loadDisplay();
        expect(spyNavigate.calls.count()).toEqual(1);
        expect(spyNavigate.calls.argsFor(0)[0]).toEqual(["/displays-panel"]);

        /**
         * Positive case - Display should be successfully loaded from the storage manager
         */
        removeDisplay();
        setDisplay();
        component.loadDisplay();
        expect(component.displayName).toEqual(display.name);
        expect(component.display.id).toEqual(display.id);
        expect(JSON.stringify(component.display)).toEqual(JSON.stringify(display));
    });

    it("should load a display if displayId is available", fakeAsync(() => {
        /**
         * Positive Case: When display id is available then display is loaded
         */
        let settingsService: CmsSettingsService = injector.get(CmsSettingsService);
        let spyLoadDisplay = spyOn(component, "loadDisplay").and.returnValue(null);

        fixture.detectChanges();
        tick();

        expect(component.displayId).toEqual(activatedRoute.params["value"]["id"]);
        expect(component.isDisplaySelected).toBeTruthy();
        expect(spyLoadDisplay.calls.count()).toEqual(1);

        // make sure the subject is subscribed
        expect(component.longPressSubcription instanceof Subscriber).toBeTruthy();
    }));


    it("should hide mini display if no display info is available", async(() => {
        activatedRoute.params = Observable.of({
            id: "nodisplay"
        });

        fixture.detectChanges();

        expect(component.isDisplaySelected).toBeFalsy();
        expect(component.displayName).toEqual("Select a display");

        // make sure the subject is subscribed
        expect(component.mDisplayPanelCmsEvent instanceof Subscriber).toBeTruthy();
        // make sure the subject is subscribed
        expect(component.longPressSubcription instanceof Subscriber).toBeTruthy();
    }));


    it("should unsubscribe subscriptions on OnDestroy", fakeAsync(() => {
        activatedRoute.params = Observable.of({
            id: "nodisplay"
        });

        let settingsService: CmsSettingsService = injector.get(CmsSettingsService);
        settingsService.longPressedSubject.next(true);


        fixture.detectChanges();
        tick();

        expect(component.mDisplayPanelCmsEvent.closed).toBeFalsy();
        expect(component.longPressSubcription.closed).toBeFalsy();

        component.ngOnDestroy();

        expect(component.mDisplayPanelCmsEvent.closed).toBeTruthy();
        expect(component.longPressSubcription.closed).toBeTruthy();
    }));


    it("should increment the fitHeightCount counter", () => {
        expect(component.fitHeightCount).toEqual(0);
        component.fitHeight();
        expect(component.fitHeightCount).toEqual(1);
        component.fitHeight();
        expect(component.fitHeightCount).toEqual(2);
    });


    it("should return back to display panel", () => {
        let settingsService: CmsSettingsService = injector.get(CmsSettingsService);
        let spy = spyOn(settingsService, "updateIsLongPress");

        component.backToDisplayPanel();

        expect(spy.calls.count()).toEqual(1);
        expect(spy.calls.argsFor(0)[0]).toEqual(false);
    });


    it("should update display name on event", () => {
        component.displayName = "abc display";

        component.onDisplayUpdate(display);

        expect(component.displayName).toEqual(display.name);
    });


    it("should clear display wall", fakeAsync(() => {
        let api: CmsApiService = injector.get(CmsApiService);
        let spy = spyOn(api, "putContentsOnDisplay").and.returnValue(Observable.of(null));

        component.displayId = "nodisplay";
        component.clearMiniDisplayWall();

        expect(spy.calls.count()).toEqual(0);


        component.displayId = "1";
        component.clearMiniDisplayWall();

        tick();

        expect(spy.calls.count()).toEqual(1);
        expect(spy.calls.argsFor(0)[0]).toEqual(1);
        expect(spy.calls.argsFor(0)[1]).toEqual(0);
    }));

    it("should clear clipboard selected sources when clear wall is resolved", fakeAsync(() => {
        let clipboardService: CmsClipboardService = injector.get(CmsClipboardService);
        clipboardService.selectedSources = [, , ,];

        fixture.detectChanges();
        tick();

        component.clearMiniDisplayWall();

        tick();

        expect(clipboardService.selectedSources.length).toEqual(0);
    }));


    function removeDisplay() {
        window.sessionStorage.removeItem(CMS_SESSION_STORAGE_ITEM.Display);
    }

    function setDisplay() {
        window.sessionStorage.setItem(CMS_SESSION_STORAGE_ITEM.Display, JSON.stringify(display));
    }
});