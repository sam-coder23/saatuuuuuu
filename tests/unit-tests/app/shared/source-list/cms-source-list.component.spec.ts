/**
 * Test Specification for Source List component.
 */
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef, NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Observable } from "rxjs/Observable";

import { CmsApiService } from "../../../../app/cms/api/cms-api.service";
import { StorageManager } from "../../../../app/cms/api/cms-storagemanager.service";
import { Display } from "../../../../app/cms/models/cms-display";
import { Source } from "../../../../app/cms/models/cms-source";
import { IUserProfileSettings } from "../../../../app/cms/models/cms-user-profile-settings";
import { AppConfig } from "../../../../app/config";
import { CmsSettingsService } from "../../../../app/launchpad/settings/cms-settings.service";
import { CmsFavoriteService } from "../../../../app/shared/cms-favorite.service";
import { CmsVirtualScrollService } from "../../../../app/shared/cms-virtual-scroll.service";
import { CmsSourceListComponent } from "../../../../app/shared/source-list/cms-source-list.component";
import { mockDisplay, sources } from "../../core/mock-stubs/cms-sourcelist.mock";

// tslint:disable:no-magic-numbers
// tslint:disable:max-classes-per-file

class MockCmsVirtualScrollService {
    public loading: boolean = true;
    public count: number = 0;
    public max: number = 0;
    public scrollTarget: HTMLElement;
    public dataCount: number = 0;
    public scrollCallback: Function = () => {
        return 1;
    }
    public addScrollListener(scrollTarget: HTMLElement, scrollCallback: Function): undefined {
        return undefined;
    }
    public removeScrollListener(): any {
        return undefined;
    }
}

class MockCmsFavoriteService {
   public markObjectAsUnfavorite(objectId: number, objectType: string, objectArray: any[], favoriteFilter?: boolean): Observable<any> {
        return Observable.of(undefined);
    }
    public markObjectAsFavorite(objectId: number, objectType: string, objectArray: any[]): Observable<any> {
        return Observable.of(undefined);
    }
}

class MockCmsApiService {
    public getSelectedDisplayContent(displayId: number): Observable<Display> {
        return Observable.of(mockDisplay);
    }

    public getSourceList(start: number = 1, count: number = 2147483647, aDisplayId: number, search: string = "", favorite: boolean = false): Observable<Source[]> {
        if (aDisplayId === -1) {
            return Observable.throw({
                message: "Error while fetching resources"
            });
        } else {
            return Observable.of(sources);
        }
    }
}

class MockCmsSettingsService {
    public userSettings: IUserProfileSettings = {
        language: "en",
        wallConnection: {
            startUpAction: "show-available-walls-list",
            specificDisplay: "Board Meeting Room",
            recentDisplay: "Board Meeting Room"
        },
        sourceLabel: {
            displaySourceNameLabels: true,
            useMultipleLines: false,
            fontColor: "#FFFFFF",
            fontSize: 14,
            backgroundColor: "#BDBDBD",
            transparency: 50
        },
        logOffTime: 0,
        pageSize: 50
    };

    public selectedSources: Source[] = [];
}

