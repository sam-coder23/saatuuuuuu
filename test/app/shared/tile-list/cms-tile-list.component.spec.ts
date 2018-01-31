/**
 * Test Specification for Tile List component.
 */
import { DebugElement, NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Http, HttpModule } from "@angular/http";
import { By } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Observable } from "rxjs/Observable";

import { CmsApiService } from "../../../../app/cms/api/cms-api.service";
import { Display } from "../../../../app/cms/models/cms-display";
import { ITilePreset } from "../../../../app/cms/models/cms-tile-preset";
import { CmsSettingsService } from "../../../../app/launchpad/settings/cms-settings.service";
import { CmsTileListComponent } from "../../../../app/shared/tile-list/cms-tile-list.component";
import { tilePresets } from "./../../core/mock-stubs/tile-grid.mock";
import { mockDisplays } from "./../../core/mock-stubs/tile.mock";

// tslint:disable:no-magic-numbers
// tslint:disable:max-classes-per-file
class MockCmsApiService {
    public getTilePresets(tilesCount: number = 0): Observable<ITilePreset[]> {
        if (tilesCount === 0) {
            return Observable.of(tilePresets);
        } else {
            return Observable.of(tilePresets.filter((tilePreset: ITilePreset) => tilePreset.noOfTiles === tilesCount));
        }
    }

    public putContentsOnDisplay(displayId: number, tilerId: number, body: any): Observable<any> {
        const errorId: number = -1;
        if (displayId === -1) {
            return Observable.throw({
                message: "Error occured while updating displayContent"
            });
        } else {
            return Observable.of(undefined);
        }
    }

    public getSelectedDisplayContent(displayId: number): Observable<Display> {
        return Observable.of(new Display(mockDisplays[0]));
    }
}

//Fake MockCmsSettingService with the below stub
class MockCmsSettingService {
    public selectedSources: any = [
        { id: 1 },
        { id: 2 }
    ];
}

