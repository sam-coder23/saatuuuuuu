/**
 * Test Specification for CMS Display List component.
 */
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Observable } from "rxjs/Observable";

import { CmsApiService } from "../../../../app/cms/api/cms-api.service";
import { CMS_EVENTS } from "../../../../app/cms/api/cms-events.enum";
import { StorageManager } from "../../../../app/cms/api/cms-storagemanager.service";
import { CMSConstants } from "../../../../app/cms/models/cms-constants";
import { Display } from "../../../../app/cms/models/cms-display";
import { CmsSessionStorageItem } from "../../../../app/cms/models/cms-session-storage-item";
import { AppConfig } from "../../../../app/config";
import { CmsSettingsService } from "../../../../app/launchpad/settings/cms-settings.service";
import { CmsFavoriteService } from "../../../../app/shared/cms-favorite.service";
import { CmsDisplayListComponent } from "../../../../app/shared/display-list/cms-display-list.component";
import { MockDisplay } from "../../core/mock-stubs/cms-mini-display.component.mock";
import { MockRouterStub } from "../../core/mock-stubs/mock-router.stub";
import { mocksUerProfileSettingsData } from "./../../core/mock-stubs/api-service.mock";

// tslint:disable:no-magic-numbers
// tslint:disable:max-classes-per-file
let displays: MockDisplay[] = [
    {
        id: 1,
        name: "Crisis room wall XYZ",
        type: "DisplayWall",
        description: "",
        snapshotPath: "",
        resolution: {
            width: 1920,
            height: 1080
        },
        online: true,
        favorite: false,
        disabled: false,
        width: 1920,
        height: 1080,
        tiles: [],
        content: []
    },
    {
        id: 2,
        name: "Crisis room wall ABC",
        type: "DisplayWall",
        description: "",
        snapshotPath: "",
        resolution: {
            width: 1920,
            height: 1080
        },
        online: true,
        favorite: false,
        disabled: true,
        width: 1920,
        height: 1080,
        tiles: [],
        content: []
    },
    {
        id: 3,
        name: "Crisis room wall 123",
        type: "DisplayWall",
        description: "",
        snapshotPath: "",
        resolution: {
            width: 1920,
            height: 1080
        },
        online: true,
        favorite: true,
        disabled: false,
        width: 1920,
        height: 1080,
        tiles: [],
        content: []
    },
    {
        id: 4,
        name: "Crisis room wall - jEFF",
        type: "DisplayWall",
        description: "",
        snapshotPath: "",
        resolution: {
            width: 1920,
            height: 1080
        },
        online: true,
        favorite: true,
        disabled: false,
        width: 1920,
        height: 1080,
        tiles: [],
        content: []
    },
    {
        id: 5,
        name: "Crisis room wall -commutor",
        type: "DisplayWall",
        description: "",
        snapshotPath: "",
        resolution: {
            width: 1920,
            height: 1080
        },
        online: true,
        favorite: false,
        disabled: false,
        width: 1920,
        height: 1080,
        tiles: [],
        content: []
    },
    {
        id: 1,
        name: "Crisis room wall -Knight",
        type: "DisplayWall",
        description: "",
        snapshotPath: "",
        resolution: {
            width: 1920,
            height: 1080
        },
        online: true,
        favorite: false,
        disabled: false,
        width: 1920,
        height: 1080,
        tiles: [],
        content: []
    }
];
class MockCmsApiService {
    public getDisplayList(start: number = 1, count: number = 2147483647, search: string = "", favorite: boolean = false): Observable<Display[]> {
        if (search === "error") {
            return Observable.throw(undefined);
        } else {
            return Observable.of(displays);
        }
    }
    public getSelectedDisplayContent(): undefined {
        return undefined;
    }
}
class MockActivatedRoute {
}
class MockCmsEventEmitterService {
    // tslint:disable-next-line:no-reserved-keywords
    public get(ID: CMS_EVENTS): CMS_EVENTS {
        return ID;
    }
}

class MockSettingsService {
    public selectedSources: any[] = [];
    public userSettings: any = mocksUerProfileSettingsData;
    public updateWallConnectionSpecificDisplay(): Observable<undefined> {
        return Observable.of(undefined);
    }

    public updateWallConnectionRecentDisplay(): Observable<undefined> {
        return Observable.of(undefined);
    }
}

class MockRouter {
    public navigate(text: string): string {
        return text;
    }
}

class MockCmsFavoriteService {
    public markObjectAsUnfavorite(objectId: number, objectType: string, objectArray: any[], favoriteFilter?: boolean): Observable<undefined> {
        return Observable.of(undefined);
    }
    public markObjectAsFavorite(objectId: number, objectType: string, objectArray: any[]): Observable<undefined> {
        return Observable.of(undefined);
    }
}

