import { TestBed, inject, async, fakeAsync, tick } from "@angular/core/testing";
import { HttpModule, Http } from "@angular/http";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { CmsSettingsService } from "../../../../app/launchpad/settings/cms-settings.service";
import { CmsApiService } from "../../../../app/cms/api/cms-api.service";
import { AppConfig } from "../../../../app/config";
import { StorageManager } from "../../../../app/cms/api/cms-storagemanager.service";
import { IUserProfileSettings } from "../../../../app/cms/models/cms-user-profile-settings";
import { CMS_SESSION_STORAGE_ITEM } from "../../../../app/cms/models/cms-session-storage-item";
import { CMSConstants } from "../../../../app/cms/models/cms-constants";

describe("Service: CmsSettingsService", () => {

    let cmsSettingsService: CmsSettingsService;
    let cmsServerApi: CmsApiService;
    let appConfig: AppConfig;
    let translate: TranslateService;
    let storageManager: StorageManager;
    let spySetTextDirectionByLanguageKey: jasmine.Spy;
    let spyRouter: jasmine.Spy;
    let testForSingleDisplay = false;

    //Mock Data for Display
    let mockDisplaysData = {
        displays: [
            {
                "id": 21,
                "name": "Board Meeting Room ,BAN",
                "type": "DisplayWall",
                "description": "Administration Building\r5th floor, room 5.01,\rPhone +49 123 456-141",
                "snapshotPath": "",
                "resolution": {
                    "width": 1920,
                    "height": 1080
                },
                "online": false,
                "acknowledged": true,
                "computerName": "NOICLT27275-1-5",
                "tags": "",
                "startUpAction": "RestoreLastKnownConfiguration",
                "favorite": false,
                "loggedInUserName": "",
                "tiles": [],
                "content": [],
                "width": 0,
                "height": 0,
                "disabled": false
            },
            {
                "id": 3,
                "name": "Board Meeting Room, CJE, INDIA",
                "type": "DisplayWall",
                "description": "Administration Building\r5th floor, room 5.01,\rPhone +49 123 456-141",
                "snapshotPath": "",
                "resolution": {
                    "width": 3520,
                    "height": 1080
                },
                "online": false,
                "acknowledged": true,
                "computerName": "NOICLT27275-1-9",
                "tags": "",
                "startUpAction": "RestoreLastKnownConfiguration",
                "favorite": true,
                "loggedInUserName": "",
                "tiles": [],
                "content": [],
                "width": 0,
                "height": 0,
                "disabled": false
            }
        ]
    };

    // Mock Data for CmsSettings
    let mockCmsSettingsServiceData = {
        "userSettings": {
            "language": "de",
            "wallConnection": {
                "startUpAction": "show-available-walls-list",
                "specificDisplay": "",
                "recentDisplay": ""
            },
            "sourceLabel": {
                "displaySourceNameLabels": true,
                "useMultipleLines": false,
                "fontColor": "#000",
                "fontSize": 16,
                "backgroundColor": "#BDBDBD",
                "transparency": 50
            },
            "logOffTime": "0",
            "pageSize": 0
        }
    };

    // Mock Data for SystemInfo
    let mockSystemInfo = {
        "ServerInfo": {
            "ip": "10.98.0.231",
            "version": "3.2 Build 0144"
        },
        "LicenseInfo": {
            "customerName": "CMS Evaluation",
            "projectName": "CMS Evaluation",
            "licenseStatus": "EvaluationLicense",
            "daysRemaining": 7,
            "localization": 1
        }
    };

    // Mocked Value for Router
    let mockRouter = {
        navigate: (url: string) => {
            return url;
        }
    };

    // Mocked Value for TranslateService
    let mockTranslateService = {
        use: (language: string) => {
            return language;
        },
        getBrowserLang: () => {
            return "pt";
        }
    };

    // Mocked service for api service
    class MockCmsApiService {
        getDisplayList(start: number, count: number, search: string, favorite: boolean): Observable<any> {
            if (testForSingleDisplay) {
                let mockDataForSingleDisplay = [];
                mockDataForSingleDisplay.push(mockDisplaysData.displays[0]);
                return Observable.of(mockDataForSingleDisplay);
            } else if (search === "ErrorTest") {
                return Observable.throw("Error");
            } else {
                return Observable.of(mockDisplaysData.displays);
            }
        }

        getUserProfileSettings(): Promise<any> {
            return Promise.resolve(mockCmsSettingsServiceData.userSettings);
        }

        updateUserProfileSettings(userSetting: IUserProfileSettings): Promise<any> {
            return Promise.resolve(null);
        }

        getSystemInfo(): Observable<any> {
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
                        useFactory: (http: Http) => new TranslateHttpLoader(http, "/base/app/i18n/", ".json"),
                        deps: [Http]
                    }
                })
            ]
        }));

    beforeEach(inject([TranslateService, CmsApiService, Router, StorageManager, AppConfig], (translate, cmsServerApi, router, storageManager, appConfig) => {
        cmsServerApi = cmsServerApi;
        appConfig = appConfig;
        translate = translate;
        storageManager = storageManager;
        router = router;
        cmsSettingsService = new CmsSettingsService(translate, cmsServerApi, router, storageManager, appConfig);
    }));


    it("should be defined", () => {
        expect(cmsSettingsService).toBeDefined();
    });

    it("should navigate to source panel for only one display wall", fakeAsync(() => {
        spyRouter = spyOn(cmsSettingsService["router"], "navigate").and.returnValue(null);
        testForSingleDisplay = true;
        storageManager = new StorageManager();
        cmsSettingsService.setUserProfileSettings();
        tick();
        cmsSettingsService.connectToWallAtStartup();
        tick();
        mockCmsSettingsServiceData.userSettings.wallConnection.recentDisplay = mockDisplaysData.displays[0].name;
        expect(storageManager.get(CMS_SESSION_STORAGE_ITEM.SETTINGS)).toEqual(JSON.stringify(mockCmsSettingsServiceData.userSettings));
        expect(storageManager.get(CMS_SESSION_STORAGE_ITEM.DISPLAY)).toEqual(JSON.stringify(mockDisplaysData.displays[0]));
        expect(spyRouter.calls.count()).toEqual(1);
        expect(spyRouter.calls.argsFor(0)[0]).toEqual([`/displays/${mockDisplaysData.displays[0].id}/sources-panel`]);
    }));

    it("should navigate to displays panel when selecetdOption is show-available-walls-list", fakeAsync(() => {
        spyRouter = spyOn(cmsSettingsService["router"], "navigate").and.returnValue(null);
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
        spyRouter = spyOn(cmsSettingsService["router"], "navigate").and.returnValue(null);
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
        spyRouter = spyOn(cmsSettingsService["router"], "navigate").and.returnValue(null);
        testForSingleDisplay = false;
        mockCmsSettingsServiceData.userSettings.wallConnection.startUpAction = CMSConstants.WALL_CONNECTION.RECENT_WALL;
        mockCmsSettingsServiceData.userSettings.wallConnection.recentDisplay = mockDisplaysData.displays[0].name;
        cmsSettingsService.setUserProfileSettings();
        tick();
        cmsSettingsService.connectToWallAtStartup();
        tick();
        expect(storageManager.get(CMS_SESSION_STORAGE_ITEM.DISPLAY)).toEqual(JSON.stringify(mockDisplaysData.displays[0]));
        expect(spyRouter.calls.count()).toEqual(1);
        expect(spyRouter.calls.argsFor(0)[0]).toEqual([`/displays/${mockDisplaysData.displays[0].id}/sources-panel`]);
    }));

    it("should check for recentDisplayName and if does not matches with any name in the display list, navigate to displays panel when selecetdOption is auto-connect-to-most-recent-wall", fakeAsync(() => {
        spyRouter = spyOn(cmsSettingsService["router"], "navigate").and.returnValue(null);
        testForSingleDisplay = false;
        mockCmsSettingsServiceData.userSettings.wallConnection.startUpAction = CMSConstants.WALL_CONNECTION.RECENT_WALL;
        mockCmsSettingsServiceData.userSettings.wallConnection.recentDisplay = "SomeDisplayName";
        cmsSettingsService.setUserProfileSettings();
        tick();
        cmsSettingsService.connectToWallAtStartup();
        tick();
        expect(spyRouter.calls.count()).toEqual(1);
        expect(spyRouter.calls.argsFor(0)[0]).toEqual([`/displays-panel`]);
    }));

    it("should navigate to displays panel when selecetdOption is auto-connect-to-most-recent-wall and no display is returned from getDisplayList API", fakeAsync(() => {
        spyRouter = spyOn(cmsSettingsService["router"], "navigate").and.returnValue(null);
        mockCmsSettingsServiceData.userSettings.wallConnection.startUpAction = CMSConstants.WALL_CONNECTION.RECENT_WALL;
        mockCmsSettingsServiceData.userSettings.wallConnection.recentDisplay = mockDisplaysData.displays[0].name;
        let copyOfMockDisplay = Object.assign([], mockDisplaysData.displays);
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
        spyRouter = spyOn(cmsSettingsService["router"], "navigate").and.returnValue(null);
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
        spyRouter = spyOn(cmsSettingsService["router"], "navigate").and.returnValue(null);
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
        spyRouter = spyOn(cmsSettingsService["router"], "navigate").and.returnValue(null);
        let spyOnUpdateWallConnectionRecentDisplay = spyOn(cmsSettingsService, "updateWallConnectionRecentDisplay").and.returnValue(null);
        testForSingleDisplay = false;
        mockCmsSettingsServiceData.userSettings.wallConnection.startUpAction = CMSConstants.WALL_CONNECTION.SPECIFIC_WALL;
        mockCmsSettingsServiceData.userSettings.wallConnection.specificDisplay = mockDisplaysData.displays[0].name;
        cmsSettingsService.setUserProfileSettings();
        tick();
        cmsSettingsService.connectToWallAtStartup();
        tick();
        expect(storageManager.get(CMS_SESSION_STORAGE_ITEM.DISPLAY)).toEqual(JSON.stringify(mockDisplaysData.displays[0]));
        expect(spyRouter.calls.count()).toEqual(1);
        expect(spyRouter.calls.argsFor(0)[0]).toEqual([`/displays/${mockDisplaysData.displays[0].id}/sources-panel`]);
        expect(spyOnUpdateWallConnectionRecentDisplay.calls.count()).toEqual(1);
        expect(spyOnUpdateWallConnectionRecentDisplay).toHaveBeenCalledWith(mockDisplaysData.displays[0]);
    }));

    it("should check for selectedDisplayName and if does not matches with any name in the display list, navigate to displays panel when selecetdOption is auto-connect-to-specific-wall", fakeAsync(() => {
        spyRouter = spyOn(cmsSettingsService["router"], "navigate").and.returnValue(null);
        testForSingleDisplay = false;
        mockCmsSettingsServiceData.userSettings.wallConnection.startUpAction = CMSConstants.WALL_CONNECTION.SPECIFIC_WALL;
        mockCmsSettingsServiceData.userSettings.wallConnection.specificDisplay = "SomeDisplayName";
        cmsSettingsService.setUserProfileSettings();
        tick();
        cmsSettingsService.connectToWallAtStartup();
        tick();
        expect(spyRouter.calls.count()).toEqual(1);
        expect(spyRouter.calls.argsFor(0)[0]).toEqual([`/displays-panel`]);
    }));

    it("should navigate to displays panel when selecetdOption is auto-connect-to-specific-wall and no display is returned from getDisplayList API", fakeAsync(() => {
        spyRouter = spyOn(cmsSettingsService["router"], "navigate").and.returnValue(null);
        mockCmsSettingsServiceData.userSettings.wallConnection.startUpAction = CMSConstants.WALL_CONNECTION.SPECIFIC_WALL;
        mockCmsSettingsServiceData.userSettings.wallConnection.specificDisplay = mockDisplaysData.displays[0].name;
        let copyOfMockDisplay = Object.assign([], mockDisplaysData.displays);
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
        spyRouter = spyOn(cmsSettingsService["router"], "navigate").and.returnValue(null);
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
        let isRTL = cmsSettingsService.isRTLLanguage("ar");
        expect(isRTL).toBeTruthy();
        isRTL = cmsSettingsService.isRTLLanguage("en");
        expect(isRTL).toBeFalsy();
    });

    it("should setTextDirectionByLanguageKey to rtl if  isRTLLanguage(param) return true", () => {
        cmsSettingsService.setTextDirectionByLanguageKey("ar");
        let html = document.getElementsByTagName("html")[0];
        expect(html.getAttribute("dir")).toBe("rtl");

        cmsSettingsService.setTextDirectionByLanguageKey("en");
        expect(html.getAttribute("dir")).toBe("ltr");
    });

    it("should return lanaguage value from key", () => {
        expect(cmsSettingsService.getUserSelectedLanguageByKey("ar")).toBe("العربية");
        expect(cmsSettingsService.getUserSelectedLanguageByKey("de")).toBe("German");
        expect(cmsSettingsService.getUserSelectedLanguageByKey("en")).toBe("English");
        expect(cmsSettingsService.getUserSelectedLanguageByKey("es")).toBe("Español");
        expect(cmsSettingsService.getUserSelectedLanguageByKey("fr")).toBe("Francais");
        expect(cmsSettingsService.getUserSelectedLanguageByKey("ja")).toBe("日本語");
        expect(cmsSettingsService.getUserSelectedLanguageByKey("pl")).toBe("Polski");
        expect(cmsSettingsService.getUserSelectedLanguageByKey("pt")).toBe("Portuguěs");
        expect(cmsSettingsService.getUserSelectedLanguageByKey("zh")).toBe("中文");
        expect(cmsSettingsService.getUserSelectedLanguageByKey("tr")).toBe("Türk");
        expect(cmsSettingsService.getUserSelectedLanguageByKey("ru")).toBe("русский");
    });

    it("should increase count value as per it's index", () => {
        let expectedFontSize = cmsSettingsService.increaseCount(16, CMSConstants.FONT_SIZES);
        expect(expectedFontSize).toEqual(18);
    });

    it("should increase count value as per it's nearest high value", () => {
        let expectedFontSize = cmsSettingsService.increaseCount(17, CMSConstants.FONT_SIZES);
        expect(expectedFontSize).toEqual(18);
    });

    it("should decrease count value as per it's index", () => {
        let expectedFontSize = cmsSettingsService.decreaseCount(16, CMSConstants.FONT_SIZES);
        expect(expectedFontSize).toEqual(14);
    });

    it("should decrease count value as per it's nearest low value", () => {
        let expectedFontSize = cmsSettingsService.decreaseCount(15, CMSConstants.FONT_SIZES);
        expect(expectedFontSize).toEqual(14);
    });

    it("should not increase/decrease count value for maximum and minimum count", () => {
        let expectedFontSize = cmsSettingsService.increaseCount(72, CMSConstants.FONT_SIZES);
        expect(expectedFontSize).toEqual(72);

        expectedFontSize = cmsSettingsService.decreaseCount(1, CMSConstants.FONT_SIZES);
        expect(expectedFontSize).toEqual(1);
    });

    it("should validate Count Data", () => {
        let expectedFontSize = cmsSettingsService.validateCountData(-8, CMSConstants.FONT_SIZES, CMSConstants.DEFAULT_FONT_SIZE);
        expect(expectedFontSize).toEqual(1);

        let expectedAutoLogOffTime = cmsSettingsService.validateCountData(78, CMSConstants.LOGOFF_TIME_STEPS, CMSConstants.DEFAULT_LOGOFF_TIME);
        expect(expectedAutoLogOffTime).toEqual(60);

        let expectedTranspareny = cmsSettingsService.validateCountData(78, CMSConstants.TRANSPARENCY_STEPS, CMSConstants.DEFAULT_TRANSPARENCY);
        expect(expectedTranspareny).toEqual(78);
    });

    it("should update displayName for specific display in the userSettings and should perfom browser back button action", fakeAsync(() => {
        let spyHistoryBack = spyOn(history, "back").and.returnValue(null);
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
        spySetTextDirectionByLanguageKey = spyOn(cmsSettingsService, "setTextDirectionByLanguageKey").and.returnValue(null);
        mockSystemInfo.LicenseInfo.localization = 0;
        cmsSettingsService.setUserProfileSettings();
        tick();
        cmsSettingsService.applyUserSelectedLanguage();
        tick();
        expect(spySetTextDirectionByLanguageKey.calls.count()).toEqual(2);
        expect(spySetTextDirectionByLanguageKey.calls.argsFor(0)[0]).toEqual("de");
        expect(spySetTextDirectionByLanguageKey.calls.argsFor(1)[0]).toEqual(CMSConstants.DEFAULTLANGUAGE);
    }));

    it("should set application language as per browser language", () => {
        spySetTextDirectionByLanguageKey = spyOn(cmsSettingsService, "setTextDirectionByLanguageKey").and.returnValue(null);
        cmsSettingsService.setBrowserLanguage();
        expect(spySetTextDirectionByLanguageKey.calls.count()).toEqual(1);
        expect(spySetTextDirectionByLanguageKey).toHaveBeenCalledWith(mockCmsSettingsServiceData.userSettings.language);
    });

    it("should set application language as per browser language even when no language is set in UserSettings", () => {
        spySetTextDirectionByLanguageKey = spyOn(cmsSettingsService, "setTextDirectionByLanguageKey").and.returnValue(null);
        mockCmsSettingsServiceData.userSettings.language = "";
        storageManager = new StorageManager();
        storageManager.set(CMS_SESSION_STORAGE_ITEM.SETTINGS, JSON.stringify(mockCmsSettingsServiceData));
        cmsSettingsService.setBrowserLanguage();
        expect(spySetTextDirectionByLanguageKey.calls.count()).toEqual(1);
        expect(spySetTextDirectionByLanguageKey).toHaveBeenCalledWith("pt");
    });

});