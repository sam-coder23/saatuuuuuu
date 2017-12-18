import { TestBed, async, fakeAsync, ComponentFixture, inject, tick, getTestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, Component, Injector } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { BaseRequestOptions, ConnectionBackend, Http, HttpModule, RequestOptions, Response, ResponseOptions, XHRBackend } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { MaterialModule } from "@angular/material";
import { FormsModule } from "@angular/forms";
import { MockRouterStub } from "../../core/mock-stubs/mock-router-stub";
import { TilePresets } from "../../shared/tile-grid/tile-grid.mock";
import { ITilePreset } from "../../../../app/cms/models/cms-tile-preset";
import { CmsSourcesPanelComponent } from "../../../../app/launchpad/sources-panel/cms-sources-panel.component";
import { StorageManager } from "../../../../app/cms/api/cms-storagemanager.service";
import { CmsSettingsService } from "../../../../app/launchpad/settings/cms-settings.service";
import { CmsApiService } from "../../../../app/cms/api/cms-api.service";
import { AppConfig } from "../../../../app/config";
import { CMSConstants } from "../../../../app/cms/models/cms-constants";
import { CMS_SESSION_STORAGE_ITEM } from "../../../../app/cms/models/cms-session-storage-item";
import { Source } from "../../../../app/cms/models/cms-source";
import { TilePresetManager } from "../../../../app/utils/tilepreset-manager.util";
import { MockTilersData, MockDisplay, MockSources } from "./cms-sources-mock";

/**
* Created mock services to fake real services injected into the CmsSourcesPanelComponent
*/

let activatedRoute = new ActivatedRoute();
activatedRoute.params = Observable.of({
    id: 1
});

/**
 * Fake MockCmsSettingService with the below stub
 */
class MockCmsSettingService {
    selectedSources = [
        {
            "id": 83,
            "name": "Airport Entrance View",
            "description": "",
            "type": "Perspective",
            "width": 1920,
            "height": 1200,
            "snapshotPath": "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F47.jpeg",
            "favorite": false,
            "selected": true
        },
        {
            "id": 88,
            "name": "Airport Entrance",
            "description": "",
            "type": "Perspective",
            "width": 1920,
            "height": 1200,
            "snapshotPath": "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F63.jpeg",
            "favorite": false,
            "selected": true
        }
    ]
};


class MockCmsApiService {
    getTilers(): Observable<ITilePreset[]> {
        return Observable.of(TilePresets);
    }

    putContentsOnDisplay(displayId: number, tilerId: number, body: any) {
        return Observable.of(null);
    }
    getTilePresets(): Observable<ITilePreset[]> {
        return Observable.of(MockTilersData);
    }
    getSelectedDisplayContent(displayId) {
        return Observable.of(MockDisplay);
    }

    logoutUser() {
        return;
    }
};

