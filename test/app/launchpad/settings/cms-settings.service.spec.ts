/**
 * This class is responsible to handle unit test case of CmsSettingsService
 */
import { fakeAsync, inject, TestBed, tick } from "@angular/core/testing";
import { Http, HttpModule } from "@angular/http";
import { Router } from "@angular/router";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Observable } from "rxjs/Observable";

import { CmsApiService } from "../../../../app/cms/api/cms-api.service";
import { StorageManager } from "../../../../app/cms/api/cms-storagemanager.service";
import { CMSConstants } from "../../../../app/cms/models/cms-constants";
import { Display } from "../../../../app/cms/models/cms-display";
import { CmsSessionStorageItem } from "../../../../app/cms/models/cms-session-storage-item";
import { IUserProfileSettings } from "../../../../app/cms/models/cms-user-profile-settings";
import { AppConfig } from "../../../../app/config";
import { CmsLanguages } from "../../../../app/i18n/cms-languages";
import { CmsSettingsService } from "../../../../app/launchpad/settings/cms-settings.service";



/**
 * This class is responsible to handle unit test case of CmsSourcesPanelComponent
 */
describe("Service: CmsSettingsService", () => {
    let cmsSettingsService: CmsSettingsService;
    let cmsServerApi: CmsApiService;
    let appConfig: AppConfig;
    let translate: TranslateService;
    let storageManager: StorageManager;
    let spySetTextDirectionByLanguageKey: jasmine.Spy;
    let spyRouter: jasmine.Spy;
    let testForSingleDisplay: boolean = false;
    let router: Router;

    //Mock Data for Display
    const mockDisplaysData : any = {
        displays: [
            {
                id: 21,
                name: "Board Meeting Room ,BAN",
                type: "DisplayWall",
                description: "Administration Building\r5th floor, room 5.01,\rPhone +49 123 456-141",
                snapshotPath: "",
                resolution: {
                    width: 1920,
                    height: 1080
                },
                online: false,
                acknowledged: true,
                computerName: "NOICLT27275-1-5",
                tags: "",
                startUpAction: "RestoreLastKnownConfiguration",
                favorite: false,
                loggedInUserName: "",
                tiles: [],
                content: [],
                width: 0,
                height: 0,
                disabled: false
            },
            {
                id: 3,
                name: "Board Meeting Room, CJE, INDIA",
                type: "DisplayWall",
                description: "Administration Building\r5th floor, room 5.01,\rPhone +49 123 456-141",
                snapshotPath: "",
                resolution: {
                    width: 3520,
                    height: 1080
                },
                online: false,
                acknowledged: true,
                computerName: "NOICLT27275-1-9",
                tags: "",
                startUpAction: "RestoreLastKnownConfiguration",
                favorite: true,
                loggedInUserName: "",
                tiles: [],
                content: [],
                width: 0,
                height: 0,
                disabled: false
            }
        ]
    };

    // Mock Data for CmsSettings
    const mockCmsSettingsServiceData = {
        userSettings: {
            language: "de",
            wallConnection: {
                startUpAction: "show-available-walls-list",
                specificDisplay: "",
                recentDisplay: ""
            },
            sourceLabel: {
                displaySourceNameLabels: true,
                useMultipleLines: false,
                fontColor: "#000",
                fontSize: 16,
                backgroundColor: "#BDBDBD",
                transparency: 50
            },
            logOffTime: "0",
            pageSize: 0
        }
    };

    // Mock Data for SystemInfo
    const mockSystemInfo : any = {
        ServerInfo: {
            ip: "10.98.0.231",
            version: "3.2 Build 0144"
        },
        LicenseInfo: {
            customerName: "CMS Evaluation",
            projectName: "CMS Evaluation",
            licenseStatus: "EvaluationLicense",
            daysRemaining: 7,
            localization: 1
        }
    };

    // Mocked Value for Router
    const mockRouter : any = {
        navigate: (url: string) : string => {
            return url;
        }
    };

    // Mocked Value for TranslateService
    const mockTranslateService : any = {
        use: (language: string) : string => {
            return language;
        },
        getBrowserLang: () : string => {
            return "pt";
        }
    };

    // Mocked service for api service
    class MockCmsApiService {
       public getDisplayList(start: number, count: number, search: string, favorite: boolean): Observable<any> {
            if (testForSingleDisplay) {
                const mockDataForSingleDisplay : Display[] = [];
                mockDataForSingleDisplay.push(mockDisplaysData.displays[0]);

                return Observable.of(mockDataForSingleDisplay);
            } else if (search === "ErrorTest") {
                return Observable.throw("Error");
            } else {
                return Observable.of(mockDisplaysData.displays);
            }
        }

        public getUserProfileSettings(): Promise<any> {
            return Promise.resolve(mockCmsSettingsServiceData.userSettings);
        }

        public updateUserProfileSettings(userSetting: IUserProfileSettings): Promise<any> {
            return Promise.resolve(undefined);
        }

        public getSystemInfo(): Observable<any> {
            return Observable.of(mockSystemInfo);
        }
    }

    beforeEach(async () =>
        TestBed.configureTestingModule({
            providers: [
                CmsSettingsService,
                AppConfig,
                StorageManager,
                {
                    provide: Router,
                    useValue: mockRouter
                },
                {
                    provide: CmsApiService,
                    useClass: MockCmsApiService
                },
                {
                    provide: TranslateService,
                    useValue: mockTranslateService
                }
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
            ]
        }));

    beforeEach(inject([TranslateService, CmsApiService, Router, StorageManager, AppConfig], (translateService: TranslateService, cmsServerApiService: CmsApiService, routerService: Router, storageManagerService: StorageManager, appConfigService: AppConfig) => {
        cmsServerApi = cmsServerApiService;
        appConfig = appConfigService;
        translate = translateService;
        storageManager = storageManagerService;
        router = routerService;
        cmsSettingsService = new CmsSettingsService(translate, cmsServerApi, router, storageManager, appConfig);
    }));


    it("should be defined", () => {
        expect(cmsSettingsService).toBeDefined();
    });

    it("should navigate to source panel for only one display wall", fakeAsync(() => {
        spyRouter = spyOn(router, "navigate");
        testForSingleDisplay = true;
        storageManager = new StorageManager();
        cmsSettingsService.setUserProfileSettings();
        tick();
        cmsSettingsService.connectToWallAtStartup();
        tick();
        mockCmsSettingsServiceData.userSettings.wallConnection.recentDisplay = mockDisplaysData.displays[0].name;
        expect(storageManager.getItem(CmsSessionStorageItem.SETTINGS)).toEqual(JSON.stringify(mockCmsSettingsServiceData.userSettings));
        expect(storageManager.getItem(CmsSessionStorageItem.DISPLAY)).toEqual(JSON.stringify(mockDisplaysData.displays[0]));
        expect(spyRouter.calls.count()).toEqual(1);
        expect(spyRouter.calls.argsFor(0)[0]).toEqual([`/displays/${mockDisplaysData.displays[0].id}/sources-panel`]);
    }));

    it("should navigate to displays panel when selecetdOption is show-available-walls-list", fakeAsync(() => {
        spyRouter = spyOn(router, "navigate");
        testForSingleDisplay = false;
        cmsSettingsService.setUserProfileSettings();
        tick();
        cmsSettingsService.connectToWallAtStartup();
        tick();
        mockCmsSettingsServiceData.userSettings.wallConnection.recentDisplay = mockDisplaysData.displays[0].name;
        expect(spyRouter.calls.count()).toEqual(1);
        expect(spyRouter.calls.argsFor(0)[0]).toEqual(["/displays-panel"]);
    }));

    it("should check for recentDisplayName is empty and navigate to displays panel when selecetdOption is auto-connect-to-most-recent-wall", fakeAsync(() => {
        spyRouter = spyOn(router, "navigate");
        testForSingleDisplay = false;
        mockCmsSettingsServiceData.userSettings.wallConnection.startUpAction = CMSConstants.WALL_CONNECTION.RECENT_WALL;
        mockCmsSettingsServiceData.userSettings.wallConnection.recentDisplay = "";
        cmsSettingsService.setUserProfileSettings();
        tick();
        cmsSettingsService.connectToWallAtStartup();
        tick();
        expect(spyRouter.calls.count()).toEqual(1);
        expect(spyRouter.calls.argsFor(0)[0]).toEqual(["/displays-panel"]);
    }));

    it("should check for recentDisplayName matches with display-list names and navigate to displays panel when selecetdOption is auto-connect-to-most-recent-wall", fakeAsync(() => {
        spyRouter = spyOn(router, "navigate");
        testForSingleDisplay = false;
        mockCmsSettingsServiceData.userSettings.wallConnection.startUpAction = CMSConstants.WALL_CONNECTION.RECENT_WALL;
        mockCmsSettingsServiceData.userSettings.wallConnection.recentDisplay = mockDisplaysData.displays[0].name;
        cmsSettingsService.setUserProfileSettings();
        tick();
        cmsSettingsService.connectToWallAtStartup();
        tick();
        expect(storageManager.getItem(CmsSessionStorageItem.DISPLAY)).toEqual(JSON.stringify(mockDisplaysData.displays[0]));
        expect(spyRouter.calls.count()).toEqual(1);
        expect(spyRouter.calls.argsFor(0)[0]).toEqual([`/displays/${mockDisplaysData.displays[0].id}/sources-panel`]);
    }));

    it("should check for recentDisplayName and if does not matches with any name in the display list, navigate to displays panel when selecetdOption is auto-connect-to-most-recent-wall", fakeAsync(() => {
        spyRouter = spyOn(router, "navigate");
        testForSingleDisplay = false;
        mockCmsSettingsServiceData.userSettings.wallConnection.startUpAction = CMSConstants.WALL_CONNECTION.RECENT_WALL;
        mockCmsSettingsServiceData.userSettings.wallConnection.recentDisplay = "SomeDisplayName";
        cmsSettingsService.setUserProfileSettings();
        tick();
        cmsSettingsService.connectToWallAtStartup();
        tick();
        expect(spyRouter.calls.count()).toEqual(1);
        expect(spyRouter.calls.argsFor(0)[0]).toEqual(["/displays-panel"]);
    }));

    it("should navigate to displays panel when selecetdOption is auto-connect-to-most-recent-wall and no display is returned from getDisplayList API", fakeAsync(() => {
        spyRouter = spyOn(router, "navigate");
        mockCmsSettingsServiceData.userSettings.wallConnection.startUpAction = CMSConstants.WALL_CONNECTION.RECENT_WALL;
        mockCmsSettingsServiceData.userSettings.wallConnection.recentDisplay = mockDisplaysData.displays[0].name;
        const copyOfMockDisplay = Object.assign([], mockDisplaysData.displays);
        mockDisplaysData.displays.length = 0;
        testForSingleDisplay = false;
        cmsSettingsService.setUserProfileSettings();
        tick();
        cmsSettingsService.connectToWallAtStartup();
        tick();
        expect(spyRouter.calls.count()).toEqual(1);
        expect(spyRouter.calls.argsFor(0)[0]).toEqual(["/displays-panel"]);
        mockDisplaysData.displays = Object.assign([], copyOfMockDisplay);
    }));

    it("should navigate to displays panel even when error is thrown from getDisplayList API, when selecetdOption is auto-connect-to-most-recent-wall", fakeAsync(() => {
        spyRouter = spyOn(router, "navigate");
        testForSingleDisplay = false;
        mockCmsSettingsServiceData.userSettings.wallConnection.startUpAction = CMSConstants.WALL_CONNECTION.RECENT_WALL;
        mockCmsSettingsServiceData.userSettings.wallConnection.recentDisplay = "ErrorTest";
        cmsSettingsService.setUserProfileSettings();
        tick();
        cmsSettingsService.connectToWallAtStartup();
        tick();
        expect(spyRouter.calls.count()).toEqual(1);
        expect(spyRouter.calls.argsFor(0)[0]).toEqual(["/displays-panel"]);
    }));

    it("should check for selectedDisplayName is empty and navigate to displays panel when selecetdOption is auto-connect-to-specific-wall", fakeAsync(() => {
        spyRouter = spyOn(router, "navigate");
        testForSingleDisplay = false;
        mockCmsSettingsServiceData.userSettings.wallConnection.startUpAction = CMSConstants.WALL_CONNECTION.SPECIFIC_WALL;
        mockCmsSettingsServiceData.userSettings.wallConnection.specificDisplay = "";
        cmsSettingsService.setUserProfileSettings();
        tick();
        cmsSettingsService.connectToWallAtStartup();
        tick();
        expect(spyRouter.calls.count()).toEqual(1);
        expect(spyRouter.calls.argsFor(0)[0]).toEqual(["/displays-panel"]);
    }));

    it("should check for matching selectedDisplayName with display-list names and navigate to displays panel when selecetdOption is auto-connect-to-specific-wall", fakeAsync(() => {
        spyRouter = spyOn(router, "navigate");
        const spyOnUpdateWallConnectionRecentDisplay : jasmine.Spy = spyOn(cmsSettingsService, "updateWallConnectionRecentDisplay");
        testForSingleDisplay = false;
        mockCmsSettingsServiceData.userSettings.wallConnection.startUpAction = CMSConstants.WALL_CONNECTION.SPECIFIC_WALL;
        mockCmsSettingsServiceData.userSettings.wallConnection.specificDisplay = mockDisplaysData.displays[0].name;
        cmsSettingsService.setUserProfileSettings();
        tick();
        cmsSettingsService.connectToWallAtStartup();
        tick();
        expect(storageManager.getItem(CmsSessionStorageItem.DISPLAY)).toEqual(JSON.stringify(mockDisplaysData.displays[0]));
        expect(spyRouter.calls.count()).toEqual(1);
        expect(spyRouter.calls.argsFor(0)[0]).toEqual([`/displays/${mockDisplaysData.displays[0].id}/sources-panel`]);
        expect(spyOnUpdateWallConnectionRecentDisplay.calls.count()).toEqual(1);
        expect(spyOnUpdateWallConnectionRecentDisplay).toHaveBeenCalledWith(mockDisplaysData.displays[0]);
    }));

    it("should check for selectedDisplayName and if does not matches with any name in the display list, navigate to displays panel when selecetdOption is auto-connect-to-specific-wall", fakeAsync(() => {
        spyRouter = spyOn(router, "navigate");
        testForSingleDisplay = false;
        mockCmsSettingsServiceData.userSettings.wallConnection.startUpAction = CMSConstants.WALL_CONNECTION.SPECIFIC_WALL;
        mockCmsSettingsServiceData.userSettings.wallConnection.specificDisplay = "SomeDisplayName";
        cmsSettingsService.setUserProfileSettings();
        tick();
        cmsSettingsService.connectToWallAtStartup();
        tick();
        expect(spyRouter.calls.count()).toEqual(1);
        expect(spyRouter.calls.argsFor(0)[0]).toEqual(["/displays-panel"]);
    }));

    it("should navigate to displays panel when selecetdOption is auto-connect-to-specific-wall and no display is returned from getDisplayList API", fakeAsync(() => {
        spyRouter = spyOn(router, "navigate");
        mockCmsSettingsServiceData.userSettings.wallConnection.startUpAction = CMSConstants.WALL_CONNECTION.SPECIFIC_WALL;
        mockCmsSettingsServiceData.userSettings.wallConnection.specificDisplay = mockDisplaysData.displays[0].name;
        const copyOfMockDisplay = Object.assign([], mockDisplaysData.displays);
        mockDisplaysData.displays.length = 0;
        testForSingleDisplay = false;
        cmsSettingsService.setUserProfileSettings();
        tick();
        cmsSettingsService.connectToWallAtStartup();
        tick();
        expect(spyRouter.calls.count()).toEqual(1);
        expect(spyRouter.calls.argsFor(0)[0]).toEqual(["/displays-panel"]);
        mockDisplaysData.displays = Object.assign([], copyOfMockDisplay);
    }));

    it("should navigate to displays panel even when error is thrown from getDisplayList API, when selecetdOption is auto-connect-to-specific-wall", fakeAsync(() => {
        spyRouter = spyOn(router, "navigate");
        testForSingleDisplay = false;
        mockCmsSettingsServiceData.userSettings.wallConnection.startUpAction = CMSConstants.WALL_CONNECTION.SPECIFIC_WALL;
        mockCmsSettingsServiceData.userSettings.wallConnection.specificDisplay = "ErrorTest";
        cmsSettingsService.setUserProfileSettings();
        tick();
        cmsSettingsService.connectToWallAtStartup();
        tick();
        expect(spyRouter.calls.count()).toEqual(1);
        expect(spyRouter.calls.argsFor(0)[0]).toEqual(["/displays-panel"]);
    }));

    it("should return true if selected language is RTL Type else false", () => {
        let isRTL: boolean = cmsSettingsService.isRTLLanguage("ar");
        expect(isRTL).toBeTruthy();
        isRTL = cmsSettingsService.isRTLLanguage("en");
        expect(isRTL).toBeFalsy();
    });

    it("should setTextDirectionByLanguageKey to rtl if  isRTLLanguage(param) return true", () => {
        cmsSettingsService.setTextDirectionByLanguageKey("ar");
        const html: HTMLHtmlElement  = document.getElementsByTagName("html")[0];
        expect(html.getAttribute("dir")).toBe("rtl");

        cmsSettingsService.setTextDirectionByLanguageKey("en");
        expect(html.getAttribute("dir")).toBe("ltr");
    });

    it("should return lanaguage value from key", () => {
        for (const language of CmsLanguages.languages) {
            expect(cmsSettingsService.getUserSelectedLanguageByKey(language.key)).toEqual(language.value);
        }
    });

    it("should increase count value as per it's index", () => {
        const expectedFontSize : number = cmsSettingsService.increaseCount(16, CMSConstants.FONT_SIZES);
        expect(expectedFontSize).toEqual(18);
    });

    it("should increase count value as per it's nearest high value", () => {
        const expectedFontSize: number = cmsSettingsService.increaseCount(17, CMSConstants.FONT_SIZES);
        expect(expectedFontSize).toEqual(18);
    });

    it("should decrease count value as per it's index", () => {
        const expectedFontSize: number = cmsSettingsService.decreaseCount(16, CMSConstants.FONT_SIZES);
        expect(expectedFontSize).toEqual(14);
    });

    it("should decrease count value as per it's nearest low value", () => {
        const expectedFontSize: number = cmsSettingsService.decreaseCount(15, CMSConstants.FONT_SIZES);
        expect(expectedFontSize).toEqual(14);
    });

    it("should not increase/decrease count value for maximum and minimum count", () => {
        let expectedFontSize: number = cmsSettingsService.increaseCount(72, CMSConstants.FONT_SIZES);
        expect(expectedFontSize).toEqual(72);

        expectedFontSize = cmsSettingsService.decreaseCount(1, CMSConstants.FONT_SIZES);
        expect(expectedFontSize).toEqual(1);
    });

    it("should validate Count Data", () => {
        const expectedFontSize: number = cmsSettingsService.validateCountData(-8, CMSConstants.FONT_SIZES, CMSConstants.DEFAULT_FONT_SIZE);
        expect(expectedFontSize).toEqual(1);

        const expectedAutoLogOffTime: number = cmsSettingsService.validateCountData(78, CMSConstants.LOGOFF_TIME_STEPS, CMSConstants.DEFAULT_LOGOFF_TIME);
        expect(expectedAutoLogOffTime).toEqual(60);

        const expectedTranspareny: number = cmsSettingsService.validateCountData(78, CMSConstants.TRANSPARENCY_STEPS, CMSConstants.DEFAULT_TRANSPARENCY);
        expect(expectedTranspareny).toEqual(78);
    });

    it("should update displayName for specific display in the userSettings and should perfom browser back button action", fakeAsync(() => {
        const spyHistoryBack = spyOn(history, "back");
        cmsSettingsService.setUserProfileSettings();
        tick();
        cmsSettingsService.updateWallConnectionSpecificDisplay(mockDisplaysData.displays[0]);
        tick();
        expect(cmsSettingsService.userSettings.wallConnection.specificDisplay).toEqual(mockDisplaysData.displays[0].name);
        expect(spyHistoryBack.calls.count()).toEqual(1);
    }));

    it("should set user selected language on the basis of localization license", fakeAsync(() => {
        spySetTextDirectionByLanguageKey = spyOn(cmsSettingsService, "setTextDirectionByLanguageKey").and.returnValue(null);
        cmsSettingsService.setUserProfileSettings();
        tick();
        cmsSettingsService.applyUserSelectedLanguage();
        tick();
        expect(spySetTextDirectionByLanguageKey.calls.count()).toEqual(1);
        expect(spySetTextDirectionByLanguageKey.calls.argsFor(0)[0]).toEqual(mockCmsSettingsServiceData.userSettings.language);
    }));

    it("should set user selected language on the basis of localization license and set default language if licence is not available", fakeAsync(() => {
        spySetTextDirectionByLanguageKey = spyOn(cmsSettingsService, "setTextDirectionByLanguageKey");
        mockSystemInfo.LicenseInfo.localization = 0;
        cmsSettingsService.setUserProfileSettings();
        tick();
        cmsSettingsService.applyUserSelectedLanguage();
        tick();
        const callCount: number = 2;
        expect(spySetTextDirectionByLanguageKey.calls.count()).toEqual(callCount);
        expect(spySetTextDirectionByLanguageKey.calls.argsFor(0)[0]).toEqual("de");
        expect(spySetTextDirectionByLanguageKey.calls.argsFor(1)[0]).toEqual(CMSConstants.DEFAULTLANGUAGE);
    }));

    it("should set application language as per browser language", () => {
        spySetTextDirectionByLanguageKey = spyOn(cmsSettingsService, "setTextDirectionByLanguageKey");
        cmsSettingsService.setBrowserLanguage();
        expect(spySetTextDirectionByLanguageKey.calls.count()).toEqual(1);
        expect(spySetTextDirectionByLanguageKey).toHaveBeenCalledWith(mockCmsSettingsServiceData.userSettings.language);
    });

    it("should set application language as per browser language even when no language is set in UserSettings", () => {
        spySetTextDirectionByLanguageKey = spyOn(cmsSettingsService, "setTextDirectionByLanguageKey");
        mockCmsSettingsServiceData.userSettings.language = "";
        storageManager = new StorageManager();
        storageManager.setItem(CmsSessionStorageItem.SETTINGS, JSON.stringify(mockCmsSettingsServiceData));
        cmsSettingsService.setBrowserLanguage();
        expect(spySetTextDirectionByLanguageKey.calls.count()).toEqual(1);
        expect(spySetTextDirectionByLanguageKey).toHaveBeenCalledWith("pt");
    });

});
