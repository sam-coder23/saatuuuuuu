/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

import { CmsApiService } from "../../cms/api/cms-api.service";
import { IUserProfileSettings } from "../../cms/models/cms-user-profile-settings";
import { CmsSettingsService } from "./cms-settings.service";
import { CmsColorPickerComponent } from "../../shared/colorpicker/cms-colorpicker.component";
import { Display } from "../../cms/models/cms-display";
import { CMSConstants } from "../../cms/models/cms-constants";
import { AppConfig } from "../../config";

/**
 * This is a panel component that defines the layout and feature of settings page.
 */
@Component({
    //moduleId: module.id,
    selector: "cms-settings-panel",
    template: require("to-string!./cms-settings-panel.component.html"),
    styles: [require("to-string!./cms-settings-panel.component.scss")]
})
export class CmsSettingsPanelComponent implements OnInit {
    // to show or hide loading process
    private mLoading: boolean = true;

    // user profile setting values
    private mUserSettings: IUserProfileSettings;

    // user profile selected language
    private mUserSelectedLanguage: string;

    // selected display Wall name 
    private displayWallName: string;

    // avaialble font-sizes
    private fontSizeDefault: number = 16;
    private fontSizeSteps: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

    // avaialble font-sizes
    private pageSizeDefault: number = 20;
    private pageSizes: number[] = [20, 30, 40, 50];

    // avaialble transparency
    private transparencyDefault: number = 50;
    private transparencySteps: number[] = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

    // available Auto Log-Off Time
    private logOffTimeDefault: number = 0;
    private logOffTimeSteps: number[] = [0, 10, 20, 30, 40, 50, 60];

    //default colors
    private fontColorDefault: string = "#000";
    private backgroundDefault: string = "#bdbdbd";

    private recentDisplayId: string;

    // toshow or hide language option on the basis of this Property.
    private localizationLicense: number;

    //hold auto logoff value for UI
    private autoLogOffTime: any

    //hold no display information
    private noDisplayAvailable: boolean = false;

    constructor(private cmsServerApi: CmsApiService, private router: Router, private cmsSettingsService: CmsSettingsService, private translate: TranslateService, private appConfig: AppConfig) {
        this.localizationLicense = 0;
    }

    ngOnInit() {
        if (!this.cmsSettingsService.mUserSettings) {
            this.cmsSettingsService.setUserProfileSettings(() => this.loadUserProfileSettings());
        } else {
            this.loadUserProfileSettings();
        }

        /**
         * Method to check for license of localization.
         */
        this.checkForLocalizationLicense();

    }

    /**
     * @description
     * With the help of this function, app will
     * check whether this user has license for localization feature or not.
     * @method  checkForLocalizationLicense
     */
    private checkForLocalizationLicense() {
        this.cmsServerApi.getSystemInfo()
            .subscribe(
            response => {
                this.localizationLicense = response.licenseinfo.localization;
            });
    }

    /**
     * @description
     * This method update user-interface as per user settings 
     */
    private loadUserProfileSettings() {
        this.mLoading = true;

        //get local settings from cms-settings-service 
        this.mUserSettings = this.cmsSettingsService.mUserSettings;

        this.mUserSelectedLanguage = this.cmsSettingsService.getUserSelectedLanguageByKey(this.mUserSettings.language);

        // check if recent display exists
        if (this.mUserSettings.wallConnection.atStartup.recentDisplayId !== "") {
            this.checkForRecentDisplay(this.mUserSettings.wallConnection.atStartup.recentDisplayId);
        }
        else {
            this.recentDisplayId = CMSConstants.NoDisplay;
        }

        // check if page size exists
        if (!this.mUserSettings.defaultPageSize) {
            this.mUserSettings.defaultPageSize = this.pageSizeDefault;
        }

        // show display wall name as per selected wall connection
        this.showDisplayWallNameByWallConnection()

        // update user settings log offtime on UI 
        // set text as never in case of 0
        this.autoLogOffTime = this.mUserSettings.logOffTime;
        this.updateAutoLogOffValueBinding(this.autoLogOffTime)

        this.mLoading = false;
    }

