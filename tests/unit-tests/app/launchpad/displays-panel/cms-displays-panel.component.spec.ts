/**
 * This class is responsible to handle unit test case of CmsDisplaysPanelComponent
 */
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, inject, TestBed } from "@angular/core/testing";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { By } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Observable } from "rxjs/Rx";

import { CmsApiService } from "../../../../app/cms/api/cms-api.service";
import { StorageManager } from "../../../../app/cms/api/cms-storagemanager.service";
import { CMSConstants } from "../../../../app/cms/models/cms-constants";
import { CmsSessionStorageItem } from "../../../../app/cms/models/cms-session-storage-item";
import { AppConfig } from "../../../../app/config";
import { CmsDisplaysPanelComponent } from "../../../../app/launchpad/displays-panel/cms-displays-panel.component";

class MockCmsApiServiceStub {
    public logoutUser(): void {
        // no code required
     }
}

describe("Component: CmsDisplaysPanelComponent", () => {
    let component: CmsDisplaysPanelComponent;
    let fixture: ComponentFixture<CmsDisplaysPanelComponent>;
    let debugInstance: any;
    let nativeElement: any;
    let inputElement: any;
    let storageManager: StorageManager;
    let cmsServerApi: CmsApiService;
    let activatedRoute: ActivatedRoute;

    beforeEach(async(() => {
        activatedRoute = new ActivatedRoute();
        activatedRoute.params = Observable.of({});
        TestBed.configureTestingModule({
            declarations: [CmsDisplaysPanelComponent],
            providers: [
                AppConfig,
                StorageManager,
                TranslateService,
                CmsApiService,
                CmsSessionStorageItem,
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
                HttpClientModule,
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
            fixture = TestBed.createComponent(CmsDisplaysPanelComponent);
            component = fixture.componentInstance;
            nativeElement = fixture.nativeElement;
            debugInstance = fixture.debugElement.componentInstance;

            inputElement = nativeElement.querySelector("#display-list-search-input input");
            spyOn(inputElement, "focus").and.returnValue(Observable.of(CMSConstants.NULL_VALUE));

        });
    }));

    beforeEach(inject([StorageManager, CmsApiService], (response : any, cmsServerApiService : CmsApiService) => {
        storageManager = response;
        cmsServerApi = cmsServerApiService;
    }));

    it("should be a defined component: ", async(() => {
        expect(component).toBeDefined();
        fixture.detectChanges();
        const backButton: DebugElement = fixture.debugElement.query(By.css("#displays-panel-back-button"));
        expect(backButton).toBeFalsy();
    }));

    it("should call onListChanged: ", async(() => {
        debugInstance.onListChanged();
        expect(debugInstance.reloadState).toBe(true);
        fixture.detectChanges();

        const reloadButton : any = document.getElementById("display-panel-reload-button");
        expect(reloadButton).toBeTruthy();
    }));

    it("should call reloadList: ", async(() => {
        debugInstance.reloadList();
        expect(debugInstance.reloadState).toBe(false);

        const reloadButton : any = document.getElementById("display-panel-reload-button");
        expect(reloadButton).toBeNull();

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            setTimeout(() => {
                expect(debugInstance.listState).toBe(true);
            }, 0);
        });
    }));

    it("should initialize search", async(() => {
        debugInstance.initializeSearch();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(inputElement.focus).toHaveBeenCalled();
        });
    }));

    it("should set searchkey as set to session storage", () => {
        // let storageManager = fixture.debugElement.injector.get(StorageManager);
        const searchBox : any = fixture.nativeElement.querySelector("#display-list-search-input");
        expect(searchBox).toBeTruthy();

        const searchString : string = "Display Room";
        searchBox.value = searchString;
        fixture.detectChanges();
        searchBox.dispatchEvent(new Event("keyup"));

        fixture.whenStable().then(() => {
            const delayTime500 : number = 500;
            delay(delayTime500).then(() => {
                expect(debugInstance.searchFilter).toBe(searchString);
                expect(storageManager.getItem(CmsSessionStorageItem.DISPLAYS_SEARCH_FILTER)).toBe(searchString);
            });
        });
    });

    it("should have filter button available with ID === display-panel-favorite-button ", () => {
        // const sm : any = fixture.debugElement.injector.get(StorageManager);
        const favoriteIcon: any = fixture.nativeElement.querySelector("#display-list-favorite-button");
        expect(favoriteIcon).toBeTruthy();

        const favState : boolean = debugInstance.isFavoriteFilter;
        fixture.detectChanges();
        favoriteIcon.dispatchEvent(new Event("ndClick"));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.isFavoriteFilter).toBe(!favState);
            expect(storageManager.getItem(CmsSessionStorageItem.DISPLAYS_FAVORITE_FILTER)).toBe((!favState).toString());
        });
    });
});
