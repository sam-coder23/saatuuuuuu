import { CmsSourceListComponent } from "./cms-source-list.component";
import { ComponentFixture, TestBed, async, inject } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ElementRef } from "@angular/core";
import { HttpModule, Http } from "@angular/http";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TilePresets } from "../tile-grid/tile-grid.mock";
import { CmsApiService } from "../../cms/api/cms-api.service";
import { CmsVirtualScrollService } from "../cms-virtual-scroll.service";
import { CmsSettingsService } from "../../launchpad/settings/cms-settings.service";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { CmsFavoriteService } from "../cms-favorite.service";
import { AppConfig } from "../../config";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { ITilePreset } from "../../cms/models/cms-tile-preset";
import { Display } from "../../cms/models/cms-display";
import { CmsResource } from "../../cms/models/cms-resource";
import { Source } from "../../cms/models/cms-source";
import { IUserProfileSettings } from "../../cms/models/cms-user-profile-settings";

class MockDisplay extends CmsResource {
    type: string;
    online: boolean;
    resolution: {
        width: number;
        height: number;
    }
}

const mDisplay: MockDisplay = {
    type: "NGPWall",
    id: 56,
    name: "ngp_display",
    description: "dadassdas",
    snapshotPath: "",
    resolution: {
        width: 1280,
        height: 1024
    },
    online: false,
    favorite: false,
    disabled: false
}

const sources: Source[] = [
    {
        id: 548,
        name: "Auto_edited_src11",
        type: "Web",
        description: "Auto_edited_desc",
        snapshotPath: "",
        x: 0,
        y: 0,
        zOrder: -1,
        width: 100,
        height: 200,
        disabled: false,
        favorite: false,
        selected: true
    },
    {
        id: 549,
        name: "Manual_edited_src11",
        type: "Web",
        description: "Auto_edited_desc1",
        snapshotPath: "x/y/z",
        x: 10,
        y: 20,
        zOrder: -1,
        width: 200,
        height: 200,
        disabled: false,
        favorite: true,
        selected: true
    },
    {
        id: 549,
        name: "Manual_edited_src11",
        type: "Web",
        description: "Auto_edited_desc1",
        snapshotPath: "x/y/z",
        x: 10,
        y: 20,
        zOrder: -1,
        width: 200,
        height: 200,
        disabled: true,
        favorite: true,
        selected: true
    }
];

class MockCmsVirtualScrollService {
    loading: boolean = true;
    count: number = 0;
    max: number = 0;
    scrollTarget: HTMLElement = null;
    scrollCallback: Function = () => {
        return 1;
    };
    dataCount = 0;
    addScrollListener(scrollTarget: HTMLElement, scrollCallback: Function) {
        return null;
    }

    removeScrollListener() {
        return null;
    }
}

class MockCmsFavoriteService {
    markObjectAsUnfavorite(objectId: number, objectType: string, objectArray, favoriteFilter?: boolean) {
        return Observable.of(null);
    }
    markObjectAsFavorite(objectId: number, objectType: string, objectArray) {
        return Observable.of(null);
    }
}

class MockCmsApiService {
    getSelectedDisplayContent(displayId): Observable<MockDisplay> {
        return Observable.of(mDisplay);
    }

    getSourceList(start: number = 1, count: number = 2147483647, aDisplayId: number, search: string = "", favorite: boolean = false): Observable<Source[]> {
        return Observable.of(sources);
    }

    loadContentOnTile(){

    }
}

class MockCmsSettingsService {
    mUserSettings: IUserProfileSettings = {
        "language": "en",
        "wallConnection": {
            "startUpAction": "show-available-walls-list",
            "specificDisplay": "Board Meeting Room",
            "recentDisplay": "Board Meeting Room"
        },
        "sourceLabel": {
            "displaySourceNameLabels": true,
            "useMultipleLines": false,
            "fontColor": "#FFFFFF",
            "fontSize": 14,
            "backgroundColor": "#BDBDBD",
            "transparency": 50
        },
        "logOffTime": 0,
        "pageSize": 50
    }
}



