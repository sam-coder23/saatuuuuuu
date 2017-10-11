/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { Subscription } from "rxjs/Rx";
import { Component, OnInit, ElementRef, OnDestroy, EventEmitter, Input, Output, OnChanges, SimpleChanges } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { CmsApiService } from "../../cms/api/cms-api.service";
import { CmsEventEmitterService } from "./../../cms/api/cms-event-emitter.service";
import { CmsClipboardService } from "./../clipboard/cms-clipboard.service";
import { CMS_EVENTS } from "../../cms/api/cms-events.enum";
import { CmsVirtualScrollService } from "../cms-virtual-scroll.service";
import { CMS_SESSION_STORAGE_ITEM } from "../../cms/models/cms-session-storage-item";
import { ICmsEvent } from "../../cms/models/cms-event";
import { Display } from "../../cms/models/cms-display";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { DomManager } from "../../utils/dom-manager.util";
import { CmsFavoriteService } from "../cms-favorite.service";
import { CmsSettingsService } from "../../launchpad/settings/cms-settings.service";
import { TranslateService } from "@ngx-translate/core";
import { CMSConstants } from "../../cms/models/cms-constants";
import { AppConfig } from "../../config";


/**
 * This a display list component that fetches the list of available displays from CMS Server API and
 * loads the list in UI in the form of cards (representing a single display with available information 
 * about the display).
 */
@Component({
    //moduleId: module.id,
    selector: "cms-display-list",
    template: require("to-string!./cms-display-list.component.html"),
    styles: [require("to-string!./cms-display-list.component.scss")]
})

/**
 * This class is reponsible display the list of display
 * @class CmsDisplayListComponent
 * @constructor constructor  This will inject following dependency Router, CmsApiService, ElementRef, CmsVirtualScrollService, CmsClipboardServic etc/
 * @pending - as of dataCount is used to control the rendering however ngLife cycle has to be seen in detail to get rid
 * of this. If we refactor this there are other components those has to be refactoered as well.
 */
export class CmsDisplayListComponent implements OnInit, OnChanges, OnDestroy {

    /**
     * These filter properties will hold the filtering data
     * @Input()  {boolean} favoriteFilter 
     * @Input() {string} searchFilter
     */
    @Input() favoriteFilter: boolean;
    @Input() searchFilter: string;

    mDisplays: Display[];

    private mScrollTarget: HTMLElement;
    private eventSubscription: Subscription;

    private mRouter: Router;
    private mCmsServerApi: CmsApiService;
    private element: ElementRef;
    private mScroller: CmsVirtualScrollService;

    //Define domManager variable of DomaManager type to handle dom related stuff
    private domManager: DomManager;
    private action: string;

    @Output("change") changeEmitter = new EventEmitter();

    private showConfirmationPopup: boolean = false;
    private mDialogMessage: string;

    /**
     * The constructor initializes various dependencies.
     */
    constructor(aRouter: Router, aCmsServerApi: CmsApiService, el: ElementRef, aScroller: CmsVirtualScrollService, private cmsClipboardService: CmsClipboardService, private storageManager: StorageManager, private cmsSettingsService: CmsSettingsService, private route: ActivatedRoute, private favoriteService: CmsFavoriteService, private translate: TranslateService, private appConfig: AppConfig) {
        this.mRouter = aRouter;
        this.mCmsServerApi = aCmsServerApi;
        this.element = el;
        this.mScroller = aScroller;
        this.domManager = new DomManager(this.element);
    }

    /**
     * On initialization of display-list component, fetching list of displays from CMS Server API service
     * and initializing displays array.
     */
    ngOnInit() {

    }

    /**
     * This will call the functionality written inside of this block
     * once it will get any changes in input of this component
     * @Hook ngOnChanges
     * @param {SimpleChanges} changes
     */
    ngOnChanges(cahnges: SimpleChanges) {
        this.mScroller.removeScrollListener();
        this.mDisplays = [];
        this.mScroller.dataCount = 0;
        this.mScroller.max = null;
        this.mScroller.count = this.cmsSettingsService.mUserSettings.defaultPageSize || 20;
        this.mScrollTarget = this.domManager.FirstChild();
        this.getDisplays();

        this.mScroller.addScrollListener(this.mScrollTarget, function () {
            if (this.mScroller.max == null) {
                this.getDisplays();
            }
        }.bind(this));
    }

