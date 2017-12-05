import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CmsApiService } from "../../cms/api/cms-api.service";
import { AppConfig } from "../../config";

@Component({
    selector: "cms-tiles-panel",
    template: require("./cms-tiles-panel.component.html"),
    styles: [require("./cms-tiles-panel.component.scss")]
})

/**
 * This is a tiles-panel component that defines the layout of a page which includes toolbar and tile list.
 * @class CmsTilesPanelComponent
 * @property {number} displayId
 * @property {object} displayResolution
 * @property {number} sourceCount
 * @property {object} viewState
 */

export class CmsTilesPanelComponent implements OnInit {
    private displayId: number;
    private displayResolution: { "width": number, "height": number };
    private sourceCount: number;
    public viewState = {
        reload: false,
        list: true
    };

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private cmsServerApi: CmsApiService, 
        private appConfig: AppConfig) {

        this.displayResolution = {
            height: 130,
            width: 230
        };
    }

    public ngOnInit() {
        this.displayId = parseInt(this.activatedRoute.params["value"]["id"]);
        this.sourceCount = parseInt(this.activatedRoute.queryParams["value"]["sourceCount"]);
    }

    /**
     * This method navigate to next page
     * @method navigateNext
     * @return void
     */
    private navigateNext(): void {
        this.router.navigateByUrl(`display-panel/${this.displayId}`);
    }

    /**
     * This method navigate to back page
     * @method navigateBack
     * @return void
     */
    public navigateBack(): void {
        window.history.back();
    }

    /**
     * This method reload tile panel
     * @method reloadList
     * @return void
     */
    public reloadList(): void {
        this.viewState.reload = false;
        this.viewState.list = false;
        window.setTimeout(() => {
            this.viewState.list = true;
        }, 0);
    }

    /**
     * This method listen list change
     * @method onListChanged
     * @return void
     */
    public onListChanged(): void {
        this.viewState.reload = true;
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