describe("CmsSourceListComponent", () => {
    let component: CmsSourceListComponent;
    let fixture: ComponentFixture<CmsSourceListComponent>;
    let cmsSettingsService: CmsSettingsService;
    let cmsApiService: CmsApiService;
    let cmsFavoriteService: CmsFavoriteService;
    let i18n: any;
    let debugInstance, nativeElement;
    let sourceAvail: String;

    let spyPutContentsOnDisplay: jasmine.Spy, spyMarkObjectAsFavorite, spyMarkObjectAsUnfavorite;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CmsSourceListComponent],
            providers: [
                {
                    provide: CmsApiService,
                    useClass: MockCmsApiService
                },
                {
                    provide: ElementRef,
                    useValue: {
                        nativeElement: HTMLElement
                    }
                },
                {
                    provide: CmsFavoriteService,
                    useClass: MockCmsFavoriteService
                },
                {
                    provide: CmsVirtualScrollService,
                    useClass: MockCmsVirtualScrollService
                },
                {
                    provide: CmsSettingsService,
                    useClass: MockCmsSettingsService
                },
                StorageManager,
                AppConfig,
                TranslateService
            ],
            imports: [
                HttpModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: (http: Http) => new TranslateHttpLoader(http, "/app/i18n/", ".json"),
                        deps: [Http]
                    }
                })
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(CmsSourceListComponent);
            component = fixture.componentInstance;
            nativeElement = fixture.nativeElement;
            debugInstance = fixture.debugElement.componentInstance;
            component.displayId = mDisplay.id;
            component.tilePresets = TilePresets;

            cmsSettingsService = fixture.debugElement.injector.get(CmsSettingsService);

            cmsApiService = fixture.debugElement.injector.get(CmsApiService);
            cmsFavoriteService = fixture.debugElement.injector.get(CmsFavoriteService);
            // translateService = fixture.debugElement.injector.get(TranslateService);

            spyMarkObjectAsFavorite = spyOn(cmsFavoriteService, "markObjectAsFavorite").and.returnValue(Observable.of(null));
            spyMarkObjectAsUnfavorite = spyOn(cmsFavoriteService, "markObjectAsUnfavorite").and.returnValue(Observable.of(null));
           
            // translateService.setDefaultLang("en");
        });
    }));

    // beforeEach(inject([TranslateService], (trans: TranslateService) => {
    //     trans.setDefaultLang("en");
    //     trans.get("sourceList").subscribe((res: any) => {
    //         i18n = res;
    //     });
    // }))

    it("component should be defined and new data should be populated on Changes and listen 'Source Updated' event", async(() => {
        expect(component).toBeDefined();
        expect(component.changeEmitter).toBeDefined();
        expect(component.errorEmitter).toBeDefined();
        fixture.detectChanges();

        expect(debugInstance["mScroller"].dataCount).toBe(0);
        debugInstance.mScroller.count = sources.length + 1;
        expect(debugInstance.mSourceListCmsEvent).toBeNull();
        component.ngOnChanges(null);
        fixture.whenStable().then(() => {
            expect(debugInstance.mScroller.max).toEqual(debugInstance.mSources.length);
            expect(debugInstance.mSources.length).toEqual(sources.length);
            expect(debugInstance.mScroller.dataCount).toBe(sources.length);
            expect(debugInstance.mScroller.max).not.toBeNull();
            expect(debugInstance.mScroller.count).toEqual(cmsSettingsService.mUserSettings.pageSize);
            expect(debugInstance.mScrollTarget.id).toEqual("source-list-card-container");

            debugInstance.cmsSettingsService.selectedSources = [];
            debugInstance.cmsSettingsService.selectedSources.push(sources[0]);
            expect(debugInstance.mSourceListCmsEvent).not.toBeNull();
            expect(debugInstance.cmsSettingsService.selectedSources[0].disabled).toBeFalsy()

            let sourceUpdated = Object.assign({}, sources[0]);
            debugInstance.mSourceListCmsEvent.next(
                {
                    "eventType": "ResourceDeleted",
                    "body": sourceUpdated
                }
            );
            fixture.whenStable().then(() => {
                expect(debugInstance.cmsSettingsService.selectedSources[0].disabled).toBeTruthy();
            });
        });
        fixture.detectChanges();
        let container = document.getElementById("source-list-card-container");
        let sourceCollection = fixture.nativeElement.querySelectorAll("cms-card");
        expect(sourceCollection.length).toEqual(3);
        expect(container.classList).toContain("bottom-up");
    }));

    it("should not render list and apply class when there are no sources on Init", async(() => {
        debugInstance.mSources = [];
        component.displayId = NaN;
        debugInstance.selectedOnly = false;
        expect(component).toBeDefined();
        expect(fixture.nativeElement.querySelectorAll("cms-card").length).toEqual(0);
        expect(document.getElementById("source-list-card-container").classList).not.toContain("bottom-up");
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            let defaultText = document.getElementsByClassName("source-list-unavailable");
            expect((defaultText[0].children[0].innerHTML)).toBe("sourceList.unavailable");
        });
        debugInstance.getSources();
        expect(debugInstance.mSources.length).toEqual(0);
    }));

    it("should return the source as selected when a undisabled source is clicked", () => {
        let render = debugInstance.renderer();
        expect(render).not.toBeDefined();
    });

    it("should return the undefined when there is no display to render", ()=>{
        debugInstance.cmsSettingsService.selectedSources = [];
        debugInstance.cmsSettingsService.selectedSources.push(sources[0]);
        
        let render = debugInstance.renderer(sources[0]);
        expect(render.selected).toBeTruthy();
        expect(render).toEqual(sources[0]);
    });

    it("should return the updated display list for selected source", ()=>{
        debugInstance.cmsSettingsService.selectedSources = [];
        debugInstance.cmsSettingsService.selectedSources.push(sources[0]);
        let render = debugInstance.renderer(sources[0]);
        expect(render.selected).toBeTruthy();
        expect(render).toEqual(sources[0])
    })

    it("should only add the selected sources to select source list", ()=>{
        component.displayId = mDisplay.id;
        debugInstance.mSources = [];
        debugInstance.selectedOnly = true;
        debugInstance.cmsSettingsService.selectedSources = [];
        debugInstance.cmsSettingsService.selectedSources.push(sources[0]);
        debugInstance.getSources();
        expect(debugInstance.mSources.length).toEqual(1);
    });

    it("should return 0 if there are no sources or tile Id for a valid source", () => {
        expect(debugInstance.tileIdForSourceCount(0)).toEqual(0);
        debugInstance.tilePresets = [];
        expect(debugInstance.tileIdForSourceCount(1)).toEqual(0);
    });

    it("should not return anything if the max scroll is not reached", () => {
        component.displayId = mDisplay.id;
        debugInstance.mSources = [];
        debugInstance.selectedOnly = false;
        debugInstance.mScroller.max = 2;
        debugInstance.getSources();
        expect(debugInstance.mSources.length).toEqual(0);
    });

    it("should not let user mark favorite or unfavorite on a disabled source", () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
        });
        component.toggleSourceFavorite(sources[2]);
        expect(cmsFavoriteService.markObjectAsFavorite).not.toHaveBeenCalled();
        expect(cmsFavoriteService.markObjectAsFavorite).not.toHaveBeenCalled();
    });

    it("should call CmsFavoriteService.markObjectAsFavorite when the selected source is unfavorite", () => {
        sources[0].disabled = false;
        fixture.detectChanges();
        component.toggleSourceFavorite(sources[0]);
        let args = spyMarkObjectAsFavorite.calls.mostRecent().args;
        expect(args[0]).toEqual(sources[0].id);
        expect(args[1]).toEqual(sources[0].type);
        expect(args[2]).toBeFalsy();
    });

    it("should call CmsFavoriteService.markObjectAsUnFavorite when the selected source is favorite", () => {
        fixture.detectChanges();
        component.toggleSourceFavorite(sources[1]);
        let args = spyMarkObjectAsUnfavorite.calls.mostRecent().args;
        expect(args[0]).toEqual(sources[1].id);
        expect(args[1]).toEqual(sources[1].type);
        expect(args[2]).toBeUndefined();
    });


    it("should call CmsApiService.putContentsOnDisplay when source is selected", () => {
        fixture.detectChanges();
        component.updateSelection(true, sources[0]);
        let args = spyPutContentsOnDisplay.calls.mostRecent().args;
        expect(args[0]).toEqual(mDisplay.id);
        expect(args[1]).toEqual(component.tilePresets[0].id);
        expect(args[2].resources).toEqual(cmsSettingsService.selectedSources);
    });

})