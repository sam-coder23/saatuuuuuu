/**
 * This class is responsible to handle unit test case of CmsSourcesPanelComponent
 */
import {  Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, Injector, NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, getTestBed, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { By } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Observable } from "rxjs/Rx";

import { CmsApiService } from "../../../../app/cms/api/cms-api.service";
import { StorageManager } from "../../../../app/cms/api/cms-storagemanager.service";
import { CMSConstants } from "../../../../app/cms/models/cms-constants";
import { CmsSessionStorageItem } from "../../../../app/cms/models/cms-session-storage-item";
import { ITilePreset } from "../../../../app/cms/models/cms-tile-preset";
import { AppConfig } from "../../../../app/config";
import { CmsSettingsService } from "../../../../app/launchpad/settings/cms-settings.service";
import { CmsSourcesPanelComponent } from "../../../../app/launchpad/sources-panel/cms-sources-panel.component";
import { CmsSourceListComponent } from "../../../../app/shared/source-list/cms-source-list.component";
import { TilePresetManager } from "../../../../app/utils/tilepreset-manager.util";
import { MockRouterStub } from "../../core/mock-stubs/mock-router.stub";
import { tilePresets } from "./../../core/mock-stubs/tile-grid.mock";
import { MockCmsApiService } from "./mock-cms-api-service";

let activatedRoute: ActivatedRoute;

/**
 * Fake MockCmsSettingService with the below stub
 */

@Component({
    selector: "cms-source-list",
    template: ""
})

class MockSourceListComponent {
    public spyClearWall: jasmine.Spy = jasmine.createSpy("clearSelectedSourceList").and.returnValue(undefined);
    public clearSelectedSourceList(): undefined {
        return undefined;
    }
}
// tslint:disable:max-classes-per-file
class MockCmsSettingService {
    public selectedSources: any[] = [
        {
            id: 2,
            name: "ECU-100: NOIVUL-ECU01: Analog: Bus-11 : Input-0",
            description: "",
            type: "Perspective",
            width: 1600,
            height: 900,
            snapshotPath: "display_snapshot.jpg",
            favorite: false,
            selected: true
        },
        {
            id: 3,
            name: "ECU-100: NOIVUL-ECU01: Analog: Bus-11 : Input-1",
            description: "",
            type: "Perspective",
            width: 1600,
            height: 900,
            snapshotPath: "display_snapshot.jpg",
            favorite: false,
            selected: true
        }
    ];
    public sourcesOnDisplay: any[]= [
        {
            id: 238,
            name: "DefaultProSource[AutoTestDisplay11]",
            type: "Perspective",
            resourceId: 39,
            x: 0,
            y: 0,
            width: 640,
            height: 540,
            snapshotPath: "display_snapshot.jpg",
            zOrder: 1
        },
        {
            id: 141,
            name: "Blue",
            type: "Perspective",
            resourceId: 23,
            x: 640,
            y: 0,
            width: 640,
            height: 540,
            snapshotPath: "display_snapshot.jpg",
            zOrder: 2
        }
    ];
}

