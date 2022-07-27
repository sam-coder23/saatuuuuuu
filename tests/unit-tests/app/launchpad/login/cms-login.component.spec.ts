/**
 * This class is responsible to handle unit test case of CmsLoginComponent
 */
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, getTestBed, inject, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Observable } from "rxjs/Observable";

import { APIRequest } from "../../../../app/cms/api/api-request";
import { CmsApiService } from "../../../../app/cms/api/cms-api.service";
import { StorageManager } from "../../../../app/cms/api/cms-storagemanager.service";
import { CMSConstants } from "../../../../app/cms/models/cms-constants";
import { CmsSessionStorageItem } from "../../../../app/cms/models/cms-session-storage-item";
import { IUserProfileSettings } from "../../../../app/cms/models/cms-user-profile-settings";
import { User } from "../../../../app/cms/models/cms-user.model";
import { AppConfig } from "../../../../app/config";
import { CmsLoginComponent } from "../../../../app/launchpad/login/cms-login.component";
import { CmsSettingsService } from "../../../../app/launchpad/settings/cms-settings.service";
import { CmsMiniDisplayService } from "../../../../app/shared/mini-display/cms-mini-display.service";
import { mockLicenseInfo, mockUser, mockUserProfileSettings } from "./../../core/mock-stubs/login.mock";
import { MockCmsApiService } from "./mock-api-service-Login";

let router: any;

/**
 * Fake ActivatedRoute Service
 */
class MockActivatedRoute {
    public params: [{
        id: number;
    }];

    constructor() {
        this.params = [{
            id: 1
        }];
    }
}

