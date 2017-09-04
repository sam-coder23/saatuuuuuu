/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { Component, OnInit, AfterViewInit, ElementRef } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { DomManager } from "../../utils/dom-manager.util";
import { Observable } from "rxjs/Rx";
import { AppConfig } from "../../config";
import { CMS_SESSION_STORAGE_ITEM } from "../../cms/models/cms-session-storage-item";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { CmsClipboardService } from "../../shared/clipboard/cms-clipboard.service";
import { TranslateService } from "@ngx-translate/core";

/**
 * This is a panel component that defines the layout of a page which includes toolbar and tile list.
 */
@Component({
    //moduleId: module.id,
    selector: "cms-tiles-panel",
    template: require("to-string!./cms-tiles-panel.component.html"),
    styles: [require("to-string!./cms-tiles-panel.component.scss")]
})
export class CmsTilesPanelComponent implements OnInit {
    // the selected display id
    private mDisplayId: number;

    constructor(private activatedRoute: ActivatedRoute, private translate: TranslateService) { }

    ngOnInit() {
        debugger
        this.activatedRoute.params.forEach((params: Params) => {
            this.mDisplayId = parseInt(params["id"]);
        });
    }


    public navigateNext(): void {
        // this.router.navigateByUrl(`/displays/${this.mDisplayId}/layouts-panel`);
    }


    public navigateBack(): void {
        // this.clipboard.selectedTiles.length = 0;
        // this.router.navigateByUrl(`/displays-panel`);
    }
}