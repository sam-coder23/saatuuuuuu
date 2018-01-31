/**
 * This class is responsible to handle unit test case of CmsHomePanelComponent
 */
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, ElementRef, NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, inject, TestBed } from "@angular/core/testing";
import { Http, HttpModule } from "@angular/http";
import { MdMenuModule, OVERLAY_PROVIDERS } from "@angular/material";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Observable } from "rxjs/Observable";

import { APIRequest } from "../../../../app/cms/api/api-request";
import { CmsApiService } from "../../../../app/cms/api/cms-api.service";
import { StorageManager } from "../../../../app/cms/api/cms-storagemanager.service";
import { CMSConstants } from "../../../../app/cms/models/cms-constants";
import { Display } from "../../../../app/cms/models/cms-display";
import { Source } from "../../../../app/cms/models/cms-source";
import { AppConfig } from "../../../../app/config";
import { CmsHomePanelComponent } from "../../../../app/launchpad/home/cms-home-panel.component";
import { CmsSettingsService } from "../../../../app/launchpad/settings/cms-settings.service";
import { MockRouterStub } from "../../core/mock-stubs/mock-router.stub";

const mockDisplayData: Display = {
    favorite: true,
    id: 1,
    name: "Crisis room wall",
    description: "",
    snapshotPath: "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fdisplays%2F1.jpeg",
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
            height: 1200,
            x: 0,
            y: 0
        }
    ],
    content: [
        {
            id: 9,
            name: "Auto_edited_src11",
            type: "Perspective",
            description: "",
            lastModified: "",
            absoluteSize: {
                left: 0,
                top: 0,
                width: 1600,
                height: 1200,
                x: 0,
                y: 0
            },
            disabled: false,
            favorite: false,
            resourceId: 17,
            x: 0,
            y: 0,
            width: 1600,
            height: 1200,
            snapshotPath: "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F17.jpeg",
            zOrder: 1
        }
    ],
    width: 0,
    height: 0,
    disabled: false
};

const mockSelectedSources: Source[] = [{
    description: "",
    favorite: false,
    height: 450,
    id: 17,
    name: "ECU-100: NOIVUL-ECU01: Analog: Bus-11 : Input-1",
    selected: true,
    snapshotPath: "",
    type: "perspective",
    width: 600,
    x: 0,
    y: 0,
    zOrder: 1,
    disabled: false
}];

class MockCmsApiService {
    public logout(): Observable<string> {
        return Observable.of("LOGOUT");
    }

    public putContentsOnDisplay(displayId: number, tilerId: number, body: any): Observable<any> {
        // tslint:disable-next-line:no-null-keyword
        if (displayId === null) {
            return Observable.throw(CMSConstants.NULL_VALUE);
        } else {
            return Observable.of(CMSConstants.NULL_VALUE);
        }
    }

    public getSelectedDisplayContent(displayId: number): Observable<Display> {
        return Observable.of(mockDisplayData);
    }
}

