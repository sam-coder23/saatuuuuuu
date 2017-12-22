import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { CmsResource } from "./../../cms/models/cms-resource";
import { CMS_SESSION_STORAGE_ITEM } from "../../cms/models/cms-session-storage-item";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { AppConfig } from "../../config";
import { Validation } from "../../core/util/Validation";
import { Display } from "../../shared/models/cms-display-card";

/**
 * This class will hold the logic of cms display panel where it will display mini-display.
 * @class CmsDisplayPanelComponent
 * @property {number} zoomLevel
 * @property {number} fitHeightCount
 * @property {CmsResource} display
 * @property {number} displayId
 */
@Component({
    selector: "cms-display-panel",
    template: require("./cms-display-panel.component.html"),
    styles: [require("./cms-display-panel.component.scss")]
})
export class CmsDisplayPanelComponent implements OnInit {
    //Holds current zoom level of mini-display
    private zoomLevel: number;

    // counter for fit height, to be changed whenever fit height is triggered from options panel
    private fitHeightCount: number;

    //Holds currently selected display from display list
    private display: CmsResource;

    // selected display id
    private displayId: number;

    constructor(
        private route: ActivatedRoute,
        private storageManager: StorageManager,
        private appConfig: AppConfig) {

        this.zoomLevel = 100;
        this.fitHeightCount = 0;
    }

    public ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.displayId = parseInt(params["id"], 10);
        });
        if (!isNaN(this.displayId)) {
            this.loadDisplay();
        }
    }

    /**
     * This method will load the selected display.
     * @method loadDisplay
     * @return void
     */
    private loadDisplay(): void {
        const display: any = this.storageManager.get(CMS_SESSION_STORAGE_ITEM.DISPLAY);
        // If selected display is not available, route to display list.
        if (Validation.IsNullOrUndefined(display)) {
            this.appConfig.error("Display not found!");
            this.display = null;
        } else {
            this.display = new CmsResource(JSON.parse(display));
        }
    }

    /**
     * This increases the fit height count
     * @method fitHeight
     * @return {void}
     */
    private fitHeight(): void {
        this.fitHeightCount++;
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