describe("CmsSourceListComponent", () => {
    let component: CmsSourceListComponent;
    let fixture: ComponentFixture<CmsSourceListComponent>;
    let cmsSettingsService: CmsSettingsService;
    let cmsApiService: CmsApiService;
    let cmsFavoriteService: CmsFavoriteService;
    let debugInstance: any;
    let nativeElement: HTMLElement;
    let spyMarkObjectAsFavorite: jasmine.Spy;
    let spyMarkObjectAsUnfavorite: jasmine.Spy;
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
                HttpClientModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: (http: HttpClient): TranslateHttpLoader => new TranslateHttpLoader(http, "/app/i18n/", ".json"),
                        deps: [HttpClient]
                    }
                })
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(CmsSourceListComponent);
            component = fixture.componentInstance;
            nativeElement = fixture.nativeElement;
            debugInstance = fixture.debugElement.componentInstance;
            component.displayId = mockDisplay.id;
            cmsSettingsService = fixture.debugElement.injector.get(CmsSettingsService);
            cmsApiService = fixture.debugElement.injector.get(CmsApiService);
            cmsFavoriteService = fixture.debugElement.injector.get(CmsFavoriteService);
            // spyMarkObjectAsFavorite = spyOn(cmsFavoriteService, "markObjectAsFavorite")
            //     .and.returnValue(Observable.of(undefined));
            // spyMarkObjectAsUnfavorite = spyOn(cmsFavoriteService, "markObjectAsUnfavorite")
            //     .and.returnValue(Observable.of(undefined));
        });
    }));

    it("component should be defined and new data should be populated on Changes", async(() => {
        const defaultSourceListCount: number = 3;
        expect(component).toBeDefined();
        expect(component.changeEmitter).toBeDefined();
        expect(component.errorEmitter).toBeDefined();
        fixture.detectChanges();
        expect(debugInstance.scroller.dataCount).toBe(0);
        debugInstance.scroller.count = sources.length + 1;
        expect(debugInstance.sourceListCmsEvent).toBeUndefined();
        component.ngOnChanges(undefined);
        fixture.whenStable().then(() => {
            expect(debugInstance.scroller.max).toEqual(debugInstance.sources.length);
            expect(debugInstance.sources.length).toEqual(sources.length);
            expect(debugInstance.scroller.dataCount).toBe(sources.length);
            expect(debugInstance.scroller.max).not.toBeUndefined();
            expect(debugInstance.scroller.count).toEqual(cmsSettingsService.userSettings.pageSize);
            expect(debugInstance.scrollTarget.id).toEqual("source-list-card-container");
            debugInstance.cmsSettingsService.selectedSources = [];
            debugInstance.cmsSettingsService.selectedSources.push(sources[0]);
            expect(debugInstance.sourceListCmsEvent).not.toBeUndefined();
            expect(debugInstance.cmsSettingsService.selectedSources[0].disabled).toBeFalsy();
            const sourceUpdated: Source = Object.assign({}, sources[0]);
            debugInstance.sourceListCmsEvent.next(
                {
                    eventType: "ResourceDeleted",
                    body: sourceUpdated
                }
            );
            fixture.whenStable().then(() => {
                expect(debugInstance.cmsSettingsService.selectedSources[0].disabled).toBeTruthy();
            });
        });
    }));

    it("should not render list and apply class when there are no sources on Init", async(() => {
        debugInstance.sources = [];
        component.displayId = NaN;
        debugInstance.selectedOnly = false;
        expect(component).toBeDefined();
        expect(fixture.nativeElement.querySelectorAll("cms-card").length).toEqual(0);
        expect(document.getElementById("source-list-card-container").classList).not
            .toContain("bottom-up");
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const defaultText: HTMLCollectionOf<Element> = document.getElementsByClassName("source-list-unavailable");
            expect((defaultText[0].children[0].innerHTML)).toBe("sourceList.unavailable");
        });
        debugInstance.getSources();
        expect(debugInstance.sources.length).toEqual(0);
    }));

    it("should update the counted of selected sources whenever a source is selected", () => {
        component.ngOnChanges(undefined);
        fixture.detectChanges();
        debugInstance.cmsSettingsService.selectedSources = [];
        fixture.whenStable().then(() => {
            const selectionCard: any = nativeElement.querySelector("cms-card");
            expect(selectionCard).not.toBeNull();
            selectionCard.dispatchEvent(new Event("select"));
            expect(debugInstance.cmsSettingsService.selectedSources.length).toEqual(0);
            selectionCard.dispatchEvent(new Event("select"));
            expect(debugInstance.cmsSettingsService.selectedSources.length).toEqual(1);
        });
    });

    it("should only add the selected sources to select source list", () => {
        component.displayId = mockDisplay.id;
        debugInstance.sources = [];
        debugInstance.selectedOnly = true;
        debugInstance.cmsSettingsService.selectedSources = [];
        debugInstance.cmsSettingsService.selectedSources.push(sources[0]);
        debugInstance.getSources();
        expect(debugInstance.sources.length).toEqual(1);
    });

    it("should not return anything if the max scroll is not reached", () => {
        component.displayId = mockDisplay.id;
        debugInstance.sources = [];
        debugInstance.selectedOnly = false;
        debugInstance.scroller.max = 2;
        debugInstance.getSources();
        expect(debugInstance.sources.length).toEqual(0);
    });

    it("should not let user mark favorite or unfavorite on a disabled source", () => {
        const sourceIndex: number = 2;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            debugInstance.toggleSourceFavorite(sources[sourceIndex]);
            expect(cmsFavoriteService.markObjectAsFavorite).not.toHaveBeenCalled();
            expect(cmsFavoriteService.markObjectAsFavorite).not.toHaveBeenCalled();
        });

    });

    it("should call CmsFavoriteService.markObjectAsFavorite when the selected source is unfavorite", () => {
        sources[0].disabled = false;
        fixture.detectChanges();
        debugInstance.toggleSourceFavorite(sources[0]);
        const args: any[] = spyMarkObjectAsFavorite.calls.mostRecent().args;
        expect(args[0]).toEqual(sources[0].id);
        expect(args[1]).toEqual(sources[0].type);
        expect(args[2]).toBeFalsy();
    });

    it("should call CmsFavoriteService.markObjectAsUnFavorite when the selected source is favorite", () => {
        fixture.detectChanges();
        debugInstance.toggleSourceFavorite(sources[1]);
        const args: any[] = spyMarkObjectAsUnfavorite.calls.mostRecent().args;
        expect(args[0]).toEqual(sources[1].id);
        expect(args[1]).toEqual(sources[1].type);
        expect(args[2]).toBeUndefined();
    });

    it("should able to get selected Source as per current display", () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const selectedSources: Source[] = debugInstance.cmsSettingsService.selectedSources;
            expect(selectedSources.length).toBe(2);
            expect(selectedSources[0].name).toBe(mockDisplay.content[0].name);
            expect(selectedSources[1].name).toBe(mockDisplay.content[1].name);
        });
    });

    it("should able to display shared sources as selected", () => {
        fixture.detectChanges();
        component.ngOnChanges(undefined);
        fixture.whenStable().then(() => {
            expect(debugInstance.sources[2].selected).toBeFalsy();
        });
    });

    it("should not be a any selected Source if current display is not have any shared content", () => {
        mockDisplay.content = [];
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const selectedSources: Source[] = debugInstance.cmsSettingsService.selectedSources;
            expect(selectedSources.length).toBe(0);
        });
    });

    it("should stop scroll if getSources() fails.", () => {
        component.displayId = -1;
        component.ngOnChanges(undefined);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.scroller.loading).toBeFalsy();
        });
    });

    it("should clear all selected sources when sources panel triggers clearWallContent", () => {
        component.ngOnChanges(undefined);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            debugInstance.clearSelectedSourceList();
            expect(debugInstance.cmsSettingsService.selectedSources.length).toEqual(0);
            expect(debugInstance.sources.findIndex((el: any) => {
                return el.selected;
              }
            )).toEqual(-1);
        });
    });
});
