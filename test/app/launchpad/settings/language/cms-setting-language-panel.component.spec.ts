import { ComponentFixture, TestBed, async, inject } from "@angular/core/testing";
import { Location } from "@angular/common";
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ElementRef } from "@angular/core";
import { HttpModule, Http } from "@angular/http";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { CmsSettingsLanguagePanelComponent } from "../../../../../app/launchpad/settings/language/cms-settings-language-panel.component";
import { CmsSettingsService } from "../../../../../app/launchpad/settings/cms-settings.service";
import { CmsApiService } from "../../../../../app/cms/api/cms-api.service";
import { AppConfig } from "../../../../../app/config";
import { CmsLanguages } from "../../../../../app/i18n/cms-languages";
import { StorageManager } from "../../../../../app/cms/api/cms-storagemanager.service";
import { APIRequest } from "../../../../../app/cms/api/api-request";
import { CMS_SESSION_STORAGE_ITEM } from "../../../../../app/cms/models/cms-session-storage-item";

let routerSpy = {
    navigate: jasmine.createSpy("settings")
};

let mockCmsSettingsData = {
    "userSettings": {
        "language": "en",
        "wallConnection": {
            "startUpAction": "show-available-walls-list",
            "specificDisplay": "Board Meeting Room",
            "recentDisplay": "Board Meeting Room"
        },
        "sourceLabel": {
            "displaySourceNameLabels": true,
            "useMultipleLines": false,
            "fontColor": "#FFFFFF",
            "fontSize": 14,
            "backgroundColor": "#BDBDBD",
            "transparency": 50
        },
        "logOffTime": 0,
        "pageSize": 50
    }
};

// Fake CmsApiService Service
class MockCmsApiService {
    getUserProfileSettings(): Promise<any> {
        return Promise.resolve(mockCmsSettingsData.userSettings);
    }
    updateUserProfileSettings(): Promise<any> {
        return Promise.resolve(mockCmsSettingsData.userSettings);
    }
}

describe("Component CmsSettingsLanguagePanelComponent", () => {
    let component: CmsSettingsLanguagePanelComponent;
    let fixture: ComponentFixture<CmsSettingsLanguagePanelComponent>;
    let cmsSettingsLanguagePanelComponent;
    let cmsSettingsService: CmsSettingsService;
    let cmsApiService: CmsApiService;
    let router: Router;
    let location: Location;
    let translate: TranslateService;
    let appConfig: AppConfig;
    let cmsLanguages: CmsLanguages;
    let storageManager;
    let i18n: any;
    let debugInstance, nativeElement;
    let activatedRoute = new ActivatedRoute();
    activatedRoute.params = Observable.of({
        key: "en"
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CmsSettingsLanguagePanelComponent],
            providers: [
                CmsSettingsService,
                {
                    provide: Router,
                    useValue: routerSpy,
                },
                {
                    provide: ActivatedRoute,
                    useValue: activatedRoute

                },
                {
                    provide: ElementRef,
                    useValue: {
                        nativeElement: HTMLElement
                    }
                },
                {
                    provide: CmsApiService,
                    useClass: MockCmsApiService
                },
                StorageManager,
                AppConfig,
                APIRequest,
                TranslateService,
                CMS_SESSION_STORAGE_ITEM,

            ],
            imports: [
                HttpModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: (http: Http) => new TranslateHttpLoader(http, "/base/app/i18n/", ".json"),
                        deps: [Http]
                    }
                })
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(CmsSettingsLanguagePanelComponent);
            component = fixture.componentInstance;
            nativeElement = fixture.nativeElement;
            debugInstance = fixture.debugElement.componentInstance;
            cmsSettingsService = fixture.debugElement.injector.get(CmsSettingsService);
            cmsApiService = fixture.debugElement.injector.get(CmsApiService);
        });
    }));

    beforeEach(inject([StorageManager], (response) => {
        storageManager = response;
    }));

    // Componenet defined
    it("should be a defined component: ", async(() => {
        expect(component).toBeDefined();
    }));

    // Check private variables
    it("should check route params and cmsLanguages : ", (done) => {
        expect(debugInstance.route.params).not.toBeNull();
        expect(debugInstance.route.params).not.toBeUndefined();
        expect(debugInstance.route.params.value.key).not.toBeNull();
        expect(debugInstance.route.params.value.key).not.toBeUndefined();
        expect(debugInstance.cmsLanguages.length).toBeGreaterThan(0);
        done();
    });

    // Check back button and title text elements
    it("should check settingLanguagePanelBackButton and settingLanguagePanelTitleText ", () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            let settingLanguagePanelTitleText = fixture.nativeElement.querySelector("#setting-language-panel-title-text");
            expect(settingLanguagePanelTitleText).toBeTruthy();
            expect(settingLanguagePanelTitleText).not.toBeNull();
            let settingLanguagePanelBackButton = fixture.nativeElement.querySelector("#setting-language-panel-back-button");
            expect(settingLanguagePanelBackButton).toBeTruthy();
        });
    });

    /** Check after click on perticular language setlanguage method should update   
     * userprofilesettings with selected language, session storage settings
     * and route to settings page 
     */
    it("should check setLanguage method and update userprofileSettings and navigate back to settings ", (done) => {
        cmsSettingsService.userSettings = mockCmsSettingsData.userSettings;
        let languageKey = debugInstance.cmsLanguages[0].key;
        expect(languageKey).not.toBeUndefined();
        expect(languageKey).not.toBeNull();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            let spyWindowHistoryBack = spyOn(window.history, "back").and.returnValue(null);
            debugInstance.setLanguage(languageKey);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let settings = JSON.parse(storageManager.appStorage.Settings);
                expect(settings.language).toBe(languageKey);
                expect(spyWindowHistoryBack).toHaveBeenCalled();
            });
            done();
        });
    });
});