describe("CmsSourcesPanelComponent", () => {
    let component: CmsSourcesPanelComponent;
    let fixture: ComponentFixture<CmsSourcesPanelComponent>;
    let router: Router;
    let debugInstance: any;
    let nativeElement: any;
    let injector: Injector;
    let translateService: TranslateService;
    // const storageManager: StorageManager;
    let cmsSettingService: CmsSettingsService;
    let panelTitle: string;
    let cmsApiService: CmsApiService;
    let appConfig: AppConfig;
    // let sourceRepositionUtility: SourceRepositionUtility;
    const delayTime500: number = 500;
    activatedRoute = new ActivatedRoute();

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CmsSourcesPanelComponent,
            MockSourceListComponent],
            providers: [
                AppConfig,
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
                TilePresetManager

            ],
            imports: [
                HttpClientModule,
                FormsModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: (http: HttpClient): TranslateHttpLoader => new TranslateHttpLoader(http, "/base/app/i18n/", ".json"),
                        deps: [HttpClient]
                    }
                })
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
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
            router = injector.get(Router);

            translateService.setDefaultLang("en");
            translateService.get("sourceList.connectTo", { value: CMSConstants.MAXSELECTION }).subscribe((response: string) => {
                panelTitle = response;
            });
            activatedRoute.params = Observable.of({
                id: 1
            });
        });
    }));

    it("component should be a defined and initialized with default values and elements", () => {
        expect(component).toBeDefined();

        expect(debugInstance.listState).toBeTruthy();
        expect(debugInstance.reloadState).toBeFalsy();

        const reLoadButton: DebugElement = fixture.debugElement.query(By.css(".sources-panel-reload-button"));
        expect(reLoadButton).toBeFalsy();

        const storageManager: any = fixture.debugElement.injector.get(StorageManager);
        fixture.detectChanges();

        const expectedSourcesFavoriteFilter: boolean = (storageManager.getItem(CmsSessionStorageItem.SOURCES_FAVORITE_FILTER) === "true") || false;
        const expectedSourcesSearchFilter: string = storageManager.getItem(CmsSessionStorageItem.SOURCES_SEARCH_FILTER) || "";

        expect(expectedSourcesFavoriteFilter).toBe(debugInstance.isFavoriteFilter);
        expect(expectedSourcesSearchFilter).toBe(debugInstance.searchFilter);

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
        const bottomToolbar: DebugElement = fixture.debugElement.query(By.css(".page-toolbar.bottom"));
        expect(bottomToolbar).toBeTruthy();
    });

    it("should show selected source count/maxsource in bottom toolbar", () => {
        fixture.detectChanges();
        const bottomToolbar: DebugElement = fixture.debugElement.query(By.css("#sources-panel-bottom-toolbar span:nth-child(1)"));
        const selectedSource: string = (cmsSettingService.selectedSources.length.toString()).concat("/").concat(CMSConstants.MAXSELECTION.toString());
        expect(bottomToolbar.nativeElement.innerText).toBeTruthy(selectedSource);
    });

    it("should have next button appeared to share the sources", async(() => {
        fixture.detectChanges();
        const buttonShare: DebugElement = fixture.debugElement.query(By.css("#sources-panel-next-button"));
        expect(buttonShare).toBeTruthy();
    }));

    it("should have raised clear wall popup", () => {
        fixture.detectChanges();
        const buttonBack: any = nativeElement.querySelector("#sources-panel-back-button");
        expect(buttonBack).toBeTruthy();
        buttonBack.dispatchEvent(new Event("ndClick"));
        expect(debugInstance.showClearWallPopup).toBeTruthy();
    });

    it("should have back button and onclick should navigate back", () => {
        fixture.detectChanges();
        const buttonBack: any = nativeElement.querySelector("#layouts-panel-back-button");
        expect(buttonBack).toBeTruthy();
        const spyNavigateByUrl: jasmine.Spy = spyOn(router, "navigateByUrl");
        buttonBack.dispatchEvent(new Event("ndClick"));
        expect(spyNavigateByUrl.calls.argsFor(0)[0]).toEqual(`/home/${debugInstance.displayId}`);
    });

    it("should set reload to TRUE on list change", () => {
        component.onListChanged();
        expect(debugInstance.reloadState).toBeTruthy();
    });

    it("should set reload and list to FALSE on reload list", () => {
        debugInstance.reloadList();
        expect(debugInstance.reloadState).toBeFalsy();
        expect(debugInstance.listState).toBeFalsy();
    });

    it("should set searchkey as set to session storage", () => {
        fixture.detectChanges();

        const storageManager: any = fixture.debugElement.injector.get(StorageManager);
        const searchBox: any = fixture.nativeElement.querySelector("#sources-panel-search-input");
        expect(searchBox).toBeTruthy();

        const searchString: string = "testSearchString";
        searchBox.value = searchString;
        fixture.detectChanges();
        searchBox.dispatchEvent(new Event("keyup"));

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            delay(delayTime500).then(() => {
                expect(debugInstance.searchFilter).toBe(searchString);
                expect(storageManager.getItem(CmsSessionStorageItem.SOURCES_SEARCH_FILTER)).toBe(searchString);
            });
        });
    });

    it("should have filter button available with ID === sources-panel-favorite-button ", () => {
        const storageManager: any = fixture.debugElement.injector.get(StorageManager);
        const favoriteIcon: any = fixture.nativeElement.querySelector("#sources-panel-favorite-button");
        expect(favoriteIcon).toBeTruthy();

        const favState: boolean = debugInstance.isFavoriteFilter;
        fixture.detectChanges();
        favoriteIcon.dispatchEvent(new Event("ndClick"));

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            delay(delayTime500).then(() => {
                expect(debugInstance.isFavoriteFilter).toBe(!favState);
                expect(storageManager.getItem(CmsSessionStorageItem.SOURCES_FAVORITE_FILTER)).toBe((!favState).toString());
            });
        });
    });

    it("should show error message if error comes from Source List", () => {
        fixture.detectChanges();
        debugInstance.errorMessage = "No tile found to share content.";
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const errorSpan: DebugElement = fixture.debugElement.query(By.css(".error"));
            expect(errorSpan).toBeDefined();
        });
    });

    it("should initialize search and search element should have ID === sources-panel-search-input", () => {
        const searchBox: any = fixture.nativeElement.querySelector("#sources-panel-search-input input");
        expect(searchBox).toBeTruthy();

        spyOn(searchBox, "focus").and.returnValue(Observable.of(undefined));
        debugInstance.initializeSearch();

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(searchBox.focus).toHaveBeenCalled();
        });
    });

    it("should set cancelClearWallPopup to False on list change", () => {
        debugInstance.cancelClearWallPopup();
        expect(debugInstance.showClearWallPopup).toBeFalsy();
    });

    it("should set closingClearWallPopup to False on list change", () => {
        debugInstance.closingClearWallPopup();
        expect(debugInstance.showClearWallPopup).toBeFalsy();
    });

    it("should showsource", () => {
        const showSourcesButton: any = fixture.nativeElement.querySelector("#sources-panel-next-button");
        expect(showSourcesButton).toBeTruthy();

        const shareTheSources: jasmine.Spy = spyOn(debugInstance, "shareTheSources");
        showSourcesButton.dispatchEvent(new Event("ndClick"));

        expect(shareTheSources.calls.count()).toEqual(1);
    });

    it("should showsource called", () => {
        const putContentsOnDisplay: jasmine.Spy = spyOn(cmsApiService, "putContentsOnDisplay").and.returnValue(Observable.of(undefined));
        debugInstance.shareTheSources();
        expect(putContentsOnDisplay.calls.count()).toEqual(1);
    });

    it("should call putContentsOnDisplay when sourcesOnDisplay is empty called", () => {
        const putContentsOnDisplay: jasmine.Spy = spyOn(cmsApiService, "putContentsOnDisplay").and.returnValue(Observable.of(undefined));
        cmsSettingService.sourcesOnDisplay = [];
        //Need further enhancement to complete the coverage
        // let SourceRepositionUtility = spyOn(SourceRepositionUtility, "stickySources");
        debugInstance.shareTheSources();
        expect(putContentsOnDisplay.calls.count()).toEqual(1);
    });

    it("clearMiniDisplayWall should set showClearWallPopup to FALSE", () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const clearWallBtn: HTMLElement = nativeElement.querySelector("#sources-panel-back-button");
            expect(clearWallBtn).not.toBeNull();
            clearWallBtn.dispatchEvent(new Event("ndClick"));
            expect(debugInstance.showClearWallPopup).toBeTruthy();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const popup: any = nativeElement.querySelector("nd-popup");
                const popupBody: any = nativeElement.querySelector("nd-popup popup-body");
                expect(popup).not.toBeNull();
                popup.dispatchEvent(new Event("done"));
                expect(debugInstance.cmsSettingService.selectedSources.length).toEqual(0);
                expect(debugInstance.showClearWallPopup).toBeFalsy();
            });
        });
    });

    it("should not close popup if error occurs while updating display Content", () => {
        const clearWallBtn: HTMLElement = nativeElement.querySelector("#sources-panel-back-button");
        expect(clearWallBtn).not.toBeNull();
        clearWallBtn.dispatchEvent(new Event("ndClick"));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.showClearWallPopup ).toBeTruthy();
            debugInstance.displayId = -1;
            debugInstance.clearMiniDisplayWall();
            expect(debugInstance.cmsSettingService.selectedSources.length).not.toEqual(0);
        });
    });

});
