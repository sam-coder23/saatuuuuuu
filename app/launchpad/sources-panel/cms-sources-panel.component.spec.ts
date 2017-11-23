
import { CmsSourcesPanelComponent } from "./cms-sources-panel.component";
import { TestBed, async, fakeAsync, ComponentFixture, inject, tick, getTestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, Component, Injector } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { BaseRequestOptions, ConnectionBackend, Http, HttpModule, RequestOptions, Response, ResponseOptions, XHRBackend } from "@angular/http";
import { DomManager } from "../../utils/dom-manager.util";
import { Observable } from "rxjs/Rx";
import { AppConfig } from "../../config";
import { CMS_SESSION_STORAGE_ITEM } from "../../cms/models/cms-session-storage-item";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { MaterialModule } from "@angular/material";
import { FormsModule } from "@angular/forms";
import { CmsApiService } from "../../cms/api/cms-api.service";
import { Source } from "./../../cms/models/cms-source";
import { CmsSourceListComponent } from "./../../shared/source-list/cms-source-list.component";
import { MockRouterStub } from "../../core/mock-stubs/mock-router-stub";
import { ITilePreset } from "../../cms/models/cms-tile-preset";
import { TilePresets } from "../../shared/tile-grid/tile-grid.mock";
import { CmsSettingsService } from "../settings/cms-settings.service";
import { CMSConstants } from "../../cms/models/cms-constants";

class MockCmsApiService {
    getTilers(): Observable<ITilePreset[]> {
        return Observable.of(TilePresets);
    }

    putContentsOnDisplay(displayId: number, tilerId: number, body: any) {
        return Observable.of(null);
    }

}

