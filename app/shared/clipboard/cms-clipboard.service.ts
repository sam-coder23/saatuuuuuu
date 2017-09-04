/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { CmsApiService } from "./../../cms/api/cms-api.service";
import { Injectable } from "@angular/core";
import { Source } from "./../../cms/models/cms-source";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { ITile } from "./../../cms/models/cms-tile";
import { CmsSettingsService } from "./../../launchpad/settings/cms-settings.service";
import { IManageWallContent } from "./../../cms/models/cms-user-profile-settings";
import { AppConfig } from "../../config";

/**
 * CmsClipboardService works as a clipboard and helps various components to get and set a clipboard source.
 * This service sends an update event whenever a clipboard source is updated.
 *   
 * @author: AKAAR
 * @version: CMS 3.0
 */
@Injectable()
export class CmsClipboardService {

    public selectedSources: Source[] = [];
    public maxSelection: number = 100;
    
    public timer: number = 0;

    private clipboard;
    private clipboardSource: Subject<Source> = new Subject<Source>();

    // Observable of type Source to emit clipboard updated event
    clipboardUpdated: Observable<Source>;

    // Holds tile geometry that requires a clipboard source directly
    tile: ITile;

    constructor(private cmsApiService: CmsApiService, private cmsSettingsService: CmsSettingsService, private appConfig: AppConfig) {
        this.clipboardUpdated = this.clipboardSource.asObservable();
    }

    public get Clipboard(): Source {
        return this.clipboard || null;
    }

    public set Clipboard(source: Source) {
        if (this.settings && !this.settings.allowChangingSources) return;

        this.clipboard = source;
        //@pending - should go from here;
        this.clipboardSource.next(source);
    }

    // returns settings related to wall content
    private get settings(): IManageWallContent {
        return (this.cmsSettingsService.mUserSettings ? this.cmsSettingsService.mUserSettings.manageWallContent : null);
    }

    /**
     * This method clears the clipboard data
     */
    clear(): void {
        this.Clipboard = null;
        this.tile = null;
    }

    /**
     * @description:
     * To add a content on the display wall
     * 
     * @params:
     * displayId: number :: Display ID of the display wall on which content to be shared 
     */
    shareContent(displayId: number): Promise<any> {
        if (!this.Clipboard || !this.tile) return;

        // hit api to load content on server
        return this.cmsApiService.loadContentOnTile(displayId, this.tile, this.Clipboard)
            .then(() => {
                this.clear();
            })
            .catch((error) => {
                this.appConfig.log("Errror:::::::::this.cmsApiService.loadContentOnTile:::::::::::::::::::::::::::::::", "shareContent method failed in cms-clipboard.service");

                // handle no permission
                if (error.status === 403) {
                    this.cmsApiService.noPermissionErrorHandler(error, "noPermission.shareContent");
                    this.clear();
                }
            });
    }

    /**
     * CanShareUnshare defines if the current user is allowed to share or unshare content on the display
     */
    public CanShareUnshare(): boolean {
        return this.settings && this.settings.allowChangingSources;
    }

    /**
     * isClipboardEnabled defines whether the user wants to use clipboard feature
     */
    public isClipboardEnabled(): boolean {
        return this.settings && this.settings.clipboard && this.settings.clipboard.isEnabled;
    }

    /**
     * clipboardDisplayStatus defines current status of clipboard
     * 
     * status can be "icon", "small", "large"
     */
    public clipboardDisplayStatus(): string {
        if (this.settings && this.settings.clipboard) {
            return this.settings.clipboard.status;
        }
    }
}
