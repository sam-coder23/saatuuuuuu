
/**
 * This is a tiles-panel component that defines the layout of a page which includes toolbar and tile list.
 * @class CmsTilesPanelComponent
 * @property {number} displayId
 * @property {object} displayResolution
 * @property {number} sourceCount
 * @property {object} viewState
 */
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CmsApiService } from "../../cms/api/cms-api.service";
import { AppConfig } from "../../config";

@Component({
    selector: "cms-tiles-panel",
    template: require("./cms-tiles-panel.component.html"),
    styles: [require("./cms-tiles-panel.component.scss")]
})

export class CmsTilesPanelComponent implements OnInit {
    public viewState: any = {
        reload: false,
        list: true
    };
    private displayId: number;
    private displayResolution: { "width": number, "height": number };
    private sourceCount: number;

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

    public ngOnInit(): void {
        const defaultDisplayId: number = 10;
        const defaultSourceCount: number = 10;
        // tslint:disable-next-line:no-string-literal
        this.displayId = parseInt(this.activatedRoute.params["value"]["id"], defaultDisplayId);
        // tslint:disable-next-line:no-string-literal
        this.sourceCount = parseInt(this.activatedRoute.queryParams["value"]["sourceCount"], defaultSourceCount);
    }

    /**
     * This method navigate to back page
     * @method navigateBack
     * @return void
     */
    public navigateBack(): void {
        this.router.navigateByUrl(`/home/${this.displayId}`);
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

}
