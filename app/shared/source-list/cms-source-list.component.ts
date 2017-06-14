/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { Component, OnInit, ElementRef, OnDestroy, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { CmsApiService } from '../../cms/api/cms-api.service';
import { CmsEventEmitterService } from './../../cms/api/cms-event-emitter.service';
import { CMS_EVENTS } from '../../cms/api/cms-events.enum';
import { CmsVirtualScrollService } from '../cms-virtual-scroll.service';
import { Source } from '../../cms/models/cms-source';
import { CMS_SESSION_STORAGE_ITEM } from '../../cms/models/cms-session-storage-item';
import { ICmsEvent } from '../../cms/models/cms-event';
import { CmsClipboardService } from './../clipboard/cms-clipboard.service';
import { CmsFavoriteService } from '../cms-favorite.service';
import { StorageManager } from './../../cms/api/cms-storagemanager.service';
import { DomManager } from '../../utils/dom-manager.util';
import { AppConfig } from '../../config';
import { CmsSettingsService } from './../../launchpad/settings/cms-settings.service';

/**
 * This a source list component that fetches the combined list of available sources, perspectives and display specific
 * applications from CMS Server API and loads the list in UI in the form of cards (representing a single source with 
 * available information about the source, perspective or application).
 */
@Component({
    //moduleId: module.id,
    selector: 'cms-source-list',
    template: require('to-string!./cms-source-list.component.html'),
    styles: [require('to-string!./cms-source-list.component.scss')]
})

export class CmsSourceListComponent implements OnInit, OnChanges, OnDestroy {
    /**
     * These filter properties will hold the filtering data
     * @Input()  {boolean} favoriteFilter 
     * @Input() {string} searchFilter
     */
    @Input() favoriteFilter: boolean;
    @Input() searchFilter: string;

    // an event to emit changes to sources-panel
    @Output('change') changeEmitter = new EventEmitter();

    // id of selected display
    @Input() displayId: number;

    // list of sources to be created as card list
    private mSources: Source[];

    // scroll element
    private mScrollTarget: HTMLElement;

    // dependencies initialized in constructor
    private mRouter: Router;
    private mCmsServerApi: CmsApiService;
    private element: ElementRef;
    private mScroller: CmsVirtualScrollService;
    private mClipboard: CmsClipboardService;
    private mFavoriteService: CmsFavoriteService;

    // it saves the CMS events subscription and unsubscribe them on component destruction
    private mSourceListCmsEvent: EventEmitter<any>;
    
    //Define domManager variable of DomaManager type to handle dom related stuff
    private domManager: DomManager;

    /**
     * The constructor initializes various dependencies.
     */
    constructor(aRouter: Router, aCmsServerApi: CmsApiService, el: ElementRef, aScroller: CmsVirtualScrollService, private cmsSettingsService: CmsSettingsService, aClipboard: CmsClipboardService, private storageManager: StorageManager, aFavoriteService: CmsFavoriteService, private appConfig: AppConfig) {
        this.mRouter = aRouter;
        this.mCmsServerApi = aCmsServerApi;
        this.element = el;
        this.mScroller = aScroller;
        this.mClipboard = aClipboard;
        this.mFavoriteService = aFavoriteService;
        this.domManager = new DomManager(this.element);
    }

    /**
     * On initialization of the component, fetching list of sources, perspectives and applications 
     * from CMS Server API service and initializing sources array.
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
        this.mSources = [];
        this.mScroller.dataCount = 0;
        this.mScroller.max = null;
        this.mScroller.count = this.cmsSettingsService.mUserSettings.defaultPageSize || 20;
        this.mScrollTarget = this.domManager.FirstChild();
        this.getSources();
        

        this.mScroller.addScrollListener(this.mScrollTarget, function () {
            if ( this.mScroller.max == null) {
                this.getSources();
            }
        }.bind(this));        
    }

    /**
     * Cleanup just before Angular destroys the component. 
     * Unsubscribe observables and detach event handlers to avoid memory leaks.
     */
    ngOnDestroy() {
        this.mScroller.removeScrollListener();
        if (this.mSourceListCmsEvent) {
            this.mSourceListCmsEvent.unsubscribe();
        }
    }

    /**
     * This method gets sources from CMS Server API.
     */
    private getSources() {
        // return if no display is found
        if (isNaN(this.displayId)) {
            return;
        }
        //this.appConfig.log("Initially this.mScroller.max ", this.mScroller.max );
        // return if complete list is loaded
        if (this.mScroller.max != null) {
            return;
        }
        this.mCmsServerApi.getSourceList(this.mSources.length + 1, this.mScroller.count, this.displayId, this.searchFilter, this.favoriteFilter)
            .subscribe(
                (sources: Source[]) =>{
                    this.appConfig.log('CmsSourceListComponent: getSources:: Sources list from server = ');

                    this.mScroller.dataCount = sources.length;
                    this.mSources.push(...sources);

                    // if max source has been loaded then set maxSources else again addScrollListener                    
                    if (sources.length < this.mScroller.count) {
                        this.mScroller.max = sources.length;
                    }
                    this.mScroller.loading = false; 

                    // subscribe for source list change events
                    if(!this.mSourceListCmsEvent) {
                        this.mSourceListCmsEvent = CmsEventEmitterService.get(CMS_EVENTS.SourceList)
                        .subscribe((res: { eventType: string, body: any }) => this.handleSourceListEvents(res.eventType, res.body));
                    }
                },
                error =>{
                    this.mScroller.loading = false; 
                }                
            );
    }

    /**
     * On selecting a card, the respective source will be copied to clipboard.
     */
    addSourceToClipboard(source: Source) {
        if(source.disabled) {
            return;
        }
        // store selected source in clipboard
        this.mClipboard.Clipboard = Object.assign({}, source);

        // immediately share content on the display
        let shareContentPromise = this.mClipboard.shareContent(this.displayId)

        if (shareContentPromise) {
            shareContentPromise.then(() => {
                this.back();
            }).catch(() => {
                this.appConfig.log("Error: addSourceToClipboard method failed in cms-source-list.component");
            })
        } else {
            this.back();
        }
    }
    

    /**
     * On selecting favorite button on card, the respective source will be marked as favorite\unfavorite.
     */
    toggleSourceFavorite(source: Source) {
        if (source.disabled) {
            return;
        }

        // if source is favorite, mark it as unfavorite
        if (source.favorite) {
            this.mFavoriteService.markObjectAsUnfavorite(source.id, source.type, this.mSources, this.favoriteFilter);
         }
        // if source is unfavorite, mark it as favorite
        else {
            this.mFavoriteService.markObjectAsFavorite(source.id, source.type, this.mSources);
        }
    }


    /**
     * Event listener to handle source list related events.
     */
    private handleSourceListEvents(anEventType: string, aResponseBody: any) {
        if (anEventType === "ResourceDeleted") {
            // find the source in the source list and disable it
            var source = this.mSources.find(source => source.id === aResponseBody.id);
            if (source) {
                source.disabled = true;
            }

            // clean up the clipboard if it contained the deleted source
            var clipboardSource = JSON.parse(this.storageManager.get(CMS_SESSION_STORAGE_ITEM.Clipboard));
            //window.sessionStorage.getItem('clipboard')
            if (clipboardSource && clipboardSource.id === aResponseBody.id) {
                this.storageManager.remove(CMS_SESSION_STORAGE_ITEM.Clipboard);
                //window.sessionStorage.removeItem(CMS_SESSION_STORAGE_ITEM.Clipboard);
            }
        }

        // send change event to sources panel to show refresh button
        this.changeEmitter.emit();
    }

    /**
     * Redirect to previous route
     */
    private back() {
        window.history.back();
    }
}