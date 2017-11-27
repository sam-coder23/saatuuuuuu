import { ComponentFixture, TestBed, async, inject } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ElementRef } from "@angular/core";
import { HttpModule, Http } from "@angular/http";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { IUserProfileSettings } from "../../../../app/cms/models/cms-user-profile-settings";
import { CmsSettingsPanelComponent } from "../../../../app/launchpad/settings/cms-settings-panel.component";
import { CmsSettingsService } from "../../../../app/launchpad/settings/cms-settings.service";
import { CmsApiService } from "../../../../app/cms/api/cms-api.service";
import { AppConfig } from "../../../../app/config";
import { CmsColorPickerComponent } from "../../../../app/shared/colorpicker/cms-colorpicker.component";
import { StorageManager } from "../../../../app/cms/api/cms-storagemanager.service";
import { APIRequest } from "../../../../app/cms/api/api-request";
import { CMS_SESSION_STORAGE_ITEM } from "../../../../app/cms/models/cms-session-storage-item";
import { CMSConstants } from "../../../../app/cms/models/cms-constants";

let spyRouter = {
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
        return Promise.resolve(mockCmsSettingsData.userSettings);
    }

    getSystemInfo(): Observable<any> {
        return Observable.of(serverInfo);
    }

    getSelectedDisplayContent(aDisplayId: number) {
        return Observable.of(displayData);
    }

    updateUserProfileSettings(data): Promise<IUserProfileSettings> {
        return Promise.resolve(mockCmsSettingsData.userSettings);
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
                    useValue: spyRouter,
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
                        useFactory: (http: Http) => new TranslateHttpLoader(http, "base/app/i18n/", ".json"),
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
            cmsSettingsPanelComponent = new CmsSettingsPanelComponent(cmsApiService, router, cmsSettingsService, translate, appConfig);
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
        expect(debugInstance.loading).toBe(true);
        expect(debugInstance.fontSizeDefault).toEqual(CMSConstants.DEFAULT_FONT_SIZE);
        expect(debugInstance.fontSizeSteps.length).toEqual(22);
        expect(debugInstance.fontSizeSteps).toEqual(CMSConstants.FONT_SIZES);
        expect(debugInstance.pageSizeDefault).toEqual(CMSConstants.DEFAULT_PAGE_SIZE);
        expect(debugInstance.pageSizes.length).toEqual(4);
        expect(debugInstance.pageSizes).toEqual(CMSConstants.PAGE_SIZES);
        expect(debugInstance.transparencyDefault).toEqual(CMSConstants.DEFAULT_TRANSPARENCY);
        expect(debugInstance.transparencySteps.length).toEqual(11);
        expect(debugInstance.transparencySteps).toEqual(CMSConstants.TRANSPARENCY_STEPS);
        expect(debugInstance.logOffTimeDefault).toEqual(CMSConstants.DEFAULT_LOGOFF_TIME);
        expect(debugInstance.logOffTimeSteps.length).toEqual(7);
        expect(debugInstance.logOffTimeSteps).toEqual(CMSConstants.LOGOFF_TIME_STEPS);
        expect(debugInstance.fontColorDefault).toEqual(CMSConstants.DEFAULT_FONT_COLOR);
        expect(debugInstance.backgroundDefault).toEqual(CMSConstants.DEFAULT_BACKGROUND_COLOR);
        expect(debugInstance.noDisplayAvailable).toBe(false);

    }));

    /** LOADING PROGRESS TRUE */
    it("should check loading-progress-indicator visible when loading is true ", (done) => {
        expect(debugInstance.loading).toBe(true);
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
            expect(cmsSettingsService.userSettings).toBeTruthy();
            cmsSettingsService.setUserProfileSettings((done) => {
                debugInstance.loadUserProfileSettings();
                done();
            });
        });
    });

    /** CHECK LOADING PROGRESS DONE */
    it("should check loading-progress-indicator null when loading is false ", (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.loading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let loadingContent = fixture.nativeElement.querySelector("#loading-progress-indicator");
                expect(loadingContent).toBeNull();
                done();
            });
        });
    });

    /** CHECK SETTING CONTENT WRAPPER VISIBLE AFTER LOADING DONE */
    it("should check settings-content-wrapper visible and loading false : ", () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.loading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let settingsContentWrapper = fixture.nativeElement.querySelector(".settings-content-wrapper");
                expect(settingsContentWrapper).not.toBeNull();
            });
        });
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
            });
        });
    });

    /** AUTO LOG OFF SECTION */
    /** AUTO LOG OFF INCREASE TIME */
    it("should increase time on logoffTime-increase-button click and update value to setting-square-input input ", (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.loading).toBe(false);
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
            });
        });
        done();
    });

    /** AUTO LOG OFF DECREASE TIME */
    it("should decrease time on logoffTime-decrease-button click and update value to setting-square-input input ", (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.loading).toBe(false);
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
            });
        });
        done();
    });

    /** WALL CONNECTION SECTION*/
    /** AUTO CONNECT TO MOST RECENT WALL */
    it("should update updateUserSettingsByAction on radio auto-connect-to-most-recent-wall-radio-button change event ", (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.loading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let wallconnectionRadiogroup = fixture.nativeElement.querySelector("#wallconnection-radiogroup");
                expect(wallconnectionRadiogroup).not.toBeNull();
                let autoConnectToMostRecentWallRadioButton = fixture.nativeElement.querySelector("#auto-connect-to-most-recent-wall-radio-button");
                expect(autoConnectToMostRecentWallRadioButton).not.toBeNull();
                autoConnectToMostRecentWallRadioButton.dispatchEvent(new Event("change"));
                let $event = { source: "MdRadioButton", value: "auto-connect-to-most-recent-wall" };
                mockCmsSettingsData.userSettings.wallConnection.startUpAction = "auto-connect-to-most-recent-wall";
                debugInstance.updateUserSettingsByAction($event);
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    let wallConnectionStatus = JSON.parse(storageManager.get(CMS_SESSION_STORAGE_ITEM.SETTINGS)).wallConnection.startUpAction;
                    expect(wallConnectionStatus).toEqual($event.value);
                });
            });
        });
        done();
    });

    /** AUTO CONNECT TO SPECIFIC WALL */
    it("should update updateUserSettingsByAction on radio auto-connect-to-specific-wall-select-button change event ", (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.loading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let autoConnectToSpecificWallSelectButton = fixture.nativeElement.querySelector("#auto-connect-to-specific-wall-select-button");
                expect(autoConnectToSpecificWallSelectButton).toBeTruthy();
                expect(autoConnectToSpecificWallSelectButton.hasAttribute("disabled")).toBe(true);
                let autoConnectToSpecificWallRadioButton = fixture.nativeElement.querySelector("#auto-connect-to-specific-wall-radio-button");
                expect(autoConnectToSpecificWallRadioButton).toBeTruthy();
                autoConnectToSpecificWallRadioButton.dispatchEvent(new Event("change"));
                let $event = { source: "MdRadioButton", value: "auto-connect-to-specific-wall" };
                mockCmsSettingsData.userSettings.wallConnection.startUpAction = "auto-connect-to-specific-wall";
                debugInstance.updateUserSettingsByAction($event);
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    let wallConnectionStatus = JSON.parse(storageManager.get(CMS_SESSION_STORAGE_ITEM.SETTINGS)).wallConnection.startUpAction;
                    expect(wallConnectionStatus).toEqual($event.value);
                    expect(autoConnectToSpecificWallSelectButton.hasAttribute("disabled")).toBe(false);
                    debugInstance.goToSelectDisplayForAutoConnect($event);
                    expect(spyRouter.navigate).toHaveBeenCalledWith(["/displays-panel", { action: CMSConstants.SELECT_DISPLAY }], { skipLocationChange: true });
                });
            });
        });
        done();
    });

    /** FONT SIZE SECTION */
    /** DECREASE FONT SIZE */
    it("should decrease font size on font-decrease-button click and update value to font-size-input", (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.loading).toBe(false);
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
                });
            });
        });
        done();
    });

    /** INCREASE FONT SIZE  */
    it("should increase font size on font-increase-button click and update value to font-size-input ", (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.loading).toBe(false);
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

                });
            });
        });
        done();
    });

    /** DECREASE TRANSPARENCY */
    it("should decrease Transparency on transparency-decrease-button click and update value to transparency-input", (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.loading).toBe(false);
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
                });
            });
        });
        done();
    });

    /** INCREASE TRANSPARENCY */
    it("should increase Transparency on transparency-increase-button click and update value to transparency-input ", (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.loading).toBe(false);
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
                });
            });
        });
        done();
    });

    /** DISPLAY DEFAULT PAGE */
    it("should display defalut page and update selected page ", (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.loading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    let defaultPageSize = fixture.nativeElement.querySelector("md-select[name=" + "pageSize" + "]");
                    fixture.detectChanges();
                    fixture.whenStable().then(() => {
                        expect(Number(defaultPageSize.getAttribute("ng-reflect-ng-model"))).toEqual(mockCmsSettingsData.userSettings.pageSize);
                        let $event = { source: "MdRadioButton", value: "auto-connect-to-most-recent-wall" };
                        mockCmsSettingsData.userSettings.pageSize = debugInstance.pageSizes[1];
                        debugInstance.updateUserSettingsByAction($event);
                        fixture.detectChanges();
                        fixture.whenStable().then(() => {
                            expect(Number(defaultPageSize.getAttribute("ng-reflect-ng-model"))).toEqual(mockCmsSettingsData.userSettings.pageSize);
                        });
                    });
                });
            });
        });
        done();
    });
    /** SOURCE LABELS */
    /** CHECK TOGGLE OF DISPLAY SOURCE NAME SLIDER BUTTON */
    it("should updateStteingByAction on toggle of display-sourcename-labels-slider-button ", (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.loading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    let displaySourcenameLabelsSliderButton = fixture.nativeElement.querySelector("#display-sourcename-labels-slider-button");
                    expect(displaySourcenameLabelsSliderButton).toBeTruthy();
                    let $event = { source: "MdSlideToggle", checked: false };
                    mockCmsSettingsData.userSettings.sourceLabel.displaySourceNameLabels = false;
                    debugInstance.updateUserSettingsByAction($event);
                    fixture.detectChanges();
                    fixture.whenStable().then(() => {
                        let displaySourceNameLabels = JSON.parse(storageManager.get(CMS_SESSION_STORAGE_ITEM.SETTINGS)).sourceLabel.displaySourceNameLabels;
                        expect(displaySourceNameLabels).toEqual($event.checked);
                    });
                });
            });
        });
        done();
    });

    /** CHECK TOGGLE OF MULTIPLE LINES SOURCE NAME SLIDER BUTTON */
    it("should updateStteingByAction on toggle of use-multiplelines-sourcename-labels-slider-button ", (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.loading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    let useMultiplelinesSourcenameLabelsSliderButton = fixture.nativeElement.querySelector("#use-multiplelines-sourcename-labels-slider-button");
                    expect(useMultiplelinesSourcenameLabelsSliderButton).toBeTruthy();
                    let $event = { source: "MdSlideToggle", checked: true };
                    mockCmsSettingsData.userSettings.sourceLabel.useMultipleLines = true;
                    debugInstance.updateUserSettingsByAction($event);
                    fixture.detectChanges();
                    fixture.whenStable().then(() => {
                        let useMultipleLines = JSON.parse(storageManager.get(CMS_SESSION_STORAGE_ITEM.SETTINGS)).sourceLabel.useMultipleLines;
                        expect(useMultipleLines).toEqual($event.checked);
                    });
                });
            });
        });
        done();
    });
    /** COLOR PICKER */
    /** FONT COLOR UPDATE */
    it("should update selected font color ", (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.loading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    let ndColorpickerFont = fixture.nativeElement.querySelector("nd-colorpicker[name=" + "font-color" + "]");
                    expect(ndColorpickerFont).not.toBeNull();
                    fixture.detectChanges();
                    fixture.whenStable().then(() => {
                        let $event = { value: "#B71C1C" };
                        debugInstance.updateFontColor($event);
                        fixture.detectChanges();
                        fixture.whenStable().then(() => {
                            let fontColor = JSON.parse(storageManager.get(CMS_SESSION_STORAGE_ITEM.SETTINGS)).sourceLabel.fontColor;
                            expect(fontColor).toEqual($event.value);
                        });
                    });
                });
            });
        });
        done();
    });

    /** BACKGROUND COLOR UPDATE */
    it("should update selected background color ", (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.loading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    let ndColorpickerBG = fixture.nativeElement.querySelector("nd-colorpicker[name=" + "background-color" + "]");
                    expect(ndColorpickerBG).not.toBeNull();
                    fixture.detectChanges();
                    fixture.whenStable().then(() => {
                        let $event = { value: "#9C27B0" };
                        debugInstance.updateBackgroundColor($event);
                        fixture.detectChanges();
                        fixture.whenStable().then(() => {
                            let BGColor = JSON.parse(storageManager.get(CMS_SESSION_STORAGE_ITEM.SETTINGS)).sourceLabel.backgroundColor;
                            expect(BGColor).toEqual($event.value);
                        });
                    });
                });
            });
        });
        done();
    });
});