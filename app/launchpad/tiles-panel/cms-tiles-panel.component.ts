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
import { TranslateService } from "@ngx-translate/core";
import { Display } from "../../cms/models/cms-display";
import { CmsApiService } from "../../cms/api/cms-api.service";

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
    private displayResolution: { "width": number, "height": number };
    private sourceCount: number;

    // all boolean states for the template
    mStates = {
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

    ngOnInit() {
        this.mDisplayId = parseInt(this.activatedRoute.params["value"]["id"]);
        this.sourceCount = parseInt(this.activatedRoute.queryParams["value"]["sourceCount"]);
    }


    public navigateNext(): void {
        this.router.navigateByUrl(`display-panel/${this.mDisplayId}`);
    }


    public navigateBack(): void {
        window.history.back();
    }

    /**
 * Reload sources list
 */
    reloadList(): void {
        this.mStates.reload = false;
        this.mStates.list = false;
        window.setTimeout(() => {
            this.mStates.list = true
        }, 0);
    }

    /**
 * On list modified event
 */
    onListChanged(): void {
        this.mStates.reload = true;
    }
}