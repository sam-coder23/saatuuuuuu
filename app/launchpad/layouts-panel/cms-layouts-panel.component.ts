/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { Component, OnInit, AfterViewInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";

import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs/Rx";
import { AppConfig } from "../../config";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { CMS_SESSION_STORAGE_ITEM } from "./../../cms/models/cms-session-storage-item";


/**
 * This is a panel component that defines the layout of a page which includes toolbar and layout list.
 */
@Component({
    //moduleId: module.id,
    selector: "cms-layouts-panel",
    template: require("to-string!./cms-layouts-panel.component.html"),
    styles: [require("to-string!./cms-layouts-panel.component.scss")]
})
export class CmsLayoutsPanelComponent implements OnInit, AfterViewInit {
    /**
     * Filter property which will filter the layout list
     * @property {boolean} isFavoriteFilter
     * @property {string} searchFilter
     */
    private isFavoriteFilter: boolean;
    public searchFilter: string;
    public searchKey: string;

    // all boolean states for the template
    public viewState = {
        reload: false,
        list: true
    };

    private displayId: number; // the selected display id

    // to determine whether to show save layout panel or not
    private showSaveLayoutPanel: boolean = false;

    // layout name to be picked from card selection
    private replaceLayoutName: string = "";

    // text to be shown near bac button
    private toolbarText: string = "";

    /**
     * The constructor initializes various dependencies.
     */
    constructor(private route: ActivatedRoute, private translate: TranslateService, private appConfig: AppConfig, private storageManager: StorageManager) {
        this.isFavoriteFilter = (this.storageManager.get(CMS_SESSION_STORAGE_ITEM.LayoutsFavoriteFilter) === "true") || false;
        this.searchFilter = this.storageManager.get(CMS_SESSION_STORAGE_ITEM.LayoutsSearchFilter) || "";
        this.searchKey = this.searchFilter;
    }

    /**
     * @method ngOnInit
     * On component initialization, fetch display id from route parameters.
     */
    public ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.displayId = Number(params["id"]);

            let actionParam = params["action"];
            if (actionParam === "saveLayout") {
                this.showSaveLayoutPanel = true;

                this.translate.get("saveLayout.toolbarText").subscribe((response: string) => {
                    this.toolbarText = response;
                });
            }
            else {
                this.translate.get("layoutList.connectTo").subscribe((response: string) => {
                    this.toolbarText = response;
                });
            }
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
        let searchInput = document.getElementById("layouts-panel-search-input");
        Observable.fromEvent(searchInput, "keyup")
            .map((e: any) => e.target.value.trim())
            .debounceTime(500)
            .subscribe(searchString => {
                this.searchFilter = searchString;
                this.storageManager.set(CMS_SESSION_STORAGE_ITEM.LayoutsSearchFilter, searchString);
            });

        /**
         * Making an Observable to prevent favorite filter on frequent clicks 
         * on favorite filter icon.
         * Updating layout list by subscribing this Observable.
         */
        let favoriteIcon = document.getElementById("layouts-panel-favorite-button");
        Observable.fromEvent(favoriteIcon, "click")
            .debounceTime(350)
            .subscribe(res => {
                this.isFavoriteFilter = !this.isFavoriteFilter;
                this.storageManager.set(CMS_SESSION_STORAGE_ITEM.LayoutsFavoriteFilter, this.isFavoriteFilter);
            });
    };

    /**
     * On list modified event
     */
    public onListChanged(): void {
        this.viewState.reload = true;
    }

    /**
     * Reload layouts list
     * @pending - need attention
     */
    public reloadList(): void {
        this.viewState.reload = false;
        this.viewState.list = false;
        //window.setImmediate.call(this, () => this.viewState.list = true);
        window.setTimeout(() => {
            this.viewState.list = true;
        }, 0);
    }

    /**
     * This method updates the layout name from selected layout card.
     */
    public replaceLayout(event) {
        this.replaceLayoutName = event.LayoutName;
    }

    /**
     * Focus on search input box
     */
    private initializeSearch(e): void {
        let mdsearch = document.getElementById("layouts-panel-search-input");
        let searchInput: NodeListOf<HTMLInputElement>;
        if (mdsearch) {
            searchInput = mdsearch.getElementsByTagName("input");
            if (searchInput.length) {
                searchInput[0].focus();
            }
        }
    }
}
