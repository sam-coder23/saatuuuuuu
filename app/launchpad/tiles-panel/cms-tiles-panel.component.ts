import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

/**
 * This is a tiles-panel component that defines the layout of a page which includes toolbar and tile list.
 */
@Component({
    selector: "cms-tiles-panel",
    template: require("./cms-tiles-panel.component.html"),
    styles: [require("./cms-tiles-panel.component.scss")]
})
export class CmsTilesPanelComponent implements OnInit {
    // the selected display id
    private displayId: number;
    private displayResolution: { "width": number, "height": number };
    private sourceCount: number;

    // all boolean states for the template
    public viewState = {
        reload: false,
        list: true
    };

    constructor(private activatedRoute: ActivatedRoute,
        private router: Router) {

        this.displayResolution = {
            height: 130,
            width: 230
        };
    }

    public ngOnInit() {
        this.displayId = parseInt(this.activatedRoute.params["value"]["id"]);
        this.sourceCount = parseInt(this.activatedRoute.queryParams["value"]["sourceCount"]);
    }


    public navigateNext(): void {
        this.router.navigateByUrl(`display-panel/${this.displayId}`);
    }


    public navigateBack(): void {
        window.history.back();
    }

    /**
     * Reload sources list
     */
    public reloadList(): void {
        this.viewState.reload = false;
        this.viewState.list = false;
        window.setTimeout(() => {
            this.viewState.list = true;
        }, 0);
    }

    /**
     * On list modified event
     */
    public onListChanged(): void {
        this.viewState.reload = true;
    }
}