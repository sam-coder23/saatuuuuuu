/**
 * This class will hold the logic of cms displays panel and hold layout of a displays page which includes toolbar and display list
 * @class CmsDisplaysPanelComponent
 * @constructor constructor This will inject the following dependency storageManager, appConfig, route etc.
 * @property {boolean} isFavoriteFilter Filter property which will filter the display list
 * @property {string} searchFilter Filter property which will filter the display list
 * @property {string} searchKey
 * @property {number} selectedDisplayId
 * @property {boolean} reloadState
 * @property {boolean} listState
 */
import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { fromEvent, map, debounceTime } from "rxjs";

import { CmsApiService } from "../../cms/api/cms-api.service";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { CmsSessionStorageItem } from "../../cms/models/cms-session-storage-item";
import { AppConfig } from "../../config";
import { Validation } from "../../core/util/Validation";

@Component({
    selector: 'cms-displays-panel',
    templateUrl: './cms-displays-panel.component.html',
    styleUrls: ['./cms-displays-panel.component.scss']
})
export class CmsDisplaysPanelComponent implements OnInit, AfterViewInit {
    public isFavoriteFilter: boolean;
    public searchFilter: string;
    public searchKey: string;
    private isSelectDisplayView: boolean = false;
    // all boolean states for the template
    public reloadState: boolean = false;
    public listState: boolean = true;

    constructor(
        private storageManager: StorageManager,
        private appConfig: AppConfig,
        private route: ActivatedRoute,
        private cmsServerApi: CmsApiService) {
        this.isFavoriteFilter = this.storageManager.getItem(CmsSessionStorageItem.DISPLAYS_FAVORITE_FILTER) === String(true);
        this.searchFilter = this.storageManager.getItem(CmsSessionStorageItem.DISPLAYS_SEARCH_FILTER) || "";
        this.searchKey = this.searchFilter;
    }

    public ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            const actionParam: string = params["action"];
        });
    }

    public ngAfterViewInit(): void {
        const dTime: number = 500;
        /**
         * Making an Observable to get the string token from
         * HTML search input control and update the searchFilter by
         * subscribing this Observable
         */
        const searchInput: HTMLElement = document.getElementById("display-list-search-input");
        fromEvent(searchInput, "keyup").pipe(
            map((e: any) => e.target.value.trim()),
            debounceTime(dTime))
            .subscribe((searchString: string) => {
                this.searchFilter = searchString;
                this.storageManager.setItem(CmsSessionStorageItem.DISPLAYS_SEARCH_FILTER, searchString);
            });
    }

    /**
     * Use this method to mark and unmark favorite displays
     * @method setFavourite
     * @return void
     */
    public setFavourite(): void {
        this.isFavoriteFilter = !this.isFavoriteFilter;
        this.storageManager.setItem(CmsSessionStorageItem.DISPLAYS_FAVORITE_FILTER, this.isFavoriteFilter);
    }

    /**
     * On list modified event
     * @method onListChanged
     * @return void
     */
    public onListChanged(): void {
        this.reloadState = true;
    }

    /**
     * This method reloads the displays list.
     * @method reloadList
     * @return void
     */
    public reloadList(): void {
        this.reloadState = false;
        this.listState = false;
        window.setTimeout(() => {
            this.listState = true;
        }, 0);
    }

    /**
     * This method returns the selected display if any.
     * @method isDisplaySelected
     * @return {boolean}
     */
    private isDisplaySelected(): boolean {
        return !Validation.IS_NULL(this.storageManager.getItem(CmsSessionStorageItem.DISPLAY));
    }

    /**
     * This method focus on search input box
     * @method initializeSearch
     * @param {event} e
     * @return void
     */
    public initializeSearch(e: any): void {
        const mdsearch: HTMLElement = document.getElementById("display-list-search-input");
        let searchInput: HTMLCollectionOf<HTMLInputElement>;
        if (mdsearch) {
            searchInput = mdsearch.getElementsByTagName("input");
            if (searchInput.length) {
                searchInput[0].focus();
            }
        }
    }
}
