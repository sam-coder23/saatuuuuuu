/** 
 * AS PER THE NEW REQUIREMENTS, REFRESH, FIT HEIGHT, ZOOM LINKS ARE HIDDEN, BUT NO CHANGE IN TEST CASES.
 * 
 * 
 * Test cases:
 * 
 * ## Constructor ##
 * disableOptionOnDisplayUnavailable should be false;
 * 
 * 
 * ## ngOnInit ##
 * should add keyup event to listen 'Escape key' press
 * sidenav.open should be called
 * displayId should be set;
 * UserName should be display in UI
 * Zoom level should be defined in UI
 * 
 * 
 * ## Refresh ##
 * expect refresh link
 * 
 * 
 * ## Fit Height ## 
 * Should have fitHeight link and OnClick should able to fit height;
 * Should have fitHeight disabled link when disableOptionOnDisplayUnavailable=true;
 * 
 * 
 * ## Other Links ##
 * Should have settings link and '/settings' as routerLink attribute;
 * Should have about link and '/about' as routerLink attribute;
 * 
 * 
 * ## SideNav ## 
 * Should able to close sideNav
 * Should close sidenav on Escape keyboard event
 * 
 * 
 */


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
                    provide: cmsApiService,
                    useClass: MockCmsApiServiceStub
                },
                storageManager,
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

        // Fit Height Link should not be in disabled state
        let fitHeightLink = fixture.nativeElement.querySelector("#options-fitheight-button");
        expect(fitHeightLink).toBeDefined();
        expect(fitHeightLink.hasAttribute("disabled")).toBeFalsy();
    });

    it("Component data should be loaded OnInit", () => {
        storageManager.set("User", JSON.stringify({ username: "bcd-se-test", loggedIn: true }));
        spyOn(EventManager, "addEvent");
        let spyOnSideNavOpen = spyOn(component.sidenav, "open");

       fixture.detectChanges();

        fixture.whenStable().then(() => {
            let userNameElement = fixture.nativeElement.querySelector(".options-username span");
            expect(userNameElement.innerHTML).toBe("bcd-se-test");

            //zoom link is in disable state
            let zoomLink = fixture.nativeElement.querySelector("#options-zoom-button");
            expect(zoomLink).toBeDefined();
            expect(zoomLink.hasAttribute("disabled")).toBeTruthy();

            expect(EventManager.addEvent).toHaveBeenCalledWith("keyup", debugInstance.onKeyUP);;
            expect(spyOnSideNavOpen).toHaveBeenCalled();
        });
    });

    it("Should able to get Username as 'bcd-se-test'", () => {
        expect(debugInstance.UserName).toBe("bcd-se-test");
    });

    it("Should have refresh link", () => {
        let refreshLink = fixture.nativeElement.querySelector("#options-refresh-button");
        expect(refreshLink).toBeDefined();
    });

    it("Should have fitHeight link and OnClick should able to fit height", () => {
        let fitHeightLink = fixture.nativeElement.querySelector("#options-fitheight-button");
        expect(fitHeightLink).toBeDefined();

        spyOn(component.fitHeightEmitter, "emit");
        fitHeightLink.dispatchEvent(new Event("click"));

        expect(component.fitHeightEmitter.emit).toHaveBeenCalled();
    });

    it("Should have fitHeight disabled link when disableOptionOnDisplayUnavailable=true", () => {
        debugInstance.disableOptionOnDisplayUnavailable = true;
        fixture.detectChanges();

        // Fit Height Link should be in disabled state
        let fitHeightLink = fixture.nativeElement.querySelector("#options-fitheight-button");
        expect(fitHeightLink).toBeDefined();
        expect(fitHeightLink.hasAttribute("disabled")).toBeTruthy();
    });

    it("Should have settings link and '/settings' as routerLink attribute", () => {
        let settingsLink = fixture.nativeElement.querySelector("#options-settings-button");
        expect(settingsLink).toBeDefined();

        let routerAttr = settingsLink.getAttribute("routerLink");
        expect(routerAttr).toBe("/settings");
    });

    it("Should have about link and '/about' as routerLink attribute", () => {
        let settingsLink = fixture.nativeElement.querySelector("#options-about-button");
        expect(settingsLink).toBeTruthy();

        let routerAttr = settingsLink.getAttribute("routerLink");
        expect(routerAttr).toBe("/about");
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