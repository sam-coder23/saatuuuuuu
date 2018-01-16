
/**
 * This is a tiles-panel component that defines the layout of a page which includes toolbar and tile list.
 * @class CmsTilesPanelComponent
 * @property {number} displayId
 * @property {object} displayResolution
 * @property {number} sourceCount
 * @property {boolean} reloadState
 * @property {boolean} listState
 */
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CmsApiService } from "../../cms/api/cms-api.service";
import { AppConfig } from "../../config";
import { ParsingManager } from "./../../utils/parsing-manager-util";

@Component({
    selector: "cms-tiles-panel",
    template: require("./cms-tiles-panel.component.html"),
    styles: [require("./cms-tiles-panel.component.scss")]
})

export class CmsTilesPanelComponent implements OnInit {
    private reloadState: boolean = false;
    private listState: boolean = true;
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
        this.activatedRoute.params.subscribe((value: any) => {
            this.displayId = ParsingManager.TO_INTEGER(value.id);
        });

        this.activatedRoute.queryParams.subscribe((value: any) => {
            this.sourceCount = ParsingManager.TO_INTEGER(value.sourceCount);
        });
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
        this.reloadState = false;
        this.listState = false;
        window.setTimeout(() => {
            this.listState = true;
        }, 0);
    }

    /**
     * This method listen list change
     * @method onListChanged
     * @return void
     */
    public onListChanged(): void {
        this.reloadState = true;
    }
}
