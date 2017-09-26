import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { CmsApiService } from "../../cms/api/cms-api.service";
import { ITilePreset } from "../../cms/models/cms-tile-preset";
import { CmsClipboardService } from "../clipboard/cms-clipboard.service";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "cms-tile-list",
    template: require("to-string!./cms-tile-list.component.html"),
    styles: [require("to-string!./cms-tile-list.component.scss")]
})

export class CmsTileListComponent implements OnInit {
    @Input()
    sourceCount: number = 0;

    @Input()
    displayResolution: { "width": number, "height": number };

    public tilePresets: ITilePreset[];


    @Output("select") tileSelectEmitter = new EventEmitter();


    constructor(
        private activatedRoute: ActivatedRoute,
        private cmsServerApi: CmsApiService,
        private clipboard: CmsClipboardService) {

        this.tilePresets = [];
    }

    ngOnInit() {
        if (!this.checkSourceCount()) {
            return;
        };
        this.getTilePresets();
    }


    public getTilePresets() {
        this.cmsServerApi.getTilers().subscribe(tilePresets => {
            this.tilePresets = tilePresets.filter(tilePreset => tilePreset.noOfTiles >= this.sourceCount).sort((a, b) => a.noOfTiles - b.noOfTiles);
        });
    }

    public checkSourceCount(): boolean {
        if (!(this.sourceCount > 0)) {
            return false;
        }

        if (!(this.sourceCount === this.clipboard.selectedSources.length)) {
            return false;
        }

        return true;
    }

    loadTilePreset(tilePreset: ITilePreset) {
        let displayId = parseInt(this.activatedRoute.params["value"]["id"]);

        let requestPayload = {
            "resources": [...this.clipboard.selectedSources]
        };

        // API rejects extra properties
        requestPayload.resources.forEach(resource => {
            resource.selected = undefined;
        });
        this.cmsServerApi.putContentsOnDisplay(displayId, tilePreset.id, requestPayload).subscribe(response => {
            this.tileSelectEmitter.emit();
        }, error => {
            console.error(error);
        });
    }
}