/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { Component, OnInit, OnDestroy, EventEmitter } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Router, ActivatedRoute, Params } from "@angular/router";

import "rxjs/add/operator/toPromise";

import { CmsApiService } from "../../cms/api/cms-api.service";
import { CmsClipboardService } from "../../shared/clipboard/cms-clipboard.service";
import { CmsResource } from "./../../cms/models/cms-resource";
import { CMS_SESSION_STORAGE_ITEM } from "../../cms/models/cms-session-storage-item";
import { Source } from "./../../cms/models/cms-source";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { CmsSettingsService } from "./../../launchpad/settings/cms-settings.service";
import { CmsEventEmitterService } from "../../cms/api/cms-event-emitter.service";
import { CMS_EVENTS } from "../../cms/api/cms-events.enum";
import { TranslateService } from "@ngx-translate/core";
import { CMSConstants } from "./../../cms/models/cms-constants";
import { AppConfig } from "../../config";
import { Validation } from "../../core/util/Validation";


/**
 * This is a panel component that defines the layout of a page which includes toolbar, mini-display component
 * and options sidenav.
 * @component loadDisplay
 */
@Component({
    //moduleId: module.id,
    selector: "cms-display-panel",
    template: require("to-string!./cms-display-panel.component.html"),
    styles: [require("to-string!./cms-display-panel.component.scss")]
})

/**
 * This class will hold the logic of cms display panel where it will display
 * toolbar, mini-display and sidenav etc options
 * @class CmsDisplayPanelComponent
 * @constructor constructor This will inject the following dependency Htttp, Router, StorageManager etc.
 * @property {number} zoomLevel
 * @property {boolean} viewOptions
 * @property {CmsResource} display
 */

export class CmsDisplayPanelComponent implements OnInit, OnDestroy {

    //Holds current zoom level of mini-display
    public zoomLevel: number;

    // counter for fit height, to be changed whenever fit height is triggered from options panel
    public fitHeightCount: number;

    //@pending - var name To control visibility of Options sidebar
    public viewOptions: boolean;

    //Holds currently selected display from display list
    public display: CmsResource;

    // hold long press state
    public isLongPressed: boolean;

    // hold subscription for isLongPressed
    public longPressSubcription;

    // selected display id
    public displayId: number;

    // hold save layout state
    public isSaveLayoutEnabled: boolean;

    private showClearWallPopup: boolean = false;

    /**
     * The constructor initializes various dependencies.
     */
    constructor(private router: Router,
        private route: ActivatedRoute,
        private storageManager: StorageManager,
        private cmsSettingsService: CmsSettingsService,
        private translate: TranslateService,
        private appConfig: AppConfig,
        private mCmsServerApi: CmsApiService,
        private cmsClipboardService: CmsClipboardService) {

        this.viewOptions = false;
        this.zoomLevel = 100;
        this.fitHeightCount = 0;
        this.isSaveLayoutEnabled = false;
    }

    /**
     * This method is called on component initialization.
     */
    public ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.displayId = parseInt(params["id"]);
        });
        if (isNaN(this.displayId)) {
            return;
        }
        if (!this.loadDisplay()) {
            this.router.navigateByUrl("/displays-panel");
            return;
        }


        // subscribe to observable and update local "isLongPressed" property
        if (this.cmsSettingsService.longPressedSubject) {
            this.longPressSubcription = this.cmsSettingsService.longPressedSubject.subscribe(() => {
                this.isLongPressed = this.cmsSettingsService.isLongPressed;
            });
        } else {
            let error = "cmsSettingsService.longPressedSubject is not defined";
            this.appConfig.error(error);
            throw error;
        }
    }

    /**
     * Cleanup just before Angular destroys the component. 
     * Unsubscribe observables and detach event handlers to avoid memory leaks.
     */
    public ngOnDestroy() {
        if (!Validation.IsNullOrUndefined(this.longPressSubcription)) {
            this.longPressSubcription.unsubscribe();
        }
    }

    /**
     * This method will load the selected display.
     * @method loadDisplay
     */
    public loadDisplay(): boolean {
        let display = this.storageManager.get(CMS_SESSION_STORAGE_ITEM.Display);

        // If selected display is not available, route to display list.
        if (Validation.IsNullOrUndefined(display)) {
            this.appConfig.error("Display not found! Routing to display list.");
            return false;
        } else {
            this.display = <CmsResource>JSON.parse(display);
            return true;
        }
    }



    /**
     * This increases the fit height count
     * @method {void} fitHeight
     */
    public fitHeight() {
        this.fitHeightCount++;
    }


    /**
     * This method revert back to display panel state when longpress is released and remose source icon is disappeared
     */
    public backToDisplayPanel() {
        this.cmsSettingsService.updateIsLongPress(false);
    }


    /**
     * This will be reponsible to clear the mini display wall
     * @method {void} clearMiniDisplayWall
     */
    public clearMiniDisplayWall() {
        this.mCmsServerApi.putContentsOnDisplay(this.displayId, 0, {}).subscribe(response => {
            this.cmsClipboardService.selectedSources.length = 0;
            this.navigateToLoginRoute();
        }, error => {
            console.error(error);
        });
        this.showClearWallPopup = false;
    }


    /**
     * logoff
     */
    public logoff() {
        //  ask for clear grid confirmation
        this.showClearWallPopup = true;
    }

    /**
     * navigateToLoginRoute
     */
    public navigateToLoginRoute() {
        this.router.navigateByUrl("/login");
    }

    /**
     * closingClearWallPopup
     */
    public closingClearWallPopup() {
        this.showClearWallPopup = false;
        this.navigateToLoginRoute();
    }

    private navigateBack() {
        history.back();
    }
}