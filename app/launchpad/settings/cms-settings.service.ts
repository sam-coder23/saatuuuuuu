/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";

import { CmsApiService } from "../../cms/api/cms-api.service";
import { CmsLanguages } from "../../i18n/cms-languages";
import { CMS_SESSION_STORAGE_ITEM } from "../../cms/models/cms-session-storage-item";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { IUserProfileSettings } from "../../cms/models/cms-user-profile-settings";
import { Display } from "../../cms/models/cms-display";
import { AppConfig } from "../../config";
import { CMSConstants } from "../../cms/models/cms-constants";
import { Source } from "./../../cms/models/cms-source";

/**
 * This service is used to provide all methods related to.
 */
@Injectable()
export class CmsSettingsService {
    //store user profile settings
    mUserSettings: IUserProfileSettings;
    // Observable for longPress state
    longPressedSubject: Subject<boolean> = new Subject<boolean>();
    isLongPressed: boolean;

    public selectedSources: Source[] = [];

    /**
     * @description
     * The constructor initializes various services.
     */
    constructor(private translate: TranslateService, private cmsServerApi: CmsApiService, private router: Router, private storageManager: StorageManager, private appConfig: AppConfig) {
    }

    /**
     * @description
     * This method get lanaguage value from key
     * 
     * @param
     * languageKey: string :: key is reference which is bind to specific language 
     */
    public getUserSelectedLanguageByKey(languageKey: string): string {
        let cmsLanguages = CmsLanguages.languages;

        //looping in all lanaguage and get value as per key
        for (var i = 0; i < cmsLanguages.length; i++) {
            if (cmsLanguages[i]["key"] === languageKey) {
                return cmsLanguages[i]["value"];
            }
        }
    }


    /**
     * @description
     * This method fetch user profile settings and update local property and execute optional callback function
     */
    public setUserProfileSettings(callback?, failure?): void {
        this.cmsServerApi.getUserProfileSettings()
            .then((response) => {
                if (response) {
                    this.mUserSettings = response;

                    if (callback) {
                        callback();
                    }
                }
            })
            .catch((error) => {
                if (failure) {
                    failure();
                }
            });
    }

    /**
     * @description
     *  This method sets user selected language on the basis of localization licesnse
     */
    public applyUserSelectedLanguage(): void {
        let defaultLanguage = this.appConfig.DefaultLanguage;

        // if language is not available
        if (!this.mUserSettings) {
            this.appConfig.log("Error loading user settings.");

            // set user selected language
            this.translate.use(defaultLanguage);
            this.setTextDirectionByLanguageKey(defaultLanguage);
        } else {
            if (!(this.mUserSettings.language && this.mUserSettings.language.length > 0)) {
                this.mUserSettings.language = defaultLanguage;

                // set user selected language
                this.translate.use(this.mUserSettings.language);
                this.setTextDirectionByLanguageKey(this.mUserSettings.language);
            }
        }

        // fetch localization licence info and set default language if licence is not available
        this.cmsServerApi.getSystemInfo()
            .subscribe(
            response => {
                if (response) {
                    let localizationLicense = response.LicenseInfo && response.LicenseInfo.localization;

                    if (!localizationLicense) {
                        this.translate.use(defaultLanguage);
                        this.setTextDirectionByLanguageKey(defaultLanguage);

                        if (this.mUserSettings) {
                            this.mUserSettings.language = defaultLanguage;
                            this.updateUserProfileData(this.mUserSettings);
                        }
                    }
                }
            },
            error => {
                this.appConfig.log("cmsServerApi.getSystemInfo api fail Error");
            });
    }

