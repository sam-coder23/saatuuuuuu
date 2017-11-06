import { CmsSettingsPanelComponent } from "./cms-settings-panel.component";
import { ComponentFixture, TestBed, async, inject } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ElementRef } from "@angular/core";
import { HttpModule, Http } from "@angular/http";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { CmsSettingsService } from "./cms-settings.service";
import { CmsApiService } from "../../cms/api/cms-api.service";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { Router } from "@angular/router";
import { IUserProfileSettings } from "../../cms/models/cms-user-profile-settings";
import { CmsColorPickerComponent } from "../../shared/colorpicker/cms-colorpicker.component";
import { Display } from "../../cms/models/cms-display";
import { CMSConstants } from "../../cms/models/cms-constants";
import { AppConfig } from "../../config";

import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";

import { CmsLanguages } from "../../i18n/cms-languages";
import { CMS_SESSION_STORAGE_ITEM } from "../../cms/models/cms-session-storage-item";
import { APIRequest } from "../../cms/api/api-request";

let router = {
    navigate: jasmine.createSpy("settings")
};

let MockCmsSettingsService = {
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

let serverInfo = {
    "ServerInfo":
    {
        "ip": "10.98.0.231",
        "version": "70.34 Build 0243"
    },
    "LicenseInfo": {
        "customerName": "Barco",
        "projectName": "CMS Demo",
        "licenseStatus": "DemoLicense",
        "daysRemaining": 1171,
        "localization": 0
    }
};

let displayData = {
    "favorite": true,
    "id": 1,
    "name": "Crisis room wall",
    "description": "",
    "snapshotPath": "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fdisplays%2F1.jpeg",
    "type": "DisplayWall",
    "online": false,
    "resolution": {
        "width": 1600,
        "height": 1200
    },
    "tiles": [
        {
            "left": 0,
            "top": 0,
            "width": 1600,
            "height": 1200
        }
    ],
    "content": [
        {
            "id": 9,
            "name": "Auto_edited_src11",
            "type": "Perspective",
            "resourceId": 17,
            "x": 0,
            "y": 0,
            "width": 1600,
            "height": 1200,
            "snapshotPath": "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F17.jpeg",
            "zOrder": 1
        }
    ]

};

let mockDisplaysData = {
    displays: [{
        "id": 2,
        "name": "Crisis room wall",
        "type": "DisplayWall",
        "description": "",
        "snapshotPath": "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fdisplays%2F1.jpeg",
        "resolution": {
            "width": 1600,
            "height": 1200
        },
        "online": false,
        "acknowledged": true,
        "computerName": "NOICLT28523",
        "tags": "",
        "startUpAction": "RestoreLastKnownConfiguration",
        "favorite": true,
        "loggedInUserName": "",
        "autoloadLayout": 0,
        "windowOption": "NoTitleBarAndNoResizableBorder",
        "vdsDisplay": false,
        "defaultAreaEnabled": false,
        "defaultArea": { "left": 0, "top": 0, "width": 0, "height": 0 },
        "isDecoderDisplay": false,
        "sourceRoutingRequired": false,
        "tilerId": 26,
        "tiles": [
            {
                "left": 0,
                "top": 0,
                "width": 800,
                "height": 600
            },
            {
                "left": 800,
                "top": 0,
                "width": 800,
                "height": 600
            },
            {
                "left": 0,
                "top": 600,
                "width": 800,
                "height": 600
            },
            {
                "left": 800,
                "top": 600,
                "width": 800,
                "height": 600
            }
        ],
        "modules": [
            {
                "id": 4,
                "geometry": {
                    "left": 0,
                    "top": 0,
                    "width": 1600,
                    "height": 1200
                }
            }]
    }]


};
/**
 * Fake CmsApiService Service
 */ 

class MockCmsApiService {

    getUserProfileSettings(): Promise<any> {
        return Promise.resolve(MockCmsSettingsService.mUserSettings);
    }

    getSystemInfo(): Observable<any> {
        return Observable.of(serverInfo);
    }

    getSelectedDisplayContent(aDisplayId: number) {
        return Observable.of(displayData);
    }

    updateUserProfileSettings(data): Promise<IUserProfileSettings> {
        return Promise.resolve(MockCmsSettingsService.mUserSettings);
    }

    getDisplayList(start: number = 1, count: number = 2147483647, search: string = "", favorite: boolean = false) {
        return Observable.of(mockDisplaysData.displays);
    }
}

describe("Component CmsSettingsPanelComponent", () => {
    let component: CmsSettingsPanelComponent;
    let fixture: ComponentFixture<CmsSettingsPanelComponent>;
    let cmsSettingsPanelComponent;
    let cmsSettingsService: CmsSettingsService;
    let cmsApiService: CmsApiService;
    let router: Router;
    let translate: TranslateService;
    let appConfig: AppConfig;
    let storageManager;
    let i18n: any;
    let debugInstance, nativeElement;
    let sourceAvail: String;
    let spyGetDisplayList;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CmsSettingsPanelComponent, CmsColorPickerComponent],
            providers: [
                CmsSettingsService,
                {
                    provide: Router,
                    useValue: router,
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
                CMS_SESSION_STORAGE_ITEM
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
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(CmsSettingsPanelComponent);
            component = fixture.componentInstance;
            nativeElement = fixture.nativeElement;
            debugInstance = fixture.debugElement.componentInstance;

            cmsSettingsPanelComponent = new CmsSettingsPanelComponent(cmsApiService, router, cmsSettingsService, translate, appConfig)

            cmsSettingsService = fixture.debugElement.injector.get(CmsSettingsService);
            cmsApiService = fixture.debugElement.injector.get(CmsApiService);
        });
    }));

    beforeEach(inject([StorageManager], (response) => {
        storageManager = response;
    }));


    /** COMPONENT DEFINED */
    it("should be a defined component: ", (done) => {
        expect(component).toBeDefined();
        done();
    });

    /** CHECK PRIVATE VARIABLES */
    it("should check private variables: ", async(() => {
        expect(debugInstance.mLoading).toBe(true);
        expect(debugInstance.fontSizeDefault).toEqual(16);
        expect(debugInstance.fontSizeSteps.length).toEqual(22);
        expect(debugInstance.fontSizeSteps).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72]);
        expect(debugInstance.pageSizeDefault).toEqual(20);
        expect(debugInstance.pageSizes.length).toEqual(4);
        expect(debugInstance.pageSizes).toEqual([20, 30, 40, 50]);
        expect(debugInstance.transparencyDefault).toEqual(50);
        expect(debugInstance.transparencySteps.length).toEqual(11);
        expect(debugInstance.transparencySteps).toEqual([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
        expect(debugInstance.logOffTimeDefault).toEqual(0);
        expect(debugInstance.logOffTimeSteps.length).toEqual(7);
        expect(debugInstance.logOffTimeSteps).toEqual([0, 10, 20, 30, 40, 50, 60]);
        expect(debugInstance.fontColorDefault).toEqual("#000");
        expect(debugInstance.backgroundDefault).toEqual("#bdbdbd");
        expect(debugInstance.noDisplayAvailable).toBe(false);

    }));

    /** LOADING PROGRESS TRUE */
    it("should check loading-progress-indicator visible when mLoading is true ", (done) => {
        expect(debugInstance.mLoading).toBe(true);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            let loadingContent = fixture.nativeElement.querySelector("#loading-progress-indicator");
            expect(loadingContent).not.toBeNull();
            done();
        });
    });

    /** SET USER PROFILE SETTINGS AND LOAD USER PROFILE SETTINGS on ngOnInit*/
    it("should check setUserProfileSettings and loadUserProfileSettings and set default values ", () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(cmsSettingsService.mUserSettings).toBeTruthy();
            cmsSettingsService.setUserProfileSettings((done) => {
                debugInstance.loadUserProfileSettings();
                done();
            });
        });
    });

    /** CHECK LOADING PROGRESS DONE */
    it("should check loading-progress-indicator null when mloading is false ", (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.mLoading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let loadingContent = fixture.nativeElement.querySelector("#loading-progress-indicator");
                expect(loadingContent).toBeNull();
                done();
            })
        })
    });

    /** CHECK SETTING CONTENT WRAPPER VISIBLE AFTER LOADING DONE */
    it("should check settings-content-wrapper visible and mLoading false : ", () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.mLoading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let settingsContentWrapper = fixture.nativeElement.querySelector(".settings-content-wrapper");
                expect(settingsContentWrapper).not.toBeNull();
            })
        })
    });

    /** LANGUAGE SECTION */
    it("should check setting panel language button disabled ", () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.localizationLicense).toBe(0);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let settingPanelLanguageLink = fixture.nativeElement.querySelector("#setting-panel-language-link");
                expect(settingPanelLanguageLink).toBeTruthy();
                expect(settingPanelLanguageLink.disabled).toBe(true);
            })
        })
    });

    /** AUTO LOG OFF SECTION */
    /** AUTO LOG OFF INCREASE TIME */
    it("should increase time on logoffTime-increase-button click and update value to setting-square-input input ", (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.mLoading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let logoffTimeIncreaseButton = fixture.nativeElement.querySelector("#logoffTime-increase-button");
                expect(logoffTimeIncreaseButton).not.toBeNull();
                debugInstance.increaseLogOffTime();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    let settingSquareInputElement = fixture.nativeElement.querySelector(".setting-square-input input").value;
                    expect(Number(settingSquareInputElement)).toEqual(debugInstance.logOffTimeSteps[1]);
                });
            })
        })
        done();
    });

    /** AUTO LOG OFF DECREASE TIME */
    it("should decrease time on logoffTime-decrease-button click and update value to setting-square-input input ", (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.mLoading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let logoffTimeDecreaseButton = fixture.nativeElement.querySelector("#logoffTime-decrease-button");
                expect(logoffTimeDecreaseButton).not.toBeNull();
                debugInstance.decreaseLogOffTime();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    let settingSquareInputElement = fixture.nativeElement.querySelector(".setting-square-input input").value;
                    expect(settingSquareInputElement).toEqual("settings.never");
                });
            })
        })
        done();
    });

    /** WALL CONNECTION SECTION*/
    it("should update updateUserSettingsByAction on radio auto-connect-to-most-recent-wall-radio-button change event ", (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.mLoading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let wallconnectionRadiogroup = fixture.nativeElement.querySelector("#wallconnection-radiogroup");
                expect(wallconnectionRadiogroup).not.toBeNull();
                let autoConnectToMostRecentWallRadioButton = fixture.nativeElement.querySelector("#auto-connect-to-most-recent-wall-radio-button");
                expect(autoConnectToMostRecentWallRadioButton).not.toBeNull();
                autoConnectToMostRecentWallRadioButton.dispatchEvent(new Event("change"));
                let e = { source: "MdRadioButton", value: "auto-connect-to-most-recent-wall" };
                MockCmsSettingsService.mUserSettings.wallConnection.startUpAction = "auto-connect-to-most-recent-wall";
                debugInstance.updateUserSettingsByAction(e);
            })
        })
        done();
    });

    /** FONT SIZE SECTION */
    /** DECREASE FONT SIZE */
    it("should decrease font size on font-decrease-button click and update value to font-size-input", (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.mLoading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let fontDecreaseButton = fixture.nativeElement.querySelector("#font-decrease-button");
                expect(fontDecreaseButton).not.toBeNull();
                fontDecreaseButton.dispatchEvent(new Event("mousedown"));
                debugInstance.decreaseFontSize();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    let fontSizeInput = fixture.nativeElement.querySelector("#font-size-input");
                    expect(fontSizeInput).not.toBeNull();
                    expect(Number(fontSizeInput.value)).toEqual(debugInstance.fontSizeSteps[10]);
                })
            })
        })
        done();
    });

    /** INCREASE FONT SIZE  */
    it("should increase font size on font-increase-button click and update value to font-size-input ", (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.mLoading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let fontIncreaseButton = fixture.nativeElement.querySelector("#font-increase-button");
                expect(fontIncreaseButton).not.toBeNull();
                fontIncreaseButton.dispatchEvent(new Event("mousedown"));
                debugInstance.increaseFontSize();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    let fontSizeInput = fixture.nativeElement.querySelector("#font-size-input");
                    expect(fontSizeInput).not.toBeNull();
                    expect(Number(fontSizeInput.value)).toEqual(debugInstance.fontSizeSteps[11]);

                })
            })
        })
        done();
    });

    /** DECREASE TRANSPARENCY */
    it("should decrease Transparency on transparency-decrease-button click and update value to transparency-input", (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.mLoading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let transparencyDecreaseButton = fixture.nativeElement.querySelector("#transparency-decrease-button");
                expect(transparencyDecreaseButton).not.toBeNull();
                transparencyDecreaseButton.dispatchEvent(new Event("mousedown"));
                debugInstance.decreaseTransparency();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    let transparencyInput = fixture.nativeElement.querySelector("#transparency-input");
                    expect(transparencyInput).not.toBeNull();
                    expect(Number(transparencyInput.value)).toEqual(debugInstance.transparencySteps[4]);

                })
            })
        })
        done();
    });

    /** INCREASE TRANSPARENCY */
    it("should increase Transparency on transparency-increase-button click and update value to transparency-input ", (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.mLoading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let transparencyIncreaseButton = fixture.nativeElement.querySelector("#transparency-increase-button");
                expect(transparencyIncreaseButton).not.toBeNull();
                transparencyIncreaseButton.dispatchEvent(new Event("mousedown"));
                debugInstance.increaseTransparency();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    let transparencyInput = fixture.nativeElement.querySelector("#transparency-input");
                    expect(transparencyInput).not.toBeNull();
                    expect(Number(transparencyInput.value)).toEqual(debugInstance.transparencySteps[5]);
                })
            })
        })
        done();
    });

});