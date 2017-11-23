import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement, NO_ERRORS_SCHEMA, EventEmitter } from "@angular/core";
import { CmsTileListComponent } from "./cms-tile-list.component";
import { ActivatedRoute } from "@angular/router";
import { CmsApiService } from "../../cms/api/cms-api.service";
import { Observable } from "rxjs/Observable";
import { ITilePreset } from "../../cms/models/cms-tile-preset";
import { TilePresets } from "../tile-grid/tile-grid.mock";
import { CmsSettingsService } from "../../launchpad/settings/cms-settings.service";
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
    getTilePresets(tilesCount: number = 0): Observable<ITilePreset[]> {
        if (tilesCount === 0) {
            return Observable.of(TilePresets);
        } else {
            return Observable.of(TilePresets.filter(tilePreset => tilePreset.noOfTiles === tilesCount));
        }
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
 * Fake MockCmsSettingService with the below stub
 */
class MockCmsSettingService {
    selectedSources = [
        { id: 1 },
        { id: 2 }
    ]
}


describe("CmsTileListComponent", () => {
    let component: CmsTileListComponent;
    let fixture: ComponentFixture<CmsTileListComponent>;
    let debugInstance;
    let cmsSettingService: MockCmsSettingService, activatedRoute: MockActivatedRoute;

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
                    provide: CmsSettingsService,
                    useClass: MockCmsSettingService
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
            cmsSettingService = fixture.debugElement.injector.get(CmsSettingsService);
            let cmsApiService = fixture.debugElement.injector.get(CmsApiService);

            spyPutContentsOnDisplay = spyOn(cmsApiService, "putContentsOnDisplay").and.returnValue(Observable.of(null));
        });
    }));

    it("component should be a defined and data should be loaded OnInit", async(() => {
        expect(component).toBeDefined();
        expect(component.tilePresets.length).toEqual(0);
        expect(debugInstance.miniDisplayEventSubscription).toBeNull();

        component.sourceCount = cmsSettingService.selectedSources.length;

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            // check for event subscription
            expect(debugInstance.miniDisplayEventSubscription).not.toBeNull();
            if (component.sourceCount === 0) {
                expect(component.tilePresets.length).toEqual(TilePresets.length);
            } else {
                let filteredTilePresets = TilePresets.filter(tilePreset => tilePreset.noOfTiles === component.sourceCount);
                expect(component.tilePresets.length).toEqual(filteredTilePresets.length);
            }

            // check default property
            let carddefaultElement: DebugElement = fixture.debugElement.query(By.css("#card-default"));
            expect(carddefaultElement).toBeDefined();
            expect(component.tilePresets[0].isDefaultForAllDisplays).toBeFalsy();

            // check isSelected property
            let cardSelectElement: DebugElement = fixture.debugElement.query(By.css(".card-select"));
            expect(cardSelectElement).toBeDefined();
            expect(component.tilePresets[0].isSelected).toBeTruthy();
        });
    }));


    it("should call CmsApiService.putContentsOnDisplay when tile layout is loaded", () => {
        component.sourceCount = cmsSettingService.selectedSources.length;

        fixture.detectChanges();

        component.loadTilePreset(component.tilePresets[0]);

        let args = spyPutContentsOnDisplay.calls.mostRecent().args;

        // check isSelected property
        let cardElement: DebugElement = fixture.debugElement.query(By.css(".card-select"));
        expect(cardElement).toBeDefined();
        expect(component.tilePresets[0].isSelected).toBeTruthy();

        expect(args[0]).toEqual(activatedRoute.params.value.id);
        expect(args[1]).toEqual(component.tilePresets[0].id);
        expect(args[2].resources).toEqual(cmsSettingService.selectedSources);
    });

    it("component should listen 'Display Updated' event", async(() => {
        component.sourceCount = cmsSettingService.selectedSources.length;
        expect(debugInstance.miniDisplayEventSubscription).toBeNull();

        fixture.detectChanges();

        // check for event subscription
        expect(debugInstance.miniDisplayEventSubscription).not.toBeNull();

        // current tile must be selected
        expect(component.tilePresets[0].isSelected).toBeTruthy();

        // provide same display with not existing tilerId
        let displayUpdated = Object.assign({}, MockDisplays[0]);
        displayUpdated.tilerId = 5;

        // trigger "DiplayUpdated" event  with not existing tilerId   
        debugInstance.miniDisplayEventSubscription.next(
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

    it("should show defaultTiler with respective default icon", () => {
        component.sourceCount = cmsSettingService.selectedSources.length;

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            let cardElement: DebugElement = fixture.debugElement.query(By.css("#card-default"));
            expect(cardElement).toBeDefined();

            expect(component.tilePresets[0].isDefaultForAllDisplays).toBeFalsy();
            expect(component.tilePresets[1].isDefaultForAllDisplays).toBeTruthy();

            let cardElements: DebugElement[] = fixture.debugElement.queryAll(By.css("#card-default"));
            expect(cardElements[0].nativeNode.innerText).toBe("bookmark_border");
            expect(cardElements[1].nativeNode.innerText).toBe("bookmark");
        });
    });
});