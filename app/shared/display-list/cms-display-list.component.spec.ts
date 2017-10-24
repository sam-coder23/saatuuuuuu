
import { Subscription } from "rxjs/Rx";
import { CMS_EVENTS } from "../../cms/api/cms-events.enum";
import { CmsDisplayListComponent } from "./cms-display-list.component";
import { ComponentFixture, TestBed, async, inject } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ElementRef, EventEmitter } from "@angular/core";
import { CMS_SESSION_STORAGE_ITEM } from "../../cms/models/cms-session-storage-item";
import { HttpModule, Http } from "@angular/http";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { CmsApiService } from "../../cms/api/cms-api.service";
import { CmsVirtualScrollService } from "../cms-virtual-scroll.service";
import { CmsSettingsService } from "../../launchpad/settings/cms-settings.service";
import { CmsClipboardService } from "../clipboard/cms-clipboard.service";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { CmsFavoriteService } from "../cms-favorite.service";
import { AppConfig } from "../../config";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { Display } from "../../cms/models/cms-display";
import { displays, settings } from "./cms-displays-mock";
import { CMSConstants } from "../../cms/models/cms-constants"
import { IUserProfileSettings } from "../../cms/models/cms-user-profile-settings";
import { CmsEventEmitterService } from "../../cms/api/cms-event-emitter.service";


class MockCmsApiService {
    getDisplayList(start: number = 1, count: number = 2147483647, search: string = "", favorite: boolean = false): Observable<Display[]> {
        return Observable.of(displays)
    }
}

class MockActivatedRoute {
}

class MockCmsEventEmitterService{
     get(ID: CMS_EVENTS){
        return ID;
    }
}

class MockSettingsService {
    mUserSettings = settings;
    updateWallConnectionSpecificDisplayId() {
        return Observable.of(null);
    }

    updateWallConnectionRecentDisplayId() {
        return Observable.of(null);
    }
}

class MockRouter {
    navigate(string: string) {
        return string;
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

class MockCmsClipboardService {
    selectedSources = [
        { id: 1 },
        { id: 2 }
    ];
    clear(){
        this.selectedSources = [];
    }
}

describe("CmsDisplayListComponent", () => {
    let component: CmsDisplayListComponent;
    let fixture: ComponentFixture<CmsDisplayListComponent>;
    let cmsSettingsService: CmsSettingsService;
    let cmsApiService: CmsApiService;
    let cmsFavoriteService: CmsFavoriteService;
    let cmsClipboardService: CmsClipboardService;
    let cmsScrollService: CmsVirtualScrollService;
    let translateService: TranslateService;
    let routerService: Router;
    let storageManager: StorageManager;
    let i18n: any;
    let debugInstance, nativeElement;
    let spyMarkObjectAsFavorite: jasmine.Spy, spyMarkObjectAsUnfavorite, spyRemoveScroll, spyAddScroll, spyRouter, spyUpdateSpecificDisplay, spyUpdateRecentDisplay, spyRemove;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CmsDisplayListComponent],
            providers: [
                {
                    provide: Router,
                    useClass: MockRouter
                },
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
                    provide: CmsClipboardService,
                    useClass: MockCmsClipboardService
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
                CmsVirtualScrollService,
                AppConfig,
                TranslateService
            ],
            imports: [
                HttpModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: (http: Http) => new TranslateHttpLoader(http, "base/app/i18n/", ".json"),
                        deps: [Http]
                    }
                })
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(CmsDisplayListComponent);
            component = fixture.componentInstance;
            nativeElement = fixture.nativeElement;
            debugInstance = fixture.debugElement.componentInstance;
            cmsClipboardService = fixture.debugElement.injector.get(CmsClipboardService);
            cmsSettingsService = fixture.debugElement.injector.get(CmsSettingsService);
            cmsScrollService = fixture.debugElement.injector.get(CmsVirtualScrollService);
            routerService = fixture.debugElement.injector.get(Router);
            storageManager = fixture.debugElement.injector.get(StorageManager);

            cmsApiService = fixture.debugElement.injector.get(CmsApiService);
            cmsFavoriteService = fixture.debugElement.injector.get(CmsFavoriteService);
            translateService = fixture.debugElement.injector.get(TranslateService);
            translateService.setDefaultLang("en");


