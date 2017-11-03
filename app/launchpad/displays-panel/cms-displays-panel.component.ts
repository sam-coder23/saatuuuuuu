/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { Component, OnInit, AfterViewInit } from "@angular/core";

import { CMS_SESSION_STORAGE_ITEM } from "../../cms/models/cms-session-storage-item";
import { StorageManager} from "../../cms/api/cms-storagemanager.service";
import { Display } from "../../cms/models/cms-display";
import { Observable } from "rxjs/Rx";
import { AppConfig } from "../../config";
import { Validation } from "../../core/util/Validation";

/**
 * This is a panel component that defines the layout of a page which includes toolbar and display list.
 */
@Component({
    //moduleId: module.id,
    selector: "cms-displays-panel",
    template: require("to-string!./cms-displays-panel.component.html"),
    styles: [require("to-string!./cms-displays-panel.component.scss")]
})
export class CmsDisplaysPanelComponent implements OnInit, AfterViewInit {
   /**
     * Filter property which will filter the display list
     * @property {boolean} isFavoriteFilter
     * @property {string} searchFilter
     */
    private isFavoriteFilter: boolean;
    public searchFilter: string;
    public searchKey: string;

   
    // all boolean states for the template
    viewState = {
        back: false,
        reload: false,
        list: true
    }

    private selectedDisplayId: number;
    
    constructor(private storageManager: StorageManager, private appConfig: AppConfig) {
        this.isFavoriteFilter = (this.storageManager.get(CMS_SESSION_STORAGE_ITEM.DisplaysFavoriteFilter) === "true") || false;
        this.searchFilter = this.storageManager.get(CMS_SESSION_STORAGE_ITEM.DisplaysSearchFilter) || "";
        this.searchKey = this.searchFilter;
     }

    /**
     * On Component initialization, disable back button if no display is selected.
     */
    ngOnInit() {
        // disable back button if no display is selected
        this.viewState.back = this.isDisplaySelected();
        
        if(this.isDisplaySelected()){
            let display = <Display>JSON.parse(window.sessionStorage.getItem(CMS_SESSION_STORAGE_ITEM.Display));
            this.selectedDisplayId = display.id;
        }
    }

   /**
     * This will register the functionality written inside of this block
     * once component intialize successfully 
     * @Hook {void} ngAfterViewInit Ng Life cycle hook
     */
    ngAfterViewInit(){
        /**
         * Making an Observable to get the string token from 
         * HTML search input control and update the searchFilter by
         * subscribing this Observable
         */
        let searchInput =  document.getElementById("display-list-search-input");
        Observable.fromEvent(searchInput, "keyup")
                 .map((e:any) => e.target.value.trim())
                 .debounceTime(500)
                 .subscribe(searchString => {
                    this.searchFilter = searchString;
                    this.storageManager.set(CMS_SESSION_STORAGE_ITEM.DisplaysSearchFilter, searchString);
                });

        /**
         * Making an Observable to prevent favorite filter on frequent clicks 
         * on favorite filter icon.
         * Updating display list by subscribing this Observable.
         */
        let favoriteIcon =  document.getElementById("display-list-favorite-button");
        Observable.fromEvent(favoriteIcon, "click")
                 .debounceTime(350)
                 .subscribe(res => {
                    this.isFavoriteFilter = !this.isFavoriteFilter;
                    this.storageManager.set(CMS_SESSION_STORAGE_ITEM.DisplaysFavoriteFilter, this.isFavoriteFilter);
                });
    };

    /**
     * On list modified event
     */
    onListChanged(): void {
        // disable back button if no display is selected
        this.viewState.back = this.isDisplaySelected();
        this.viewState.reload = true;
    }

    /**
     * This method reloads the displays list.
     * @pending
     */
    reloadList(): void {
        this.viewState.reload = false;
        this.viewState.list = false;
        window.setTimeout(() => {
             this.viewState.list = true
        },0);
       // window.setImmediate.call(this, () => this.viewState.list = true);
    }

    /**
     * This method returns the selected display if any.
     */
    private isDisplaySelected(): boolean {
        return !Validation.IsNull(this.storageManager.get(CMS_SESSION_STORAGE_ITEM.Display));
    }

    /**
     * Focus on search input box
     */
    private initializeSearch(e): void{
        let mdsearch = document.getElementById("display-list-search-input");
        let searchInput: NodeListOf<HTMLInputElement>;
        if(mdsearch){
            searchInput = mdsearch.getElementsByTagName("input");
            if(searchInput.length){
                searchInput[0].focus();
            }
        }
    }
}