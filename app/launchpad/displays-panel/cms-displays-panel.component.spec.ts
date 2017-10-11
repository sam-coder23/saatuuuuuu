import { CmsDisplaysPanelComponent } from "./cms-displays-panel.component";
import { ComponentFixture, TestBed, async, inject } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ElementRef } from "@angular/core";
import { HttpModule, Http } from "@angular/http";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { CmsApiService } from "../../cms/api/cms-api.service";
import { CMS_SESSION_STORAGE_ITEM } from "../../cms/models/cms-session-storage-item";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { Observable } from "rxjs/Rx";
import { AppConfig } from "../../config";
import { Router } from "@angular/router";
import { Display } from "../../cms/models/cms-display";

describe("Component: CmsDisplaysPanelComponent", () => {
    let component: CmsDisplaysPanelComponent;
    let fixture: ComponentFixture<CmsDisplaysPanelComponent>;
    let debugInstance, nativeElement, inputElement, translateService;
    let cmsDisplaysPanelComponentInstance;
    let spyPutContentsOnDisplays: jasmine.Spy;

    let storageManager: StorageManager;
    let appConfig: AppConfig;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CmsDisplaysPanelComponent],
            providers: [
                AppConfig,
                StorageManager,
                TranslateService,
                CmsApiService,
                CMS_SESSION_STORAGE_ITEM
            ],
            imports: [
                HttpModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: (http: Http) => new TranslateHttpLoader(http, "/app/i18n", ".json"),
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

    beforeEach(inject([StorageManager], (response) => {
        storageManager = response;
    }));

    it("should be a defined component: ", async(() => {
        expect(component).toBeDefined();
    }));

    it("should call onListChanged: ", async(() => {
        component.onListChanged();
        cmsDisplaysPanelComponentInstance = new CmsDisplaysPanelComponent(storageManager, appConfig);
        let isDispSelected = cmsDisplaysPanelComponentInstance.isDisplaySelected();
        expect(debugInstance.viewState.reload).toBe(true);
        expect(debugInstance.viewState.back).toBe(isDispSelected);
        fixture.detectChanges();

        let reloadButton = document.getElementById("display-panel-reload-button");
        expect(reloadButton).toBeTruthy();
    }));

    it("should call reloadList: ", async(() => {
        component.reloadList();
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
        let isDispSelected = cmsDisplaysPanelComponentInstance.isDisplaySelected();
        expect(isDispSelected).toBe(false);
    }));

    it("should initialize search", async(() => {
        cmsDisplaysPanelComponentInstance.initializeSearch();
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
                expect(component.searchFilter).toBe(searchString);
                expect(storageManager.get(CMS_SESSION_STORAGE_ITEM.DisplaysSearchFilter)).toBe(searchString);

            });
        });
    });

    it("should have filter button available with ID === display-panel-favorite-button ", () => {
        let storageManager = fixture.debugElement.injector.get(StorageManager);
        let favoriteIcon = fixture.nativeElement.querySelector("#display-list-favorite-button");
        expect(favoriteIcon).toBeTruthy();

        let favState = debugInstance.isFavoriteFilter;
        fixture.detectChanges();
        favoriteIcon.dispatchEvent(new Event("click"));
        fixture.whenStable().then(() => {
            delay(500).then(() => {
                expect(debugInstance.isFavoriteFilter).toBe(!favState);
                expect(storageManager.get(CMS_SESSION_STORAGE_ITEM.DisplaysFavoriteFilter)).toBe((!favState).toString());
            });
        });
    });

})