describe("CmsSourcesPanelComponent", () => {
    let component: CmsSourcesPanelComponent;
    let fixture: ComponentFixture<CmsSourcesPanelComponent>;
    let router: Router;
    let debugInstance, nativeElement;
    let injector: Injector;
    let translateService: TranslateService;
    let storageManager: StorageManager;
    let cmsSettingService: CmsSettingsService;
    let route: ActivatedRoute;
    let panelTitle: string;
    let cmsApiService: CmsApiService;
    let tilePresetManager: TilePresetManager;
    let spyGetTileId;
    let appConfig: AppConfig;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CmsSourcesPanelComponent],
            providers: [
                AppConfig,
                StorageManager,
                TranslateService,
                StorageManager,
                {
                    provide: CmsApiService,
                    useClass: MockCmsApiService
                },
                {
                    provide: Router,
                    useClass: MockRouterStub
                },
                {
                    provide: ActivatedRoute,
                    useValue: activatedRoute
                },
                {
                    provide: CmsSettingsService,
                    useClass: MockCmsSettingService
                },
                TilePresetManager,

            ],
            imports: [
                HttpModule,
                MaterialModule.forRoot(),
                FormsModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: (http: Http) => new TranslateHttpLoader(http, "/base/app/i18n/", ".json"),
                        deps: [Http]
                    }
                })
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(CmsSourcesPanelComponent);
            component = fixture.componentInstance;
            nativeElement = fixture.nativeElement;
            debugInstance = fixture.debugElement.componentInstance;

            injector = getTestBed();
            cmsSettingService = injector.get(CmsSettingsService);
            cmsApiService = injector.get(CmsApiService);
            translateService = injector.get(TranslateService);
            appConfig = injector.get(AppConfig);

            translateService.setDefaultLang("en");
            translateService.get("sourceList.connectTo", { value: CMSConstants.MAXSELECTION }).subscribe((response: string) => {
                panelTitle = response;
            });


        });
    }));

    it("component should be a defined and initialized with default values and elements", () => {
        expect(component).toBeDefined();

        expect(debugInstance.states.list).toBeTruthy();
        expect(debugInstance.states.reload).toBeFalsy();

        let reLoadButton: DebugElement = fixture.debugElement.query(By.css(".sources-panel-reload-button"));
        expect(reLoadButton).toBeFalsy();

        let storageManager = fixture.debugElement.injector.get(StorageManager);
        fixture.detectChanges();

        let expectedSourcesFavoriteFilter = (storageManager.get(CMS_SESSION_STORAGE_ITEM.SOURCES_FAVORITE_FILTER) === "true") || false;
        let expectedSourcesSearchFilter = storageManager.get(CMS_SESSION_STORAGE_ITEM.SOURCES_SEARCH_FILTER) || "";

        expect(expectedSourcesFavoriteFilter).toBe(debugInstance.isFavoriteFilter);
        expect(expectedSourcesSearchFilter).toBe(component.searchFilter);

    });

    it("should have max count === 20", () => {
        component.ngOnInit();
        expect(debugInstance.displayId).not.toBeNaN();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.maxSelection).toBe(CMSConstants.MAXSELECTION);
        });
    });

    it("should show bottom toolbar in case selected source is > 0", () => {
        fixture.detectChanges();
        let bottomToolbar: DebugElement = fixture.debugElement.query(By.css(".page-toolbar.bottom"));
        expect(bottomToolbar).toBeTruthy();

        cmsSettingService.selectedSources = MockSources;
        expect(bottomToolbar).toBeTruthy();
    });

    it("should show selected source count/maxsource in bottom toolbar", () => {
        fixture.detectChanges();
        let bottomToolbar: DebugElement = fixture.debugElement.query(By.css("#sources-panel-bottom-toolbar span:nth-child(1)"));
        let selectedSource = cmsSettingService.selectedSources.length + "/" + CMSConstants.MAXSELECTION
        expect(bottomToolbar.nativeElement.innerText).toBeTruthy(selectedSource);
    });

    it("should have next button and onclick it navigates to next route", async(() => {
        fixture.detectChanges();

        let buttonNext: DebugElement = fixture.debugElement.query(By.css("#sources-panel-next-button"));
        expect(buttonNext).toBeTruthy();
        let router = fixture.debugElement.injector.get(Router);
        let spyNavigateByUrl = spyOn(router, "navigateByUrl").and.returnValue(null);
        buttonNext.triggerEventHandler("ndClick", null);
        expect(spyNavigateByUrl.calls.count()).toEqual(1);
        expect(spyNavigateByUrl.calls.argsFor(0)[0]).toEqual(`/displays/${debugInstance.displayId}/tiles-panel?sourceCount=${cmsSettingService.selectedSources.length}`);

    }));

    it("should have back button and onclick should navigate back", () => {
        fixture.detectChanges();
        let buttonBack: DebugElement = fixture.debugElement.query(By.css("#sources-panel-back-button"));
        expect(buttonBack).toBeTruthy();
        let router = fixture.debugElement.injector.get(Router);
        let spyNavigateByUrl = spyOn(router, "navigateByUrl").and.returnValue(null);
        buttonBack.triggerEventHandler("ndClick", null);
        expect(spyNavigateByUrl.calls.count()).toEqual(1);
        expect(spyNavigateByUrl.calls.argsFor(0)[0]).toEqual(`/displays-panel`);
    });

    it("should set reload to TRUE on list change", () => {
        component.onListChanged();
        expect(debugInstance.states.reload).toBeTruthy();
    });

    it("should set reload and list to FALSE on reload list", () => {
        debugInstance.reloadList();
        expect(debugInstance.states.reload).toBeFalsy();
        expect(debugInstance.states.list).toBeFalsy();
    });

    it("should set searchkey as set to session storage", () => {
        fixture.detectChanges();

        let storageManager = fixture.debugElement.injector.get(StorageManager);
        let searchBox = fixture.nativeElement.querySelector("#sources-panel-search-input");
        expect(searchBox).toBeTruthy();

        let searchString = "testSearchString";
        searchBox.value = searchString;
        fixture.detectChanges();
        searchBox.dispatchEvent(new Event("keyup"));

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            delay(500).then(() => {
                expect(component.searchFilter).toBe(searchString);
                expect(storageManager.get(CMS_SESSION_STORAGE_ITEM.SOURCES_SEARCH_FILTER)).toBe(searchString);
            });
        });
    });

    it("should have filter button available with ID === sources-panel-favorite-button ", () => {
        let storageManager = fixture.debugElement.injector.get(StorageManager);
        let favoriteIcon = fixture.nativeElement.querySelector("#sources-panel-favorite-button");
        expect(favoriteIcon).toBeTruthy();

        let favState = debugInstance.isFavoriteFilter;
        fixture.detectChanges();
        favoriteIcon.dispatchEvent(new Event("ndClick"));

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            delay(500).then(() => {
                expect(debugInstance.isFavoriteFilter).toBe(!favState);
                expect(storageManager.get(CMS_SESSION_STORAGE_ITEM.SOURCES_FAVORITE_FILTER)).toBe((!favState).toString());
            });
        });
    });

    it("should show error message if error comes from Source List", () => {
        fixture.detectChanges();
        debugInstance.errorMessage = "No tile found to share content.";
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            let errorSpan: DebugElement = fixture.debugElement.query(By.css(".error"));
            expect(errorSpan).toBeDefined();
        });
    });

    it("should initialize search and search element should have ID === sources-panel-search-input", () => {
        let searchBox = fixture.nativeElement.querySelector("#sources-panel-search-input input");
        expect(searchBox).toBeTruthy();

        spyOn(searchBox, "focus").and.returnValue(Observable.of(null));
        debugInstance.initializeSearch();

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(searchBox.focus).toHaveBeenCalled();
        });
    });

    it("should call CmsApiService.putContentsOnDisplay when source is selected", (done) => {
        let spyPutContentsOnDisplay = spyOn(cmsApiService, "putContentsOnDisplay").and.returnValue(Observable.of(null));
        fixture.detectChanges();
        component.navigateNext();

        let args = spyPutContentsOnDisplay.calls.mostRecent().args;
        expect(args[0]).toEqual(debugInstance.displayId);
        expect(args[1]).toEqual(MockTilersData[1].id);
        expect(args[2].resources[0].id).toEqual(debugInstance.cmsSettingService.selectedSources[0].id);
        expect(args[2].resources[1].id).toEqual(debugInstance.cmsSettingService.selectedSources[1].id);
        done();
    });

    it("should handle and log error when CmsApiService.putContentsOnDisplay throws error", () => {
        let error = "Server error";
        let spyPutContentsOnDisplay = spyOn(cmsApiService, "putContentsOnDisplay").and.returnValue(Observable.throw(error));
        let spyError = spyOn(appConfig, "error");

        fixture.detectChanges();
        component.navigateNext();
        let args = spyError.calls.mostRecent().args;
        expect(args[0]).toEqual(error);
    });

    it("should navigate to tile-panel directly, if selected sources are same as shared on display", () => {
        let selectedSource = [
            {
                "id": 23,
                "name": "Blue",
                "type": "Perspective"
            },
            {
                "id": 39,
                "name": "DefaultProSource[AutoTestDisplay11]",
                "type": "Perspective"
            }
        ];

        let spyNavigateToTilesPanel = spyOn(debugInstance, "navigateToTilesPanel").and.returnValue(null);
        let spyUpdateDisplayWall = spyOn(debugInstance, "updateDisplayWall").and.returnValue(null);
        let settingService = <CmsSettingsService>fixture.debugElement.injector.get(CmsSettingsService);

        settingService.selectedSources = selectedSource.map((s) => new Source(s));

        component.navigateNext();

        expect(spyNavigateToTilesPanel.calls.count()).toEqual(1);
        expect(spyUpdateDisplayWall.calls.count()).toEqual(0);
    });


    it("should update display wall when navigate next is clicked", () => {
        let spyNavigateToTilesPanel = spyOn(debugInstance, "navigateToTilesPanel").and.returnValue(null);
        let spyUpdateDisplayWall = spyOn(debugInstance, "updateDisplayWall").and.returnValue(null);
        let settingService = <CmsSettingsService>fixture.debugElement.injector.get(CmsSettingsService);

        settingService.selectedSources = [];

        component.navigateNext();

        expect(spyNavigateToTilesPanel.calls.count()).toEqual(0);
        expect(spyUpdateDisplayWall.calls.count()).toEqual(1);
    });

    it("should logoutUser on logout", () => {
        let apiService = <CmsApiService>fixture.debugElement.injector.get(CmsApiService);
        let spyLogoutUser = spyOn(apiService, "logoutUser").and.returnValue(null);

        expect(spyLogoutUser.calls.count()).toEqual(0);

        debugInstance.logout();

        expect(spyLogoutUser.calls.count()).toEqual(1);
    });

    it("should set the errorMessage when there are no tilers", () => {
        cmsSettingService.selectedSources = [];
        let spyTilers = spyOn(cmsApiService, "getTilePresets").and.returnValue(Observable.of([]));
        let errorMessage = "No tile layout found for loading source on display wall.";

        debugInstance.updateDisplayWall();
        expect(debugInstance.errorMessage).toEqual(errorMessage);

        // spyTilers = spyOn(cmsApiService, "getTilePresets").and.returnValue(Observable.throw([]));
        spyTilers.and.returnValue(Observable.throw([]));
        debugInstance.errorMessage = "";

        debugInstance.updateDisplayWall();
        expect(debugInstance.errorMessage).toEqual(errorMessage);
    });
});