describe("CmsTileListComponent", () => {
    let component: CmsTileListComponent;
    let fixture: ComponentFixture<CmsTileListComponent>;
    let debugInstance: any;
    let cmsSettingService: MockCmsSettingService;
    let activatedRoute: ActivatedRoute;
    let spyPutContentsOnDisplay: jasmine.Spy;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CmsTileListComponent],
            providers: [
                { provide: ActivatedRoute, useValue: { params: Observable.from([{ id: 1 }]) } },
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
                        useFactory: (http: Http): TranslateHttpLoader => new TranslateHttpLoader(http, "/base/app/i18n/", ".json"),
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
            const cmsApiService: CmsApiService = fixture.debugElement.injector.get(CmsApiService);
            spyPutContentsOnDisplay = spyOn(cmsApiService, "putContentsOnDisplay").and.returnValue(Observable.of(undefined));
        });
    }));

    it("component should be a defined and data should be loaded OnInit", async(() => {
        expect(component).toBeDefined();
        expect(component.tilePresets.length).toEqual(0);
        expect(debugInstance.miniDisplayEventSubscription).toBeUndefined();
        component.sourceCount = cmsSettingService.selectedSources.length;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            // check for event subscription
            expect(debugInstance.miniDisplayEventSubscription).not.toBeUndefined();

            if (component.sourceCount === 0) {
                expect(component.tilePresets.length).toEqual(tilePresets.length);
            } else {
                const filteredTilePresets: ITilePreset[] = tilePresets.filter((tilePreset: ITilePreset) => tilePreset.noOfTiles === component.sourceCount);
                expect(component.tilePresets.length).toEqual(filteredTilePresets.length);
            }
            // default icon is temporary hidden but it will available in DOM
            // check default property
            const carddefaultElement: DebugElement = fixture.debugElement.query(By.css("#card-default"));
            expect(carddefaultElement).toBeDefined();
            expect(component.tilePresets[0].isDefaultForAllDisplays).toBeFalsy();
            // check isSelected property
            const cardSelectElement: DebugElement = fixture.debugElement.query(By.css(".card-select"));
            expect(cardSelectElement).toBeDefined();
            expect(component.tilePresets[0].isSelected).toBeTruthy();
        });
    }));

    it("should not fetch any tile presets if the selected source count is greater than sourceCount", () => {
        component.sourceCount = debugInstance.cmsSettingService.selectedSources.length - 1;
        component.ngOnInit();
        fixture.whenStable().then(() => {
            expect(debugInstance.tilePresets.length).toEqual(0);
        });
    });

    it("should get the tile presets whenever ngOnChanges is triggered", () => {
        const expectedTilerCount: any = 5;
        component.ngOnChanges(undefined);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.tilePresets.length).toEqual(expectedTilerCount);
        });
    });

    it("should call CmsApiService.putContentsOnDisplay when tile layout is loaded", () => {
        component.sourceCount = cmsSettingService.selectedSources.length;
        fixture.detectChanges();
        component.loadTilePreset(component.tilePresets[0]);
        const args: any[] = spyPutContentsOnDisplay.calls.mostRecent().args;
        // check isSelected property
        const cardElement: DebugElement = fixture.debugElement.query(By.css(".card-select"));
        expect(cardElement).toBeDefined();
        expect(component.tilePresets[0].isSelected).toBeTruthy();
        let id: number;
        activatedRoute.params.subscribe((value: any) => {
            id = value.id;
        });
        expect(args[0]).toEqual(id);
        expect(args[1]).toEqual(component.tilePresets[0].id);
        expect(args[2].resources).toEqual(cmsSettingService.selectedSources);
    });

    it("component should listen Display Updated event and should trigger change event emitter", async(() => {
        const expectedSpyCalls: number = 2;
        component.sourceCount = cmsSettingService.selectedSources.length;
        expect(debugInstance.miniDisplayEventSubscription).toBeUndefined();
        fixture.detectChanges();
        // check for event subscription
        expect(debugInstance.miniDisplayEventSubscription).not.toBeUndefined();
        // current tile must be selected
        expect(component.tilePresets[0].isSelected).toBeTruthy();
        // provide same display with not existing tilerId
        const displayUpdated: Display = Object.assign({}, mockDisplays[0]);
        displayUpdated.tilerId = 5;

        const spyOnChangeEmitter: any = spyOn(component.changeEmitter, "emit").and.returnValue(Observable.of(undefined));

        // trigger "DiplayUpdated" event  with not existing tilerId
        debugInstance.miniDisplayEventSubscription.next({
            eventType: "DisplayUpdated",
            body: displayUpdated,
            displayId: 1
        });

        debugInstance.tileListEventSubscription.next(
            {
                eventType: " ",
                body: " ",
                displayId: 1
            }
        );

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(spyOnChangeEmitter).toHaveBeenCalledTimes(expectedSpyCalls);
        });
    }));

    it("component should listen Display Updated event and should not trigger change event emitter", async(() => {
        component.sourceCount = cmsSettingService.selectedSources.length;
        // provide same display with already existing tilerId and which is also selected
        const displayUpdated: Display = Object.assign({}, mockDisplays[0]);
        displayUpdated.tilerId = 1;
        const spyOnChangeEmitter: any = spyOn(component.changeEmitter, "emit").and.returnValue(Observable.of(undefined));
        fixture.detectChanges();
        // trigger "DiplayUpdated" event  with not existing tilerId
        debugInstance.miniDisplayEventSubscription.next({
            eventType: "DisplayUpdated",
            body: displayUpdated,
            displayId: 1
        });

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(spyOnChangeEmitter).not.toHaveBeenCalled();
        });
    }));

    it("should show defaultTiler with respective default icon", () => {
        component.sourceCount = cmsSettingService.selectedSources.length;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const cardElement: DebugElement = fixture.debugElement.query(By.css("#card-default"));
            expect(cardElement).toBeDefined();
            expect(component.tilePresets[0].isDefaultForAllDisplays).toBeFalsy();
            expect(component.tilePresets[1].isDefaultForAllDisplays).toBeTruthy();
            const cardElements: DebugElement[] = fixture.debugElement.queryAll(By.css("#card-default"));
            expect(cardElements[0].nativeNode.innerText).toBe("");
            expect(cardElements[1].nativeNode.innerText).toBe("");
        });
    });
});