describe("CmsDisplayListComponent", () => {
    let component: CmsDisplayListComponent;
    let fixture: ComponentFixture<CmsDisplayListComponent>;
    let cmsSettingsService: CmsSettingsService;
    let cmsApiService: CmsApiService;
    let cmsFavoriteService: CmsFavoriteService;
    let translateService: TranslateService;
    let routerService: Router;
    let storageManager: StorageManager;
    let debugInstance: any;
    let nativeElement: HTMLElement;
    let spyMarkObjectAsFavorite: jasmine.Spy;
    let spyMarkObjectAsUnfavorite: jasmine.Spy;
    let spyRouter: jasmine.Spy;
    let spyUpdateSpecificDisplay: jasmine.Spy;
    let spyUpdateRecentDisplay: jasmine.Spy;
    let spyRemove: jasmine.Spy;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CmsDisplayListComponent],
            providers: [
                {
                    provide: Router,
                    useClass: MockRouterStub
                },
                {
                    provide: CmsApiService,
                    useClass: MockCmsApiService
                },
                {
                    provide: CmsSettingsService,
                    useClass: MockSettingsService
                },
                {
                    provide: ActivatedRoute,
                    useClass: MockActivatedRoute
                },
                {
                    provide: CmsFavoriteService,
                    useClass: MockCmsFavoriteService
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
                        useFactory: (http: HttpClient): TranslateHttpLoader => new TranslateHttpLoader(
                            http, "/base/app/i18n/", ".json"),
                        deps: [HttpClient]
                    }
                })
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(CmsDisplayListComponent);
            component = fixture.componentInstance;
            nativeElement = fixture.nativeElement;
            debugInstance = fixture.debugElement.componentInstance;
            cmsSettingsService = fixture.debugElement.injector.get(CmsSettingsService);
            routerService = fixture.debugElement.injector.get(Router);
            storageManager = fixture.debugElement.injector.get(StorageManager);
            cmsApiService = fixture.debugElement.injector.get(CmsApiService);
            cmsFavoriteService = fixture.debugElement.injector.get(CmsFavoriteService);
            translateService = fixture.debugElement.injector.get(TranslateService);
            translateService.setDefaultLang("en");
            // spyRemove = spyOn(storageManager, "removeItem").and.returnValue(Observable.of(undefined));
            // spyRouter = spyOn(routerService, "navigate").and.returnValue(Observable.of(undefined));
            // spyMarkObjectAsFavorite = spyOn(cmsFavoriteService, "markObjectAsFavorite").and.returnValue(Observable.of(undefined));
            // spyMarkObjectAsUnfavorite = spyOn(cmsFavoriteService, "markObjectAsUnfavorite").and.returnValue(Observable.of(undefined));
            // spyUpdateRecentDisplay = spyOn(cmsSettingsService, "updateWallConnectionRecentDisplay").and.returnValue(Observable.of(undefined));
            // spyUpdateSpecificDisplay = spyOn(cmsSettingsService, "updateWallConnectionSpecificDisplay").and.returnValue(Observable.of(undefined));
        });
    }));

    it("component should be defined", async(() => {
        expect(component).toBeDefined();
        expect(debugInstance.cmsServerApi).toBeDefined();
    }));

    it("should not let user mark favorite or unfavorite on a disabled display", () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            debugInstance.toggleDisplayFavorite(displays[1]);
        });
        expect(cmsFavoriteService.markObjectAsFavorite).not.toHaveBeenCalled();
        expect(cmsFavoriteService.markObjectAsFavorite).not.toHaveBeenCalled();
    });

    it("should call CmsFavoriteService.markObjectAsFavorite when the selected display is unfavorite", () => {
        fixture.detectChanges();
        debugInstance.toggleDisplayFavorite(displays[0]);
        const args: any[] = spyMarkObjectAsFavorite.calls.mostRecent().args;
        expect(args[0]).toEqual(displays[0].id);
        expect(args[1]).toEqual(displays[0].type);
        expect(args[2]).toBeFalsy();
    });

    it("should call CmsFavoriteService.markObjectAsUnFavorite when the selected display is favorite", () => {
        fixture.detectChanges();
        debugInstance.toggleDisplayFavorite(displays[2]);
        const args: any[] = spyMarkObjectAsUnfavorite.calls.mostRecent().args;
        expect(args[0]).toEqual(displays[2].id);
        expect(args[1]).toEqual(displays[2].type);
        expect(args[2]).toBeUndefined();
    });

    it("should check that displays are getting loaded on the OnChange, adds and remove the scroll service", () => {
        fixture.detectChanges();
        component.ngOnChanges(undefined);
        fixture.whenStable().then(() => {
            expect(debugInstance.displays).toEqual(displays);
        });
    });

    it("should render the list on UI based on displays from API", () => {
        component.ngOnChanges(undefined);
        const container: HTMLElement = document.getElementById("display-list-card-container");
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const displayCollection: any[] = fixture.nativeElement.querySelectorAll("cms-card");
            expect(displayCollection.length).toEqual(displays.length);
        });
    });

    it("should route to sources panel", () => {
        component.ngOnChanges(undefined);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const displayCard: HTMLElement = fixture.nativeElement.querySelector("cms-card");
            debugInstance.route.params = [{ action: CMSConstants.TRANSPARENCY_STEPS }];
            expect(displayCard).not.toBeNull();
            displayCard.dispatchEvent(new Event("select"));
            const args: any[] = spyRouter.calls.mostRecent().args;
            expect(args[0]).toEqual(["/displays/1/sources-panel"]);
        });

    });

    it("should not render the list on UI, if there are  no displays returned by the API", () => {
        debugInstance.displays = [];
        debugInstance.showConfirmationPopup = true;
        const panelTitle: string = "";
        const container: HTMLElement = document.getElementById("display-list-card-container");
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(fixture.nativeElement.querySelectorAll("div.display-list-unavailable")).not.toBeUndefined();
            let noDisplayText: string = " ";
            translateService.get("displayList.unavailable").subscribe((response: string) => {
                noDisplayText = response;
            });
            expect(fixture.nativeElement.querySelectorAll("div.display-list-unavailable")[0].firstElementChild.innerText).toEqual(noDisplayText);
        });
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            let common: any;
            let ndPopup: any;
            let displayList: any;
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                ndPopup = fixture.nativeElement.querySelectorAll("nd-popup")[0];
                expect(ndPopup).not.toBeUndefined();
                expect(ndPopup.className).toEqual("confirm-popup");
                translateService.get("common").subscribe((response: string) => {
                    common = response;
                    expect(ndPopup.okText).toEqual(common.ok);
                });
                translateService.get("displayList").subscribe((response: string) => {
                    displayList = response;
                    expect(ndPopup.title).toEqual(displayList.confirmationTitlePopup);
                });
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    debugInstance.showDialogMessage();
                    expect(debugInstance.dialogMessage).toEqual(displayList.unavailableConfirmation);
                });
            });
        });
    });

    it("should route onConfimation of pop up", () => {
        component.ngOnChanges(undefined);
        debugInstance.route.params = [{ action: CMSConstants.SELECT_DISPLAY }];
        debugInstance.onConfirmation();
        const args: any[] = spyRouter.calls.mostRecent().args;
        expect(args[0]).toEqual(["/settings"]);
        component.ngOnChanges(undefined);
        debugInstance.route.params = [{ xyz: "abc" }];
        debugInstance.onConfirmation();
        expect(debugInstance.showConfirmationPopup).toBeFalsy();
    });

    it("should add displays on scroll to the displays list", () => {
        debugInstance.displays = [];
        debugInstance.showConfirmationPopup = true;
        debugInstance.getDisplays();
        fixture.detectChanges();
        expect(debugInstance.displays.length).toEqual(displays.length);
        expect(debugInstance.eventSubscription).toBeDefined();
        debugInstance.eventSubscription.next(
            {
                body: debugInstance.displays[0],
                uri: "/1/1/1/1",
                verb: "deleted"
            }
        );
        fixture.whenStable().then(() => {
            expect(debugInstance.showConfirmationPopup).toBeFalsy();
            expect(JSON.parse(storageManager.getItem(CmsSessionStorageItem.DISPLAY))).toBeDefined();
            // expect(storageManager.remove).toHaveBeenCalled();
        });
        debugInstance.eventSubscription.next(
            {
                body: { id: 455 },
                uri: "/1/1/1/1",
                verb: "put"
            }
        );
        debugInstance.eventSubscription.next(
            {
                body: { id: 455 },
                uri: "/1/1/1/1",
                verb: "deleted"
            }
        );
        expect(JSON.parse(storageManager.getItem(CmsSessionStorageItem.DISPLAY))).toBeDefined();
    });

    it("should show a dialog popup whenever there are no displays turning up from API", () => {
        let displayList: string;
        debugInstance.displays = [];
        debugInstance.searchFilter = "";
        debugInstance.dialogMessage = "";
        debugInstance.favoriteFilter = false;
        debugInstance.getDisplays();
        expect(debugInstance.showConfirmationPopup).toBeFalsy();
        translateService.get("displayList").subscribe((response: string) => {
            displayList = response;
        });
    });

    it("should show dialog message that no displays are available,", () => {
        debugInstance.displays = [];
        displays = [];
        debugInstance.searchFilter = "";
        debugInstance.dialogMessage = "";
        debugInstance.favoriteFilter = false;
        debugInstance.eventSubscription = undefined;
        debugInstance.getDisplays();
        expect(debugInstance.showConfirmationPopup).toBeTruthy();
    });

    it("should show dialog message that no displays are available,", () => {
        debugInstance.displays = [];
        debugInstance.searchFilter = "error";
        debugInstance.dialogMessage = "";
        debugInstance.favoriteFilter = false;
        debugInstance.getDisplays();
        expect(debugInstance.showConfirmationPopup).toBeTruthy();
    });
});
