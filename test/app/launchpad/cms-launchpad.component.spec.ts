import { ComponentFixture, TestBed, async, inject } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { NO_ERRORS_SCHEMA, ElementRef } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { HttpModule, Http } from "@angular/http";
import { MaterialModule, MdIconRegistry } from "@angular/material";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService, TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { MockRouterStub } from "../core/mock-stubs/mock-router.stub";
import { IUserProfileSettings } from "../../../app/cms/models/cms-user-profile-settings";
import { CmsLaunchpadComponent } from "../../../app/launchpad/cms-launchpad.component";
import { StorageManager } from "../../../app/cms/api/cms-storagemanager.service";
import { CmsSettingsService } from "../../../app/launchpad/settings/cms-settings.service";
import { CmsApiService } from "../../../app/cms/api/cms-api.service";
import { AppConfig } from "../../../app/config";
import { APIRequest } from "../../../app/cms/api/api-request";
import { CMS_SESSION_STORAGE_ITEM } from "../../../app/cms/models/cms-session-storage-item";
import { CmsLanguages } from "../../../app/i18n/cms-languages";
import { MockUserProfileSettings } from "../core/mock-stubs/login.mock";

/**
 * Fake CmsApiService Service
 */
class MockCmsApiService {
    reconnectSessionWithServer() {

    }

    getSystemInfo(): Observable<any> {
        return Observable.of(systemInfoData);
    }

    updateUserProfileSettings(): Promise<IUserProfileSettings> {
        return Promise.resolve(MockUserProfileSettings);
    }

    logout() {
        return Observable.of("LOGOUT");
    }

    performOnlogout() {

    }

    logoutUser() {

    }

    makeSessionExpire() {

    }
}

let router = {
    navigate: jasmine.createSpy("login")
};

let userData = {
    "username": "bcd-se-test",
    "loggedIn": true
};

let settingsData = {
    "language": "ar",
    "wallConnection": {
        "startUpAction": "show-available-walls-list",
        "specificDisplay": "Auditorium",
        "recentDisplay": "Auditorium"
    },
    "sourceLabel": {
        "displaySourceNameLabels": true,
        "useMultipleLines": false,
        "fontColor": "#E57373",
        "fontSize": 16,
        "backgroundColor": "#4FC3F7",
        "transparency": 50
    },
    "wallContent": {
        "requireConfirmationForLoadingLayouts": false,
        "allowChangingSources": false,
        "clipboardEnabled": false,
        "clipboardSize": "large"
    },
    "logOffTime": 0.0001,
    "pageSize": 20
};

let systemInfoData = {
    "ServerInfo": {
        "ip": "10.98.0.231",
        "version": "70.34 Build 0258"
    },
    "LicenseInfo": {
        "customerName": "Barco",
        "projectName": "CMS Demo",
        "licenseStatus": "DemoLicense",
        "daysRemaining": 1153,
        "localization": 0
    }
};

