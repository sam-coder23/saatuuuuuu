import { CmsLoginComponent } from "./cms-login.component";
import { ComponentFixture, TestBed, async, inject } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement, NO_ERRORS_SCHEMA } from "@angular/core";
import { MockUser, MockUserProfileSettings, MoclLicenseinfo } from "./login.mock";
import { Observable } from "rxjs/Observable";
import { UserConfig, User } from "../models/cms-user.model";
import { CmsApiService } from "../../cms/api/cms-api.service";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { HttpModule, Http } from "@angular/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { AppConfig } from "../../config";
import { CmsClipboardService } from "../../shared/clipboard/cms-clipboard.service";
import { CmsMiniDisplayService } from "../../shared/mini-display/cms-mini-display.service";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { CmsSettingsService } from "../settings/cms-settings.service";
import { MaterialModule, MdRippleModule } from "@angular/material";
import { FormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { IUserProfileSettings } from "../../cms/models/cms-user-profile-settings";
import { CMS_SESSION_STORAGE_ITEM } from "../../cms/models/cms-session-storage-item";
import { APIRequest } from "../../cms/api/api-request";
import { CmsOptionsComponent } from "../display-panel/options/cms-options.component";

/**
 * Fake CmsApiService Service
 */
class MockCmsApiService {
    login(mockUser): Observable<UserConfig> {
        if(mockUser.username === MockUser.username && mockUser.password === MockUser.password) {
            return Observable.of(MockUser);
        } else {
            return Observable.throw("Invalid credentials");
        }
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
        return Observable.of(MoclLicenseinfo);
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
    let componentOptions: CmsOptionsComponent;
    let fixtureOptions: ComponentFixture<CmsOptionsComponent>;
    let debugInstanceOptions, cmsApiService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CmsLoginComponent, CmsOptionsComponent],
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
                CmsClipboardService,
                APIRequest,
                AppConfig
            ],
            imports: [
                FormsModule,
                HttpModule, MaterialModule.forRoot(),
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: (http: Http) => new TranslateHttpLoader(http, "base/app/i18n/", ".json"),
                        deps: [Http]
                    }
                })
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(CmsLoginComponent);
            component = fixture.componentInstance;
            nativeElement = fixture.nativeElement;
            debugInstance = fixture.debugElement.componentInstance;

            fixtureOptions = TestBed.createComponent(CmsOptionsComponent);
            componentOptions = fixtureOptions.componentInstance;
            debugInstanceOptions = fixtureOptions.debugElement.componentInstance;
            cmsApiService = fixtureOptions.debugElement.injector.get(CmsApiService);
            spyOn(cmsApiService, "logout").and.returnValue(Observable.of(null));
        });
    }));

    beforeEach(inject([StorageManager], (response) => {
        storageManager = response;
    }));

    it("component should be a defined", () => {
        expect(component).toBeDefined();
        expect(debugInstance.isLoginInProgress).toBeFalsy();
        expect(debugInstance.hasError).toBeFalsy();

        expect(componentOptions).toBeDefined();
        expect(debugInstanceOptions.disableOptionOnDisplayUnavailable).toBeFalsy();
    });

    it("User Login: Success", (done) => {
        debugInstance.user = MockUser;
        component.onLoginSubmit();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            let userModel = JSON.parse(storageManager.get(CMS_SESSION_STORAGE_ITEM.User));
            if(userModel) {
                expect(userModel.username).toEqual(MockUser.username);
                expect(userModel.loggedIn).toEqual(true);
            } else {
                console.log("ERROR: User Login");
            }
            done();
        });
    });

    it("Logout", () => {
        componentOptions.logout();
        fixtureOptions.whenStable().then(() => {
            expect(cmsApiService.logout).toHaveBeenCalled();
            // expect(storageManager.appStorage.length).toBe(0);
            // expect(router.navigate).toHaveBeenCalledWith(["/login"]);
        });
    });

    it("User Login: Failure", () => {
        debugInstance.user = {username: "test", password: "password"};
        component.onLoginSubmit();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.hasError).toEqual(true);
        });
    });
});