describe("CmsSourcesPanelComponent", () => {
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
            { id: 1 },
            { id: 2 },
            { id: 3 }
        ]
    }

    let sources: Source[] = [
        {
            id: 548,
            name: "Auto_edited_src11",
            type: "Web",
            description: "Auto_edited_desc",
            snapshotPath: "",
            x: 0,
            y: 0,
            zOrder: -1,
            width: 100,
            height: 200,
            disabled: false,
            favorite: true,
            selected: true
        },
        {
            id: 549,
            name: "Manual_edited_src11",
            type: "Web",
            description: "Auto_edited_desc1",
            snapshotPath: "x/y/z",
            x: 10,
            y: 20,
            zOrder: -1,
            width: 200,
            height: 200,
            disabled: false,
            favorite: true,
            selected: false
        }
    ]


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
    let spyPutContentsOnDisplay: jasmine.Spy;

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
                }
            ],
            imports: [
                HttpModule,
                MaterialModule.forRoot(),
                FormsModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: (http: Http) => new TranslateHttpLoader(http, "base/app/i18n/", ".json"),
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
            spyPutContentsOnDisplay = spyOn(cmsApiService, "putContentsOnDisplay").and.returnValue(Observable.of(null));

            translateService.setDefaultLang("en");
            translateService.get("sourceList.connectTo", { value: CMSConstants.MAXSELECTION }).subscribe((response: string) => {
                panelTitle = response;
            });


        });
    }));

    it("component should be a defined and initialized with default values and elements", () => {
        expect(component).toBeDefined();

        expect(component.mStates.list).toBeTruthy();
        expect(component.mStates.reload).toBeFalsy();

        let reLoadButton: DebugElement = fixture.debugElement.query(By.css(".sources-panel-reload-button"));
        expect(reLoadButton).toBeFalsy();

        let storageManager = fixture.debugElement.injector.get(StorageManager);
        fixture.detectChanges();

        let expectedSourcesFavoriteFilter = (storageManager.get(CMS_SESSION_STORAGE_ITEM.SOURCES_FAVORITE_FILTER) === "true") || false;
        let expectedSourcesSearchFilter = storageManager.get(CMS_SESSION_STORAGE_ITEM.SOURCES_SEARCH_FILTER) || "";

        expect(expectedSourcesFavoriteFilter).toBe(debugInstance.isFavoriteFilter);
        expect(expectedSourcesSearchFilter).toBe(component.searchFilter);

    });

    it("should have max count === 10, also panel title is same as defined pattern and display ID Initialized", () => {
        component.ngOnInit();
        expect(debugInstance.mDisplayId).not.toBeNaN();

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            let panelTitlewithMaxSelection = debugInstance.panelTitle.split("maximum ");
            expect(panelTitlewithMaxSelection[1]).toContain(CMSConstants.MAXSELECTION);
            expect(debugInstance.panelTitle).toEqual("Select sources (maximum " + CMSConstants.MAXSELECTION + ")");
        });
    });

    it("should show bottom toolbar in case selected source is > 0", () => {
        fixture.detectChanges();
        let bottomToolbar: DebugElement = fixture.debugElement.query(By.css(".page-toolbar.bottom"));
        expect(bottomToolbar).toBeTruthy();

        cmsSettingService.selectedSources = sources;
        expect(bottomToolbar).toBeTruthy();
    });

    it("should show selected source count/maxsource in bottom toolbar", () => {
        fixture.detectChanges();
        let bottomToolbar: DebugElement = fixture.debugElement.query(By.css("#sources-panel-bottom-toolbar span:nth-child(1)"));
        let selectedSource = cmsSettingService.selectedSources.length + "/" + CMSConstants.MAXSELECTION

        expect(bottomToolbar.nativeElement.innerText).toBeTruthy(selectedSource);
    });

    it("should have next button and onclick it navigates to next route", () => {
        fixture.detectChanges();

        let buttonNext: DebugElement = fixture.debugElement.query(By.css("#sources-panel-next-button"));
        expect(buttonNext).toBeTruthy();

        let router = fixture.debugElement.injector.get(Router);
        let spyNavigateByUrl = spyOn(router, "navigateByUrl").and.returnValue(null);

        buttonNext.triggerEventHandler("click", null);

        expect(spyNavigateByUrl.calls.count()).toEqual(1);
        expect(spyNavigateByUrl.calls.argsFor(0)[0]).toEqual(`/displays/${debugInstance.mDisplayId}/tiles-panel?sourceCount=${cmsSettingService.selectedSources.length}`);
    });

    it("should have back button and onclick should navigate back", () => {
        fixture.detectChanges();

        let buttonBack: DebugElement = fixture.debugElement.query(By.css("#sources-panel-back-button"));
        expect(buttonBack).toBeTruthy();

        let router = fixture.debugElement.injector.get(Router);
        let spyNavigateByUrl = spyOn(router, "navigateByUrl").and.returnValue(null);

        buttonBack.triggerEventHandler("click", null);

        expect(spyNavigateByUrl.calls.count()).toEqual(1);
        expect(spyNavigateByUrl.calls.argsFor(0)[0]).toEqual(`/displays-panel`);
    });



    it("should set reload to TRUE on list change", () => {
        component.onListChanged();
        expect(component.mStates.reload).toBeTruthy();
    });

    it("should set reload and list to FALSE on reload list", () => {
        component.reloadList();
        expect(component.mStates.reload).toBeFalsy();
        expect(component.mStates.list).toBeFalsy();
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
        favoriteIcon.dispatchEvent(new Event("click"));

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

    it("should initialize search and search element should have ID === sources-panel-search-input", async(() => {
        let searchBox = fixture.nativeElement.querySelector("#sources-panel-search-input input");
        expect(searchBox).toBeTruthy();

        spyOn(searchBox, "focus").and.returnValue(Observable.of(null));
        debugInstance.initializeSearch();

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(searchBox.focus).toHaveBeenCalled();
        });
    }));

    it("should call CmsApiService.putContentsOnDisplay when source is selected", () => {
        fixture.detectChanges();
        component.navigateNext();
        let args = spyPutContentsOnDisplay.calls.mostRecent().args;
        expect(args[0]).toEqual(debugInstance.mDisplayId);
        expect(args[1]).toEqual(debugInstance.tileId);
        expect(args[2].resources).toEqual(debugInstance.cmsSettingService.selectedSources);
    });
})