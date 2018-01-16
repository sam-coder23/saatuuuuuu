/**
 * This class is responsible to handle unit test case of CmsLaunchpadComponent
 */
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { Http, HttpModule } from "@angular/http";
import { MaterialModule, MdIconRegistry } from "@angular/material";
import { Router } from "@angular/router";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Observable } from "rxjs/Observable";

import { APIRequest } from "../../../app/cms/api/api-request";
import { CmsApiService } from "../../../app/cms/api/cms-api.service";
import { StorageManager } from "../../../app/cms/api/cms-storagemanager.service";
import { CmsSessionStorageItem } from "../../../app/cms/models/cms-session-storage-item";
import { IUserProfileSettings } from "../../../app/cms/models/cms-user-profile-settings";
import { IUserConfig } from "../../../app/cms/models/cms-user.model";
import { AppConfig } from "../../../app/config";
import { CmsLanguages } from "../../../app/i18n/cms-languages";
import { CmsLaunchpadComponent } from "../../../app/launchpad/cms-launchpad.component";
import { CmsSettingsService } from "../../../app/launchpad/settings/cms-settings.service";
import { MockUserProfileSettings } from "../core/mock-stubs/login.mock";
import { ParsingManager } from "./../../../app/utils/parsing-manager-util";
import { CMSConstants } from "../../../app/cms/models/cms-constants";

/**
 * Fake CmsApiService Service
 */
class MockCmsApiService {
    public reconnectSessionWithServer(): void {
        //no code required here.
    }

    public getSystemInfo(): Observable<any> {
        return Observable.of(systemInfoData);
    }

    public updateUserProfileSettings(): Promise<IUserProfileSettings> {
        return Promise.resolve(MockUserProfileSettings);
    }

    public logout() : Observable<string>  {
        return Observable.of("LOGOUT");
    }

    public performOnlogout(): void {
        //no code required here.
    }

    public makeSessionExpire(): void {
        //no code required here.
    }
}
let  router: any;

const userData: any = {
    username: "bcd-se-test",
    loggedIn: true
};

const settingsData : any = {
    language: "ar",
    wallConnection: {
        startUpAction: "show-available-walls-list",
        specificDisplay: "Auditorium",
        recentDisplay: "Auditorium"
    },
    sourceLabel: {
        displaySourceNameLabels: true,
        useMultipleLines: false,
        fontColor: "#E57373",
        fontSize: 16,
        backgroundColor: "#4FC3F7",
        transparency: 50
    },
    wallContent: {
        requireConfirmationForLoadingLayouts: false,
        allowChangingSources: false,
        clipboardEnabled: false,
        clipboardSize: "large"
    },
    logOffTime: 0.0001,
    pageSize: 20
};

const systemInfoData : any = {
    ServerInfo: {
        ip: "10.98.0.231",
        version: "70.34 Build 0258"
    },
    LicenseInfo: {
        customerName: "Barco",
        projectName: "CMS Demo",
        licenseStatus: "DemoLicense",
        daysRemaining: 1153,
        localization: 0
    }
};

