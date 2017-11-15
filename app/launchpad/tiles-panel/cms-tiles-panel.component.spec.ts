import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CmsTilesPanelComponent } from "./cms-tiles-panel.component";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { HttpModule, Http } from "@angular/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { MockRouterStub } from "../../core/mock-stubs/mock-router-stub";


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
                {
                    provide: ActivatedRoute,
                    useValue: activatedRoute
                },
                {
                    provide: Router,
                    useClass: MockRouterStub
                }
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
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
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

        expect(component["mDisplayId"]).toEqual(1);
        expect(component["sourceCount"]).toEqual(1);

        expect(component.mStates.list).toBeTruthy();
        expect(component.mStates.reload).toBeFalsy();

        let reloadButton: DebugElement = fixture.debugElement.query(By.css("#tiles-panel-reload-button"));
        expect(reloadButton).toBeFalsy();
    });


    it("should have next button and onclick it navigates to next route", () => {
        fixture.detectChanges();

        let buttonNext: DebugElement = fixture.debugElement.query(By.css("#tiles-panel-next-button"));
        expect(buttonNext).toBeDefined();

        let router = fixture.debugElement.injector.get(Router);
        let spyNavigateByUrl = spyOn(router, "navigateByUrl").and.returnValue(null);

        buttonNext.triggerEventHandler("click", null);

        expect(spyNavigateByUrl.calls.count()).toEqual(1);
        expect(spyNavigateByUrl.calls.argsFor(0)[0]).toEqual(`display-panel/${component["mDisplayId"]}`);
    });

    it("should have back button and onclick it navigates to back history", () => {
        fixture.detectChanges();

        let buttonBack: DebugElement = fixture.debugElement.query(By.css("#tiles-panel-back-button"));
        expect(buttonBack).toBeDefined();
        
        let spyWindowHistoryBack = spyOn(window.history, "back").and.returnValue(null);
        
        buttonBack.triggerEventHandler("click", null);

        expect(spyWindowHistoryBack).toHaveBeenCalled();
        expect(spyWindowHistoryBack.calls.count()).toEqual(1);
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
});