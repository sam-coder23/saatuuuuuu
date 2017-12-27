import { ComponentFixture, TestBed, async, fakeAsync, tick } from "@angular/core/testing";
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA, Injector } from "@angular/core";
import { ActivatedRoute, Router, RouterModule, Params } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { HttpModule, Http } from "@angular/http";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { MockRouterStub } from "../../core/mock-stubs/mock-router.stub";
import { MockLogger } from "../../core/mock-stubs/logger.mock";
import { MockCmsSettingsServiceStub } from "../../core/mock-stubs/cms-settings-service.stub";
import { Subscriber } from "rxjs";
import { CmsDisplayPanelComponent } from "../../../../app/launchpad/display-panel/cms-display-panel.component";
import { AppConfig } from "../../../../app/config";
import { StorageManager } from "../../../../app/cms/api/cms-storagemanager.service";
import { CmsSettingsService } from "../../../../app/launchpad/settings/cms-settings.service";
import { CmsApiService } from "../../../../app/cms/api/cms-api.service";
import { CMS_SESSION_STORAGE_ITEM } from "../../../../app/cms/models/cms-session-storage-item";
import { CmsResource } from "../../../../app/cms/models/cms-resource";
import { By } from "@angular/platform-browser";
import { Subject } from "rxjs/Subject";

// Fake CmsApiService Service with the below stub
class MockCmsApiServiceStub {
    putContentsOnDisplay(displayId: number, tilerId: number, body: any) {

        if (isNaN(displayId)) {
            return Observable.throw("Invalid displayId");
        } else {
            return Observable.of(null);
        }
    }

    logoutUser() {
        return Observable.of(null);
    }
};

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
    let params: Subject<Params>;

    beforeEach(async(() => {
        params = new Subject<Params>();
        TestBed.configureTestingModule({
            declarations: [CmsDisplayPanelComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: { params: params }
                },
                StorageManager,
                {
                    provide: AppConfig,
                    useClass: MockLogger
                }
            ],
            imports: [
                HttpModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: (http: Http) => new TranslateHttpLoader(http, "/base/app/i18n/", ".json"),
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

        expect(debugInstance.zoomLevel).toEqual(100);
        expect(debugInstance.fitHeightCount).toEqual(0);
    });


    it("should load a saved display", () => {
        // Display should be successfully loaded from the storage manager
        removeDisplay();
        setDisplay();
        debugInstance.loadDisplay();
        expect(debugInstance.display.id).toEqual(display.id);
        expect(debugInstance.display instanceof CmsResource).toBeTruthy();
    });

    it("should load a display if displayId is available", fakeAsync(() => {
        // When display id is available then display is loaded
        removeDisplay();
        setDisplay();

        fixture.detectChanges();
        params.next({ "id": 1 });
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
        let buttonBack = fixture.debugElement.query(By.css("#display-panel-back-button"));
        expect(buttonBack instanceof DebugElement).toBeTruthy();

        let spyNavigateBack = spyOn(debugInstance, "navigateBack").and.returnValue(null);
        buttonBack.nativeElement.dispatchEvent(new Event("ndClick"));

        expect(spyNavigateBack.calls.count()).toEqual(1);
    });

    function removeDisplay() {
        window.sessionStorage.removeItem(CMS_SESSION_STORAGE_ITEM.DISPLAY);
    }

    function setDisplay() {
        window.sessionStorage.setItem(CMS_SESSION_STORAGE_ITEM.DISPLAY, JSON.stringify(display));
    }
});