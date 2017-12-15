import { Component, OnInit, OnDestroy, EventEmitter } from "@angular/core";
import { Http } from "@angular/http";
import { Router, ActivatedRoute, Params } from "@angular/router";
import "rxjs/add/operator/toPromise";
import { CmsApiService } from "../../cms/api/cms-api.service";
import { CmsResource } from "./../../cms/models/cms-resource";
import { CMS_SESSION_STORAGE_ITEM } from "../../cms/models/cms-session-storage-item";
import { Source } from "./../../cms/models/cms-source";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { CmsSettingsService } from "./../../launchpad/settings/cms-settings.service";
import { TranslateService } from "@ngx-translate/core";
import { AppConfig } from "../../config";
import { Validation } from "../../core/util/Validation";

@Component({
    //moduleId: module.id,
    selector: "cms-display-panel",
    template: require("./cms-display-panel.component.html"),
    styles: [require("./cms-display-panel.component.scss")]
})

/**
 * This class will hold the logic of cms display panel where it will display
 * toolbar, mini-display and sidenav etc options
 * @class CmsDisplayPanelComponent
 * @constructor constructor This will inject the following dependency Htttp, Router, StorageManager etc.
 * @property {number} zoomLevel
 * @property {boolean} viewOptions
 * @property {number} fitHeightCount
 * @property {CmsResource} display
 * @property {number} displayId
 * @property {boolean} isSaveLayoutEnabled
 * @property {boolean} showClearWallPopup
 */
export class CmsDisplayPanelComponent implements OnInit {
    //Holds current zoom level of mini-display
    private zoomLevel: number;

    // counter for fit height, to be changed whenever fit height is triggered from options panel
    private fitHeightCount: number;

    //@pending - var name To control visibility of Options sidebar
    private viewOptions: boolean;

    //Holds currently selected display from display list
    private display: CmsResource;

    // selected display id
    private displayId: number;

    // hold save layout state
    private isSaveLayoutEnabled: boolean;

    private showClearWallPopup: boolean = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private storageManager: StorageManager,
        private cmsSettingsService: CmsSettingsService,
        private translate: TranslateService,
        private appConfig: AppConfig,
        private cmsServerApi: CmsApiService) {

        this.viewOptions = false;
        this.zoomLevel = 100;
        this.fitHeightCount = 0;
        this.isSaveLayoutEnabled = false;
    }

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
    }

    /**
     * This method will load the selected display.
     * @method loadDisplay
     * @return boolean
     */
    private loadDisplay(): boolean {
        let display = this.storageManager.get(CMS_SESSION_STORAGE_ITEM.DISPLAY);

        // If selected display is not available, route to display list.
        if (display) {
            this.display = <CmsResource>JSON.parse(display);
            return true;
        }
    }

    /**
     * This increases the fit height count
     * @method fitHeight
     * @return void
     */
    private fitHeight(): void {
        this.fitHeightCount++;
    }

    /**
     * This will be reponsible to clear the mini display wall
     * @method clearMiniDisplayWall
     * @return void
     */
    private clearMiniDisplayWall(): void {
        this.cmsServerApi.putContentsOnDisplay(this.displayId, 0, {}).subscribe(response => {
            this.cmsSettingsService.selectedSources.length = 0;
            this.navigateToLoginRoute();
        }, error => {
            console.error(error);
        });
        this.showClearWallPopup = false;
    }

    /** 
     * This method handle logout of user
     * @method logoff
     * @return void
     */
    private logoff(): void {
        //ask for clear grid confirmation
        this.showClearWallPopup = true;
    }

    /**
     * This method logs out the user and performs clean up
     * @method navigateToLoginRoute
     * @return void
     */
    private navigateToLoginRoute(): void {
        this.cmsServerApi.logoutUser();
    }

    /**
     * This method close clear-wall-popup
     * @method closingClearWallPopup
     * @return void
     */
    private closingClearWallPopup(): void {
        this.showClearWallPopup = false;
    }

    /**
     * This method cancel clear-wall-popup and logout
     * @method cancelClearWallPopup
     * @return void
     */
    private cancelClearWallPopup(): void {
        this.showClearWallPopup = false;
        this.navigateToLoginRoute();
    }

    /**
     * This method navigate to back page
     * @method navigateBack
     * @return void
     */
    private navigateBack(): void {
        window.history.back();
    }
}