    /**
     * @description
     * This method fetch display wall name and update {{displayWallName}}
     * 
     * @param: displayId: number ​:: Display ID to which specified content belong to.
     */
    private showDisplayWallNameById(displayId: number): void {
        this.cmsServerApi.getSelectedDisplayContent(displayId)
            .subscribe((display: Display) => {
                if (display) {
                    this.displayWallName = display["name"];

                    // update as selected display wall for future selection
                    this.mUserSettings.wallConnection.atStartup.selectedDisplayId = display["id"];
                    this.cmsSettingsService.updateUserProfileData(this.mUserSettings);

                }
            }, (error) => {
                this.displayWallName = "nodisplayfound";
                this.appConfig.log("CmsSettingsPanelComponent: showDisplayWallNameById");
            });
    }

    /**
     * @description
     * This method fetch display wall name and update {{displayWallName}}
     * 
     * @param: displayId: number ​:: Display ID to which specified content belong to.
     */
    private checkForRecentDisplay(displayId: number): void {
        this.cmsServerApi.getSelectedDisplayContent(displayId)
            .subscribe((display: Display) => {
                if (display) {
                    this.recentDisplayId = display["id"].toString();
                }
            }, (error) => {
                this.recentDisplayId = CMSConstants.NoDisplay;
                this.appConfig.log("CmsSettingsPanelComponent: checkForRecentDisplay");
            });
    }

    /**
     * @description
     * This method update user settings via PUT /users/current/profile/settings
     */
    private updateUserSettingsByAction(event): void {
        // prevent function execution when event source is null
        // md-radio-change event fired itself when value is change by model-binding
        if (event.source !== null) {
            this.cmsSettingsService.updateUserProfileData(this.mUserSettings);
        }
    }

    /**
     * @description
     * This method navigate to displays list while click on "auto connect on specific display wall" button
     */
    private goToSelectDisplayForAutoConnect(event) {
        this.router.navigate(["/displays-panel", { action: "selectDisplayForAutoConnect" }]);
    }

    /**
     * @description
     * This method update font-size in user profile settings on server
     */
    private updateFontSize(): void {
        let fontSize = this.mUserSettings.sourceLabels.fontSize;
        this.mUserSettings.sourceLabels.fontSize = this.cmsSettingsService.validateCountData(fontSize, this.fontSizeSteps, this.fontSizeDefault);
        if (fontSize) {
            this.cmsSettingsService.updateUserProfileData(this.mUserSettings);
        }
    }

    /**
     * @description
     * This method increase font-size in user profile settings on server and on UI
     */
    private increaseFontSize(): void {
        let fontSize = this.mUserSettings.sourceLabels.fontSize;
        this.mUserSettings.sourceLabels.fontSize = this.cmsSettingsService.increaseCount(fontSize, this.fontSizeSteps);
        this.updateFontSize();
    }

    /**
      * @description
      * This method decrease font-size in user profile settings on server and on UI
      */
    private decreaseFontSize(): void {
        let fontSize = this.mUserSettings.sourceLabels.fontSize;
        this.mUserSettings.sourceLabels.fontSize = this.cmsSettingsService.decreaseCount(fontSize, this.fontSizeSteps);
        this.updateFontSize();
    }

    /**
     * @description
     * This method update transparency in user profile settings on server
     */
    private updateTransparency(): void {
        let transparency = this.mUserSettings.sourceLabels.transparency;
        this.mUserSettings.sourceLabels.transparency = this.cmsSettingsService.validateCountData(transparency, this.transparencySteps, this.transparencyDefault);
        if (transparency || transparency === 0) {
            this.cmsSettingsService.updateUserProfileData(this.mUserSettings);
        }
    }

    /**
     * @description
     * This method increase transparency in user profile settings on server and on UI
     */
    private increaseTransparency(): void {
        let transparency = this.mUserSettings.sourceLabels.transparency;
        this.mUserSettings.sourceLabels.transparency = this.cmsSettingsService.increaseCount(transparency, this.transparencySteps);
        this.updateTransparency();
    }

    /**
     * @description
     * This method decrease transparency in user profile settings on server and on UI
     */
    private decreaseTransparency(): void {
        let transparency = this.mUserSettings.sourceLabels.transparency;
        this.mUserSettings.sourceLabels.transparency = this.cmsSettingsService.decreaseCount(transparency, this.transparencySteps);
        this.updateTransparency();
    }

    /**
     * @description
     * This method update font color in user profile settings on server
     */
    private updateFontColor(event): void {
        if (event) {
            let fontColor = event[0];
            if (fontColor) {
                this.mUserSettings.sourceLabels.fontColor = fontColor;
                this.cmsSettingsService.updateUserProfileData(this.mUserSettings);
            }
        }
    }

