import { Component, OnInit, AfterViewInit } from "@angular/core";
import { CMS_SESSION_STORAGE_ITEM } from "../../cms/models/cms-session-storage-item";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { Display } from "../../cms/models/cms-display";
import { Observable } from "rxjs/Rx";
import { AppConfig } from "../../config";
import { Validation } from "../../core/util/Validation";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { CMSConstants } from "../../cms/models/cms-constants";
import { CmsApiService } from "../../cms/api/cms-api.service";

@Component({
    //moduleId: module.id,
    selector: "cms-displays-panel",
    template: require("./cms-displays-panel.component.html"),
    styles: [require("./cms-displays-panel.component.scss")]
})

/**
 * This class will hold the logic of cms displays panel and hold layout of a displays page which includes toolbar and display list
 * @class CmsDisplaysPanelComponent
 * @constructor constructor This will inject the following dependency storageManager, appConfig, route etc.
 * @property {boolean} isFavoriteFilter Filter property which will filter the display list
 * @property {string} searchFilter Filter property which will filter the display list
 * @property {string} searchKey
 * @property {boolean} isBackButton Show and Hide Back button visibility
 * @property {number} selectedDisplayId
 * @property {object} viewState
 */
export class CmsDisplaysPanelComponent implements OnInit, AfterViewInit {
    private isFavoriteFilter: boolean;
    private searchFilter: string;
    private searchKey: string;
    private isBackButton: boolean = false;
    private selectedDisplayId: number;

    // all boolean states for the template
    private viewState = {
        back: false,
        reload: false,
        list: true
    };

    constructor(private storageManager: StorageManager, 
        private appConfig: AppConfig, 
        private route: ActivatedRoute, 
        private cmsServerApi: CmsApiService) {
        this.isFavoriteFilter = this.storageManager.get(CMS_SESSION_STORAGE_ITEM.DISPLAYS_FAVORITE_FILTER) === String(true);
        this.searchFilter = this.storageManager.get(CMS_SESSION_STORAGE_ITEM.DISPLAYS_SEARCH_FILTER) || "";
        this.searchKey = this.searchFilter;
    }

    public ngOnInit() {
        // disable back button if no display is selected
        this.viewState.back = this.isDisplaySelected();

        if (this.isDisplaySelected()) {
            let display = <Display>JSON.parse(window.sessionStorage.getItem(CMS_SESSION_STORAGE_ITEM.DISPLAY));
            this.selectedDisplayId = display.id;
        }

        this.route.params.forEach((params: Params) => {
            let actionParam = params["action"];

            // Check for change in settings for specific selected wall.
            if (actionParam === CMSConstants.SELECT_DISPLAY) {
                this.isBackButton = true;
            }
        });
    }

    public ngAfterViewInit() {
        /**
         * Making an Observable to get the string token from 
         * HTML search input control and update the searchFilter by
         * subscribing this Observable
         */
        let searchInput = document.getElementById("display-list-search-input");
        Observable.fromEvent(searchInput, "keyup")
            .map((e: any) => e.target.value.trim())
            .debounceTime(500)
            .subscribe(searchString => {
                this.searchFilter = searchString;
                this.storageManager.set(CMS_SESSION_STORAGE_ITEM.DISPLAYS_SEARCH_FILTER, searchString);
            });
    };

    /**
     * Use this method to mark and unmark favorite displays
     */
    setFavourite(): void {
        this.isFavoriteFilter = !this.isFavoriteFilter;
        this.storageManager.set(CMS_SESSION_STORAGE_ITEM.DISPLAYS_FAVORITE_FILTER, this.isFavoriteFilter);
    }

    /**
     * On list modified event
     */
    private onListChanged(): void {
        // disable back button if no display is selected
        this.viewState.back = this.isDisplaySelected();
        this.viewState.reload = true;
    }

    /**
     * This method reloads the displays list.
     * @method reloadList
     * @return {void} 
     */
    private reloadList(): void {
        this.viewState.reload = false;
        this.viewState.list = false;
        window.setTimeout(() => {
            this.viewState.list = true
        }, 0);
    }

    /**
     * This method returns the selected display if any.
     * @method isDisplaySelected
     * @return {boolean}  
     */
    private isDisplaySelected(): boolean {
        return !Validation.IsNull(this.storageManager.get(CMS_SESSION_STORAGE_ITEM.DISPLAY));
    }

    /**
     * This method focus on search input box
     * @method initializeSearch
     * @param {event} e
     * @return {void} 
     */
    private initializeSearch(e): void {
        let mdsearch = document.getElementById("display-list-search-input");
        let searchInput: NodeListOf<HTMLInputElement>;
        if (mdsearch) {
            searchInput = mdsearch.getElementsByTagName("input");
            if (searchInput.length) {
                searchInput[0].focus();
            }
        }
    }

    /**
     * This method navigate to back page
     * @method navigateBack
     * @return {void}
     */
    private navigateBack() {
        history.back();
    }

    /**
     * This method logs out the user and performs clean up
     * @method logout
     * @return {void}
     */
    private logout() {
        this.cmsServerApi.logoutUser();
    }
}