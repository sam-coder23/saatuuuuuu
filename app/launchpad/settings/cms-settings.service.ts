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
 * This service provides method related to user settings.
 * @class CmsSettingsService
 * @property {IUserProfileSettings} userSettings
 * @property {Subject} longPressedSubject 
 * @property {boolean} isLongPressed
 * @property {Source[]} selectedSources
 */
@Injectable()
export class CmsSettingsService {
    //store user profile settings
    public userSettings: IUserProfileSettings;
    // Observable for longPress state
    public longPressedSubject: Subject<boolean> = new Subject<boolean>();
    public isLongPressed: boolean;
    public selectedSources: Source[] = [];

    constructor(
        private translate: TranslateService,
        private cmsServerApi: CmsApiService,
        private router: Router,
        private storageManager: StorageManager,
        private appConfig: AppConfig) {
    }

    /**
     * This method get lanaguage value from key
     * @method getUserSelectedLanguageByKey
     * @param {string} languageKey Key is reference which is bind to specific language
     * @return {string} 
     */
    public getUserSelectedLanguageByKey(languageKey: string): string {
        let cmsLanguages = CmsLanguages.languages;

        //looping in all lanaguage and get value as per key
        for (let index = 0; index < cmsLanguages.length; index++) {
            if (cmsLanguages[index]["key"] === languageKey) {
                return cmsLanguages[index]["value"];
            }
        }
    }


