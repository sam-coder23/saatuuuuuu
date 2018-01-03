/**
 * This class defines the layout and feature of settings page.
 * @class CmsSettingsPanelComponent
 * @property {object} i18n
 * @property {boolean} loading
 * @property {object} fontColorModel
 * @property {object} backgroundColorModel
 * @property {IUserProfileSettings} userSettings
 * @property {string} userSelectedLanguage
 * @property {string} displayWallName
 * @property {number} fontSizeDefault
 * @property {number[]} fontSizeSteps
 * @property {number} pageSizeDefault
 * @property {number[]} pageSizes
 * @property {number} transparencyDefault
 * @property {number[]} transparencySteps
 * @property {number} logOffTimeDefault
 * @property {number[]} logOffTimeSteps
 * @property {string} fontColorDefault
 * @property {string} backgroundDefault
 * @property {number} recentDisplayId
 * @property {number} localizationLicense
 * @property {any} autoLogOffTime
 * @property {boolean} noDisplayAvailable
 * @property {string} wallConnection
 */
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs/Subscription";

import { CmsApiService } from "../../cms/api/cms-api.service";
import { CMSConstants } from "../../cms/models/cms-constants";
import { Display } from "../../cms/models/cms-display";
import { IUserProfileSettings } from "../../cms/models/cms-user-profile-settings";
import { AppConfig } from "../../config";
import { Validation } from "../../core/util/Validation";
import { CmsSettingsService } from "./cms-settings.service";

@Component({
    //moduleId: module.id,
    selector: "cms-settings-panel",
    template: require("./cms-settings-panel.component.html"),
    styles: [require("./cms-settings-panel.component.scss")]
})

export class CmsSettingsPanelComponent implements OnInit {
    private i18n: any;
    // to show or hide loading process
    private loading: boolean = true;
    private fontColorModel: {
        data: {
            value: string
        },
        value: string,
        key: string,
        defaultTabLabel: string,
        cancelText: string,
        label: string
    };
    private backgroundColorModel: {
        data: {
            value: string
        },
        value: string,
        key: string,
        defaultTabLabel: string,
        cancelText: string,
        label: string
    };
    // user profile setting values
    private userSettings: IUserProfileSettings;

    // user profile selected language
    private userSelectedLanguage: string;

    // selected display Wall name
    private displayWallName: string;

    // avaialble font-sizes
    private fontSizeDefault: number = CMSConstants.DEFAULT_FONT_SIZE;
    private fontSizeSteps: number[] = CMSConstants.FONT_SIZES;

    // avaialble font-sizes
    private pageSizeDefault: number = CMSConstants.DEFAULT_PAGE_SIZE;
    private pageSizes: number[] = CMSConstants.PAGE_SIZES;

    // avaialble transparency
    private transparencyDefault: number = CMSConstants.DEFAULT_TRANSPARENCY;
    private transparencySteps: number[] = CMSConstants.TRANSPARENCY_STEPS;

    // available Auto Log-Off Time
    private logOffTimeDefault: number = CMSConstants.DEFAULT_LOGOFF_TIME;
    private logOffTimeSteps: number[] = CMSConstants.LOGOFF_TIME_STEPS;

    //default colors
    private fontColorDefault: string = CMSConstants.DEFAULT_FONT_COLOR;
    private backgroundDefault: string = CMSConstants.DEFAULT_BACKGROUND_COLOR;

    private recentDisplayId: number;

    // toshow or hide language option on the basis of this Property.
    private localizationLicense: number;

    //hold auto logoff value for UI
    private autoLogOffTime: number;

    //hold no display information
    private noDisplayAvailable: boolean = false;

    //hold wall connection constant information
    private wallConnection: any = CMSConstants.WALL_CONNECTION;

    constructor(
        private cmsServerApi: CmsApiService,
        private router: Router,
        private cmsSettingsService: CmsSettingsService,
        private translate: TranslateService,
        private appConfig: AppConfig) {
        this.localizationLicense = 0;
    }

    public ngOnInit(): void {
        if (!this.cmsSettingsService.userSettings) {
            this.cmsSettingsService.setUserProfileSettings(() => this.loadUserProfileSettings());
        } else {
            this.loadUserProfileSettings();
        }

        // Method to check for license of localization.
        this.checkForLocalizationLicense();
    }

