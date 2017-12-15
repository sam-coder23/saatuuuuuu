import { Component, OnInit, AfterViewInit, ElementRef } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { DomManager } from "../../utils/dom-manager.util";
import { Observable } from "rxjs/Rx";
import { AppConfig } from "../../config";
import { CMS_SESSION_STORAGE_ITEM } from "../../cms/models/cms-session-storage-item";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { TranslateService } from "@ngx-translate/core";
import { TilePresetManager } from "../../utils/tilepreset-manager.util";
import { CmsApiService } from "../../cms/api/cms-api.service";
import { CmsSettingsService } from "../settings/cms-settings.service";
import { CMSConstants } from "../../cms/models/cms-constants";
import { Source } from "../../cms/models/cms-source";
import { Display } from "./../../cms/models/cms-display";

/**
 * This is a panel component that defines the layout of a page which includes toolbar and source list.
 * @class CmsSourcesPanelComponent
 * @property {CmsApiService} cmsServerApi
 * @property {boolean} isFavoriteFilter
 * @property {string} searchFilter
 * @property {DomManager} domManager
 * @property {ActivatedRoute} route
 * @property {number} displayId
 * @property {string} panelTitle
 * @property {number} maxSelection
 * @property {string} errorMessage
 * @property {object} states
 * @property {string} searchFilter
 * @property {string} searchKey
 */
@Component({
    //moduleId: module.id,
    selector: "cms-sources-panel",
    template: require("./cms-sources-panel.component.html"),
    styles: [require("./cms-sources-panel.component.scss")]
})
export class CmsSourcesPanelComponent implements OnInit {
    private isFavoriteFilter: boolean;
    private domManager: DomManager;
    private displayId: number;
    private panelTitle: string;
    private maxSelection: number = CMSConstants.MAXSELECTION;
    private errorMessage: string;
    private states = {
        reload: false,
        list: true
    }
    public searchFilter: string;
    public searchKey: string;

    constructor(
        private route: ActivatedRoute,
        private appConfig: AppConfig,
        private storageManager: StorageManager,
        private router: Router,
        private cmsSettingService: CmsSettingsService,
        private translate: TranslateService,
        private cmsServerApi: CmsApiService,
        private element: ElementRef) {

        this.isFavoriteFilter = (this.storageManager.get(CMS_SESSION_STORAGE_ITEM.SOURCES_FAVORITE_FILTER) === "true") || false;
        this.searchFilter = this.storageManager.get(CMS_SESSION_STORAGE_ITEM.SOURCES_SEARCH_FILTER) || "";
        this.searchKey = this.searchFilter;
        this.domManager = new DomManager(this.element);
    }

    public ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.displayId = +params["id"];
        });

        this.translate.get("sourceList.connectTo", { value: CMSConstants.MAXSELECTION }).subscribe((response: string) => {
            this.panelTitle = response;
        });
    }

    public ngAfterViewInit() {
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
     * This method listen list changes
     * @method onListChanged
     * @return void
     */
    public onListChanged(): void {
        this.states.reload = true;
    }

    /**
     * This method use this method to mark and unmark favorite sources
     * @method setFavourite
     * @return void
     */
    private setFavourite(): void {
        this.isFavoriteFilter = !this.isFavoriteFilter;
        this.storageManager.set(CMS_SESSION_STORAGE_ITEM.SOURCES_FAVORITE_FILTER, this.isFavoriteFilter);
    }

    /**
     * This method reload sources list
     * @method reloadList
     * @return void
     */
    private reloadList(): void {
        this.states.reload = false;
        this.states.list = false;
        window.setTimeout(() => {
            this.states.list = true
        }, 0);
    }

    /**
     * This method focus on search input box
     * @method initializeSearch
     * @param {event} e
     * @return void
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
     * This method navigate to Next page
     * @method navigateNext
     * @return void
     */
    public navigateNext(): void {
        let selectedSourcesLength = this.cmsSettingService.selectedSources.length;
        this.isSelectedSameAsSharedSource((sameAsShared) => {
            if (sameAsShared) {
                let url = `/displays/${this.displayId}/tiles-panel?sourceCount=${selectedSourcesLength}`;
                this.router.navigateByUrl(url);
            } else {
                this.updateDisplayWall();
            }
        });
    }

    /**
     * This method update wall as per selected sources
     * @method updateDisplayWall
     * @return void
     */
    private updateDisplayWall(): void {
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

        this.cmsServerApi.getTilePresets().subscribe((tilers) => {
            let tileId = TilePresetManager.GetTileId(tilers, selectedSourcesLength, this.displayId);

            if (tileId === 0) {
                this.setErrorMessage("sourceList.tileLayoutNotAvailable");
            }
            else {
                this.cmsServerApi.putContentsOnDisplay(this.displayId, tileId, requestPayload).subscribe(response => {
                    let url = `/displays/${this.displayId}/tiles-panel?sourceCount=${selectedSourcesLength}`;
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
     * This method will check if all selected source are same as shared sources
     * Then sameAsShared is true, a new tile will not be applied
     * @method isSelectedSameAsSharedSource
     * @param {method} callback
     */
    private isSelectedSameAsSharedSource(callback) {
        let selectedSources = this.cmsSettingService.selectedSources;
        let selectedSourceMatched = false;
        this.cmsServerApi.getSelectedDisplayContent(this.displayId).subscribe((display) => {
            let sharedcontent = display.content;
            if (selectedSources.length === sharedcontent.length) {
                for (let selectedSourceIndex = 0; selectedSourceIndex < selectedSources.length; selectedSourceIndex++) {
                    let source = selectedSources[selectedSourceIndex];
                    for (let contentIndex = 0; contentIndex < sharedcontent.length; contentIndex++) {
                        if ((source.id === sharedcontent[contentIndex].resourceId) && (source.type.toLowerCase() === sharedcontent[contentIndex].type.toLowerCase())) {
                            selectedSourceMatched = true;
                            break;
                        }
                        else {
                            selectedSourceMatched = false;
                        }
                    }
                }
            }
            else {
                selectedSourceMatched = false;
            }

            if (typeof callback === "function") {
                callback(selectedSourceMatched);
            }
        });
    }

    /**
     * This method navigate to back page
     * @method navigateBack
     * @return void
     */
    public navigateBack(): void {
        this.router.navigateByUrl(`/displays-panel`);
    }

    /**
     * Sets translated error message
     * @param messageKey : key for translation
     * @return void
     */
    private setErrorMessage(messageKey: string): void {
        this.translate.get(messageKey).subscribe((value) => {
            this.errorMessage = value;
        });
    }

    /**
     * This method logs out the user and performs clean up
     * @method logout
     * @return void
     */
    private logout(): void {
        this.cmsServerApi.logoutUser();
    }
}