    /**
     * Cleanup just before Angular destroys the component. 
     * Unsubscribe observables and detach event handlers to avoid memory leaks.
     */
    ngOnDestroy() {
        this.mScroller.removeScrollListener();
        if (this.eventSubscription)
            this.eventSubscription.unsubscribe();
    }

    /**
     * This method gets all displays from CMS Server API.
     */
    getDisplays() {
        if (this.mScroller.max != null) {
            return;
        }

        return this.mCmsServerApi.getDisplayList(this.mDisplays.length + 1, this.mScroller.count, this.searchFilter, this.favoriteFilter)
            .subscribe(
            (displays: Display[]) => {
                this.mScroller.dataCount = displays.length;
                this.mDisplays.push(...displays);

                // if max display has been loaded then set maxDisplays else again addScrollListener  
                if (displays.length < this.mScroller.count) {
                    this.mScroller.max = this.mDisplays.length;
                }
                this.mScroller.loading = false;

                // subscribe for display list change events
                if (!this.eventSubscription) {
                    this.eventSubscription = CmsEventEmitterService.get(CMS_EVENTS.DisplayList)
                        .subscribe((event: ICmsEvent) => this.handleDisplayListEvents(event));
                }

                // show dialog if no displays are available
                if (this.mDisplays.length === 0 && this.searchFilter === "" && !this.favoriteFilter) {
                    this.showDialogMessage();
                }
            },
            error => {
                this.mScroller.loading = false;
                this.showDialogMessage();
            });
    }

    /**
     * On selecting a card, the respective display will be loaded on mini-display component.
     */
    connectWall(display: Display) {
        if (display.disabled) {
            return;
        }

        // fetch the param and select the display for wall auto-connection
        this.route.params.forEach((params: Params) => {
            let actionParam = params["action"];

            if (actionParam === "selectDisplayForAutoConnect") {
                this.cmsSettingsService.updateWallConnectionSpecificDisplayId(display);
            }
            else {
                //update recentDisplayId on user profile data 
                this.cmsSettingsService.updateWallConnectionRecentDisplayId(display);

                window.sessionStorage.setItem(CMS_SESSION_STORAGE_ITEM.Display, JSON.stringify(display));
                this.cmsClipboardService.clear();
                this.cmsClipboardService.selectedSources.length = 0;
                this.mRouter.navigate([`/displays/${display.id}/sources-panel`]);
            }
        });
    }

    /**
     * On selecting favorite button on card, the respective display will be marked as favorite\unfavorite.
     */
    toggleDisplayFavorite(display: Display) {
        if (display.disabled) {
            return;
        }

        // if display is favorite, mark it as unfavorite
        if (display.favorite) {
            this.favoriteService.markObjectAsUnfavorite(display.id, display.type, this.mDisplays, this.favoriteFilter);
        }
        // if display is unfavorite, mark it as favorite
        else {
            this.favoriteService.markObjectAsFavorite(display.id, display.type, this.mDisplays);
        }
    }

    /**
     * On displays unavailable dialog confirmation, route user to display panel.
     */
    public onConfirmation() {
        this.route.params.forEach((params: Params) => {
            let actionParam = params["action"];

            if (actionParam === "selectDisplayForAutoConnect") {
                this.mRouter.navigate(["/settings"]);
            }
            else {
                this.mRouter.navigate([`/display-panel/${CMSConstants.NoDisplay}`]);
            }
        });
    }

    /**
     * This methods show dialog for confirmation
     */
    private showDialogMessage() {
        //show confimation dialog
        this.showConfirmationPopup = true;

        // dialog message using TranslateService
        this.translate.get("displayList.unavailableConfirmation").subscribe((response: string) => {
            this.mDialogMessage = response;
        });
    }

    /**
     * Event listener to handle display list related events
     */
    private handleDisplayListEvents(event: ICmsEvent) {
        //show confimation dialog
        this.showConfirmationPopup = false;

        if (event.verb.toLowerCase() === "deleted") {
            let id = (<{ id: number }>event.body).id;

            let display = this.mDisplays.find(d => d.id === id);
            if (display) {
                display.disabled = true;
            }

            display = JSON.parse(this.storageManager.get(CMS_SESSION_STORAGE_ITEM.Display));
            if (display && display.id === id) {
                this.storageManager.remove(CMS_SESSION_STORAGE_ITEM.Display);
            }
        }
        this.changeEmitter.emit();
    }
}