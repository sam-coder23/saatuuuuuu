/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { Subscription } from "rxjs/Rx";
import { Component, OnInit, ElementRef, OnDestroy, EventEmitter, Output, Input, OnChanges, SimpleChanges } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { CmsApiService } from "../../cms/api/cms-api.service";
import { CmsEventEmitterService } from "./../../cms/api/cms-event-emitter.service";
import { CMS_EVENTS } from "../../cms/api/cms-events.enum";
import { CmsVirtualScrollService } from "../cms-virtual-scroll.service";
import { ICmsEvent } from "../../cms/models/cms-event";
import { Layout } from "../../cms/models/cms-layout";
import { DomManager } from "../../utils/dom-manager.util";
import { CmsFavoriteService } from "../cms-favorite.service";
import { CmsSettingsService } from "../../launchpad/settings/cms-settings.service";
import { TranslateService } from "@ngx-translate/core";
import { AppConfig } from "../../config";

/**
 * This a layout list component that fetches the list of available layouts from CMS Server API and
 * loads the list in UI in the form of cards (representing a single layout with available information 
 * about the layout).
 * @component 
 */
@Component({
    //moduleId: module.id,
    selector: "cms-layout-list",
    template: require("to-string!./cms-layout-list.component.html"),
    styles: [require("to-string!./cms-layout-list.component.scss")]
})

/**
 * @class CmsLayoutListComponent
 * @constructor constructor
 */
export class CmsLayoutListComponent implements OnInit, OnChanges, OnDestroy {

     /**
     * This property will hold the status whether the component is 
     * initiated or not
     * @property {boolean} isInited
     */
    private isInited: boolean;

    /**
     * These filter input will hold the filtering data
     * @Input  {boolean} favoriteFilterValue 
     * @Input {string} searchFilterValue
     */
    @Input() favoriteFilter: boolean;
    @Input() searchFilter: string;


    mLayouts: Layout[];

    @Input() mDisplayId: number;

    private mScrollTarget: HTMLElement;
    private eventSubscription: Subscription;

    private mRouter: Router;
    private mCmsServerApi: CmsApiService;
    private element: ElementRef;
    private mScroller: CmsVirtualScrollService;

    //Define domManager variable of DomaManager type to handle dom related stuff
    private domManager: DomManager;

    private mShowConfirmationDialog: boolean;
    private mLoadLayoutInfo: Layout;
    private mDialogMessage: string;

    @Output("change") changeEmitter = new EventEmitter();

    //Event for updating layout name to be overridden in save layout
    @Output("replaceLayout") replaceLayoutEmitter = new EventEmitter();

    /** 
     * The constructor initializes various dependencies.
     */
    constructor(aRouter: Router, aCmsServerApi: CmsApiService, el: ElementRef, aScroller: CmsVirtualScrollService, private cmsSettingsService: CmsSettingsService, private favoriteService: CmsFavoriteService, private translate: TranslateService, private route: ActivatedRoute, private appConfig: AppConfig) {
        this.mRouter = aRouter;
        this.mCmsServerApi = aCmsServerApi;
        this.element = el;
        this.mScroller = aScroller;
        this.domManager = new DomManager(this.element);
        this.isInited = false;
    }

    /**
     * On initialization of layout-list component, fetching list of layouts from CMS Server API service
     * and initializing layouts array.
     */
    ngOnInit() {
        
    }
    
    /**
     * This will call the functionality written inside of this block
     * once it will get any changes in input of this component
     * @Hook ngOnChanges
     * @param {SimpleChanges} changes
     */
    ngOnChanges(changes: SimpleChanges){    
        this.mScroller.removeScrollListener();  
        this.mLayouts = [];
        this.mScroller.dataCount = 0;
        this.mScroller.max = null;
        this.mScroller.count = this.cmsSettingsService.mUserSettings.defaultPageSize || 20;
        this.mScrollTarget = this.domManager.FirstChild();
        this.getLayouts(); 

        this.mScroller.addScrollListener(this.mScrollTarget, function () {
            if ( this.mScroller.max == null) {
                this.getLayouts();
            }
        }.bind(this));              
    }
   

    /**
     * Angular"s lifecycle hook ngOnDestroy
     */
    ngOnDestroy() {
        this.mScroller.removeScrollListener();
        if (this.eventSubscription) {
            this.eventSubscription.unsubscribe();
        }
    }


