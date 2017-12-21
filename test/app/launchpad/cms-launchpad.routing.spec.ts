import { Location, APP_BASE_HREF } from "@angular/common";
import { TestBed, async } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Router, ActivatedRoute } from "@angular/router";
import { launchpadRouter } from "../../../app/launchpad/cms-launchpad.routing";
import { CmsLoginComponent } from "../../../app/launchpad/login/cms-login.component";
import { CmsDisplayPanelComponent } from "../../../app/launchpad/display-panel/cms-display-panel.component";
import { CmsLaunchpadComponent } from "../../../app/launchpad/cms-launchpad.component";
import { CmsDisplaysPanelComponent } from "../../../app/launchpad/displays-panel/cms-displays-panel.component";
import { CmsSettingsPanelComponent } from "../../../app/launchpad/settings/cms-settings-panel.component";
import { CmsSettingsLanguagePanelComponent } from "../../../app/launchpad/settings/language/cms-settings-language-panel.component";
import { CmsAboutPanelComponent } from "../../../app/launchpad/about/cms-about-panel.component";
import { CmsSourcesPanelComponent } from "../../../app/launchpad/sources-panel/cms-sources-panel.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { CmsSettingsService } from "../../../app/launchpad/settings/cms-settings.service";
import { CmsApiService } from "../../../app/cms/api/cms-api.service";
import { StorageManager } from "../../../app/cms/api/cms-storagemanager.service";
import { TranslateService, TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { CmsMiniDisplayService } from "../../../app/shared/mini-display/cms-mini-display.service";
import { APIRequest } from "../../../app/cms/api/api-request";
import { AppConfig } from "../../../app/config";
import { FormsModule } from "@angular/forms";
import { HttpModule, Http } from "@angular/http";
import { MaterialModule } from "@angular/material";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { CmsCanActivateViaAuthorizationService } from "../../../app/launchpad/login/cms-can-activate-via-authorization.service";
import { Observable } from "rxjs/Observable";
import { CmsTilesPanelComponent } from "../../../app/launchpad/tiles-panel/cms-tiles-panel.component";
import { CmsOptionsComponent } from "../../../app/launchpad/display-panel/options/cms-options.component";

describe("Router: App", () => {

    let location: Location;
    let router: Router;
    let fixture;
    let canActiveViaAuthorizationService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [launchpadRouter,
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
            declarations: [
                CmsLoginComponent,
                CmsDisplaysPanelComponent,
                CmsDisplayPanelComponent,
                CmsSourcesPanelComponent,
                CmsSettingsPanelComponent,
                CmsSettingsLanguagePanelComponent,
                CmsAboutPanelComponent,
                CmsTilesPanelComponent,
                CmsOptionsComponent,
                CmsLaunchpadComponent
            ],
            providers: [
                { provide: APP_BASE_HREF, useValue: "/" },
                CmsSettingsService,
                CmsApiService,
                StorageManager,
                TranslateService,
                CmsMiniDisplayService,
                APIRequest,
                AppConfig,
                CmsCanActivateViaAuthorizationService
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents().then(() => {
            router = TestBed.get(Router);
            location = TestBed.get(Location);
            canActiveViaAuthorizationService = TestBed.get(CmsCanActivateViaAuthorizationService);
            spyOn(TestBed.get(CmsApiService), "getSystemInfo").and.returnValue(Observable.of(null));
            fixture = TestBed.createComponent(CmsLaunchpadComponent);
            router.initialNavigation();
        });
    }));

    it("navigate to \"\" redirects you to /login", ((done) => {
        router.navigate([""]).then(() => {
            expect(location.path()).toEqual("/login");
            done();
        });
    }));

    it("navigate to \"about\" redirects you to /login without login", () => {
        router.navigate(["/about"]).then(() => {
            expect(location.path()).toEqual("/login");
        });
    });

    it("navigate to \"about\" redirects you to /about", () => {
        spyOn(canActiveViaAuthorizationService, "canActivate").and.returnValue(true);
        router.navigate(["/about"]).then(() => {
            expect(location.path()).toEqual("/about");
        });
    });

    it("navigate to \"displays-panel\" redirects you to /login without login", ((done) => {
        router.navigate(["/displays-panel"]).then(() => {
            expect(location.path()).toEqual("/login");
            done();
        });
    }));

    it("navigate to \"displays-panel\" redirects you to /displays-panel", () => {
        spyOn(canActiveViaAuthorizationService, "canActivate").and.returnValue(true);
        router.navigate(["/displays-panel"]).then(() => {
            expect(location.path()).toEqual("/displays-panel");
        });
    });

    it("navigate to \"display-panel/:id\" redirects you to /displays-panel without login", () => {
        router.navigate(["/display-panel/1"]).then(() => {
            expect(location.path()).toEqual("/login");
        });
    });

    it("navigate to \"display-panel/:id\" redirects you to /display-panel/1", () => {
        spyOn(canActiveViaAuthorizationService, "canActivate").and.returnValue(true);
        router.navigate(["/display-panel/1"]).then(() => {
            expect(location.path()).toEqual("/display-panel/1");
        });
    });

    it("navigate to \"displays/:id/sources-panel\" redirects you to /login without login", () => {
        router.navigate(["/displays/1/sources-panel"]).then(() => {
            expect(location.path()).toEqual("/login");
        });
    });

    it("navigate to \"displays/:id/sources-panel\" redirects you to /displays/1/sources-panel", () => {
        spyOn(canActiveViaAuthorizationService, "canActivate").and.returnValue(true);
        router.navigate(["/displays/1/sources-panel"]).then(() => {
            expect(location.path()).toEqual("/displays/1/sources-panel");
        });
    });

    it("navigate to \"displays/:id/tiles-panel\" redirects you to /login without login", () => {
        router.navigate(["/displays/1/tiles-panel"]).then(() => {
            expect(location.path()).toEqual("/login");
        });
    });

    it("navigate to \"displays/:id/tiles-panel\" redirects you to /displays/1/tiles-panel", () => {
        spyOn(canActiveViaAuthorizationService, "canActivate").and.returnValue(true);
        router.navigate(["/displays/1/tiles-panel"]).then(() => {
            expect(location.path()).toEqual("/displays/1/tiles-panel");
        });
    });

    it("navigate to \"settings\" redirects you to /login without login", () => {
        router.navigate(["/settings"]).then(() => {
            expect(location.path()).toEqual("/login");
        });
    });

    it("navigate to \"settings\" redirects you to /settings", () => {
        spyOn(canActiveViaAuthorizationService, "canActivate").and.returnValue(true);
        router.navigate(["/settings"]).then(() => {
            expect(location.path()).toEqual("/settings");
        });
    });

    it("navigate to \"settings/language/:key\" redirects you to /login without login", () => {
        router.navigate(["/settings/language/en"]).then(() => {
            expect(location.path()).toEqual("/login");
        });
    });

    it("navigate to \"settings/language/:key\" redirects you to /settings/language/en", () => {
        spyOn(canActiveViaAuthorizationService, "canActivate").and.returnValue(true);
        router.navigate(["/settings/language/en"]).then(() => {
            expect(location.path()).toEqual("/settings/language/en");
        });
    });
});