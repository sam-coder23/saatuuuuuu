import { ComponentFixture, TestBed, async, inject, tick, getTestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement, NO_ERRORS_SCHEMA } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { HttpModule, Http } from "@angular/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { MaterialModule, MdRippleModule } from "@angular/material";
import { FormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { IUserConfig } from "../../../../app/cms/models/cms-user.model";
import { IUserProfileSettings } from "../../../../app/cms/models/cms-user-profile-settings";
import { CmsLoginComponent } from "../../../../app/launchpad/login/cms-login.component";
import { CmsSettingsService } from "../../../../app/launchpad/settings/cms-settings.service";
import { CmsApiService } from "../../../../app/cms/api/cms-api.service";
import { StorageManager } from "../../../../app/cms/api/cms-storagemanager.service";
import { CmsMiniDisplayService } from "../../../../app/shared/mini-display/cms-mini-display.service";
import { APIRequest } from "../../../../app/cms/api/api-request";
import { AppConfig } from "../../../../app/config";
import { CmsSessionStorageItem } from "../../../../app/cms/models/cms-session-storage-item";
import { MockUser, MockUserProfileSettings, MockLicenseInfo } from "./../../core/mock-stubs/login.mock";

/**
 * Fake CmsApiService Service
 */
class MockCmsApiService {
    login(mockUser): Observable<any> {
        const response: any = {
            error: {
                status: 0
            }
        };

        if (mockUser.username === MockUser.username && mockUser.password === MockUser.password) {
            return Observable.of(MockUser);
        }
        else if (mockUser.username === "license-error") {
            response.error.status = 403;
        }
        else if (mockUser.username === "settings-error") {
            response.error.status = 406;
        }
        else if (mockUser.username === "user-disabled-error") {
            response.error.status = 409;
        }
        else if (mockUser.username === "server-unavailable-error") {
            response.error.status = 0;
        }
        else if (mockUser.username === "not-found-error") {
            response.error.status = 404;
        }
        else if (mockUser.username === "server-not-ready-error") {
            response.error.status = 503;
        }
        else if (mockUser.username === "other-error") {
            response.error.status = -1;
        }

        return Observable.throw(response.error);
    }

    keepSessionAlive() {

    }

    getUserProfileSettings(): Promise<IUserProfileSettings> {
        return Promise.resolve(MockUserProfileSettings);
    }

    updateUserProfileSettings(): Promise<IUserProfileSettings> {
        return Promise.resolve(MockUserProfileSettings);
    }

    getSystemInfo(): Observable<any> {
        return Observable.of(MockLicenseInfo);
    }

    logout(): Observable<any> {
        return Observable.of("LOGOUT");
    }

    performOnlogout(): void {
        // new StorageManager().removeStorage();
        // router.navigate(["/login"]);
    }

    makeSessionExpire() {
        return Observable.of(null);
    }
}

let router = {
    navigate: jasmine.createSpy("login")
}

/**
 * Fake ActivatedRoute Service
 */
class MockActivatedRoute {
    params: [{
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
    let debugInstance, nativeElement, storageManager;
    let translateService: TranslateService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CmsLoginComponent],
            providers: [
                {
                    provide: Router,
                    useValue: router,
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
                HttpModule,
                MaterialModule.forRoot(),
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
            const injector = getTestBed();
            fixture = TestBed.createComponent(CmsLoginComponent);
            component = fixture.componentInstance;
            nativeElement = fixture.nativeElement;
            debugInstance = fixture.debugElement.componentInstance;
            translateService = injector.get(TranslateService);
        });
    }));

    beforeEach(inject([StorageManager], (response) => {
        storageManager = response;
    }));

    it("component should be a defined", () => {
        expect(component).toBeDefined();
        expect(debugInstance.isLoginInProgress).toBeFalsy();
        expect(debugInstance.hasError).toBeFalsy();
    });

    it("User Login: Success", (done) => {
        debugInstance.user = MockUser;
        debugInstance.onLoginSubmit();
        fixture.whenStable().then(() => {
            let userModel = JSON.parse(storageManager.getItem(CmsSessionStorageItem.USER));
            if (userModel) {
                expect(userModel.username).toEqual(MockUser.username);
                expect(userModel.loggedIn).toEqual(true);
            } else {
                console.log("ERROR: User Login");
            }
            done();
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
        const nameBox = nativeElement.querySelector("#user-name-box");
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
        const passwordBox = nativeElement.querySelector("#password-box");
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
        const nameBox = nativeElement.querySelector("#user-name-box");
        const passwordBox = nativeElement.querySelector("#password-box");
        const loginButton = nativeElement.querySelector("#login-submit-button");
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
        const nameBox = nativeElement.querySelector("#user-name-box");
        const passwordBox = nativeElement.querySelector("#password-box");
        const loginButton = nativeElement.querySelector("#login-submit-button");
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
        const nameBox = nativeElement.querySelector("#user-name-box");
        const passwordBox = nativeElement.querySelector("#password-box");
        const loginButton = nativeElement.querySelector("#login-submit-button");
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
        const nameBox = nativeElement.querySelector("#user-name-box");
        const passwordBox = nativeElement.querySelector("#password-box");
        const loginButton = nativeElement.querySelector("#login-submit-button");
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
        const nameBox = nativeElement.querySelector("#user-name-box");
        const passwordBox = nativeElement.querySelector("#password-box");
        const loginButton = nativeElement.querySelector("#login-submit-button");
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
        const nameBox = nativeElement.querySelector("#user-name-box");
        const passwordBox = nativeElement.querySelector("#password-box");
        const loginButton = nativeElement.querySelector("#login-submit-button");
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
        const nameBox = nativeElement.querySelector("#user-name-box");
        const passwordBox = nativeElement.querySelector("#password-box");
        const loginButton = nativeElement.querySelector("#login-submit-button");
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
