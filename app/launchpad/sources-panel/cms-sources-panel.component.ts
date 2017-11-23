/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { Component, OnInit, AfterViewInit, ElementRef } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { DomManager } from "../../utils/dom-manager.util";
import { Observable } from "rxjs/Rx";
import { AppConfig } from "../../config";
import { CMS_SESSION_STORAGE_ITEM } from "../../cms/models/cms-session-storage-item";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { TranslateService } from "@ngx-translate/core";
import { CmsSourceListComponent } from "../../shared/source-list/cms-source-list.component"
import { TilePresetManager } from "../../utils/tilepreset-manager.util";
import { ITilePreset } from "../../cms/models/cms-tile-preset";
import { CmsApiService } from "../../cms/api/cms-api.service";
import { CmsSettingsService } from "../settings/cms-settings.service";
import { CMSConstants } from "../../cms/models/cms-constants";
import { Source } from "../../cms/models/cms-source";

/**
 * This is a panel component that defines the layout of a page which includes toolbar and source list.
 */
@Component({
    //moduleId: module.id,
    selector: "cms-sources-panel",
    template: require("to-string!./cms-sources-panel.component.html"),
    styles: [require("to-string!./cms-sources-panel.component.scss")]
})
export class CmsSourcesPanelComponent implements OnInit {
    private mCmsServerApi: CmsApiService;
    /**
      * Filter property which will filter the source list
      * @property {boolean} isFavoriteFilter
      * @property {string} searchFilter
      */
    private isFavoriteFilter: boolean;
    public searchFilter: string;
    public searchKey: string;
    private domManager: DomManager;
    // all boolean states for the template
    mStates = {
        reload: false,
        list: true
    }

    // active route
    private mRoute: ActivatedRoute;

    // the selected display id
    private mDisplayId: number;

    private panelTitle: string;

    private maxSelection = CMSConstants.MAXSELECTION;
    private errorMessage: string;

    /**
     * The constructor initializes various dependencies.
     */
    constructor(aRoute: ActivatedRoute, private appConfig: AppConfig, private storageManager: StorageManager,
        private router: Router, private cmsSettingService: CmsSettingsService, private translate: TranslateService, 
        private aCmsServerApi: CmsApiService, private element: ElementRef) {
        this.isFavoriteFilter = (this.storageManager.get(CMS_SESSION_STORAGE_ITEM.SOURCES_FAVORITE_FILTER) === "true") || false;
        this.searchFilter = this.storageManager.get(CMS_SESSION_STORAGE_ITEM.SOURCES_SEARCH_FILTER) || "";
        this.searchKey = this.searchFilter;
        this.mRoute = aRoute;
        this.mCmsServerApi = aCmsServerApi;
        this.domManager = new DomManager(this.element);
    }

    /**
     * On component initialization, fetch display id from route parameters.
     */
    ngOnInit() {

        this.mRoute.params.forEach((params: Params) => {
            this.mDisplayId = +params["id"];
        });

        this.translate.get("sourceList.connectTo", { value: CMSConstants.MAXSELECTION }).subscribe((response: string) => {
            this.panelTitle = response;
        });
    }

    /**
      * This will register the functionality written inside of this block
      * once component intialize successfully 
      * @Hook {void} ngAfterViewInit Ng Life cycle hook
      */
    ngAfterViewInit() {
        /**
         * Making an Observable to get the string token from 
         * HTML search input control and update the searchFilter by
         * subscribing this Observable
         */
        let searchInput = this.domManager.getElementById("sources-panel-search-input");
        Observable.fromEvent(searchInput, "keyup")
            .map((e: any) => e.target.value.trim())
            .debounceTime(500)
            .subscribe(searchString => {
                this.searchFilter = searchString;
                this.storageManager.set(CMS_SESSION_STORAGE_ITEM.SOURCES_SEARCH_FILTER, searchString);
            });
    };

    /**
     * Use this method to mark and unmark favorite sources
     */
    setFavourite(): void {
        this.isFavoriteFilter = !this.isFavoriteFilter;
        this.storageManager.set(CMS_SESSION_STORAGE_ITEM.SOURCES_FAVORITE_FILTER, this.isFavoriteFilter);
    }

    /**
     * On list modified event
     */
    onListChanged(): void {
        this.mStates.reload = true;
    }

    /**
     * Reload sources list
     */
    reloadList(): void {
        this.mStates.reload = false;
        this.mStates.list = false;
        //window.setImmediate.call(this, () => this.mStates.list = true);
        window.setTimeout(() => {
            this.mStates.list = true
        }, 0);
    }

    /**
     * Focus on search input box
     */
    private initializeSearch(e): void {
        let mdsearch = this.domManager.getElementById("sources-panel-search-input");
        let searchInput: NodeListOf<HTMLInputElement>;
        if (mdsearch) {
            searchInput = mdsearch.getElementsByTagName("input");
            if (searchInput.length) {
                searchInput[0].focus();
            }
        }
    }


    /**
     * navigateNext
     */
    public navigateNext(): void {
        this.updateDisplayWall();
    }

    private updateDisplayWall() {
        let selectedSourcesLength = this.cmsSettingService.selectedSources.length;
        let resources = new Array(selectedSourcesLength);
        // Clone sources and delete selected property; API service rejects extra properties;
        for (let resourceIndex = 0; resourceIndex < resources.length; resourceIndex++) {
            resources[resourceIndex] = new Source(this.cmsSettingService.selectedSources[resourceIndex]);
            delete resources[resourceIndex].selected;
        }
        let requestPayload = {
            "resources": resources
        };

        this.mCmsServerApi.getTilePresets().subscribe((tilers) => {
            let tileId = TilePresetManager.GetTileId(tilers, selectedSourcesLength, this.mDisplayId);

            if (tileId === 0) {
                this.setErrorMessage("sourceList.tileLayoutNotAvailable");
            } else {
                this.mCmsServerApi.putContentsOnDisplay(this.mDisplayId, tileId, requestPayload).subscribe(response => {
                    let url = `/displays/${this.mDisplayId}/tiles-panel?sourceCount=${selectedSourcesLength}`;
                    this.router.navigateByUrl(url);
                }, error => {
                    this.appConfig.error(error);
                });
            }
        }, (error) => {
            this.appConfig.error(error);
            this.setErrorMessage("sourceList.tileLayoutNotAvailable");
        });
    }

    /**
     * navigateBack
     */
    public navigateBack(): void {
        this.router.navigateByUrl(`/displays-panel`);
    }

    /**
     * Sets translated error message
     * @param messageKey : key for translation
     */
    private setErrorMessage(messageKey: string): void {
        this.translate.get(messageKey).subscribe((value) => {
            this.errorMessage = value;
        });
    }
}