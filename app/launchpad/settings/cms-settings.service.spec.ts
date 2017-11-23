import { TestBed, inject, async, fakeAsync, tick } from "@angular/core/testing";
import { CmsSettingsService } from "./cms-settings.service";
import { HttpModule, Http } from "@angular/http";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Router } from "@angular/router";

import { CmsApiService } from "../../cms/api/cms-api.service";
import { CmsLanguages } from "../../i18n/cms-languages";
import { CMS_SESSION_STORAGE_ITEM } from "../../cms/models/cms-session-storage-item";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { IUserProfileSettings } from "../../cms/models/cms-user-profile-settings";
import { Display } from "../../cms/models/cms-display";
import { AppConfig } from "../../config";
import { CMSConstants } from "../../cms/models/cms-constants";
import { Observable } from "rxjs/Observable";

describe("Service: CmsSettingsService", () => {

    let cmsSettingsService: CmsSettingsService;
    let cmsServerApi: CmsApiService;
    let appConfig: AppConfig;
    let translate: TranslateService;
    let storageManager: StorageManager;

    //Mock Data for one Display
    let mockDisplaysData = {
        displays: [{
            "id": 11,
            "name": "Auditorium",
            "type": "DisplayWall",
            "description": "Auditorium\rNoida",
            "snapshotPath": "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fdisplays%2F17.jpeg",
            "resolution": {
                "width": 2048,
                "height": 1080
            },
            "online": false,
            "acknowledged": true,
            "computerName": "AudiComp",
            "tags": "",
            "startUpAction": "RestoreLastKnownConfiguration",
            "favorite": true,
            "loggedInUserName": "",
            "autoloadLayout": 0,
            "windowOption": "NoTitleBarAndNoResizableBorder",
            "vdsDisplay": false,
            "defaultAreaEnabled": false,
            "defaultArea": {
                "left": 0,
                "top": 0,
                "width": 0,
                "height": 0
            },
            "isDecoderDisplay": false,
            "sourceRoutingRequired": false,
            "tilerId": 0,
            "tiles": [],
            "modules": [
                {
                    "id": 21,
                    "geometry": {
                        "left": 0,
                        "top": 0,
                        "width": 2048,
                        "height": 1080
                    }
                }
            ]
        }]
    };

    // Mock Data for CmsSettings
    let mockCmsSettingsServiceData = {
        "userSettings": {
            "language": "en",
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

    // Mocked Value for Router
    let mockRouter = {
        navigate: (url: string) => {
            return url;
        }
    };

    // Mocked service for api service
    class MockCmsApiService {
        getDisplayList(): Observable<any> {
            return Observable.of(mockDisplaysData.displays);
        }

        getUserProfileSettings(): Promise<any> {
            return Promise.resolve(mockCmsSettingsServiceData.userSettings);
        }

        updateUserProfileSettings(userSetting: IUserProfileSettings): Promise<any> {
            return Promise.resolve(null);
        }
    }

    beforeEach(async () =>
        TestBed.configureTestingModule({
            providers: [
                CmsSettingsService,
                TranslateService,
                AppConfig,
                StorageManager,
                {
                    provide: Router,
                    useValue: mockRouter
                },
                {
                    provide: CmsApiService,
                    useClass: MockCmsApiService
                }
            ],
            imports: [
                HttpModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: (http: Http) => new TranslateHttpLoader(http, "base/app/i18n", ".json"),
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
        let spy = spyOn(cmsSettingsService["router"], "navigate").and.returnValue(null);
        storageManager = new StorageManager();
        cmsSettingsService.setUserProfileSettings();
        tick();
        cmsSettingsService.connectToWallAtStartup();
        tick();
        mockCmsSettingsServiceData.userSettings.wallConnection.recentDisplay = mockDisplaysData.displays[0].name;
        expect(storageManager.get(CMS_SESSION_STORAGE_ITEM.SETTINGS)).toEqual(JSON.stringify(mockCmsSettingsServiceData.userSettings));
        expect(storageManager.get(CMS_SESSION_STORAGE_ITEM.DISPLAY)).toEqual(JSON.stringify(mockDisplaysData.displays[0]));
        expect(spy.calls.count()).toEqual(1);
        expect(spy.calls.argsFor(0)[0]).toEqual([`/displays/${mockDisplaysData.displays[0].id}/sources-panel`]);
    }));

});