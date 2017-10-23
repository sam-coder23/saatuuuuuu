/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { EventManager } from "../../../utils/event-manager.util";
import { KeyManager } from "../../../utils/key-manager.util";
import { CmsApiService } from "../../../cms/api/cms-api.service";
import { StorageManager } from "../../../cms/api/cms-storagemanager.service";
import { CMS_SESSION_STORAGE_ITEM } from "../../../cms/models/cms-session-storage-item";
import { CMSConstants } from "../../../cms/models/cms-constants";
import { AppConfig } from "../../../config";

/**
 * This component act as a sidenav for mini-display view. It provides various menu options to the user for launchpad.
 */
@Component({
    //moduleId: module.id,
    selector: "cms-options",
    template: require("to-string!./cms-options.component.html"),
    styles: [require("to-string!./cms-options.component.scss")]
})

export class CmsOptionsComponent implements OnInit {

    // we are using selected display id as string as it can also provide string value as "nodisplay"
    private displayId: string;

    private keyManager = new KeyManager();

    // zoom level of mini-Display
    @Input("zoom") mZoomLevel: number;
    
    // Create a "close" event
    @Output("close") closeEmitter = new EventEmitter();

    @Output("fitHeight") fitHeightEmitter = new EventEmitter();

    /**
     * Sidenav: https://github.com/angular/material2/blob/master/src/lib/sidenav/README.md
     * ViewChild: http://stackoverflow.com/questions/34517969/access-a-local-variable-from-the-template-in-the-controller-in-angular2
     */
    @ViewChild("sidenav") sidenav;

    // this flag will disable certain options if display is not available
    private disableOptionOnDisplayUnavailable: boolean;

    /**
     * The constructor initializes various dependencies.
     */
    constructor(private route: ActivatedRoute, private router: Router, private cmsApiService: CmsApiService, private storageManager: StorageManager, private appConfig: AppConfig) {
        this.disableOptionOnDisplayUnavailable = false;
    }

    /**
     * On component initialization, add close event listener.
     */
    ngOnInit() {
        EventManager.addEvent("keyup", this.onKeyUP.bind(this));

        // Open sidenav with animation
        // @attend - This seems to be tricky. Might need attention.
        // window.setImmediate(() => this.sidenav.open());
        window.setTimeout(() => {
            this.sidenav.open()
        }, 0);

        // fetch selected display id from url parameter
        this.route.params.forEach((params: Params) => {
            this.displayId = params["id"];
        });

        // disable certain options based on display unavailablity
        if (this.displayId === CMSConstants.NoDisplay) {
            this.disableOptionOnDisplayUnavailable = true;
        }
    }

    /**
     * This will return the logged in user name.
     * Being used by template 
     * @property UserName {String}
     * @return {String}
     */
    public get UserName(): string {
        let user = JSON.parse(this.storageManager.get(CMS_SESSION_STORAGE_ITEM.User));
        return user.username;
    }

    /**
     * This method closes options sidenav and removes keyup event listener from document.
     * Also emit close event to its host component.
     */
    public close() {
        EventManager.removeEvent("keyup", this.onKeyUP);
        this.closeEmitter.emit();
    }

    /**
     * This method performs the logout for the user and redirects to login page on success.
     */
    public logout() {
        this.cmsApiService.logout()
            .subscribe(
            response => {
                this.cmsApiService.performOnlogout();
            },
            error => {
                this.appConfig.log("OptionsComponent: Logout failed");
            }
            )
    }

    /**
     * This method performs browser refresh.
     */
    public refresh() {
        window.location.reload(true);
    }

    /**
     * This method logout the user and close the application.
     */
    public exit() {
       window.self.close();
    }


    /**
     * This emits fit height event to its host component and closes the sidenav
     * @method {void} onFitHeightClick
     */
    public onFitHeightClick(): void {
        this.fitHeightEmitter.emit();
        this.sidenav.close()
    }

    /**
     * This event handler will be invoked when user will press escape key.
     * @method onKeyUP
     * @param e - Native event object provided by the browser when key is pressed   
     */
    private onKeyUP(e) {
        if (this.keyManager.IsEscapeKey(e)) {
            this.sidenav.close()
        }
    };

    /**
     * This method adds keyup event listener to event loop on document. 
     */
    // private addCloseEventListener() {
    //     window.document.addEventListener("keyup", this.closeHandler.bind(this));
    // }
    
}