describe("CmsLaunchpadComponent", () => {
    let component: CmsLaunchpadComponent;
    let fixture: ComponentFixture<CmsLaunchpadComponent>;
    let debugInstance, nativeElement, iconRegistry, spyOnAddSvgIcon,
        translate: TranslateService, storageManager: StorageManager,
        cmsApiService: CmsApiService, cmsSettingsService: CmsSettingsService,
        appConfig: AppConfig;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CmsLaunchpadComponent],
            providers: [
                {
                    provide: Router,
                    useValue: router,
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
                        useFactory: (http: Http) => new TranslateHttpLoader(http, "/base/app/i18n/", ".json"),
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
            spyOn(cmsApiService, "logoutUser").and.returnValue(Observable.of(null));
            storageManager.set(CMS_SESSION_STORAGE_ITEM.USER, null);
            storageManager.set(CMS_SESSION_STORAGE_ITEM.SETTINGS, null);
            // iconRegistry = fixture.debugElement.injector.get(MdIconRegistry);
            // spyOnAddSvgIcon = spyOn(iconRegistry, "addSvgIcon");
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
    //TODO:commented for icon registry cases
    // it("should add icons to the registry", () => {
    //     fixture.whenStable().then(() => {
    //         expect(iconRegistry.addSvgIcon).toHaveBeenCalled();
    //     });
    // });

    it("Check prevent browser defaults", () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            let evtWheel = new MouseEvent("wheel", { "ctrlKey": true });
            spyOn(evtWheel, "preventDefault");
            window.document.dispatchEvent(evtWheel);
            expect(evtWheel.preventDefault).toHaveBeenCalled();
            let whichList = [61, 173, 107, 109, 187, 189, 116, 82];
            for (let whichListIndex = 0; whichListIndex < whichList.length; whichListIndex++) {
                let evtKeyDown = new KeyboardEvent("keydown", { ctrlKey: true });
                spyOn(evtKeyDown, "preventDefault");
                Object.defineProperty(evtKeyDown, "which", { get: function () { return whichList[whichListIndex]; } });
                window.document.dispatchEvent(evtKeyDown);
                expect(evtKeyDown.preventDefault).toHaveBeenCalled();
            }

            let evtTouchStart = new Event("touchstart");
            spyOn(evtTouchStart, "preventDefault");
            Object.defineProperty(evtTouchStart, "touches", { get: function () { return [1, 2]; } });
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
            let languageKeys = CmsLanguages.languagesKeys;
            expect(translate.getLangs()).toEqual(languageKeys);
        });
    });

    it("should route to login page if user session is empty", (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            if (!storageManager.get(CMS_SESSION_STORAGE_ITEM.USER)) {
                expect(router.navigate).toHaveBeenCalledWith(["/login"]);
            }
            done();
        });
    });

    it(`should reconnect session with server and have settings data into session and
        apply user selected language and test auto logout functionality
        and application events`, (done) => {
            storageManager.set(CMS_SESSION_STORAGE_ITEM.USER, JSON.stringify(userData));
            storageManager.set(CMS_SESSION_STORAGE_ITEM.SETTINGS, JSON.stringify(settingsData));
            spyOn(cmsApiService, "reconnectSessionWithServer");
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(cmsApiService.reconnectSessionWithServer).toHaveBeenCalled();

                expect(cmsSettingsService.userSettings).toEqual(JSON.parse(storageManager.get(CMS_SESSION_STORAGE_ITEM.SETTINGS)));
                expect(cmsSettingsService.userSettings.language).toEqual(appConfig.DefaultLanguage);
                nativeElement.click();
                delay(2000).then(() => {
                    expect(cmsApiService.logoutUser).toHaveBeenCalled();

                    cmsSettingsService.userSettings.logOffTime = 10;
                    let userLastActionTime = storageManager.get(CMS_SESSION_STORAGE_ITEM.USER_LASTACTION_TIME);
                    nativeElement.click();
                    delay(1500).then(() => {
                        expect(parseInt(userLastActionTime)).toBeLessThanOrEqual(parseInt(storageManager.get(CMS_SESSION_STORAGE_ITEM.USER_LASTACTION_TIME)));
                        done();
                    });
                });

                debugInstance.applicationLevelEvent.next(
                    {
                        "eventType": "permission",
                        "eventName": "userModified"
                    }
                );
                fixture.whenStable().then(() => {
                    expect(debugInstance.showSystemDialog).toBeTruthy();
                    expect(debugInstance.showProgressDialog).toBeFalsy();
                    debugInstance.applicationLevelEvent.next(
                        {
                            "eventType": "not permission",
                            "eventName": "EventReconnectionSuccess"
                        }
                    );
                    fixture.whenStable().then(() => {
                        expect(debugInstance.showProgressDialog).toBeFalsy();
                        debugInstance.applicationLevelEvent.next(
                            {
                                "eventType": "not permission",
                                "eventName": "ServerDisconnected"
                            }
                        );
                        fixture.whenStable().then(() => {
                            expect(debugInstance.showProgressDialog).toBeTruthy();
                            expect(debugInstance.showSystemDialog).toBeFalsy();
                            fixture.detectChanges();
                            let progressCircle = nativeElement.querySelector("md-progress-circle");
                            expect(progressCircle).toBeDefined()
                            let messageContainer = nativeElement.querySelector(".message");
                            expect(messageContainer.innerText).toEqual("Trying to connect to the server...");

                            debugInstance.applicationLevelEvent.next(
                                {
                                    "eventType": "not permission",
                                    "eventName": "ServerConnected"
                                }
                            );
                            fixture.whenStable().then(() => {
                                expect(debugInstance.showProgressDialog).toBeFalsy();
                                expect(debugInstance.showSystemDialog).toBeTruthy();
                                fixture.detectChanges();
                                let popup = nativeElement.querySelector("nd-popup");
                                let popupBody = nativeElement.querySelector("nd-popup popup-body");
                                expect(popupBody.innerText).toEqual("Connection with the server is now established! Perform login again.");
                                popup.dispatchEvent(new Event("done"));
                                expect(debugInstance.showSystemDialog).toBeFalsy();
                                debugInstance.applicationLevelEvent.next(
                                    {
                                        "eventType": "system",
                                        "eventName": "system"
                                    }
                                );

                                fixture.whenStable().then(() => {
                                    popup.dispatchEvent(new Event("done"));
                                    expect(cmsApiService.logoutUser).toHaveBeenCalled();

                                    debugInstance.applicationEventType = "";
                                    storageManager.remove(CMS_SESSION_STORAGE_ITEM.USER);

                                    debugInstance.applicationLevelEvent.next(
                                        {
                                            "eventType": "not permission",
                                            "eventName": "ServerConnected"
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

    it(`should reset last action time`, (done) => {
            storageManager.set(CMS_SESSION_STORAGE_ITEM.USER, JSON.stringify(userData));
            storageManager.set(CMS_SESSION_STORAGE_ITEM.SETTINGS, JSON.stringify(settingsData));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                storageManager.remove(CMS_SESSION_STORAGE_ITEM.USER_LASTACTION_TIME);
                cmsSettingsService.userSettings.logOffTime = 5;
                nativeElement.click();
                delay(2000).then(() => {
                    expect(parseInt(debugInstance.userLastActionTime)).toBeLessThanOrEqual(parseInt(storageManager.get(CMS_SESSION_STORAGE_ITEM.USER_LASTACTION_TIME)));
                    nativeElement.click();
                    delay(1500).then(() => {
                        expect(parseInt(debugInstance.userLastActionTime)).toBeLessThanOrEqual(parseInt(storageManager.get(CMS_SESSION_STORAGE_ITEM.USER_LASTACTION_TIME)));
                        done();
                    });
                });
            });
        });

    it("should set user last action time", async(() => {
        storageManager.set(CMS_SESSION_STORAGE_ITEM.USER, JSON.stringify(userData));
        storageManager.set(CMS_SESSION_STORAGE_ITEM.SETTINGS, JSON.stringify(settingsData));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(storageManager.get(CMS_SESSION_STORAGE_ITEM.USER_LASTACTION_TIME)).toBeDefined();
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
        storageManager.set(CMS_SESSION_STORAGE_ITEM.USER, JSON.stringify(userData));
        storageManager.remove(CMS_SESSION_STORAGE_ITEM.SETTINGS);
        component.ngOnInit();
        fixture.whenStable().then(() => {
            expect(cmsSettingsService.userSettings).toBeUndefined();
        });
    }));
});