    /**
     * This method fetch user profile settings and update local property and execute optional callback function
     * @method setUserProfileSettings
     * @param {any} callback
     * @param {any} failure
     */
    public setUserProfileSettings(callback?, failure?): void {
        this.cmsServerApi.getUserProfileSettings()
            .then((response) => {
                if (response) {
                    this.userSettings = response;

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
     * This method sets user selected language on the basis of localization licesnse
     * @method applyUserSelectedLanguage
     * @return {void}
     */
    public applyUserSelectedLanguage(): void {
        let defaultLanguage = this.appConfig.DefaultLanguage;

        // if language is not available
        if (!this.userSettings) {
            this.appConfig.log("Error loading user settings.");

            // set user selected language
            this.translate.use(defaultLanguage);
            this.setTextDirectionByLanguageKey(defaultLanguage);
        } else {
            if (!this.userSettings.language) {
                this.userSettings.language = defaultLanguage;
            }

            // set user selected language
            this.translate.use(this.userSettings.language);
            this.setTextDirectionByLanguageKey(this.userSettings.language);
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

                        if (this.userSettings) {
                            this.userSettings.language = defaultLanguage;
                            this.updateUserProfileData(this.userSettings);
                        }
                    }
                }
            },
            error => {
                this.appConfig.log("cmsServerApi.getSystemInfo api fail Error");
            });
    }

    /**
     * This method update user settings via API and execute optional callback function
     * @method updateUserProfileData
     * @param {IUserProfileSettings} data contain data-model of user settings
     * @return {void}
     */
    public updateUserProfileData(data: IUserProfileSettings, callback?): void {
        if (!data) { return };

        this.userSettings = data;

        this.cmsServerApi.updateUserProfileSettings(data)
            .then((response) => {
                // store user setting in storage
                this.storageManager.set(CMS_SESSION_STORAGE_ITEM.SETTINGS, JSON.stringify(this.userSettings));
                if (callback) {
                    callback();
                }
            })
            .catch((error) => {
                this.appConfig.log("CmsSettingsService: updateUserProfileData error");
            });
    }

    /**
      * This method update displayId related to wall connection
      * @method updateWallConnectionRecentDisplay
      * @param {Display} display wall info json
      * @return {void}
      */
    public updateWallConnectionRecentDisplay(display): void {
        if (display) {
            this.userSettings.wallConnection.recentDisplay = display.name;
            this.updateUserProfileData(this.userSettings);
        }
    }

    /**
      * This method update displayName related to wall connection
      * @method updateWallConnectionSpecificDisplay
      * @param {Display} display wall info json
      * @return {void}
      */
    public updateWallConnectionSpecificDisplay(display): void {
        if (display) {
            this.userSettings.wallConnection.specificDisplay = display.name;
            this.updateUserProfileData(this.userSettings, () => history.back());
        }
    }

    /**
     * This method validate input [number] as per min, max and default values
     * @method validateCountData
     * @param {number} count
     * @param {any} data
     * @param {number} defaultCount
     * @return number
     */
    public validateCountData(count: number, data: any, defaultCount: number): number {
        let maxCount = data[data.length - 1];
        let minCount = data[0];
        
        if (isNaN(count)) { 
            return defaultCount;
        }

        if (count <= minCount) { 
            return minCount; 
        }

        if (count >= maxCount) { 
            return maxCount; 
        }

        return count;
    }

    /**
     * This method increase count value as per it's index and nearest high value
     * @method increaseCount
     * @param {number} count
     * @param {any} data
     * @return number
     */
    public increaseCount(count: number, data: any): number {
        let countIndex = data.indexOf(count);

        if (countIndex == -1) {
            return this.getNearestHighValue(count, data);
        } else {
            if (data.length - 1 !== countIndex) {
                return data[countIndex + 1];
            }
        }

        return count;
    }

    /**
     * This method decrease count value as per it"s index and nearest low value
     * @method decreaseCount
     * @param {number} count
     * @param {any} data
     * @return number
     */
    public decreaseCount(count: number, data: any): number {
        let countIndex = data.indexOf(count);
        if (countIndex == -1) {
            return this.getNearestLowValue(count, data);
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
     * @method connectToWallAtStartup
     * @return {void}
     */
    public connectToWallAtStartup(): void {
        let selectedOption = this.userSettings.wallConnection.startUpAction;
        let selectedDisplayName = this.userSettings.wallConnection.specificDisplay;
        let recentDisplayName = this.userSettings.wallConnection.recentDisplay;

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
     * This method navigates directly to the source panel if there is only one display available.
     * @method navigateToSourcePanel
     * @param {Display[]} displays
     * @return {void}
     */
    private navigateToSourcePanel(displays: Display[]): void {
        //update recentDisplayId on user profile data         
        this.updateWallConnectionRecentDisplay(displays[0]);
        this.storageManager.set(CMS_SESSION_STORAGE_ITEM.DISPLAY, JSON.stringify(displays[0]));
        this.router.navigate([`/displays/${displays[0].id}/sources-panel`]);
    }

    /**
     * This method connect to most recent wall at startup
     * @method autoConnectToMostRecentWall
     * @param {string} recentDisplayName
     * @return {void}
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
                        this.storageManager.set(CMS_SESSION_STORAGE_ITEM.DISPLAY, JSON.stringify(display));
                        this.router.navigate([`/displays/${display.id}/sources-panel`]);
                    }
                    else {
                        this.router.navigate(["/displays-panel"]);
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
     * This method connect to specific wall at startup
     * @method autoConnectToSpecificWall
     * @param {string} autoConnectToSpecificWall
     * @return {void}
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

                        this.storageManager.set(CMS_SESSION_STORAGE_ITEM.DISPLAY, JSON.stringify(display));
                        this.router.navigate([`/displays/${display.id}/sources-panel`]);
                    }
                    else {
                        this.router.navigate(["/displays-panel"]);
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
     * @method getNearestHighValue
     * @param {number} count
     * @param {number[]} data
     * @return {number}
     */
    private getNearestHighValue(count: number, data: number[]) {
        for (let index = 0; index < data.length; index++) {
            if (count < data[index]) {
                return data[index];
            }
        }
    }

    /**
     * This method fetch nearest low value
     * @method getNearestLowValue
     * @param {number} count
     * @param {number[]} data
     * @return {number}
     */
    private getNearestLowValue(count: number, data: number[]) {
        for (let index = data.length - 1; index >= 0; index--) {
            if (count > data[index]) {
                return data[index];
            }
        }
    }

    /**
     * This method update "isLongPress" property and update event emit
     * @method updateIsLongPress
     * @param {boolean} state
     * @return {void}
     */
    public updateIsLongPress(state: boolean): void{
        this.isLongPressed = state;
        this.longPressedSubject.next(state);
    }

    /**
     * This method update text direction for whole application
     * @method setTextDirectionByLanguageKey
     * @param {string} languageKey
     * @return {void}
     */
    public setTextDirectionByLanguageKey(languageKey): void{
        let html = document.getElementsByTagName("html")[0];
        html.setAttribute("dir", this.isRTLLanguage(languageKey) ? "rtl" : "ltr");
    }

    /**
     * This method return true if slected language is RTL Type
     * @method isRTLLanguage
     * @param {string} languageKey
     * @return {boolean}
     */
    public isRTLLanguage(languageKey): boolean{
        return CMSConstants.RTLLANGUAGES.indexOf(languageKey) !== -1;
    }

    /**
     * This method set application language as per browser language 
     * @method setBrowserLanguage
     * @return {void}
     */
    public setBrowserLanguage(): void {
        let currentLang;
        let settingsStorageData = this.storageManager.get(CMS_SESSION_STORAGE_ITEM.SETTINGS);
        
        if (settingsStorageData) {
            let userSettings = JSON.parse(settingsStorageData);
            if (userSettings && userSettings.language) {
                currentLang = userSettings.language;
            }
        }

        if (!currentLang) {
            let browserLang = this.translate.getBrowserLang();
            let languagesRegEx = CmsLanguages.languagesRegExPattern;
            currentLang = browserLang.match(languagesRegEx) ? browserLang : this.appConfig.DefaultLanguage;
        }

        this.translate.use(currentLang);

        //update text direction
        this.setTextDirectionByLanguageKey(currentLang);
    }
}