describe("CmsLaunchpadComponent", () => {
    let component: CmsLaunchpadComponent;
    let fixture: ComponentFixture<CmsLaunchpadComponent>;
    let debugInstance: any;
    let nativeElement: any;
        // iconRegistry,
        // spyOnAddSvgIcon,
    let translate: TranslateService;
    let storageManager: StorageManager;
    let cmsApiService: CmsApiService;
    let cmsSettingsService: CmsSettingsService;
    let appConfig: AppConfig;
    const delayTime1500: number = 1500;
    const delayTime2000: number = 2000;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CmsLaunchpadComponent],
            providers: [
                {
                    provide: Router,
                    useValue: router
                },
                CmsSettingsService,
                {
                    provide: CmsApiService,
                    useClass: MockCmsApiService
                },
                APIRequest,
                TranslateService,
                StorageManager,
                AppConfig,
                MdIconRegistry
            ],
            imports: [
                FormsModule,
                HttpModule, MaterialModule.forRoot(),
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: (http: Http) : TranslateHttpLoader => new TranslateHttpLoader(http, "/base/app/i18n/", ".json"),
                        deps: [Http]
                    }
                })
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(CmsLaunchpadComponent);
            component = fixture.componentInstance;
            nativeElement = fixture.nativeElement;
            debugInstance = fixture.debugElement.componentInstance;
            translate = fixture.debugElement.injector.get(TranslateService);
            storageManager = fixture.debugElement.injector.get(StorageManager);
            cmsApiService = fixture.debugElement.injector.get(CmsApiService);
            cmsSettingsService = fixture.debugElement.injector.get(CmsSettingsService);
            appConfig = fixture.debugElement.injector.get(AppConfig);
            spyOn(cmsApiService, "logout");
            storageManager.setItem(CmsSessionStorageItem.USER, CMSConstants.NULL_VALUE);
            storageManager.setItem(CmsSessionStorageItem.SETTINGS, CMSConstants.NULL_VALUE);
            // iconRegistry = fixture.debugElement.injector.get(MdIconRegistry);
            // spyOnAddSvgIcon = spyOn(iconRegistry, "addSvgIcon");

            router = {
                navigate: jasmine.createSpy("login")
            };
        });
    }));

    // beforeEach(inject([MdIconRegistry], (response) => {
    //     iconRegistry = response;
    // }));

    it("Launchpad component should be a defined", () => {
        expect(component).toBeDefined();
        expect(debugInstance.showSystemDialog).toBeFalsy();
        expect(debugInstance.showProgressDialog).toBeFalsy();
    });

    // tslint:disable-next-line:no-suspicious-comment
    //TODO:commented for icon registry cases
    // it("should add icons to the registry", () => {
    //     fixture.whenStable().then(() => {
    //         expect(iconRegistry.addSvgIcon).toHaveBeenCalled();
    //     });
    // });

    it("Check prevent browser defaults", () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const evtWheel: MouseEvent = new MouseEvent("wheel", { ctrlKey: true });
            spyOn(evtWheel, "preventDefault");
            window.document.dispatchEvent(evtWheel);
            expect(evtWheel.preventDefault).toHaveBeenCalled();
            // tslint:disable-next-line:no-magic-numbers
            const whichList: [number] = [61, 173, 107, 109, 187, 189, 116, 82];
            for (const data of whichList) {
                const evtKeyDown: KeyboardEvent = new KeyboardEvent("keydown", { ctrlKey: true });
                spyOn(evtKeyDown, "preventDefault");
                Object.defineProperty(evtKeyDown, "which", { get: (): number => { return data; } });
                window.document.dispatchEvent(evtKeyDown);
                expect(evtKeyDown.preventDefault).toHaveBeenCalled();
            }

            const evtTouchStart: Event = new Event("touchstart");
            spyOn(evtTouchStart, "preventDefault");
            // tslint:disable-next-line:no-magic-numbers
            Object.defineProperty(evtTouchStart, "touches", { get: (): number[] => { return [1, 2]; } });
            window.document.dispatchEvent(evtTouchStart);
            expect(evtTouchStart.preventDefault).toHaveBeenCalled();

            spyOn(debugInstance, "preventBrowserDefaults");
            component.ngOnInit();
            expect(debugInstance.preventBrowserDefaults).toHaveBeenCalled();
        });
    });

    it("should add all supported languages to the app", () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const languageKeys : string[] = CmsLanguages.languagesKeys;
            expect(translate.getLangs()).toEqual(languageKeys);
        });
    });

    it("should route to login page if user session is empty", (done: DoneFn) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            if (!storageManager.getItem(CmsSessionStorageItem.USER)) {
                expect(router.navigate).toHaveBeenCalledWith(["/login"]);
            }
            done();
        });
    });

    // tslint:disable-next-line:max-func-body-length
    it("should reconnect session with server and have settings data into session and apply user selected language and test auto logout functionality and application events", (done : DoneFn) : void => {
            storageManager.setItem(CmsSessionStorageItem.USER, JSON.stringify(userData));
            storageManager.setItem(CmsSessionStorageItem.SETTINGS, JSON.stringify(settingsData));
            spyOn(cmsApiService, "reconnectSessionWithServer");
            fixture.detectChanges();
            // tslint:disable-next-line:max-func-body-length
            fixture.whenStable().then(() => {
                expect(cmsApiService.reconnectSessionWithServer).toHaveBeenCalled();
                expect(cmsSettingsService.userSettings).toEqual(JSON.parse(storageManager.getItem(CmsSessionStorageItem.SETTINGS)));
                expect(cmsSettingsService.userSettings.language).toEqual(appConfig.DefaultLanguage);
                nativeElement.click();
                delay(delayTime2000).then(() => {
                    expect(cmsApiService.logout).toHaveBeenCalled();
                    const logoffTime : number = 10;
                    cmsSettingsService.userSettings.logOffTime = logoffTime;
                    const userLastActionTime : any = storageManager.getItem(CmsSessionStorageItem.USER_LASTACTION_TIME);
                    nativeElement.click();
                    delay(delayTime1500).then(() => {
                        expect(ParsingManager.TO_INTEGER(userLastActionTime)).toBeLessThanOrEqual(ParsingManager.TO_INTEGER(storageManager.getItem(CmsSessionStorageItem.USER_LASTACTION_TIME)));
                        done();
                    });
                });

                debugInstance.applicationLevelEvent.next(
                    {
                        eventType: "permission",
                        eventName: "userModified"
                    }
                );
                fixture.whenStable().then(() => {
                    expect(debugInstance.showSystemDialog).toBeTruthy();
                    expect(debugInstance.showProgressDialog).toBeFalsy();
                    debugInstance.applicationLevelEvent.next(
                        {
                            eventType: "not permission",
                            eventName: "EventReconnectionSuccess"
                        }
                    );
                    fixture.whenStable().then(() => {
                        expect(debugInstance.showProgressDialog).toBeFalsy();
                        debugInstance.applicationLevelEvent.next(
                            {
                                eventType: "not permission",
                                eventName: "ServerDisconnected"
                            }
                        );
                        fixture.whenStable().then(() => {
                            expect(debugInstance.showProgressDialog).toBeTruthy();
                            expect(debugInstance.showSystemDialog).toBeFalsy();
                            fixture.detectChanges();
                            const progressCircle : any = nativeElement.querySelector("md-progress-circle");
                            expect(progressCircle).toBeDefined();
                            const messageContainer : any = nativeElement.querySelector(".message");
                            expect(messageContainer.innerText).toEqual("Trying to connect to the server...");

                            debugInstance.applicationLevelEvent.next(
                                {
                                    eventType: "not permission",
                                    eventName: "ServerConnected"
                                }
                            );
                            fixture.whenStable().then(() => {
                                expect(debugInstance.showProgressDialog).toBeFalsy();
                                expect(debugInstance.showSystemDialog).toBeTruthy();
                                fixture.detectChanges();
                                const popup : any = nativeElement.querySelector("nd-popup");
                                const popupBody: any = nativeElement.querySelector("nd-popup popup-body");
                                expect(popupBody.innerText).toEqual("Connection with the server is now established! Perform login again.");
                                popup.dispatchEvent(new Event("done"));
                                expect(debugInstance.showSystemDialog).toBeFalsy();
                                debugInstance.applicationLevelEvent.next(
                                    {
                                        eventType: "system",
                                        eventName: "system"
                                    }
                                );

                                fixture.whenStable().then(() => {
                                    popup.dispatchEvent(new Event("done"));
                                    expect(cmsApiService.logout).toHaveBeenCalled();

                                    debugInstance.applicationEventType = "";
                                    storageManager.removeItem(CmsSessionStorageItem.USER);

                                    debugInstance.applicationLevelEvent.next(
                                        {
                                            eventType: "not permission",
                                            eventName: "ServerConnected"
                                        }
                                    );

                                    fixture.whenStable().then(() => {
                                        expect(debugInstance.applicationEventType).toEqual("");
                                    });

                                });
                            });
                        });
                    });
                });
            });
        });

    it("should reset last action time", (done: DoneFn) => {
        storageManager.setItem(CmsSessionStorageItem.USER, JSON.stringify(userData));
        storageManager.setItem(CmsSessionStorageItem.SETTINGS, JSON.stringify(settingsData));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            storageManager.removeItem(CmsSessionStorageItem.USER_LASTACTION_TIME);
            const logOffTime: number = 5;
            cmsSettingsService.userSettings.logOffTime = logOffTime;
            nativeElement.click();
            delay(delayTime2000).then(() => {
                    expect(ParsingManager.TO_INTEGER(debugInstance.userLastActionTime)).toBeLessThanOrEqual(ParsingManager.TO_INTEGER(storageManager.getItem(CmsSessionStorageItem.USER_LASTACTION_TIME)));
                    nativeElement.click();
                    delay(delayTime1500).then(() => {
                        expect(ParsingManager.TO_INTEGER(debugInstance.userLastActionTime)).toBeLessThanOrEqual(ParsingManager.TO_INTEGER(storageManager.getItem(CmsSessionStorageItem.USER_LASTACTION_TIME)));
                        done();
                    });
                });
            });
        });

    it("should set user last action time", async(() => {
        storageManager.setItem(CmsSessionStorageItem.USER, JSON.stringify(userData));
        storageManager.setItem(CmsSessionStorageItem.SETTINGS, JSON.stringify(settingsData));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(storageManager.getItem(CmsSessionStorageItem.USER_LASTACTION_TIME)).toBeDefined();
        });
    }));

    it("should add log off time observable on click", async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.calculateUserWrapperHash).toBeUndefined();
            nativeElement.click();
            expect(debugInstance.calculateUserWrapperHash).toBeDefined();
            spyOn(window, "clearTimeout");
            nativeElement.click();
            expect(window.clearTimeout).toHaveBeenCalled();
            expect(debugInstance.calculateUserWrapperHash).toBeDefined();
        });
    }));

    it("should add log off time observable on scroll", async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            nativeElement.dispatchEvent(new Event("scroll"));
            expect(debugInstance.calculateUserWrapperHash).toBeDefined();
            spyOn(window, "clearTimeout");
            nativeElement.dispatchEvent(new Event("scroll"));
            expect(window.clearTimeout).toHaveBeenCalled();
        });
    }));

    it("should add log off time observable on input", async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            nativeElement.dispatchEvent(new Event("input"));
            expect(debugInstance.calculateUserWrapperHash).toBeDefined();
            spyOn(window, "clearTimeout");
            nativeElement.dispatchEvent(new Event("input"));
            expect(window.clearTimeout).toHaveBeenCalled();
        });
    }));

    it("should set user last action time", async(() => {
        storageManager.setItem(CmsSessionStorageItem.USER, JSON.stringify(userData));
        storageManager.removeItem(CmsSessionStorageItem.SETTINGS);
        component.ngOnInit();
        fixture.whenStable().then(() => {
            expect(cmsSettingsService.userSettings).toBeUndefined();
        });
    }));
});