    /**
     * @description
     * This method update background color in user profile settings on server
     */
    private updateBackgroundColor(event): void {
        if (event) {
            let backgroundColor = event[0];
            if (backgroundColor) {
                this.mUserSettings.sourceLabels.​background = backgroundColor
                this.cmsSettingsService.updateUserProfileData(this.mUserSettings);
            }
        }
    }

    /**
     * @description
     * This method will show languages panel if user have licenses.
     * @method  showLanguages
     * @property {event} event
     */
    private showLanguages(event): void {
        event.preventDefault();
        if (this.localizationLicense) {
            this.router.navigate([`/settings/language/${this.mUserSettings.language}`]);
        }
    }

    /**
     * @description
     * This method update logOffTime in user profile settings on server
     */
    private updateLogOffTime(): void {
        let autoLogOffTime = Number(this.autoLogOffTime);
        this.autoLogOffTime = this.cmsSettingsService.validateCountData(autoLogOffTime, this.logOffTimeSteps, this.logOffTimeDefault);
        if (this.autoLogOffTime == 0 || isNaN(this.autoLogOffTime)) {
            // update time as 0 for NaN and "never" on UI
            this.updateAutoLogOffValueBinding(this.autoLogOffTime);
            this.mUserSettings.logOffTime = 0;
            this.cmsSettingsService.updateUserProfileData(this.mUserSettings);
        } else {
            // update value as numeric
            this.mUserSettings.logOffTime = this.autoLogOffTime;
            this.cmsSettingsService.updateUserProfileData(this.mUserSettings);
        }
    }

    /**
     * @description
     * This method increase logOffTime in user profile settings on server and on UI
     */
    private increaseLogOffTime(): void {
        let autoLogOffTime = Number(this.autoLogOffTime);
        this.autoLogOffTime = this.cmsSettingsService.increaseCount(autoLogOffTime, this.logOffTimeSteps) || this.logOffTimeSteps[1];
        this.updateLogOffTime();
    }

    /**
     * @description
     * This method decrease logOffTime in user profile settings on server and on UI
     */
    private decreaseLogOffTime(): void {
        let autoLogOffTime = Number(this.autoLogOffTime);
        this.autoLogOffTime = this.cmsSettingsService.decreaseCount(autoLogOffTime, this.logOffTimeSteps) || this.logOffTimeSteps[0];
        this.updateLogOffTime();
    }

    private updateAutoLogOffValueBinding(autoLogOffTime) {
        if (autoLogOffTime == 0 || isNaN(autoLogOffTime)) {
            this.translate.get("settings.never").subscribe((response: string) => {
                this.autoLogOffTime = response;
            });
        }
    }


    /**
     * This method show display wall name as per selected wall connection
     */
    private showDisplayWallNameByWallConnection() {
        if (this.mUserSettings.wallConnection.atStartup.selectedDisplayId !== "" && this.mUserSettings.wallConnection.atStartup.status === "auto-connect-to-specific-wall") {
            //show selected display name
            this.showDisplayWallNameById(this.mUserSettings.wallConnection.atStartup.selectedDisplayId);
        }
        else if (this.mUserSettings.wallConnection.atStartup.recentDisplayId !== "") {
            //show recent display name
            this.showDisplayWallNameById(this.mUserSettings.wallConnection.atStartup.recentDisplayId);
        }

        // check if any display exist or not
        this.showFirstDisplayWallName();

    }

    /**
     * This method gets any first display from CMS Server API.
     */
    private showFirstDisplayWallName() {
        let start = 1, count = 1, search = "", isFavorite = false;

        return this.cmsServerApi.getDisplayList(start, count, search, isFavorite)
            .subscribe(
            (displays: Display[]) => {
                if (displays.length === 0) {
                    // if no displays are available
                    this.noDisplayAvailable = true;
                }
                else {
                    this.noDisplayAvailable = false;

                    // wall exists and no recent wall selected
                    if (this.mUserSettings.wallConnection.atStartup.recentDisplayId === "") {
                        this.showDisplayWallNameById(displays[0]["id"]);
                    }
                }
            },
            error => {
                this.appConfig.log("CmsSettingsPanelComponent: showFirstDisplayWallName");
            });
    }

}