    /**
     * @description
     *  This method update user settings via API and execute optional callback function
     * 
     * @Param data: IUserProfileSettings :: contain data-model of user settings
     */
    public updateUserProfileData(data: IUserProfileSettings, callback?): void {
        if (!data) { return };

        this.mUserSettings = data;

        this.cmsServerApi.updateUserProfileSettings(data)
            .then((response) => {
                // store user setting in storage
                this.storageManager.set(CMS_SESSION_STORAGE_ITEM.Settings, JSON.stringify(this.mUserSettings));
                if (callback) {
                    callback();
                }
            })
            .catch((error) => {
                this.appConfig.log("CmsSettingsService: updateUserProfileData error");
            });
    }

    /**
      * @description
      *  This method update displayId related to wall connection
      *
      * @Param display :: display wall info json
      */
    public updateWallConnectionRecentDisplay(display): void {
        if (display) {
            this.mUserSettings.wallConnection.recentDisplay = display.name;
            this.updateUserProfileData(this.mUserSettings);
        }
    }

    /**
      * @description This method update displayName related to wall connection
      * @param display : display wall info json
     */
    public updateWallConnectionSpecificDisplay(display): void {
        if (display) {
            this.mUserSettings.wallConnection.specificDisplay = display.name;
            this.updateUserProfileData(this.mUserSettings, () => this.router.navigate(["/settings"]));
        }
    }

    /**
     * This method validate input [number] as per min, max and default values
     */
    public validateCountData(count: number, data: any, defaultCount: number): number {
        let maxCount = data[data.length - 1];
        let minCount = data[0];
        if (isNaN(count)) { return defaultCount }
        if (count <= minCount) { return minCount }
        if (count >= maxCount) { return maxCount }
        return count;
    }

    /**
     * This method increase count value as per it's index and nearest high value
     */
    public increaseCount(count: number, data: any): number {
        let countIndex = data.indexOf(count);
        if (countIndex == -1) {
            return this.getNearestHighValue(count, data)
        } else {
            if (data.length - 1 !== countIndex) {
                return data[countIndex + 1];
            }
        }
        return count;
    }

    /**
     * This method decrease count value as per it"s index and nearest low value
     */
    public decreaseCount(count: number, data: any): number {
        let countIndex = data.indexOf(count);
        if (countIndex == -1) {
            return this.getNearestLowValue(count, data)
        } else {
            if (countIndex !== 0) {
                return data[countIndex - 1];
            }
        }
        return count;
    }

    /**
     * @description 
     * This method connect to wall as per user selection of wall connection at startup
     */
    public connectToWallAtStartup(): void {
        let selectedOption = this.mUserSettings.wallConnection.startUpAction;
        let selectedDisplayName = this.mUserSettings.wallConnection.specificDisplay;
        let recentDisplayName = this.mUserSettings.wallConnection.recentDisplay;

        this.cmsServerApi.getDisplayList().subscribe((displays: Display[]) => {
            //Check for if only one display is available.
            if (displays.length === 1) {
                this.navigateToSourcePanel(displays);
                return;
            }

            switch (selectedOption) {
                case CMSConstants.WALL_CONNECTION.DISPLAY_WALL_LIST:
                    this.router.navigate(["/displays-panel"]);
                    break;

                case CMSConstants.WALL_CONNECTION.RECENT_WALL:
                    this.autoConnectToMostRecentWall(recentDisplayName);
                    break;

                case CMSConstants.WALL_CONNECTION.SPECIFIC_WALL:
                    this.autoConnectToSpecificWall(selectedDisplayName);
                    break;
            }
        });
    }

    /**
     * @description 
     * This method navigates directly to the source panel if there is only one display available.
     */
    private navigateToSourcePanel(displays: Display[]) {
        //update recentDisplayId on user profile data         
        this.updateWallConnectionRecentDisplay(displays[0]);
        this.storageManager.set(CMS_SESSION_STORAGE_ITEM.Display, JSON.stringify(displays[0]));
        this.router.navigate([`/displays/${displays[0].id}/sources-panel`]);
    }

