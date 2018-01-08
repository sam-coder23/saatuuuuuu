/**
 * This class will hold the logic of cms display panel where it will display mini-display.
 * @class CmsDisplayPanelComponent
 * @property {number} zoomLevel
 * @property {number} fitHeightCount
 * @property {CmsResource} display
 * @property {number} displayId
 */
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";

import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { CmsSessionStorageItem } from "../../cms/models/cms-session-storage-item";
import { AppConfig } from "../../config";
import { Validation } from "../../core/util/Validation";
import { CmsResource } from "./../../cms/models/cms-resource";
import { ParsingManager } from "./../../utils/parsing-manager-util";

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
        const defaultZoomLevel: number = 100;
        const defaultHeightCount: number = 0;
        this.zoomLevel = defaultZoomLevel;
        this.fitHeightCount = defaultHeightCount;
    }

    public ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.displayId = ParsingManager.TO_INTEGER(params.id);
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
        const display: any = this.storageManager.getItem(CmsSessionStorageItem.DISPLAY);
        // If selected display is not available, route to display list.
        if (Validation.IS_NULL_OR_UNDEFINED(display)) {
            this.appConfig.error("Display not found!");
            this.display = undefined;
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
        const increment: number = 1;
        this.fitHeightCount = this.fitHeightCount + increment;
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
