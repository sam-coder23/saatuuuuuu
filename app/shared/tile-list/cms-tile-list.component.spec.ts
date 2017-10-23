import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement, NO_ERRORS_SCHEMA, EventEmitter } from "@angular/core";
import { CmsTileListComponent } from "./cms-tile-list.component";
import { ActivatedRoute } from "@angular/router";
import { CmsApiService } from "../../cms/api/cms-api.service";
import { Observable } from "rxjs/Observable";
import { ITilePreset } from "../../cms/models/cms-tile-preset";
import { TilePresets } from "../tile-grid/tile-grid.mock";
import { CmsClipboardService } from "../clipboard/cms-clipboard.service";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { Http, HttpModule } from "@angular/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Display } from "./../../cms/models/cms-display";
import { CmsEventEmitterService } from "./../../cms/api/cms-event-emitter.service";
import { CMS_EVENTS } from "../../cms/api/cms-events.enum";
import { MockDisplays } from "./tile.mock";

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
        return Observable.of(TilePresets);
    }

    putContentsOnDisplay(displayId: number, tilerId: number, body: any) {
        return Observable.of(null);
    }

    getSelectedDisplayContent(displayId: number): Observable<Display> {
        return Observable.of(
            new Display(MockDisplays[0])
        );
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
    let debugInstance;

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
            debugInstance = fixture.debugElement.componentInstance;

            activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
            cmsClipboardService = fixture.debugElement.injector.get(CmsClipboardService);
            let cmsApiService = fixture.debugElement.injector.get(CmsApiService);

            spyPutContentsOnDisplay = spyOn(cmsApiService, "putContentsOnDisplay").and.returnValue(Observable.of(null));
        });
    }));

    it("component should be a defined and data should be loaded OnInit", async(() => {
        expect(component).toBeDefined();
        expect(component.tilePresets.length).toEqual(0);
        expect(debugInstance.eventSubscription).toBeNull();

        component.sourceCount = cmsClipboardService.selectedSources.length;

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            // check for event subscription
            expect(debugInstance.eventSubscription).not.toBeNull();

            // source count is 2, so expect only 1 tile preset is shown after filtering
            expect(component.tilePresets.length).toEqual(1);

            // check isSelected property
            let cardElement: DebugElement = fixture.debugElement.query(By.css(".card-select"));
            expect(cardElement).toBeDefined();
            expect(component.tilePresets[0].isSelected).toBeTruthy();

        });
    }));


    it("should call CmsApiService.putContentsOnDisplay when tile layout is loaded", () => {
        component.sourceCount = cmsClipboardService.selectedSources.length;

        fixture.detectChanges();

        component.loadTilePreset(component.tilePresets[0]);

        let args = spyPutContentsOnDisplay.calls.mostRecent().args;

        // check isSelected property
        let cardElement: DebugElement = fixture.debugElement.query(By.css(".card-select"));
        expect(cardElement).toBeDefined();
        expect(component.tilePresets[0].isSelected).toBeTruthy();

        expect(args[0]).toEqual(activatedRoute.params.value.id);
        expect(args[1]).toEqual(component.tilePresets[0].id);
        expect(args[2].resources).toEqual(cmsClipboardService.selectedSources);
    });

    it("component should listen 'Display Updated' event", async(() => {
        component.sourceCount = cmsClipboardService.selectedSources.length;
        expect(debugInstance.eventSubscription).toBeNull();

        fixture.detectChanges();

        // check for event subscription
        expect(debugInstance.eventSubscription).not.toBeNull();

        // current tile must be selected
        expect(component.tilePresets[0].isSelected).toBeTruthy();

        // provide same display with not existing tilerId
        let displayUpdated = Object.assign({}, MockDisplays[0]);
            displayUpdated.tilerId = 5;

        // trigger "DiplayUpdated" event  with not existing tilerId   
        debugInstance.eventSubscription.next(
            {
                "eventType": "DisplayUpdated",
                "body": displayUpdated,
                "displayId": 1
            }
        );

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            // current tile must be not selected
            expect(component.tilePresets[0].isSelected).toBeFalsy();
        });
    }));
});