    /**
     * This method gets display specific layouts from CMS Server API.
     */
    getLayouts() {
        if (isNaN(this.mDisplayId)) {
            // return if no display is found
            return;
        }
        if (this.mScroller.max != null) {
            // return if complete list is loaded
            return;
        }

        return this.mCmsServerApi.getLayoutList(this.mDisplayId, this.searchFilter, this.favoriteFilter, this.mLayouts.length + 1, this.mScroller.count)
            .subscribe(
                (layouts: Layout[]) => {
                    this.mScroller.dataCount = layouts.length;
                    this.mLayouts.push(...layouts);

                    // if max layout has been loaded then set maxLayouts else again addScrollListener
                    if (layouts.length < this.mScroller.count) {
                        this.mScroller.max = this.mLayouts.length;
                    }
                    this.mScroller.loading = false;

                    // subscribe for layout list change events
                    if(!this.eventSubscription){
                        this.eventSubscription = CmsEventEmitterService.get(CMS_EVENTS.LayoutList)
                        .subscribe((event: ICmsEvent) => this.handleLayoutListEvents(event));
                    }
                },
                error => {
                    this.mScroller.loading = false;
                }
            )
    }

    /**
     * This methods show confirmation as per user settings and load the layout
     */
    confirmLoadLayout(layout: Layout) {
        if (layout.disabled) {
            return;
        }

        this.route.params.forEach((params: Params) => {
            let actionParam = params["action"];

            // select the layout name for save layout dialog
            if (actionParam === "saveLayout") {
                this.replaceLayoutEmitter.emit({ LayoutName: layout.name });
            }
            // load layout
            else {
                let userSettings = this.cmsSettingsService.mUserSettings;
                let isConfirmationRequired = userSettings.manageWallContent.requireConfirmationforLoadingLayouts;

                if (isConfirmationRequired) {
                    this.showDialogMessage(layout);
                }
                else if (!isConfirmationRequired) {
                    this.loadLayout(layout);
                }
            }
        });
    }

    /**
     * On selecting favorite button on card, the respective layout will be marked as favorite\unfavorite.
     */
    toggleLayoutFavorite(layout: Layout) {
        if (layout.disabled) {
            return;
        }

        let type: string = "layout";

        // if layout is favorite, mark it as unfavorite
        if (layout.favorite) {
            this.favoriteService.markObjectAsUnfavorite(layout.id, type, this.mLayouts, this.favoriteFilter);
        }
        // if layout is unfavorite, mark it as favorite
        else {
            this.favoriteService.markObjectAsFavorite(layout.id, type, this.mLayouts);
        }
    }

    /**
     * Private Methods
     */

    /**
     * Event listener to handle layout list related events
     */
    private handleLayoutListEvents(event: ICmsEvent) {
        if (event.verb.toLowerCase() === "deleted") {
            let id = (<{ id: number }>event.body).id;

            let layout = this.mLayouts.find(d => d.id === id);
            if (layout) {
                layout.disabled = true;
            }
        }
        this.changeEmitter.emit();
    }

    /**
     * On selecting a card, the respective layout will be loaded on mini-layout component.
     */
    private loadLayout(layout: Layout) {
        if (layout.disabled) {
            return;
        }
        this.mCmsServerApi.loadLayout(this.mDisplayId, layout.id)
            .subscribe(() => {
                this.mRouter.navigate([`/display-panel/${this.mDisplayId}`]);
            }, error => {
                this.appConfig.error("CmsLayoutListComponent: loadLayout:: API failed. Error: ", error)

                // handle no permission
                if (error.status === 403) {
                    this.mCmsServerApi.noPermissionErrorHandler(error, "noPermission.loadLayout");
                }
            });
    }

     /**
     * This methods show dialog for confirmation
     */
    private showDialogMessage(layout: Layout) {
        //show confimation dialog
        this.mShowConfirmationDialog = true;
        // store layoutInfo temporary
        this.mLoadLayoutInfo = layout;

        // dialog message using TranslateService
        this.translate.get("settings.loadLayoutConfirmation", { value: layout.name }).subscribe((response: string) => {
            this.mDialogMessage = response;
        });
    }


    /**
     * This methods load layout after confirmation
     */
    private onConfimation() {
        this.mShowConfirmationDialog = false;
        this.loadLayout(this.mLoadLayoutInfo);
        this.mLoadLayoutInfo = null;
    }

    /**
     * This methods cancel load layout after confirmation
     */
    private onCancel() {
        this.mShowConfirmationDialog = false;
        this.mLoadLayoutInfo = null;
    }
}