describe("CmsLoginComponent", () => {
    let component: CmsLoginComponent;
    let fixture: ComponentFixture<CmsLoginComponent>;
    let debugInstance: any;
    let nativeElement: any;
    let storageManager: any;
    let translateService: TranslateService;
    let nameBox: any;
    let passwordBox: any;
    let loginButton: any;

    beforeEach(async(() => {
        router = {
            navigate: jasmine.createSpy("login")
        };
        TestBed.configureTestingModule({
            declarations: [CmsLoginComponent],
            providers: [
                {
                    provide: Router,
                    useValue: router
                },
                {
                    provide: ActivatedRoute,
                    useClass: MockActivatedRoute
                },
                CmsSettingsService,
                {
                    provide: CmsApiService,
                    useClass: MockCmsApiService
                },
                StorageManager,
                TranslateService,
                CmsMiniDisplayService,
                APIRequest,
                AppConfig
            ],
            imports: [
                FormsModule,
                HttpClientModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: (http: HttpClient): TranslateHttpLoader => new TranslateHttpLoader(http, "/base/app/i18n/", ".json"),
                        deps: [HttpClient]
                    }
                })
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents().then(() => {
            const injector : TestBed = getTestBed();
            fixture = TestBed.createComponent(CmsLoginComponent);
            component = fixture.componentInstance;
            nativeElement = fixture.nativeElement;
            debugInstance = fixture.debugElement.componentInstance;
            translateService = injector.get(TranslateService);

            nameBox = nativeElement.querySelector("#login-username-input");
            passwordBox = nativeElement.querySelector("#login-password-input");
            loginButton = nativeElement.querySelector("#login-submit-button");
        });
    }));

    beforeEach(inject([StorageManager], (response: any) => {
        storageManager = response;
    }));

    it("component should be a defined", () => {
        expect(component).toBeDefined();
        expect(debugInstance.isLoginInProgress).toBeFalsy();
        expect(debugInstance.hasError).toBeFalsy();
    });

    it("User Login: Success", () => {
        debugInstance.user = mockUser;
        debugInstance.onLoginSubmit();
        fixture.whenStable().then(() => {
            const userModel : any = JSON.parse(storageManager.getItem(CmsSessionStorageItem.USER));
            if (userModel) {
                expect(userModel.username).toEqual(mockUser.username);
                expect(userModel.loggedIn).toEqual(true);
            } else {
                debugInstance.appConfig.log("ERROR: User Login");
            }
        });
    });

    it("User Login: Failure", () => {
        debugInstance.user = { username: "test", password: "password" };
        debugInstance.onLoginSubmit();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.hasError).toEqual(true);
        });
    });

    it("Triggering the user name change event", () => {
        fixture.detectChanges();
        expect(nameBox).toBeTruthy();
        nameBox.value = "username";
        nameBox.dispatchEvent(new Event("input"));
        fixture.detectChanges();
        expect(debugInstance.hasError).toBe(false);
        fixture.whenStable().then(() => {
            expect(debugInstance.user.username).toBe(nameBox.value);
        });
    });

    it("Triggering the password change event", () => {
        fixture.detectChanges();
        expect(passwordBox).toBeTruthy();
        passwordBox.value = "password";
        passwordBox.dispatchEvent(new Event("input"));
        fixture.detectChanges();
        expect(debugInstance.hasError).toBe(false);
        fixture.whenStable().then(() => {
            expect(debugInstance.user.password).toBe(passwordBox.value);
        });
    });

    it("Can handle license error", () => {
        fixture.detectChanges();
        expect(nameBox).toBeTruthy();
        expect(passwordBox).toBeTruthy();
        expect(loginButton).toBeTruthy();

        nameBox.value = "license-error";
        passwordBox.value = "password";
        passwordBox.dispatchEvent(new Event("input"));
        debugInstance.user = {
            username: nameBox.value,
            password: passwordBox.value
        };
        fixture.detectChanges();
        expect(debugInstance.hasError).toBe(false);
        fixture.whenStable().then(() => {
            debugInstance.login(debugInstance.user);
            expect(debugInstance.hasError).toBe(true);
        });
    });

    it("Can handle settings error", () => {
        fixture.detectChanges();
        expect(nameBox).toBeTruthy();
        expect(passwordBox).toBeTruthy();
        expect(loginButton).toBeTruthy();

        nameBox.value = "settings-error";
        passwordBox.value = "password";
        passwordBox.dispatchEvent(new Event("input"));
        debugInstance.user = {
            username: nameBox.value,
            password: passwordBox.value
        };
        fixture.detectChanges();
        expect(debugInstance.hasError).toBe(false);
        fixture.whenStable().then(() => {
            debugInstance.login(debugInstance.user);
            expect(debugInstance.hasError).toBe(true);
        });
    });

    it("Can handle user disabled error", () => {
        fixture.detectChanges();
        expect(nameBox).toBeTruthy();
        expect(passwordBox).toBeTruthy();
        expect(loginButton).toBeTruthy();

        nameBox.value = "user-disabled-error";
        passwordBox.value = "password";
        passwordBox.dispatchEvent(new Event("input"));
        debugInstance.user = {
            username: nameBox.value,
            password: passwordBox.value
        };
        fixture.detectChanges();
        expect(debugInstance.hasError).toBe(false);
        fixture.whenStable().then(() => {
            debugInstance.login(debugInstance.user);
            expect(debugInstance.hasError).toBe(true);
        });
    });

    it("Can handle server unavailable error", () => {
        fixture.detectChanges();
        expect(nameBox).toBeTruthy();
        expect(passwordBox).toBeTruthy();
        expect(loginButton).toBeTruthy();

        nameBox.value = "server-unavailable-error";
        passwordBox.value = "password";
        passwordBox.dispatchEvent(new Event("input"));
        debugInstance.user = {
            username: nameBox.value,
            password: passwordBox.value
        };
        fixture.detectChanges();
        expect(debugInstance.hasError).toBe(false);
        fixture.whenStable().then(() => {
            debugInstance.login(debugInstance.user);
            expect(debugInstance.hasError).toBe(true);
        });
    });

    it("Can handle not found error", () => {
        fixture.detectChanges();
        expect(nameBox).toBeTruthy();
        expect(passwordBox).toBeTruthy();
        expect(loginButton).toBeTruthy();

        nameBox.value = "not-found-error";
        passwordBox.value = "password";
        passwordBox.dispatchEvent(new Event("input"));
        debugInstance.user = {
            username: nameBox.value,
            password: passwordBox.value
        };
        fixture.detectChanges();
        expect(debugInstance.hasError).toBe(false);
        fixture.whenStable().then(() => {
            debugInstance.login(debugInstance.user);
            expect(debugInstance.hasError).toBe(true);
        });
    });

    it("Can handle server not ready error", () => {
        fixture.detectChanges();
        expect(nameBox).toBeTruthy();
        expect(passwordBox).toBeTruthy();
        expect(loginButton).toBeTruthy();

        nameBox.value = "server-not-ready-error";
        passwordBox.value = "password";
        passwordBox.dispatchEvent(new Event("input"));
        debugInstance.user = {
            username: nameBox.value,
            password: passwordBox.value
        };
        fixture.detectChanges();
        expect(debugInstance.hasError).toBe(false);
        fixture.whenStable().then(() => {
            debugInstance.login(debugInstance.user);
            expect(debugInstance.hasError).toBe(true);
        });
    });

    it("Can handle server other error", () => {
        fixture.detectChanges();
        expect(nameBox).toBeTruthy();
        expect(passwordBox).toBeTruthy();
        expect(loginButton).toBeTruthy();

        nameBox.value = "other-error";
        passwordBox.value = "password";
        passwordBox.dispatchEvent(new Event("input"));
        debugInstance.user = {
            username: nameBox.value,
            password: passwordBox.value
        };
        fixture.detectChanges();
        expect(debugInstance.hasError).toBe(false);
        fixture.whenStable().then(() => {
            debugInstance.login(debugInstance.user);
            expect(debugInstance.hasError).toBe(true);
        });
    });
});