describe("Component: CmsHomePanelComponent", () => {
    let component: CmsHomePanelComponent;
    let fixture: ComponentFixture<CmsHomePanelComponent>;
    let debugInstance: any;
    let cmsApiService: CmsApiService;
    let cmsSettingsService: CmsSettingsService;
    let routerService: Router;
    let spyNavigateRouter: jasmine.Spy;
    let spyNavigateByUrlRouter: jasmine.Spy;
    const selectedDisplayId: number = 4;
    let activatedRoute: ActivatedRoute;

    beforeEach(async(() => {
        activatedRoute = new ActivatedRoute();
        activatedRoute.params = Observable.of({
            displayId: selectedDisplayId
        });
        TestBed.configureTestingModule({
            declarations: [CmsHomePanelComponent],
            providers: [
                OVERLAY_PROVIDERS,
                TranslateService,
                CmsSettingsService,
                APIRequest,
                AppConfig,
                StorageManager,
                {
                    provide: Router,
                    useClass: MockRouterStub
                },
                {
                    provide: ActivatedRoute,
                    useValue: activatedRoute
                },
                {
                    provide: CmsApiService,
                    useClass: MockCmsApiService
                }
            ],
            imports: [
                HttpModule,
                MdMenuModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: (http: Http): TranslateHttpLoader => new TranslateHttpLoader(http, "/base/app/i18n/", ".json"),
                        deps: [Http]
                    }
                })
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(CmsHomePanelComponent);
            component = fixture.componentInstance;
            debugInstance = fixture.debugElement.componentInstance;
            cmsApiService = fixture.debugElement.injector.get(CmsApiService);
            cmsSettingsService = fixture.debugElement.injector.get(CmsSettingsService);
            routerService = fixture.debugElement.injector.get(Router);
            spyNavigateRouter = spyOn(routerService, "navigate");
            spyNavigateByUrlRouter = spyOn(routerService, "navigateByUrl");
        });
    }));

    /**
     * Fix for bug in mdMenu lifecycle(ngOnDestroy)
     * For detailed description,
     * Refer: https://github.com/angular/material2/issues/1913
     */
    afterEach(() => {
        fixture.detectChanges();
    });

    it("should be a defined component", async(() => {
        expect(component).toBeDefined();
    }));

    it("should set displayId and enable/disable options as per the number of selectedSources", async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.displayId).toEqual(selectedDisplayId);
            expect(debugInstance.isDisabled).toBeFalsy();

            // Store mock data, so that we do not lose our mock data and it can be set again later
            const displayData : object = Object.assign([], mockDisplayData.content);
            // Modifying mock data to generate the test condition
            mockDisplayData.content.length = 0;
            debugInstance.ngOnInit();
            expect(debugInstance.isDisabled).toBeTruthy();
            // Set modified mock data back to original mock data
            mockDisplayData.content = Object.assign([], displayData);
        });
    }));

    it("should be able to clear Mini Display", async(() => {
        const spyNavigateToLogin: jasmine.Spy = spyOn(debugInstance, "navigateToLogin");
        cmsSettingsService.selectedSources = Object.assign([], mockSelectedSources);
        debugInstance.clearMiniDisplayWall();
        expect(cmsSettingsService.selectedSources.length).toEqual(0);
        expect(spyNavigateToLogin.calls.count()).toEqual(1);
        expect(debugInstance.showClearWallPopup).toEqual(false);
    }));

    it("should throw error while invoking putContentsOnDisplay API", async(() => {
        cmsSettingsService.selectedSources = Object.assign([], mockSelectedSources);
        debugInstance.displayId = CMSConstants.NULL_VALUE;
        debugInstance.clearMiniDisplayWall();
        expect(cmsSettingsService.selectedSources.length).not.toEqual(0);
        expect(debugInstance.showClearWallPopup).toEqual(false);
    }));

    it("should navigate to Source Panel Component", async(() => {
        fixture.detectChanges();
        debugInstance.navigateToSource();
        expect(spyNavigateRouter).toHaveBeenCalledWith([`/displays/${selectedDisplayId}/sources-panel`]);
    }));

    it("should navigate to Layout Panel Component", async(() => {
        fixture.detectChanges();
        debugInstance.navigateToLayout();
        expect(spyNavigateByUrlRouter).toHaveBeenCalledWith(`/displays/${selectedDisplayId}/tiles-panel?sourceCount=${mockSelectedSources.length}`);
    }));

    it("should navigate to Reposition Panel Component", async(() => {
        fixture.detectChanges();
        debugInstance.navigateToResposition();
        expect(spyNavigateByUrlRouter).toHaveBeenCalledWith(`display-panel/${selectedDisplayId}`);
    }));

    it("should navigate to Settings Panel Component", async(() => {
        debugInstance.navigateToSettings();
        expect(spyNavigateRouter).toHaveBeenCalledWith(["/settings"]);
    }));

    it("should navigate to About Panel Component", async(() => {
        debugInstance.navigateToAbout();
        expect(spyNavigateRouter).toHaveBeenCalledWith(["/about"]);
    }));

    it("should show clear wall popup while log off if atleast one source is selected", async(() => {
        fixture.detectChanges();
        debugInstance.userLogoff();
        expect(debugInstance.showClearWallPopup).toBeTruthy();
    }));

    it("should directly log off if no source is selected", async(() => {
        const spyNavigateToLogin: jasmine.Spy = spyOn(debugInstance, "navigateToLogin");
        debugInstance.selectedSourcesLength = 0;
        debugInstance.userLogoff();
        expect(debugInstance.showClearWallPopup).toBeFalsy();
        expect(spyNavigateToLogin.calls.count()).toEqual(1);
    }));

    it("should hide clearWall popup and navigate to login page when cancel button is clicked in clearWall popup", async(() => {
        const spyNavigateToLogin: jasmine.Spy = spyOn(debugInstance, "navigateToLogin");
        debugInstance.showClearWallPopup = true;
        debugInstance.cancelClearWallPopup();
        expect(debugInstance.showClearWallPopup).toBeFalsy();
        expect(spyNavigateToLogin.calls.count()).toEqual(1);
    }));

    it("should hide clearWall popup and remain on the HomePanel when close button is clicked in clearWall popup", async(() => {
        debugInstance.showClearWallPopup = true;
        debugInstance.closingClearWallPopup();
        expect(debugInstance.showClearWallPopup).toBeFalsy();
    }));

    it("should navigate to login page", async(() => {
        const spyNavigateToLogin: jasmine.Spy = spyOn(cmsApiService, "logout").and.returnValue(Observable.of(""));
        debugInstance.navigateToLogin();
        expect(spyNavigateToLogin.calls.count()).toEqual(1);
    }));

});
