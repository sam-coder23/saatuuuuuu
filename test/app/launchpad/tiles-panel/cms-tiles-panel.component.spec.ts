import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { HttpModule, Http } from "@angular/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { MockRouterStub } from "../../core/mock-stubs/mock-router.stub";
import { CmsTilesPanelComponent } from "../../../../app/launchpad/tiles-panel/cms-tiles-panel.component";
import { AppConfig } from "../../../../app/config";
import { CmsApiService } from "../../../../app/cms/api/cms-api.service";

class MockCmsApiServiceStub {
}

describe("CmsTilesPanelComponent - Test Suite", () => {
    let component: CmsTilesPanelComponent;
    let fixture: ComponentFixture<CmsTilesPanelComponent>;
    let debugInstance, nativeElement;
    let activatedRoute = new ActivatedRoute();
    activatedRoute.params = Observable.of({
        id: 1
    });

    activatedRoute.queryParams = Observable.of({
        sourceCount: 1
    });


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CmsTilesPanelComponent],
            providers: [
                AppConfig,
                CmsApiService,
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
            fixture = TestBed.createComponent(CmsTilesPanelComponent);
            component = fixture.componentInstance;
            nativeElement = fixture.nativeElement;
            debugInstance = fixture.debugElement.componentInstance;
        });
    }));


    it("Component should be instantiated", () => {
        expect(component instanceof CmsTilesPanelComponent).toBeTruthy();
        expect(component["displayResolution"].height).toEqual(130);
        expect(component["displayResolution"].width).toEqual(230);

        fixture.detectChanges();

        expect(component["displayId"]).toEqual(1);
        expect(component["sourceCount"]).toEqual(1);

        expect(component.viewState.list).toBeTruthy();
        expect(component.viewState.reload).toBeFalsy();

        let reloadButton: DebugElement = fixture.debugElement.query(By.css("#tiles-panel-reload-button"));
        expect(reloadButton).toBeFalsy();
    });


    // it("should have next button and onclick it navigates to next route", () => {
    //     fixture.detectChanges();
    //     // let buttonNext: DebugElement = fixture.debugElement.query(By.css("#tiles-panel-next-button"));
    //     // expect(buttonNext).toBeDefined();
    //     let router = fixture.debugElement.injector.get(Router);
    //     let spyNavigateByUrl = spyOn(router, "navigateByUrl").and.returnValue(null);
    //     buttonNext.triggerEventHandler("ndClick", null);
    //     expect(spyNavigateByUrl.calls.count()).toEqual(1);
    //     expect(spyNavigateByUrl.calls.argsFor(0)[0]).toEqual(`display-panel/${component["displayId"]}`);
    // });

    it("should have back button and onclick it navigates to back history", () => {
        fixture.detectChanges();
        let buttonBack = fixture.nativeElement.querySelector("#layouts-panel-back-button");
        expect(buttonBack).toBeDefined();
        let spyWindowHistoryBack = spyOn(window.history, "back").and.returnValue(null);
        buttonBack.dispatchEvent(new Event("ndClick"));
        // expect(spyWindowHistoryBack).toHaveBeenCalled();
        expect(spyWindowHistoryBack.calls.count()).toEqual(1);
    });

    it("should set reload to TRUE on list change", () => {
        component.onListChanged();
        expect(component.viewState.reload).toBeTruthy();
    });

    it("should set reload and list to FALSE on reload list", () => {
        component.reloadList();
        expect(component.viewState.reload).toBeFalsy();
        expect(component.viewState.list).toBeFalsy();
    });
});