    /**
     * With the help of this function, app will check whether this user has license for localization feature or not.
     * @method checkForLocalizationLicense
     * @return void
     */
    private checkForLocalizationLicense(): void {
        this.cmsServerApi.getSystemInfo()
            .subscribe(
            (response: any) => {
                if (response) {
                    this.localizationLicense = response.LicenseInfo.localization;
                }
            });
    }

    /**
     * This method will provide model for color picker
     * @method getColorPickerModel
     * @param {string} value
     * @return {any} returns the model to be assigned to the color picker"s model.
     */
    private getColorPickerModel(color: string): any {
        return {
            data: {
                value: color
            },
            value: color,
            key: "value",
            defaultTabLabel: this.i18n.defaultColorPickerTabLabel,
            cancelText: this.i18n.cancel,
            label: ""
        };
    }

    /**
     * This method update user-interface as per user settings
     * @method loadUserProfileSettings
     * @return {void}
     */
    private loadUserProfileSettings(): void {
        this.loading = true;

        //get local settings from cms-settings-service
        this.userSettings = this.cmsSettingsService.userSettings;

        this.translate.get("settings").subscribe((response: any) => {
            this.i18n = response;

            this.fontColorModel = this.getColorPickerModel(this.userSettings.sourceLabel.fontColor);
            this.backgroundColorModel = this.getColorPickerModel(this.userSettings.sourceLabel.backgroundColor);
        });

        this.userSelectedLanguage = this.cmsSettingsService.getUserSelectedLanguageByKey(this.userSettings.language);

        // check if recent display exists
        if (this.userSettings.wallConnection.recentDisplay !== "") {
            this.checkForRecentDisplay(this.userSettings.wallConnection.recentDisplay);
        }

        // check if page size exists
        if (!this.userSettings.pageSize) {
            this.userSettings.pageSize = this.pageSizeDefault;
        }

        // show display wall name as per selected wall connection
        this.showDisplayWallNameByWallConnection();

        // update user settings log offtime on UI
        // set text as never in case of 0
        this.autoLogOffTime = this.userSettings.logOffTime;
        this.updateAutoLogOffValueBinding(this.autoLogOffTime);

        this.loading = false;
    }

    /**
     * This method fetch display wall name and update {{displayWallName}}
     * @method showDisplayWallName
     * @param  {string} displayName Display Name to which specified content belong to.
     * @return void
     */
    private showDisplayWallName(displayName: string): void {
        const start: number = 1;
        const count: number = 1;
        const search: string = displayName;
        const isFavorite: boolean = false;
        let display: Display;
        this.cmsServerApi.getDisplayList(start, count, search, isFavorite)
            .subscribe(
            (displays: Display[]) => {
                if (displays.length) {
                    // filter display by name
                    for (const displayItem of displays) {
                        if (displayItem.name === displayName) {
                            display = displayItem;
                            break;
                        }
                    }

                    if (display) {
                        this.displayWallName = display.name;

                        // update as selected display wall for future selection
                        this.userSettings.wallConnection.specificDisplay = display.name;
                        this.cmsSettingsService.updateUserProfileData(this.userSettings);
                    } else {
                        this.displayWallName = CMSConstants.NO_DISPLAY_FOUND;
                    }
                } else {
                    this.displayWallName = CMSConstants.NO_DISPLAY_FOUND;
                }
            },
            (error: any) => {
                this.displayWallName = CMSConstants.NO_DISPLAY_FOUND;
                this.appConfig.log("CmsSettingsPanelComponent: showDisplayWallNameById");
            });
    }

    /**
     * This method fetch display wall name and update {{displayWallName}}
     * @method checkForRecentDisplay
     * @param {string} displayName Display Name to which specified content belong to.
     * @return void
     */
    private checkForRecentDisplay(displayName: string): void {
        const start: number = 1;
        const count: number = 1;
        const search: string = displayName;
        const isFavorite: boolean = false;
        let display: any;
        this.cmsServerApi.getDisplayList(start, count, search, isFavorite)
            .subscribe(
            (displays: Display[]) => {
                if (displays.length) {
                    // filter display by name
                    for (const dislayItem of displays) {
                        if (dislayItem.name === displayName) {
                            display = dislayItem;
                            break;
                        }
                    }

                    if (display) {
                        this.recentDisplayId = display.id.toString();
                    } else {
                        this.recentDisplayId = undefined;
                    }
                }
            },
            (error: any) => {
                this.appConfig.log("CmsSettingsPanelComponent: checkForRecentDisplay");
            });
    }

