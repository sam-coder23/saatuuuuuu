/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { Layout } from "../../../cms/models/cms-layout";
import { CmsApiService } from "../../../cms/api/cms-api.service";
import { TranslateService } from "@ngx-translate/core";
import { AppConfig } from "../../../config";


/**
 * This is a save layout component that performs saving of a new layout, overriding a layout using CMS Server API.
 */
@Component({
    selector: "cms-save-layout",
    template: require("to-string!./cms-save-layout.component.html"),
    styles: [require("to-string!./cms-save-layout.component.scss")]
})
export class CmsSaveLayoutComponent implements OnInit {
  
    // the selected display id
    private displayId: number;

    // layout name model value for input field
    @Input() layoutName: string = "";

    private dialogMessage: string = "";
    private showConfirmationDialog: boolean = false;

    // total layout list
    private layouts: Layout[];

    /**
     * Public Methods
     */

    /**
     * The constructor initializes various dependencies.
     */
    constructor(private router: Router, private route: ActivatedRoute, private cmsServerApi: CmsApiService, private translate: TranslateService, private appConfig: AppConfig) { }

    /**
     * On component initialization, fetch display id from route parameters.
     */
    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.displayId = +params["id"];
        });

        this.getLayoutList();
    }

    /**
     * This method shows confirmation dialog before saving layout.
     */
    confirmSaveLayout() {
        if (this.layoutAlreadyExists()) {
            this.showConfirmationDialog = true;

            // dialog message using TranslateService
            this.translate.get("saveLayout.saveLayoutConfirmation", { value: this.layoutName }).subscribe((response: string) => {
                this.dialogMessage = response;
            });
        }
        else {
            this.saveLayout();
        }
    }

    /**
     * Private Methods
     */

    /**
     * This method calls CMS Server API to save a layout.
     */
    private saveLayout() {
        this.cmsServerApi.saveLayout(this.displayId, this.layoutName)
            .then((response) => {
                this.router.navigate([`/display-panel/${this.displayId}`]);
            })
            .catch((error) => {
                this.appConfig.log("CmsSaveLayoutComponent: saveLayout:: API failed.");

                // handle no permission
                if (error.status === 403) {
                    this.cmsServerApi.noPermissionErrorHandler(error, "noPermission.saveLayout");
                }
            });
    }

    /**
     * This method calls CMS Server API to fetch complete list of layouts.
     */
    private getLayoutList() {
        this.cmsServerApi.getLayoutList(this.displayId)
            .subscribe((layouts: Layout[]) => {
                this.layouts = layouts;
            },(error) => {
                this.appConfig.log("CmsSaveLayoutComponent: Layout List API failed. Error: ", error);
            });
    }

    /**
     * This method checks if the layout user want to save already exists or not.
     */
    private layoutAlreadyExists(): boolean {
        let exists = false;

        if (this.layouts) {
            for (var i = 0; i < this.layouts.length; i++) {
                if (this.layouts[i].name === this.layoutName) {
                    exists = true;
                    break;
                }
            }
        }
        return exists;
    }

    /**
     * This methods save layout after confirmation.
     */
    private onConfimation() {
        this.showConfirmationDialog = false;
        this.saveLayout();
    }

    /**
     * This methods cancel save layout after confirmation.
     */
    private onCancel() {
        this.showConfirmationDialog = false;
    }
}
