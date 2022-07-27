/**
 * This class is responsible to handle unit test case of CmsSettingsPanelComponent
 */
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef, NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, inject, TestBed } from "@angular/core/testing";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Router } from "@angular/router";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Observable } from "rxjs/Observable";

import { APIRequest } from "../../../../app/cms/api/api-request";
import { CmsApiService } from "../../../../app/cms/api/cms-api.service";
import { StorageManager } from "../../../../app/cms/api/cms-storagemanager.service";
import { CMSConstants } from "../../../../app/cms/models/cms-constants";
import { CmsSessionStorageItem } from "../../../../app/cms/models/cms-session-storage-item";
import { IUserProfileSettings } from "../../../../app/cms/models/cms-user-profile-settings";
import { AppConfig } from "../../../../app/config";
import { CmsSettingsPanelComponent } from "../../../../app/launchpad/settings/cms-settings-panel.component";
import { CmsSettingsService } from "../../../../app/launchpad/settings/cms-settings.service";
import { ParsingManager } from "./../../../../app/utils/parsing-manager-util";

let spyRouter: any;

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

const serverInfo : any = {
    ServerInfo:
    {
        ip: "10.98.0.231",
        version: "70.34 Build 0243"
    },
    LicenseInfo: {
        customerName: "Barco",
        projectName: "CMS Demo",
        licenseStatus: "DemoLicense",
        daysRemaining: 1171,
        localization: 0
    }
};

const displayData : any = {
    favorite: true,
    id: 1,
    name: "Crisis room wall",
    description: "",
    snapshotPath: "display_snapshot.jpg",
    type: "DisplayWall",
    online: false,
    resolution: {
        width: 1600,
        height: 1200
    },
    tiles: [
        {
            left: 0,
            top: 0,
            width: 1600,
            height: 1200
        }
    ],
    content: [
        {
            id: 9,
            name: "Auto_edited_src11",
            type: "Perspective",
            resourceId: 17,
            x: 0,
            y: 0,
            width: 1600,
            height: 1200,
            snapshotPath: "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F17.jpeg",
            zOrder: 1
        }
    ]

};

const mockDisplaysData : any = {
    displays: [{
        id: 2,
        name: "Crisis room wall",
        type: "DisplayWall",
        description: "",
        snapshotPath: "display_snapshot.jpg",
        resolution: {
            width: 1600,
            height: 1200
        },
        online: false,
        acknowledged: true,
        computerName: "NOICLT28523",
        tags: "",
        startUpAction: "RestoreLastKnownConfiguration",
        favorite: true,
        loggedInUserName: "",
        autoloadLayout: 0,
        windowOption: "NoTitleBarAndNoResizableBorder",
        vdsDisplay: false,
        defaultAreaEnabled: false,
        defaultArea: { left: 0, top: 0, width: 0, height: 0 },
        isDecoderDisplay: false,
        sourceRoutingRequired: false,
        tilerId: 26,
        tiles: [
            {
                left: 0,
                top: 0,
                width: 800,
                height: 600
            },
            {
                left: 800,
                top: 0,
                width: 800,
                height: 600
            },
            {
                left: 0,
                top: 600,
                width: 800,
                height: 600
            },
            {
                left: 800,
                top: 600,
                width: 800,
                height: 600
            }
        ],
        modules: [
            {
                id: 4,
                geometry: {
                    left: 0,
                    top: 0,
                    width: 1600,
                    height: 1200
                }
            }]
    }]
};
/**
 * Fake CmsApiService Service
 */

class MockCmsApiService {
    public getUserProfileSettings(): Promise<any> {
        return Promise.resolve(mockCmsSettingsData.userSettings);
    }

    public getSystemInfo(): Observable<any> {
        return Observable.of(serverInfo);
    }

    public getSelectedDisplayContent(aDisplayId: number): Observable<any> {
        return Observable.of(displayData);
    }

    public updateUserProfileSettings(data: IUserProfileSettings): Promise<IUserProfileSettings> {
        return Promise.resolve(mockCmsSettingsData.userSettings);
    }

    public getDisplayList(start: number = 1, count: number = 2147483647, search: string = "", favorite: boolean = false) : Observable<any> {
        return Observable.of(mockDisplaysData.displays);
    }
}

