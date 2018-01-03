import { ComponentFixture, TestBed, async, inject } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement, NO_ERRORS_SCHEMA } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { HttpModule, Http } from "@angular/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { MaterialModule, MdRippleModule } from "@angular/material";
import { FormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { IUserConfig } from "../../../../app/launchpad/models/cms-user.model";
import { IUserProfileSettings } from "../../../../app/cms/models/cms-user-profile-settings";
import { CmsLoginComponent } from "../../../../app/launchpad/login/cms-login.component";
import { CmsSettingsService } from "../../../../app/launchpad/settings/cms-settings.service";
import { CmsApiService } from "../../../../app/cms/api/cms-api.service";
import { StorageManager } from "../../../../app/cms/api/cms-storagemanager.service";
import { CmsMiniDisplayService } from "../../../../app/shared/mini-display/cms-mini-display.service";
import { APIRequest } from "../../../../app/cms/api/api-request";
import { AppConfig } from "../../../../app/config";
import { CmsSessionStorageItem } from "../../../../app/cms/models/cms-session-storage-item";
import { MockUser, MockUserProfileSettings, MoclLicenseinfo } from "./../../core/mock-stubs/login.mock";

/**
 * Fake CmsApiService Service
 */
class MockCmsApiService {
    login(mockUser): Observable<IUserConfig> {
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
    let debugInstanceOptions, cmsApiService;

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
            fixture = TestBed.createComponent(CmsLoginComponent);
            component = fixture.componentInstance;
            nativeElement = fixture.nativeElement;
            debugInstance = fixture.debugElement.componentInstance;
        });
    }));

    beforeEach(inject([StorageManager], (response) => {
        storageManager = response;
    }));

    it("component should be a defined", () => {
        expect(component).toBeDefined();
        expect(debugInstance.isLoginInProgress).toBeFalsy();
        expect(debugInstance.hasError).toBeFalsy();

        expect(debugInstanceOptions.disableOptionOnDisplayUnavailable).toBeFalsy();
    });

    it("User Login: Success", (done) => {
        debugInstance.user = MockUser;
        debugInstance.onLoginSubmit();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            let userModel = JSON.parse(storageManager.get(CmsSessionStorageItem.USER));
            if(userModel) {
                expect(userModel.username).toEqual(MockUser.username);
                expect(userModel.loggedIn).toEqual(true);
            } else {
                console.log("ERROR: User Login");
            }
            done();
        });
    });

    it("User Login: Failure", () => {
        debugInstance.user = {username: "test", password: "password"};
        debugInstance.onLoginSubmit();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.hasError).toEqual(true);
        });
    });
});
