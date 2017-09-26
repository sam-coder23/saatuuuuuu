
import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement, NO_ERRORS_SCHEMA } from "@angular/core";
import { CmsTileListComponent } from "./cms-tile-list.component";
import { ActivatedRoute } from "@angular/router";
import { CmsApiService } from "../../cms/api/cms-api.service";
import { Observable } from "rxjs/Observable";
import { ITilePreset } from "../../cms/models/cms-tile-preset";
import { TILE_PRESET } from "../tile-grid/tile-grid.mock";
import { CmsClipboardService } from "../clipboard/cms-clipboard.service";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { Http, HttpModule } from "@angular/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";


/**
 * Created mock services to fake real services injected into the CmsTileListComponent
 */

/**
 * Fake ActivatedRoute Service
 */
class MockActivatedRoute {
    params: {
        value: {
            id: number;
        };
    };

    constructor() {
        this.params = {
            value: {
                id: 1
            }
        };
    }
}



/**
 * Fake CmsApiService Service with the below stub
 */
class MockCmsApiService {
    getTilers(): Observable<ITilePreset[]> {
        return Observable.of([TILE_PRESET]);
    }

    putContentsOnDisplay(displayId: number, tilerId: number, body: any) {
        return Observable.of(null);
    }
}



/**
 * Fake CmsClipboardService with the below stub
 */
class MockCmsClipboardService {
    selectedSources = [
        { id: 1 },
        { id: 2 }
    ]
}


describe("CmsTileListComponent", () => {


    let component: CmsTileListComponent;
    let fixture: ComponentFixture<CmsTileListComponent>;

    let cmsClipboardService: MockCmsClipboardService, activatedRoute: MockActivatedRoute;

    let spyPutContentsOnDisplay: jasmine.Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CmsTileListComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useClass: MockActivatedRoute
                },
                {
                    provide: CmsApiService,
                    useClass: MockCmsApiService
                },
                {
                    provide: CmsClipboardService,
                    useClass: MockCmsClipboardService
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
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(CmsTileListComponent);
            component = fixture.componentInstance;

            activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
            cmsClipboardService = fixture.debugElement.injector.get(CmsClipboardService);
            let cmsApiService = fixture.debugElement.injector.get(CmsApiService);

            spyPutContentsOnDisplay = spyOn(cmsApiService, "putContentsOnDisplay").and.returnValue(Observable.of(null));
        });
    }));

    it("component should be a defined and data should be loaded OnInit", async(() => {
        expect(component).toBeDefined();

        expect(component.tilePresets.length).toEqual(0);

        component.sourceCount = cmsClipboardService.selectedSources.length;

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(component.tilePresets.length).toEqual(1);
        });
    }));


    it("should call CmsApiService.putContentsOnDisplay when tile layout is loaded", () => {
        component.sourceCount = cmsClipboardService.selectedSources.length;

        fixture.detectChanges();

        component.loadTilePreset(component.tilePresets[0]);

        let args = spyPutContentsOnDisplay.calls.mostRecent().args;

        expect(args[0]).toEqual(activatedRoute.params.value.id);
        expect(args[1]).toEqual(component.tilePresets[0].id);
        expect(args[2].resources).toEqual(cmsClipboardService.selectedSources);
    });
});