describe("Component CmsSettingsPanelComponent", () => {
    let component: CmsSettingsPanelComponent;
    let fixture: ComponentFixture<CmsSettingsPanelComponent>;
    let cmsSettingsPanelComponent: any;
    let cmsSettingsService: CmsSettingsService;
    let cmsApiService: CmsApiService;
    // tslint:disable-next-line:prefer-const
    let router: Router;
    // tslint:disable-next-line:prefer-const
    let translate: TranslateService;
    // tslint:disable-next-line:prefer-const
    let appConfig: AppConfig;
    let storageManager: any;
    let debugInstance: any;
    let nativeElement: any;

    beforeEach(async(() => {
        spyRouter = {
            navigate: jasmine.createSpy("settings")
        };
        TestBed.configureTestingModule({
            declarations: [CmsSettingsPanelComponent],
            providers: [
                CmsSettingsService,
                {
                    provide: Router,
                    useValue: spyRouter
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
                HttpClientModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: (http: HttpClient): TranslateHttpLoader => new TranslateHttpLoader(http, "/base/app/i18n/", ".json"),
                        deps: [HttpClient]
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

    beforeEach(inject([StorageManager], (response : any) => {
        storageManager = response;
    }));

    it("should be a defined component: ", () => {
        expect(component).toBeDefined();
    });

    it("should check private variables: ", () => {
        expect(debugInstance.loading).toBe(true);
        expect(debugInstance.fontSizeDefault).toEqual(CMSConstants.DEFAULT_FONT_SIZE);
        const fontSizeStepsLength: number = 22;
        expect(debugInstance.fontSizeSteps.length).toEqual(fontSizeStepsLength);
        expect(debugInstance.fontSizeSteps).toEqual(CMSConstants.FONT_SIZES);
        expect(debugInstance.pageSizeDefault).toEqual(CMSConstants.DEFAULT_PAGE_SIZE);
        const pageSizesLength: number = 4;
        expect(debugInstance.pageSizes.length).toEqual(pageSizesLength);
        expect(debugInstance.pageSizes).toEqual(CMSConstants.PAGE_SIZES);
        expect(debugInstance.transparencyDefault).toEqual(CMSConstants.DEFAULT_TRANSPARENCY);
        const transparencyStepsLength: number = 11;
        expect(debugInstance.transparencySteps.length).toEqual(transparencyStepsLength);
        expect(debugInstance.transparencySteps).toEqual(CMSConstants.TRANSPARENCY_STEPS);
        expect(debugInstance.logOffTimeDefault).toEqual(CMSConstants.DEFAULT_LOGOFF_TIME);
        const logOffTimeStepsLength: number = 7;
        expect(debugInstance.logOffTimeSteps.length).toEqual(logOffTimeStepsLength);
        expect(debugInstance.logOffTimeSteps).toEqual(CMSConstants.LOGOFF_TIME_STEPS);
        expect(debugInstance.fontColorDefault).toEqual(CMSConstants.DEFAULT_FONT_COLOR);
        expect(debugInstance.backgroundDefault).toEqual(CMSConstants.DEFAULT_BACKGROUND_COLOR);
        expect(debugInstance.noDisplayAvailable).toBe(false);

    });

    /**
     *  LOADING PROGRESS TRUE
     */
    it("should check loading-progress-indicator visible when loading is true ", () => {
        expect(debugInstance.loading).toBe(true);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const loadingContent : any = fixture.nativeElement.querySelector("#loading-progress-indicator");
            expect(loadingContent).not.toBeNull();
        });
    });

    /**
     * SET USER PROFILE SETTINGS AND LOAD USER PROFILE SETTINGS on ngOnInit
     */
    it("should check setUserProfileSettings and loadUserProfileSettings and set default values ", () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(cmsSettingsService.userSettings).toBeTruthy();
            cmsSettingsService.setUserProfileSettings(() => {
                debugInstance.loadUserProfileSettings();
            });
        });
    });

    /**
     * CHECK LOADING PROGRESS DONE
     */
    it("should check loading-progress-indicator null when loading is false ", () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.loading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const loadingContent : any = fixture.nativeElement.querySelector("#loading-progress-indicator");
                expect(loadingContent).toBeNull();
            });
        });
    });

    /**
     * CHECK SETTING CONTENT WRAPPER VISIBLE AFTER LOADING DONE
     */
    it("should check settings-content-wrapper visible and loading false : ", () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.loading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const settingsContentWrapper : any = fixture.nativeElement.querySelector(".settings-content-wrapper");
                expect(settingsContentWrapper).not.toBeNull();
            });
        });
    });

    /**
     * LANGUAGE SECTION
     */
    it("should check setting panel language button disabled ", () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.localizationLicense).toBe(0);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const settingPanelLanguageLink : any = fixture.nativeElement.querySelector("#setting-panel-language-link");
                expect(settingPanelLanguageLink).toBeTruthy();
                expect(settingPanelLanguageLink.disabled).toBe(true);
            });
        });
    });

    /**
     * AUTO LOG OFF SECTION
     * AUTO LOG OFF INCREASE TIME
     */
    it("should increase time on logoffTime-increase-button click and update value to setting-square-input input ", () : void => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.loading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const logoffTimeIncreaseButton : any = fixture.nativeElement.querySelector("#logoffTime-increase-button");
                expect(logoffTimeIncreaseButton).not.toBeNull();
                debugInstance.increaseLogOffTime();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    const settingSquareInputElement : any = fixture.nativeElement.querySelector(".setting-square-input input").value;
                    expect(ParsingManager.TO_INTEGER(settingSquareInputElement)).toEqual(debugInstance.logOffTimeSteps[1]);
                });
            });
        });
    });

    /**
     * AUTO LOG OFF DECREASE TIME
     */
    it("should decrease time on logoffTime-decrease-button click and update value to setting-square-input input ", () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.loading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const logoffTimeDecreaseButton : any = fixture.nativeElement.querySelector("#logoffTime-decrease-button");
                expect(logoffTimeDecreaseButton).not.toBeNull();
                debugInstance.decreaseLogOffTime();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    const settingSquareInputElement : any = fixture.nativeElement.querySelector(".setting-square-input input").value;
                    expect(settingSquareInputElement).toEqual("settings.never");
                });
            });
        });
    });

    /**
     * WALL CONNECTION SECTION
     * AUTO CONNECT TO MOST RECENT WALL
     */
    it("should update updateUserSettingsByAction on radio auto-connect-to-most-recent-wall-radio-button change event ", () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.loading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const wallconnectionRadiogroup : any = fixture.nativeElement.querySelector("#wallconnection-radiogroup");
                expect(wallconnectionRadiogroup).not.toBeNull();
                const autoConnectToMostRecentWallRadioButton : any = fixture.nativeElement.querySelector("#auto-connect-to-most-recent-wall-radio-button");
                expect(autoConnectToMostRecentWallRadioButton).not.toBeNull();
                autoConnectToMostRecentWallRadioButton.dispatchEvent(new Event("change"));
                const $event : any = { source: "MdRadioButton", value: "auto-connect-to-most-recent-wall" };
                mockCmsSettingsData.userSettings.wallConnection.startUpAction = "auto-connect-to-most-recent-wall";
                debugInstance.updateUserSettingsByAction($event);
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    const wallConnectionStatus : any = JSON.parse(storageManager.getItem(CmsSessionStorageItem.SETTINGS)).wallConnection.startUpAction;
                    expect(wallConnectionStatus).toEqual($event.value);
                });
            });
        });
    });

    /**
     *  AUTO CONNECT TO SPECIFIC WALL
     */
    it("should update updateUserSettingsByAction on radio auto-connect-to-specific-wall-select-button change event ", () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.loading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const autoConnectToSpecificWallSelectButton : any = fixture.nativeElement.querySelector("#auto-connect-to-specific-wall-select-button");
                expect(autoConnectToSpecificWallSelectButton).toBeTruthy();
                expect(autoConnectToSpecificWallSelectButton.hasAttribute("disabled")).toBe(true);
                const autoConnectToSpecificWallRadioButton : any = fixture.nativeElement.querySelector("#auto-connect-to-specific-wall-radio-button");
                expect(autoConnectToSpecificWallRadioButton).toBeTruthy();
                autoConnectToSpecificWallRadioButton.dispatchEvent(new Event("change"));
                const $event : any = { source: "MdRadioButton", value: "auto-connect-to-specific-wall" };
                mockCmsSettingsData.userSettings.wallConnection.startUpAction = "auto-connect-to-specific-wall";
                debugInstance.updateUserSettingsByAction($event);
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    const wallConnectionStatus : any = JSON.parse(storageManager.getItem(CmsSessionStorageItem.SETTINGS)).wallConnection.startUpAction;
                    expect(wallConnectionStatus).toEqual($event.value);
                    expect(autoConnectToSpecificWallSelectButton.hasAttribute("disabled")).toBe(false);
                    debugInstance.goToSelectDisplayForAutoConnect($event);
                    expect(spyRouter.navigate).toHaveBeenCalledWith(["/displays-panel", { action: CMSConstants.SELECT_DISPLAY }]);
                });
            });
        });
    });

    /**
     * FONT SIZE SECTION
     * DECREASE FONT SIZE
     */
    it("should decrease font size on font-decrease-button click and update value to font-size-input", () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.loading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const fontDecreaseButton : any = fixture.nativeElement.querySelector("#font-decrease-button");
                expect(fontDecreaseButton).not.toBeNull();
                fontDecreaseButton.dispatchEvent(new Event("mousedown"));
                debugInstance.decreaseFontSize();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    const fontSizeInput : any = fixture.nativeElement.querySelector("#font-size-input");
                    expect(fontSizeInput).not.toBeNull();
                    const value: number = 10;
                    expect(ParsingManager.TO_INTEGER(fontSizeInput.value)).toEqual(debugInstance.fontSizeSteps[value]);
                });
            });
        });
    });

    /**
     * INCREASE FONT SIZE
     */
    it("should increase font size on font-increase-button click and update value to font-size-input ", () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.loading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const fontIncreaseButton : any = fixture.nativeElement.querySelector("#font-increase-button");
                expect(fontIncreaseButton).not.toBeNull();
                fontIncreaseButton.dispatchEvent(new Event("mousedown"));
                debugInstance.increaseFontSize();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    const fontSizeInput: any = fixture.nativeElement.querySelector("#font-size-input");
                    expect(fontSizeInput).not.toBeNull();
                    const value: number = 11;
                    expect(ParsingManager.TO_INTEGER(fontSizeInput.value)).toEqual(debugInstance.fontSizeSteps[value]);

                });
            });
        });
    });

    /**
     * DECREASE TRANSPARENCY
     */
    it("should decrease Transparency on transparency-decrease-button click and update value to transparency-input", () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.loading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const transparencyDecreaseButton: any = fixture.nativeElement.querySelector("#transparency-decrease-button");
                expect(transparencyDecreaseButton).not.toBeNull();
                transparencyDecreaseButton.dispatchEvent(new Event("mousedown"));
                debugInstance.decreaseTransparency();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    const transparencyInput: any = fixture.nativeElement.querySelector("#transparency-input");
                    expect(transparencyInput).not.toBeNull();
                    const value: number = 4;
                    expect(ParsingManager.TO_INTEGER(transparencyInput.value)).toEqual(debugInstance.transparencySteps[value]);
                });
            });
        });
    });

    /**
     * INCREASE TRANSPARENCY
     */
    it("should increase Transparency on transparency-increase-button click and update value to transparency-input ", () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.loading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const transparencyIncreaseButton: any = fixture.nativeElement.querySelector("#transparency-increase-button");
                expect(transparencyIncreaseButton).not.toBeNull();
                transparencyIncreaseButton.dispatchEvent(new Event("mousedown"));
                debugInstance.increaseTransparency();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    const transparencyInput: any  = fixture.nativeElement.querySelector("#transparency-input");
                    expect(transparencyInput).not.toBeNull();
                    const value: number = 5;
                    expect(ParsingManager.TO_INTEGER(transparencyInput.value)).toEqual(debugInstance.transparencySteps[value]);
                });
            });
        });
    });

    /**
     *  DISPLAY DEFAULT PAGE
     */
    it("should display defalut page and update selected page ", () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.loading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    const data: string = "md-select[name=";
                    const defaultPageSize : any = fixture.nativeElement.querySelector( data.concat("pageSize").concat("]"));
                    fixture.detectChanges();
                    fixture.whenStable().then(() => {
                        expect(ParsingManager.TO_INTEGER(defaultPageSize.getAttribute("ng-reflect-ng-model"))).toEqual(mockCmsSettingsData.userSettings.pageSize);
                        const $event  : any = { source: "MdRadioButton", value: "auto-connect-to-most-recent-wall" };
                        mockCmsSettingsData.userSettings.pageSize = debugInstance.pageSizes[1];
                        debugInstance.updateUserSettingsByAction($event);
                        fixture.detectChanges();
                        fixture.whenStable().then(() => {
                            expect(ParsingManager.TO_INTEGER(defaultPageSize.getAttribute("ng-reflect-ng-model"))).toEqual(mockCmsSettingsData.userSettings.pageSize);
                        });
                    });
                });
            });
        });
    });
    /**
     * SOURCE LABELS
     * CHECK TOGGLE OF DISPLAY SOURCE NAME SLIDER BUTTON
     */
    it("should updateStteingByAction on toggle of display-sourcename-labels-slider-button ", () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.loading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    const displaySourcenameLabelsSliderButton : any = fixture.nativeElement.querySelector("#display-sourcename-labels-slider-button");
                    expect(displaySourcenameLabelsSliderButton).toBeTruthy();
                    const $event : any = { source: "MdSlideToggle", checked: false };
                    mockCmsSettingsData.userSettings.sourceLabel.displaySourceNameLabels = false;
                    debugInstance.updateUserSettingsByAction($event);
                    fixture.detectChanges();
                    fixture.whenStable().then(() => {
                        const displaySourceNameLabels : any = JSON.parse(storageManager.getItem(CmsSessionStorageItem.SETTINGS)).sourceLabel.displaySourceNameLabels;
                        expect(displaySourceNameLabels).toEqual($event.checked);
                    });
                });
            });
        });
    });

    /**
     * CHECK TOGGLE OF MULTIPLE LINES SOURCE NAME SLIDER BUTTON
     */
    it("should updateStteingByAction on toggle of use-multiplelines-sourcename-labels-slider-button ", () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.loading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    const useMultiplelinesSourcenameLabelsSliderButton : any  = fixture.nativeElement.querySelector("#use-multiplelines-sourcename-labels-slider-button");
                    expect(useMultiplelinesSourcenameLabelsSliderButton).toBeTruthy();
                    const $event : any = { source: "MdSlideToggle", checked: true };
                    mockCmsSettingsData.userSettings.sourceLabel.useMultipleLines = true;
                    debugInstance.updateUserSettingsByAction($event);
                    fixture.detectChanges();
                    fixture.whenStable().then(() => {
                        const useMultipleLines : any = JSON.parse(storageManager.getItem(CmsSessionStorageItem.SETTINGS)).sourceLabel.useMultipleLines;
                        expect(useMultipleLines).toEqual($event.checked);
                    });
                });
            });
        });
    });
    /**
     * COLOR PICKER
     * FONT COLOR UPDATE
     */
    it("should update selected font color ", () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.loading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    const data: string = "nd-colorpicker[name=";
                    const ndColorpickerFont : any = fixture.nativeElement.querySelector(data.concat("font-color").concat("]"));
                    expect(ndColorpickerFont).not.toBeNull();
                    fixture.detectChanges();
                    fixture.whenStable().then(() => {
                        const $event : any = { value: "#B71C1C" };
                        debugInstance.updateFontColor($event);
                        fixture.detectChanges();
                        fixture.whenStable().then(() => {
                            const fontColor : any = JSON.parse(storageManager.getItem(CmsSessionStorageItem.SETTINGS)).sourceLabel.fontColor;
                            expect(fontColor).toEqual($event.value);
                        });
                    });
                });
            });
        });
    });

    /**
     *  BACKGROUND COLOR UPDATE
     */
    it("should update selected background color ", () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.loading).toBe(false);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    const data: string = "nd-colorpicker[name=";
                    const ndColorpickerBG: any = fixture.nativeElement.querySelector(data.concat("background-color").concat("]"));
                    expect(ndColorpickerBG).not.toBeNull();
                    fixture.detectChanges();
                    fixture.whenStable().then(() => {
                        const $event : any = { value: "#9C27B0" };
                        debugInstance.updateBackgroundColor($event);
                        fixture.detectChanges();
                        fixture.whenStable().then(() => {
                            const bgColor : any = JSON.parse(storageManager.getItem(CmsSessionStorageItem.SETTINGS)).sourceLabel.backgroundColor;
                            expect(bgColor).toEqual($event.value);
                        });
                    });
                });
            });
        });
    });
});
