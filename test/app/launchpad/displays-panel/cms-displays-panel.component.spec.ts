import { ComponentFixture, TestBed, async, inject } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ElementRef } from "@angular/core";
import { HttpModule, Http } from "@angular/http";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { Observable } from "rxjs/Rx";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { CmsDisplaysPanelComponent } from "../../../../app/launchpad/displays-panel/cms-displays-panel.component";
import { StorageManager } from "../../../../app/cms/api/cms-storagemanager.service";
import { AppConfig } from "../../../../app/config";
import { CmsApiService } from "../../../../app/cms/api/cms-api.service";
import { CMS_SESSION_STORAGE_ITEM } from "../../../../app/cms/models/cms-session-storage-item";
import { Validation } from "../../../../app/core/util/Validation";

class MockCmsApiServiceStub {
    logoutUser() { }
}

describe("Component: CmsDisplaysPanelComponent", () => {
    let component: CmsDisplaysPanelComponent;
    let fixture: ComponentFixture<CmsDisplaysPanelComponent>;
    let debugInstance, nativeElement, inputElement, translateService;
    let cmsDisplaysPanelComponentInstance;
    let spyPutContentsOnDisplays: jasmine.Spy;

    let storageManager: StorageManager;
    let appConfig: AppConfig;
    let cmsServerApi: CmsApiService;
    let activatedRoute = new ActivatedRoute();
    activatedRoute.params = Observable.of({});

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CmsDisplaysPanelComponent],
            providers: [
                AppConfig,
                StorageManager,
                TranslateService,
                CmsApiService,
                CMS_SESSION_STORAGE_ITEM,
                {
                    provide: ActivatedRoute,
                    useValue: activatedRoute
                },
                {
                    provide: CmsApiService,
                    useClass: MockCmsApiServiceStub
                }
            ],
            imports: [
                HttpModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: (http: Http) => new TranslateHttpLoader(http, "/base/app/i18n/", ".json"),
                        deps: [Http]
                    }
                })
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(CmsDisplaysPanelComponent);
            component = fixture.componentInstance;
            nativeElement = fixture.nativeElement;
            debugInstance = fixture.debugElement.componentInstance;

            inputElement = nativeElement.querySelector("#display-list-search-input input");
            spyOn(inputElement, "focus").and.returnValue(Observable.of(null));

        });
    }));

    beforeEach(inject([StorageManager, CmsApiService], (response, cmsServerApi) => {
        storageManager = response;
        cmsServerApi = cmsServerApi;
    }));

    it("should be a defined component: ", async(() => {
        expect(component).toBeDefined();
        fixture.detectChanges();
        let backButton: DebugElement = fixture.debugElement.query(By.css("#displays-panel-back-button"));
        expect(backButton).toBeFalsy();
    }));

    it("should call onListChanged: ", async(() => {
        debugInstance.onListChanged();
        expect(debugInstance.viewState.reload).toBe(true);
        fixture.detectChanges();

        let reloadButton = document.getElementById("display-panel-reload-button");
        expect(reloadButton).toBeTruthy();
    }));

    it("should call reloadList: ", async(() => {
        debugInstance.reloadList();
        expect(debugInstance.viewState.reload).toBe(false);

        let reloadButton = document.getElementById("display-panel-reload-button");
        expect(reloadButton).toBeNull();

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            setTimeout(() => {
                expect(debugInstance.viewState.list).toBe(true);
            }, 0);
        });
    }));

    it("should call isDisplaySelected: ", async(() => {
        let isDispSelected = debugInstance.isDisplaySelected();
        expect(isDispSelected).toBe(!Validation.IsNull(storageManager.get(CMS_SESSION_STORAGE_ITEM.DISPLAY)));
    }));

    it("should initialize search", async(() => {
        debugInstance.initializeSearch();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(inputElement.focus).toHaveBeenCalled();
        });
    }));

    it("should set searchkey as set to session storage", () => {

        let storageManager = fixture.debugElement.injector.get(StorageManager);
        let searchBox = fixture.nativeElement.querySelector("#display-list-search-input");
        expect(searchBox).toBeTruthy();

        let searchString = "Display Room";
        searchBox.value = searchString;
        fixture.detectChanges();
        searchBox.dispatchEvent(new Event("keyup"));

        fixture.whenStable().then(() => {
            delay(500).then(() => {
                expect(debugInstance.searchFilter).toBe(searchString);
                expect(storageManager.get(CMS_SESSION_STORAGE_ITEM.DISPLAYS_SEARCH_FILTER)).toBe(searchString);
            });
        });
    });

    it("should have filter button available with ID === display-panel-favorite-button ", () => {
        let storageManager = fixture.debugElement.injector.get(StorageManager);
        let favoriteIcon = fixture.nativeElement.querySelector("#display-list-favorite-button");
        expect(favoriteIcon).toBeTruthy();

        let favState = debugInstance.isFavoriteFilter;
        fixture.detectChanges();
        favoriteIcon.dispatchEvent(new Event("ndClick"));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.isFavoriteFilter).toBe(!favState);
            expect(storageManager.get(CMS_SESSION_STORAGE_ITEM.DISPLAYS_FAVORITE_FILTER)).toBe((!favState).toString());
        });
    });
});