    /**
     * This method update user settings via PUT /users/current/profile/settings
     * @method updateUserSettingsByAction
     * @param event
     * @return void
     */
    private updateUserSettingsByAction(event: any): void {
        // prevent function execution when event source is null
        // md-radio-change event fired itself when value is change by model-binding
        if (!Validation.IS_NULL_OR_UNDEFINED(event.source)) {
            this.cmsSettingsService.updateUserProfileData(this.userSettings);
        }
    }

    /**
     * This method navigate to displays list while click on "auto connect on specific display wall" button
     * @method goToSelectDisplayForAutoConnect
     * @param event
     * @return void
     */
    private goToSelectDisplayForAutoConnect(event: any): void {
        this.router.navigate(["/displays-panel", { action: CMSConstants.SELECT_DISPLAY }]);
    }

    /**
     * This method update font-size in user profile settings on server
     * @method updateFontSize
     * @return void
     */
    private updateFontSize(): void {
        const fontSize: number = this.userSettings.sourceLabel.fontSize;
        this.userSettings.sourceLabel.fontSize = this.cmsSettingsService
            .validateCountData(fontSize, this.fontSizeSteps, this.fontSizeDefault);
        if (fontSize) {
            this.cmsSettingsService.updateUserProfileData(this.userSettings);
        }
    }

    /**
     * This method increase font-size in user profile settings on server and on UI
     * @method increaseFontSize
     * @return void
     */
    private increaseFontSize(): void {
        const fontSize: number = this.userSettings.sourceLabel.fontSize;
        this.userSettings.sourceLabel.fontSize = this.cmsSettingsService.increaseCount(fontSize, this.fontSizeSteps);
        this.updateFontSize();
    }

    /**
     * This method decrease font-size in user profile settings on server and on UI
     * @method decreaseFontSize
     * @return void
     */
    private decreaseFontSize(): void {
        const fontSize: number = this.userSettings.sourceLabel.fontSize;
        this.userSettings.sourceLabel.fontSize = this.cmsSettingsService.decreaseCount(fontSize, this.fontSizeSteps);
        this.updateFontSize();
    }

    /**
     * This method update transparency in user profile settings on server
     * @method updateTransparency
     * @return void
     */
    private updateTransparency(): void {
        const transparency: number = this.userSettings.sourceLabel.transparency;
        this.userSettings.sourceLabel.transparency = this.cmsSettingsService
            .validateCountData(transparency, this.transparencySteps, this.transparencyDefault);
        if (transparency || transparency === 0) {
            this.cmsSettingsService.updateUserProfileData(this.userSettings);
        }
    }

    /**
     * This method increase transparency in user profile settings on server and on UI
     * @method increaseTransparency
     * @return void
     */
    private increaseTransparency(): void {
        const transparency: number = this.userSettings.sourceLabel.transparency;
        this.userSettings.sourceLabel.transparency = this.cmsSettingsService.increaseCount(transparency, this.transparencySteps);
        this.updateTransparency();
    }

    /**
     * This method decrease transparency in user profile settings on server and on UI
     * @method decreaseTransparency
     * @return void
     */
    private decreaseTransparency(): void {
        const transparency: number = this.userSettings.sourceLabel.transparency;
        this.userSettings.sourceLabel.transparency = this.cmsSettingsService.decreaseCount(transparency, this.transparencySteps);
        this.updateTransparency();
    }

    /**
     * This method update font color in user profile settings on server
     * @method updateFontColor
     * @return void
     */
    private updateFontColor(event: any): void {
        if (event) {
            const fontColor: string = event.value;
            if (fontColor) {
                this.userSettings.sourceLabel.fontColor = fontColor;
                this.cmsSettingsService.updateUserProfileData(this.userSettings);
            }
        }
    }

    /**
     * This method update background color in user profile settings on server
     * @method updateBackgroundColor
     * @param event
     * @return void
     */
    private updateBackgroundColor(event: any): void {
        if (event) {
            const backgroundColor: string = event.value;
            if (backgroundColor) {
                this.userSettings.sourceLabel.​backgroundColor = backgroundColor;
                this.cmsSettingsService.updateUserProfileData(this.userSettings);
            }
        }
    }

