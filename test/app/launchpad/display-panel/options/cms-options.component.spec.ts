import { ComponentFixture, TestBed, async, fakeAsync, tick } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA, Injector } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { HttpModule, Http } from "@angular/http";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Subscriber } from "rxjs";

import { MaterialModule, MdIconRegistry, MdUniqueSelectionDispatcher } from "@angular/material";
import { CmsOptionsComponent } from "../../../../../app/launchpad/display-panel/options/cms-options.component";
import { AppConfig } from "../../../../../app/config";
import { CmsApiService } from "../../../../../app/cms/api/cms-api.service";
import { StorageManager } from "../../../../../app/cms/api/cms-storagemanager.service";
import { EventManager } from "../../../../../app/utils/event-manager.util";

class MockCmsApiServiceStub { }
class MockRouterStub { }
class MockAppConfigStub { }

describe("CmsOptionsComponent", () => {
    let component: CmsOptionsComponent;
    let fixture: ComponentFixture<CmsOptionsComponent>;
    let debugInstance, nativeElement;
    let injector: Injector;
    let activatedRoute = new ActivatedRoute();
    let routeParamId = 1;
    let translate: TranslateService, router: Router, cmsApiService: CmsApiService, storageManager: StorageManager, appConfig: AppConfig;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CmsOptionsComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: activatedRoute
                },
                {
                    provide: Router,
                    useClass: MockRouterStub
                },
                {
                    provide: CmsApiService,
                    useClass: MockCmsApiServiceStub
                },
                StorageManager,
                {
                    provide: AppConfig,
                    useClass: MockAppConfigStub
                },
                MdIconRegistry,
                MdUniqueSelectionDispatcher
            ],
            imports: [
                HttpModule,
                MaterialModule.forRoot(),
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: (http: Http) => new TranslateHttpLoader(http, "base/app/i18n/", ".json"),
                        deps: [Http]
                    }
                }),
                RouterModule
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(CmsOptionsComponent);
            component = fixture.componentInstance;
            nativeElement = fixture.nativeElement;
            debugInstance = fixture.debugElement.componentInstance;
            injector = fixture.debugElement.injector;

            activatedRoute.params = Observable.of({
                id: routeParamId
            });

            translate = fixture.debugElement.injector.get(TranslateService);
            router = fixture.debugElement.injector.get(Router);
            cmsApiService = fixture.debugElement.injector.get(CmsApiService);
            storageManager = fixture.debugElement.injector.get(StorageManager);
            appConfig = fixture.debugElement.injector.get(AppConfig);

            translate.use("en");
        });
    }));

    it("Component should be instantiated", () => {
        expect(component instanceof CmsOptionsComponent).toBeTruthy();
        expect(debugInstance.disableOptionOnDisplayUnavailable).toBeFalsy();
    });

    it("Component data should be loaded OnInit", ((done) => {
        storageManager.set("User", JSON.stringify({ username: "bcd-se-test", loggedIn: true }));
        let spyOnSideNavOpen = spyOn(component.sidenav, "open");

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            // userName element
            let userNameElement = fixture.nativeElement.querySelector(".options-username span");
            expect(debugInstance.UserName).toBe("bcd-se-test");
            expect(userNameElement.innerHTML).toBe("bcd-se-test");

            //refresh element
            let refreshLink = fixture.nativeElement.querySelector("#options-refresh-button");
            expect(refreshLink).toBeDefined();
            expect(refreshLink.parentElement.hasAttribute("hidden")).toBeTruthy();

            //zoom link is in disable state
            let zoomLink = fixture.nativeElement.querySelector("#options-zoom-button");
            expect(zoomLink).toBeDefined();
            expect(zoomLink.hasAttribute("disabled")).toBeTruthy();
            expect(zoomLink.parentElement.hasAttribute("hidden")).toBeTruthy();

            // Fit Height Link should not be in disabled state
            let fitHeightLink = fixture.nativeElement.querySelector("#options-fitheight-button");
            expect(fitHeightLink).toBeDefined();
            expect(fitHeightLink.hasAttribute("disabled")).toBeFalsy();
            expect(fitHeightLink.parentElement.hasAttribute("hidden")).toBeTruthy();

            //setting element
            let settingLink = fixture.nativeElement.querySelector("#options-settings-button");
            expect(settingLink).toBeDefined();

            //about element
            let aboutLink = fixture.nativeElement.querySelector("#options-about-button");
            expect(aboutLink).toBeDefined();

            expect(spyOnSideNavOpen).toHaveBeenCalled();
            done();
        });
    }));

    it("Should invoke respective method on click refresh button", () => {
        let refreshLink = fixture.nativeElement.querySelector("#options-refresh-button");
        let spyOnRefresh = spyOn(debugInstance, "refresh");
        refreshLink.dispatchEvent(new Event("click"));

        expect(spyOnRefresh).toHaveBeenCalled();
    });

    it("Should be able to fit height", () => {
        let fitHeightLink = fixture.nativeElement.querySelector("#options-fitheight-button");
        spyOn(component.fitHeightEmitter, "emit");
        fitHeightLink.dispatchEvent(new Event("click"));

        expect(component.fitHeightEmitter.emit).toHaveBeenCalled();
    });

    it("Should have fitHeight disabled link when disableOptionOnDisplayUnavailable=true", () => {
        let fitHeightLink = fixture.nativeElement.querySelector("#options-fitheight-button");
        debugInstance.disableOptionOnDisplayUnavailable = true;
        fixture.detectChanges();

        // Fit Height Link should be in disabled state
        expect(fitHeightLink.hasAttribute("disabled")).toBeTruthy();
    });

    it("Should have settings link and '/settings' as routerLink attribute", () => {
        let settingLink = fixture.nativeElement.querySelector("#options-settings-button");
        expect(settingLink.getAttribute("routerLink")).toBe("/settings");
    });

    it("Should have about link and '/about' as routerLink attribute", () => {
        let aboutLink = fixture.nativeElement.querySelector("#options-about-button");
        expect(aboutLink.getAttribute("routerLink")).toBe("/about");
    });

    it("Should able to close sideNav", () => {
        spyOn(component.closeEmitter, "emit");
        spyOn(EventManager, "removeEvent");
        debugInstance.close();

        expect(component.closeEmitter.emit).toHaveBeenCalled();
        expect(EventManager.removeEvent).toHaveBeenCalledWith("keyup", debugInstance.onKeyUP);
    });

    it("Should close sidenav on Escape keyboard event", () => {
        fixture.detectChanges();
        let spyOnSideNavClose = spyOn(component.sidenav, "close");

        debugInstance.onKeyUP({
            code: "Escape",
            type: "keyup",
            keyCode: 27,
            which: 27
        });

        expect(spyOnSideNavClose).toHaveBeenCalled();
    });
});