/**
 * This class is responsible to handle unit test case of CmsSettingsPanelComponent
 */
import { Location } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef, NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, inject, TestBed } from "@angular/core/testing";
import { Http, HttpModule } from "@angular/http";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Observable } from "rxjs/Observable";

import { APIRequest } from "../../../../../app/cms/api/api-request";
import { CmsApiService } from "../../../../../app/cms/api/cms-api.service";
import { StorageManager } from "../../../../../app/cms/api/cms-storagemanager.service";
import { CmsSessionStorageItem } from "../../../../../app/cms/models/cms-session-storage-item";
import { AppConfig } from "../../../../../app/config";
import { CmsLanguages } from "../../../../../app/i18n/cms-languages";
import { CmsSettingsService } from "../../../../../app/launchpad/settings/cms-settings.service";
import { CmsSettingsLanguagePanelComponent } from "../../../../../app/launchpad/settings/language/cms-settings-language-panel.component";

let routerSpy: any;

const mockCmsSettingsData : any = {
    userSettings: {
        language: "en",
        wallConnection: {
            startUpAction: "show-available-walls-list",
            specificDisplay: "Board Meeting Room",
            recentDisplay: "Board Meeting Room"
        },
        sourceLabel: {
            displaySourceNameLabels: true,
            useMultipleLines: false,
            fontColor: "#FFFFFF",
            fontSize: 14,
            backgroundColor: "#BDBDBD",
            transparency: 50
        },
        logOffTime: 0,
        pageSize: 50
    }
};

// Fake CmsApiService Service
class MockCmsApiService {
    public getUserProfileSettings(): Promise<any> {
        return Promise.resolve(mockCmsSettingsData.userSettings);
    }
    public updateUserProfileSettings(): Promise<any> {
        return Promise.resolve(mockCmsSettingsData.userSettings);
    }
}

describe("Component CmsSettingsLanguagePanelComponent", () => {
    let component: CmsSettingsLanguagePanelComponent;
    let fixture: ComponentFixture<CmsSettingsLanguagePanelComponent>;
    let cmsSettingsService: CmsSettingsService;
    let cmsApiService: CmsApiService;
    let storageManager : any;
    let debugInstance: any;
    let nativeElement: any;
    let activatedRoute: ActivatedRoute;

    beforeEach(async(() => {
       routerSpy = {
            navigate: jasmine.createSpy("settings")
        };
       activatedRoute = new ActivatedRoute();
       activatedRoute.params = Observable.of({
            key: "en"
        });
       TestBed.configureTestingModule({
            declarations: [CmsSettingsLanguagePanelComponent],
            providers: [
                CmsSettingsService,
                {
                    provide: Router,
                    useValue: routerSpy
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
                CmsSessionStorageItem
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
            fixture = TestBed.createComponent(CmsSettingsLanguagePanelComponent);
            component = fixture.componentInstance;
            nativeElement = fixture.nativeElement;
            debugInstance = fixture.debugElement.componentInstance;
            cmsSettingsService = fixture.debugElement.injector.get(CmsSettingsService);
            cmsApiService = fixture.debugElement.injector.get(CmsApiService);
        });
    }));

    beforeEach(inject([StorageManager], (response : any) => {
        storageManager = response;
    }));

    // Componenet defined
    it("should be a defined component: ", async(() => {
        expect(component).toBeDefined();
    }));

    // Check private variables
    it("should check route params and cmsLanguages : ", () => {
        expect(debugInstance.route.params).not.toBeNull();
        expect(debugInstance.route.params).not.toBeUndefined();
        expect(debugInstance.route.params.value.key).not.toBeNull();
        expect(debugInstance.route.params.value.key).not.toBeUndefined();
        expect(debugInstance.cmsLanguages.length).toBeGreaterThan(0);
    });

    // Check back button and title text elements
    it("should check settingLanguagePanelBackButton and settingLanguagePanelTitleText ", () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const settingLanguagePanelTitleText : any = fixture.nativeElement.querySelector("#setting-language-panel-title-text");
            expect(settingLanguagePanelTitleText).toBeTruthy();
            expect(settingLanguagePanelTitleText).not.toBeNull();
            const settingLanguagePanelBackButton : any = fixture.nativeElement.querySelector("#setting-language-panel-back-button");
            expect(settingLanguagePanelBackButton).toBeTruthy();
        });
    });

    /** Check after click on perticular language setlanguage method should update
     * userprofilesettings with selected language, session storage settings
     * and route to settings page
     */
    it("should check setLanguage method and update userprofileSettings and navigate back to settings ", () => {
        cmsSettingsService.userSettings = mockCmsSettingsData.userSettings;
        const languageKey : any = debugInstance.cmsLanguages[0].key;
        expect(languageKey).not.toBeUndefined();
        expect(languageKey).not.toBeNull();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const spyWindowHistoryBack : jasmine.Spy = spyOn(window.history, "back");
            debugInstance.setLanguage(languageKey);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const settings : any = JSON.parse(storageManager.appStorage.Settings);
                expect(settings.language).toBe(languageKey);
                expect(spyWindowHistoryBack).toHaveBeenCalled();
            });
        });
    });
});