    /**
     * @description 
     * This method connect to most recent wall at startup
     */
    private autoConnectToMostRecentWall(recentDisplayName: string): void {
        let start = 1, count = 1, search = recentDisplayName, isFavorite = false, display;

        if (recentDisplayName === "") {
            this.router.navigate(["/displays-panel"]);
            return;
        }

        // get display wall details as per displayName
        this.cmsServerApi.getDisplayList(start, count, search, isFavorite)
            .subscribe((displays: Display[]) => {
                if (displays.length) {

                    // filter display by name
                    for (let displayIndex = 0; displayIndex < displays.length; displayIndex++) {
                        if (displays[displayIndex].name === recentDisplayName) {
                            display = displays[displayIndex];
                            break;
                        }
                    };

                    if (display) {
                        this.storageManager.set(CMS_SESSION_STORAGE_ITEM.Display, JSON.stringify(display));
                        this.router.navigate([`/displays/${display.id}/sources-panel`]);
                    }
                } else {
                    this.router.navigate(["/displays-panel"]);
                }
            }, (error) => {
                this.router.navigate(["/displays-panel"]);
                this.appConfig.log("CmsSettingsService: connectToWallAtStartup");
            });
    }

    /**
     * @description 
     * This method connect to specific wall at startup
     */
    private autoConnectToSpecificWall(selectedDisplayName: string): void {
        let start = 1, count = 1, search = selectedDisplayName, isFavorite = false, display;

        if (selectedDisplayName === "") {
            this.router.navigate(["/displays-panel"]);
            return;
        }

        this.cmsServerApi.getDisplayList(start, count, search, isFavorite)
            .subscribe((displays: Display[]) => {
                if (displays.length) {
                    // filter display by name
                    for (let displayIndex = 0; displayIndex < displays.length; displayIndex++) {
                        if (displays[displayIndex].name === selectedDisplayName) {
                            display = displays[displayIndex];
                            break;
                        }
                    };

                    if (display) {
                        //update recentDisplay on user profile data 
                        this.updateWallConnectionRecentDisplay(display);

                        this.storageManager.set(CMS_SESSION_STORAGE_ITEM.Display, JSON.stringify(display));
                        this.router.navigate([`/displays/${display.id}/sources-panel`]);
                    }
                } else {
                    this.router.navigate(["/displays-panel"]);
                }
            }, (error) => {
                this.router.navigate(["/displays-panel"]);
                this.appConfig.log("CmsSettingsService: connectToWallAtStartup");
            });
    }

    /**
     * This method fetch nearest high value
     */
    private getNearestHighValue(count: number, data: number[]) {
        for (var i = 0; i < data.length; i++) {
            if (count < data[i]) {
                return data[i];
            }
        }
    }

    /**
     * This method fetch nearest low value
     */
    private getNearestLowValue(count: number, data: number[]) {
        for (var i = data.length - 1; i >= 0; i--) {
            if (count > data[i]) {
                return data[i];
            }
        }
    }

    /**
     * This method update "isLongPress" property and update event emit 
     */
    public updateIsLongPress(state: boolean) {
        this.isLongPressed = state;
        this.longPressedSubject.next(state);
    }

    /**
     * This method update text direction for whole application
     */
    public setTextDirectionByLanguageKey(languageKey) {
        let html = document.getElementsByTagName("html")[0];
        html.setAttribute("dir", this.isRTLLanguage(languageKey) ? "rtl" : "ltr");
    }

    /**
     * This method return true if slected language is RTL Type
     */
    public isRTLLanguage(languageKey) {
        return CMSConstants.RTLLanguages.indexOf(languageKey) !== -1;
    }

    /**
     * This method set application language as per browser language 
     */
    public setBrowserLanguage() {
        let browserLang = this.translate.getBrowserLang();
        let languagesRegEx = CmsLanguages.languagesRegExPattern;

        this.translate.use(browserLang.match(languagesRegEx) ? browserLang : this.appConfig.DefaultLanguage);

        //update text direction
        this.setTextDirectionByLanguageKey(browserLang);
    }
}