            spyRemove = spyOn(storageManager, "remove").and.returnValue(Observable.of(null));
            spyRouter = spyOn(routerService, "navigate").and.returnValue(Observable.of(null));
            spyAddScroll = spyOn(cmsScrollService, "addScrollListener").and.returnValue(Observable.of(null));
            spyRemoveScroll = spyOn(cmsScrollService, "removeScrollListener").and.returnValue(Observable.of(null));
            spyMarkObjectAsFavorite = spyOn(cmsFavoriteService, "markObjectAsFavorite").and.returnValue(Observable.of(null));
            spyMarkObjectAsUnfavorite = spyOn(cmsFavoriteService, "markObjectAsUnfavorite").and.returnValue(Observable.of(null));
            spyUpdateRecentDisplay =  spyOn(cmsSettingsService, "updateWallConnectionRecentDisplayId").and.returnValue(Observable.of(null));
            spyUpdateSpecificDisplay = spyOn(cmsSettingsService, "updateWallConnectionSpecificDisplayId").and.returnValue(Observable.of(null));
        });
    }));

    it("component should be defined", async(() => {
        expect(component).toBeDefined();
        expect(debugInstance.mCmsServerApi).toBeDefined();
        expect(debugInstance.element).toBeDefined();
        expect(debugInstance.mScroller).toBeDefined();
    }));

    it("should remove scroll event on Destroy LifeCycle Hook", async(() => {
        component.ngOnDestroy();
        expect(cmsScrollService.removeScrollListener).toHaveBeenCalled();
        debugInstance.eventSubscription = null;
    }));

    it("should not let user mark favorite or unfavorite on a disabled source", () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
        });
        component.toggleDisplayFavorite(displays[1]);
        expect(cmsFavoriteService.markObjectAsFavorite).not.toHaveBeenCalled();
        expect(cmsFavoriteService.markObjectAsFavorite).not.toHaveBeenCalled();
    });

    it("should call CmsFavoriteService.markObjectAsFavorite when the selected source is unfavorite", () => {
        fixture.detectChanges();
        component.toggleDisplayFavorite(displays[0]);
        let args = spyMarkObjectAsFavorite.calls.mostRecent().args;
        expect(args[0]).toEqual(displays[0].id);
        expect(args[1]).toEqual(displays[0].type);
        expect(args[2]).toBeFalsy();
    });

    it("should call CmsFavoriteService.markObjectAsUnFavorite when the selected source is favorite", () => {
        fixture.detectChanges();
        component.toggleDisplayFavorite(displays[2]);
        let args = spyMarkObjectAsUnfavorite.calls.mostRecent().args;
        expect(args[0]).toEqual(displays[2].id);
        expect(args[1]).toEqual(displays[2].type);
        expect(args[2]).toBeUndefined();
    });

    it("should check that displays are getting loaded on the OnChange, adds and remove the scroll service", () => {
        fixture.detectChanges();
        component.ngOnChanges(null);
        fixture.whenStable().then(() => {
            expect(cmsScrollService.removeScrollListener).toHaveBeenCalled();
            expect(debugInstance.mDisplays).toEqual(displays);
            expect(debugInstance.mScroller.dataCount).toEqual(displays.length);
            expect(debugInstance.mScroller.max).toBeNull();
            expect(debugInstance.mScroller.count).toEqual(settings.defaultPageSize);
            expect(cmsScrollService.addScrollListener).toHaveBeenCalled();
        });
    });

    it("should render the list on UI based on displays from API", () => {
        component.ngOnChanges(null);
        let container = document.getElementById("display-list-card-container");
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            let displayCollection = fixture.nativeElement.querySelectorAll("cms-card");
            expect(displayCollection.length).toEqual(displays.length);
            //expect(displayCollection[1].localName).toEqual("cms-card.disabled");
        })
    });

    it("should not render the list on UI, if there are  no displays returned by the API", () => {
        debugInstance.mDisplays = [];
        debugInstance.showConfirmationPopup = true;
        let panelTitle;
        let container = document.getElementById("display-list-card-container");
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(fixture.nativeElement.querySelectorAll("div.display-list-unavailable")).not.toBeUndefined();
            let noDisplayText;
            translateService.get("displayList.unavailable").subscribe((response: string) => {
                noDisplayText = response;
            });
            expect(fixture.nativeElement.querySelectorAll("div.display-list-unavailable")[0].firstElementChild.innerText).toEqual(noDisplayText)
        });
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            let common, ndPopup, displayList;
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
                    expect(debugInstance.mDialogMessage).toEqual(displayList.unavailableConfirmation);
                });
            });
        });
    });

    it("should route onConfimation of pop up", () => {
        component.ngOnChanges(null);
        debugInstance.route.params = [{ "action": "selectDisplayForAutoConnect" }];
        component.onConfirmation();
        let args = spyRouter.calls.mostRecent().args;
        expect(args[0]).toEqual(["/settings"]);
        debugInstance.route.params = [{ "action": "jargonText" }];
        component.onConfirmation();
        args = spyRouter.calls.mostRecent().args;
        expect(args[0]).toEqual([`/display-panel/${CMSConstants.NoDisplay}`]);
    });

    it("should connect the display to the wall, and redirect to the sources list", () => {
        component.connectWall(displays[1]);
        expect(cmsSettingsService.updateWallConnectionRecentDisplayId).not.toHaveBeenCalled();
        expect(cmsSettingsService.updateWallConnectionSpecificDisplayId).not.toHaveBeenCalled();     
        debugInstance.route.params = [{ "action": "selectDisplayForAutoConnect" }];
        component.connectWall(displays[0]);
        expect(cmsSettingsService.updateWallConnectionSpecificDisplayId).toHaveBeenCalled(); 
        debugInstance.route.params = [{ "action": "jargonText" }];
        component.connectWall(displays[0]);
        expect(cmsSettingsService.updateWallConnectionRecentDisplayId).toHaveBeenCalled();
        let displayStringify = JSON.stringify(displays[0]);
        expect(window.sessionStorage.getItem(CMS_SESSION_STORAGE_ITEM.Display)).toEqual(displayStringify);
        let args = spyRouter.calls.mostRecent().args;
        expect(debugInstance.cmsClipboardService.selectedSources.length).toEqual(0);
        expect(args[0]).toEqual([`/displays/${displays[0].id}/sources-panel`]);
    });

    it("should not return any more displays if there are still displays to scroll to", ()=>{
        debugInstance.mScroller.max = displays.length;
        debugInstance.mDisplays = [];
        debugInstance.getDisplays();
        expect(debugInstance.mDisplays.length).toEqual(0);
    });

    it("should add displays on scroll to the displays list", ()=>{
        debugInstance.mScroller.max = null;
        debugInstance.mDisplays = [];
        debugInstance.showConfirmationPopup = true;
        debugInstance.getDisplays();
        expect(debugInstance.mDisplays.length).toEqual(displays.length);
        expect(debugInstance.mScroller.loading).toBeFalsy();
        expect(debugInstance.mScroller.max).toBeNull();
        expect(debugInstance.eventSubscription).toBeDefined();
        debugInstance.eventSubscription.next(
            {
                "body": debugInstance.mDisplays[0],
                "uri" : "/1/1/1/1",
                "verb" : "deleted"
            }
        );
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(debugInstance.showConfirmationPopup).toBeFalsy();
            expect(JSON.parse(window.sessionStorage.getItem(CMS_SESSION_STORAGE_ITEM.Display))).not.toBeNull();
            expect(storageManager.remove).toHaveBeenCalled();
        });
    });

    it("should show a dialog popup whenever there are no displays turning up from API", ()=>{
        let displayList;
        debugInstance.mDisplays = [];
        debugInstance.mScroller.max = null;
        debugInstance.searchFilter = "";
        debugInstance.mDialogMessage = "";
        debugInstance.favoriteFilter = false;
        debugInstance.getDisplays();
        expect(debugInstance.showConfirmationPopup).toBeFalsy();
        translateService.get("displayList").subscribe((response: string) => {
            displayList = response;
        });
       // expect(debugInstance.mDialogMessage).toEqual(displayList.unavailableConfirmation);
    });
});
