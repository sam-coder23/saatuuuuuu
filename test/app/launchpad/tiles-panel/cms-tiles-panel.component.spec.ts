/**
 * This class is responsible to handle unit test case of CmsTilesPanelComponent
 */
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Http, HttpModule } from "@angular/http";
import { By } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Observable } from "rxjs/Observable";

import { CmsApiService } from "../../../../app/cms/api/cms-api.service";
import { AppConfig } from "../../../../app/config";
import { CmsTilesPanelComponent } from "../../../../app/launchpad/tiles-panel/cms-tiles-panel.component";
import { MockRouterStub } from "../../core/mock-stubs/mock-router.stub";

class MockCmsApiServiceStub {
}

describe("CmsTilesPanelComponent - Test Suite", () => {
    let component: CmsTilesPanelComponent;
    let fixture: ComponentFixture<CmsTilesPanelComponent>;
    let debugInstance: any;
    let nativeElement : any;

    beforeEach(async(() => {
        const activatedRoute: ActivatedRoute = new ActivatedRoute();
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
                        useFactory: (http: Http): TranslateHttpLoader => new TranslateHttpLoader(http, "/base/app/i18n/", ".json"),
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
            activatedRoute.params = Observable.of({
                id: 1
            });

            activatedRoute.queryParams = Observable.of({
                sourceCount: 1
            });

        });
    }));

    it("Component should be instantiated", () => {
        expect(component instanceof CmsTilesPanelComponent).toBeTruthy();
        const height: number = 130;
        const width: number = 230;
        expect(debugInstance.displayResolution.height).toEqual(height);
        expect(debugInstance.displayResolution.width).toEqual(width);
        fixture.detectChanges();
        expect(debugInstance.displayId).toEqual(1);
        expect(debugInstance.sourceCount).toEqual(1);
        expect(debugInstance.listState).toBeTruthy();
        expect(debugInstance.reloadState).toBeFalsy();
        const reloadButton: DebugElement = fixture.debugElement.query(By.css("#tiles-panel-reload-button"));
        expect(reloadButton).toBeFalsy();
    });

    it("should have back button and onclick it navigates to back history", () => {
        fixture.detectChanges();
        const buttonBack : any = fixture.nativeElement.querySelector("#layouts-panel-back-button");
        expect(buttonBack).toBeDefined();
        const router : any = fixture.debugElement.injector.get(Router);
        const spyNavigateByUrl : jasmine.Spy = spyOn(router, "navigateByUrl");
        buttonBack.dispatchEvent(new Event("ndClick"));
        expect(spyNavigateByUrl.calls.argsFor(0)[0]).toEqual(`/home/${debugInstance.displayId}`);
    });

    it("should set reload to TRUE on list change", () => {
        component.onListChanged();
        expect(debugInstance.reloadState).toBeTruthy();
    });

    it("should set reload and list to FALSE on reload list", () => {
        component.reloadList();
        expect(debugInstance.reloadState).toBeFalsy();
        expect(debugInstance.listState).toBeFalsy();
    });
});
