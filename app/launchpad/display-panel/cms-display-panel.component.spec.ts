import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
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
    let activatedRoute = new ActivatedRoute();


    let mockSettings = new MockCmsSettingsServiceStub();
    mockSettings.mUserSettings = {
        "language": "en",
        "wallConnection": {
            "atStartup": {
                "status": "show-available-walls-list",
                "selectedDisplayId": 56,
                "recentDisplayId": 31
            }
        },
        "sourceLabels": {
            "displaySourceNameLabels": true,
            "useMultipleLines": false,
            "fontColor": "#FFFFFF",
            "fontSize": 14,
            "background": "#BDBDBD",
            "transparency": 50
        },
        "manageWallContent": {
            "requireConfirmationforLoadingLayouts": true,
            "allowChangingSources": true,
            "clipboard": {
                "isEnabled": true,
                "status": "large"
            }
        },
        "logOffTime": 0,
        "defaultPageSize": 50
    };

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
                        useFactory: (http: Http) => new TranslateHttpLoader(http, "/app/i18n", ".json"),
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

            activatedRoute.params = Observable.of({
                id: 1
            });
        });
    }));


    it("Component should be instantiated", () => {
        expect(component instanceof CmsDisplayPanelComponent).toBeTruthy();

        expect(component.viewOptions).toBeFalsy();
        expect(component.zoomLevel).toEqual(100);
        expect(component.fitHeightCount).toEqual(0);
        expect(component.settings).not.toBeNull();
        expect(component.isSaveLayoutEnabled).toBeFalsy();
    });


    xit("should not load a display and navigate to '/displays-panel' if no display info is available", () => {


        fixture.detectChanges();

        fixture.whenStable().then(() => {

        });
    });
});