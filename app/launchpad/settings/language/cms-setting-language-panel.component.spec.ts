import { ComponentFixture, TestBed, async, inject } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ElementRef } from "@angular/core";
import { HttpModule, Http } from "@angular/http";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

import { CMS_SESSION_STORAGE_ITEM } from "../../../cms/models/cms-session-storage-item";
import { CmsSettingsLanguagePanelComponent } from "./cms-settings-language-panel.component"
import { CmsLanguages } from "../../../i18n/cms-languages";
import { CmsApiService } from "../../../cms/api/cms-api.service";
import { CmsSettingsService } from "./../../settings/cms-settings.service";
import { AppConfig } from "../../../config";
import { APIRequest } from "../../../cms/api/api-request";
import { StorageManager } from "../../../cms/api/cms-storagemanager.service";
import { IUserProfileSettings } from "../../../cms/models/cms-user-profile-settings";

let routerSpy = {
    navigate: jasmine.createSpy("settings")
};

let mockCmsSettingsData = {
    "mUserSettings": {
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
        "wallContent": {
            "requireConfirmationForLoadingLayouts": true,
            "allowChangingSources": true,
            "clipboardEnabled": true,
            "clipboardSize": "large"
        },
        "logOffTime": 0,
        "pageSize": 50
    }
};

/**
 * Fake CmsApiService Service
 */

class MockCmsApiService {
    getUserProfileSettings(): Promise<any> {
        return Promise.resolve(mockCmsSettingsData.mUserSettings);
    }
    updateUserProfileSettings(): Promise<IUserProfileSettings> {
        return Promise.resolve(mockCmsSettingsData.mUserSettings);
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
                        useFactory: (http: Http) => new TranslateHttpLoader(http, "base/app/i18n/", ".json"),
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
            cmsSettingsLanguagePanelComponent = new CmsSettingsLanguagePanelComponent(translate, cmsApiService, router, activatedRoute, cmsSettingsService);
            cmsSettingsService = fixture.debugElement.injector.get(CmsSettingsService);
            cmsApiService = fixture.debugElement.injector.get(CmsApiService);
        });
    }));

    beforeEach(inject([StorageManager], (response) => {
        storageManager = response;
    }));

    /** COMPONENT DEFINED */
    it("should be a defined component: ", async(() => {
        expect(component).toBeDefined();
    }));

    /** CHECK PRIVATE VARIABLES */
    it("should check route params and mCmsLanguages : ", (done) => {
        expect(debugInstance.route.params).not.toBeNull();
        expect(debugInstance.route.params).not.toBeUndefined();
        expect(debugInstance.route.params.value.key).not.toBeNull();
        expect(debugInstance.route.params.value.key).not.toBeUndefined();
        expect(debugInstance.mCmsLanguages.length).toBeGreaterThan(0);
        done();
    });

    /** CHECK BACK BUTTON AND TITLE TEXT ELEMENTS */
    it("should check settingLanguagePanelBackButton and settingLanguagePanelTitleText ", () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            let settingLanguagePanelTitleText = fixture.nativeElement.querySelector("#setting-language-panel-title-text");
            expect(settingLanguagePanelTitleText).toBeTruthy();
            expect(settingLanguagePanelTitleText).not.toBeNull();
            let settingLanguagePanelBackButton = fixture.nativeElement.querySelector("#setting-language-panel-back-button");
            expect(settingLanguagePanelBackButton).toBeTruthy();
            expect(settingLanguagePanelBackButton.hasAttribute("routerLink")).toBe(true);
            expect(settingLanguagePanelBackButton.getAttribute("routerLink")).toBe("/settings");
        });
    });

    /** CHECK AFTER CLICK ON PERTICULAR LANGUAGE setLanguage METHOD SHOULD UPDATE   
     * userprofileSettings WITH SELECTED LANGUAGE, SESSION STORAGE SETTINGS
     * AND ROUTE TO SETTINGS PAGE 
    */
    it("should check setLanguage method and update userprofileSettings and navigate route to settings ", (done) => {
        cmsSettingsService.mUserSettings = mockCmsSettingsData.mUserSettings;
        let languageKey = debugInstance.mCmsLanguages[0].key;
        expect(languageKey).not.toBeUndefined();
        expect(languageKey).not.toBeNull();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            debugInstance.setLanguage(languageKey);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let settings = JSON.parse(storageManager.appStorage.Settings);
                expect(settings.language).toBe(languageKey);
                expect(routerSpy.navigate).toHaveBeenCalledWith(["/settings"]);
            });
            done();
        });
    });

});