    /**
     * This method will show languages panel if user have licenses.
     * @method showLanguages
     * @property {event} event
     * @return void
     */
    private showLanguages(event: any): void {
        event.preventDefault();
        if (this.localizationLicense) {
            this.router.navigate([`/settings/language/${this.userSettings.language}`]);
        }
    }

    /**
     * This method update logOffTime in user profile settings on server
     * @method updateLogOffTime
     * @return void
     */
    private updateLogOffTime(): void {
        const autoLogOffTime: number = Number(this.autoLogOffTime);
        this.autoLogOffTime = this.cmsSettingsService.validateCountData(autoLogOffTime, this.logOffTimeSteps, this.logOffTimeDefault);
        if (this.autoLogOffTime === 0 || isNaN(this.autoLogOffTime)) {
            // update time as 0 for NaN and "never" on UI
            this.updateAutoLogOffValueBinding(this.autoLogOffTime);
            this.userSettings.logOffTime = 0;
            this.cmsSettingsService.updateUserProfileData(this.userSettings);
        } else {
            // update value as numeric
            this.userSettings.logOffTime = this.autoLogOffTime;
            this.cmsSettingsService.updateUserProfileData(this.userSettings);
        }
    }

    /**
     * This method increase logOffTime in user profile settings on server and on UI
     * @method increaseLogOffTime
     * @return void
     */
    private increaseLogOffTime(): void {
        const autoLogOffTime: number = Number(this.autoLogOffTime);
        this.autoLogOffTime = this.cmsSettingsService.increaseCount(autoLogOffTime, this.logOffTimeSteps) || this.logOffTimeSteps[1];
        this.updateLogOffTime();
    }

    /**
     * This method decrease logOffTime in user profile settings on server and on UI
     * @method increaseLogOffTime
     * @return void
     */
    private decreaseLogOffTime(): void {
        const autoLogOffTime: number = Number(this.autoLogOffTime);
        this.autoLogOffTime = this.cmsSettingsService.decreaseCount(autoLogOffTime, this.logOffTimeSteps) || this.logOffTimeSteps[0];
        this.updateLogOffTime();
    }

    /**
     * This method update logoff time to "never" on UI
     * @method updateAutoLogOffValueBinding
     * @return void
     */
    private updateAutoLogOffValueBinding(autoLogOffTime: number): void {
        if (autoLogOffTime === 0 || isNaN(autoLogOffTime)) {
            this.translate.get("settings.never").subscribe((response: number) => {
                this.autoLogOffTime = response;
            });
        }
    }

    /**
     * This method show display wall name as per selected wall connection
     * @method showDisplayWallNameByWallConnection
     * @return void
     */
    private showDisplayWallNameByWallConnection(): void {
        if (this.userSettings.wallConnection.specificDisplay !== ""
            && this.userSettings.wallConnection.startUpAction === CMSConstants.WALL_CONNECTION.SPECIFIC_WALL) {
            //show selected display name
            this.showDisplayWallName(this.userSettings.wallConnection.specificDisplay);
        } else if (this.userSettings.wallConnection.recentDisplay !== "") {
            //show recent display name
            this.showDisplayWallName(this.userSettings.wallConnection.recentDisplay);
        }

        // check if any display exist or not
        this.showFirstDisplayWallName();
    }

    /**
     * This method gets any first display from CMS Server API.
     * @method showFirstDisplayWallName
     * @return {any} Observable
     */
    private showFirstDisplayWallName(): Subscription {
        const start: number = 1;
        const count: number = 1;
        const search: string = "";
        const isFavorite: boolean = false;

        return this.cmsServerApi.getDisplayList(start, count, search, isFavorite)
            .subscribe(
            (displays: Display[]) => {
                if (displays.length === 0) {
                    // if no displays are available
                    this.noDisplayAvailable = true;
                } else {
                    this.noDisplayAvailable = false;

                    // wall exists and no recent wall selected
                    if (this.userSettings.wallConnection.recentDisplay === "") {
                        this.showDisplayWallName(displays[0].name);
                    }
                }
            },
            (error: any) => {
                this.appConfig.log("CmsSettingsPanelComponent: showFirstDisplayWallName");
            });
    }

    /**
     * This method navigate to back page
     * @method navigateBack
     * @return void
     */
    private navigateBack(): void {
        history.back();
    }
}
