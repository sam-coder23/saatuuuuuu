import { ComponentFixture, TestBed, async, fakeAsync, tick } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA, Injector } from "@angular/core";
import { ActivatedRoute, Router, RouterModule, Params } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { HttpModule, Http } from "@angular/http";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { MockRouterStub } from "../../core/mock-stubs/mock-router-stub";
import { MockLogger } from "../../core/mock-stubs/mock-logger";
import { MockCmsSettingsServiceStub } from "../../core/mock-stubs/mock-cms-settings-service";
import { Subscriber } from "rxjs";
import { CmsDisplayPanelComponent } from "../../../../app/launchpad/display-panel/cms-display-panel.component";
import { AppConfig } from "../../../../app/config";
import { StorageManager } from "../../../../app/cms/api/cms-storagemanager.service";
import { CmsSettingsService } from "../../../../app/launchpad/settings/cms-settings.service";
import { CmsApiService } from "../../../../app/cms/api/cms-api.service";
import { CMS_SESSION_STORAGE_ITEM } from "../../../../app/cms/models/cms-session-storage-item";
import { Subject } from "rxjs/Subject";

// Fake CmsApiService Service with the below stub
class MockCmsApiServiceStub {
    putContentsOnDisplay(displayId: number, tilerId: number, body: any) {
        return Observable.of(null);
    }

    logoutUser() {
        return Observable.of(null);
    }
};

fdescribe("CmsDisplayPanelComponent - Test Suite", () => {
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
    let params: Subject<Params>;

    beforeEach(async(() => {
        params = new Subject<Params>();
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
    });

    it("Component should be instantiated", () => {
        expect(component instanceof CmsDisplayPanelComponent).toBeTruthy();

        expect(debugInstance.viewOptions).toBeFalsy();
        expect(debugInstance.zoomLevel).toEqual(100);
        expect(debugInstance.isSaveLayoutEnabled).toBeFalsy();
        expect(debugInstance.fitHeightCount).toEqual(0);
    });


    it("should load a saved display", () => {
        // Display should be successfully loaded from the storage manager
        removeDisplay();
        setDisplay();
        debugInstance.loadDisplay();
        expect(debugInstance.display.id).toEqual(display.id);
        expect(JSON.stringify(debugInstance.display)).toEqual(JSON.stringify(display));
    });

    it("should load a display if displayId is available", fakeAsync(() => {
        // When display id is available then display is loaded
        removeDisplay();
        setDisplay();

        fixture.detectChanges();
        tick();

        expect(debugInstance.displayId).toEqual(activatedRoute.params["value"]["id"]);

        let spyLoadDisplay = spyOn(debugInstance, "loadDisplay").and.returnValue(null);
        component.ngOnInit();

        expect(spyLoadDisplay.calls.count()).toEqual(1);
    }));

    it("should increment the fitHeightCount counter", () => {
        expect(debugInstance.fitHeightCount).toEqual(0);
        debugInstance.fitHeight();
        expect(debugInstance.fitHeightCount).toEqual(1);
        debugInstance.fitHeight();
        expect(debugInstance.fitHeightCount).toEqual(2);
    });

    it("should have back button and onclick should navigate back", () => {
        fixture.detectChanges();

        let buttonBack = nativeElement.querySelector("#display-panel-back-button");
        expect(buttonBack).toBeDefined();

        let router = fixture.debugElement.injector.get(Router);
        let spyWindowHistoryBack = spyOn(window.history, "back").and.returnValue(null);
        buttonBack.dispatchEvent(new Event("ndClick"));

        expect(spyWindowHistoryBack).toHaveBeenCalled();
        expect(spyWindowHistoryBack.calls.count()).toEqual(1);
    });

    it("should have next button and onclick should display a popup for logoff", () => {
        fixture.detectChanges();

        let buttonNext = nativeElement.querySelector("#display-panel-next-button");
        expect(buttonNext).toBeDefined();

        buttonNext.dispatchEvent(new Event("ndClick"));
        expect(component["showClearWallPopup"]).toBeTruthy();
    });

    it("click on close icon, popoup should be closed and mini-display should be remain present", () => {
        fixture.detectChanges();

        let buttonNext = nativeElement.querySelector("#display-panel-next-button");
        expect(buttonNext).toBeDefined();

        buttonNext.dispatchEvent(new Event("ndClick"));
        expect(component["showClearWallPopup"]).toBeTruthy();

        //simulate click on close icon of nd-popup
        debugInstance.closingClearWallPopup();
        fixture.detectChanges();

        expect(component["showClearWallPopup"]).toBeFalsy();

        let miniDisplayContainer = nativeElement.querySelector("cms-mini-display");
        expect(miniDisplayContainer).toBeDefined();
    });


    it("should clear display wall", fakeAsync(() => {
        let api: CmsApiService = injector.get(CmsApiService);
        let spy = spyOn(api, "putContentsOnDisplay").and.returnValue(Observable.of(null));

        debugInstance.displayId = 1;
        debugInstance.clearMiniDisplayWall();
        tick();

        expect(spy.calls.count()).toEqual(1);
        expect(spy.calls.argsFor(0)[0]).toEqual(1);
        expect(spy.calls.argsFor(0)[1]).toEqual(0);
        expect(spy.calls.argsFor(0)[2]).toEqual({});
    }));


    it("should clear selected sources when clear wall is resolved", fakeAsync(() => {
        let settingsService: CmsSettingsService = injector.get(CmsSettingsService);
        settingsService.selectedSources = [, , ,];

        fixture.detectChanges();
        tick();
        debugInstance.clearMiniDisplayWall();
        tick();

        expect(settingsService.selectedSources.length).toEqual(0);
    }));

    function removeDisplay() {
        window.sessionStorage.removeItem(CMS_SESSION_STORAGE_ITEM.DISPLAY);
    }

    function setDisplay() {
        window.sessionStorage.setItem(CMS_SESSION_STORAGE_ITEM.DISPLAY, JSON.stringify(display));
    }

    function setUndefinedDisplay() {
        window.sessionStorage.setItem(CMS_SESSION_STORAGE_ITEM.DISPLAY, "null");
    }
});