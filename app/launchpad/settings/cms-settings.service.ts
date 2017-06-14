/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { CmsApiService } from '../../cms/api/cms-api.service';
import { CmsLanguages } from '../../i18n/cms-languages';
import { CMS_SESSION_STORAGE_ITEM } from '../../cms/models/cms-session-storage-item';
import { StorageManager } from '../../cms/api/cms-storagemanager.service';
import { IUserProfileSettings } from '../../cms/models/cms-user-profile-settings';
import { Display } from '../../cms/models/cms-display';
import { AppConfig } from '../../config';
import { CMSConstants } from '../../cms/models/cms-constants';

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
            if (cmsLanguages[i]['key'] === languageKey) {
                return cmsLanguages[i]['value'];
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
                 if(failure){
                     failure();
                 }
            });
    }

    /**
     * @description
     *  This method sets user selected language on the basis of localization licesnse
     */
    public applyUserSelectedLanguage(): void {
        let defaultLanguage = this.appConfig.defaultLanguage;
        
		// if language is not available
        if(!this.mUserSettings.language || !this.mUserSettings.language.length) {
            this.mUserSettings.language = defaultLanguage;
        }
		
		// set user selected language
        this.translate.use(this.mUserSettings.language);
        this.setTextDirectionByLanguageKey(this.mUserSettings.language);
		
		// fetch localization licence info and set default language if licence is not available
        this.cmsServerApi.getSystemInfo()
            .subscribe(
                response => {
                    if (response) {
                        let localizationLicense = response.licenseinfo && response.licenseinfo.localization;

                        if (!localizationLicense) {
                            this.mUserSettings.language = defaultLanguage;
                            this.translate.use(defaultLanguage);
                            this.setTextDirectionByLanguageKey(this.mUserSettings.language);
                            this.updateUserProfileData(this.mUserSettings);                        
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
    public updateWallConnectionRecentDisplayId(display): void {
        this.mUserSettings.wallConnection.atStartup.recentDisplayId = display.id;
        this.updateUserProfileData(this.mUserSettings);
    }

    /**
      * @description This method update displayId related to wall connection
      * @param display : display wall info json
     */
    public updateWallConnectionSpecificDisplayId(display): void {
        this.mUserSettings.wallConnection.atStartup.selectedDisplayId = display.id;
        this.updateUserProfileData(this.mUserSettings, () => this.router.navigate(['/settings']));
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
     * This method decrease count value as per it's index and nearest low value
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
        let selectedOption = this.mUserSettings.wallConnection.atStartup.status;
        let selectedDisplayId = this.mUserSettings.wallConnection.atStartup.selectedDisplayId;
        let recentDisplayId = this.mUserSettings.wallConnection.atStartup.recentDisplayId;

        switch (selectedOption) {
            case "show-available-walls-list":
                this.router.navigate(['/displays-panel']);                
                break;

            case "auto-connect-to-most-recent-wall":
                this.autoConnectToMostRecentWall(recentDisplayId);
                break;

            case "auto-connect-to-specific-wall":
                this.autoConnectToSpecificWall(selectedDisplayId);
                break;
        }
    }


    /**
     * @description 
     * This method connect to most recent wall at startup
     */
    private autoConnectToMostRecentWall(recentDisplayId: any): void {
        if (recentDisplayId === '') {
            this.router.navigate(['/displays-panel']);
            return;
        }

        // get display wall details as per displayId
        this.cmsServerApi.getSelectedDisplayContent(recentDisplayId)
            .subscribe((display: Display) => {
                if (display) {
                    window.sessionStorage.setItem(CMS_SESSION_STORAGE_ITEM.Display, JSON.stringify(display));
                    this.router.navigate([`/display-panel/${display.id}`]);
                }
            }, (error) => {
                this.router.navigate(['/displays-panel']);
                this.appConfig.log("CmsSettingsService: connectToWallAtStartup");
            });
    }

    /**
     * @description 
     * This method connect to specific wall at startup
     */
    private autoConnectToSpecificWall(selectedDisplayId: any): void {
        if (selectedDisplayId === '') {
            this.router.navigate(['/displays-panel']);
            return;
        }

        this.cmsServerApi.getSelectedDisplayContent(selectedDisplayId)
            .subscribe((display: Display) => {
                if (display) {
                    //update recentDisplayId on user profile data 
                    this.updateWallConnectionRecentDisplayId(display);

                    window.sessionStorage.setItem(CMS_SESSION_STORAGE_ITEM.Display, JSON.stringify(display));
                    this.router.navigate([`/display-panel/${display.id}`]);
                }
            }, (error) => {
                this.router.navigate(['/displays-panel']);
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
     * This method update 'isLongPress' property and update event emit 
     */
    public updateIsLongPress(state: boolean) {
        this.isLongPressed = state;
        this.longPressedSubject.next(state);
    }

    /**
     * This method update text direction for whole application
     */
    public setTextDirectionByLanguageKey(languageKey) {
        let html = document.getElementsByTagName('html')[0];
        html.setAttribute("dir", this.isRTLLanguage(languageKey) ? "rtl": "ltr");        
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
    public setBrowserLanguage(){
        let browserLang = this.translate.getBrowserLang();
        let languagesRegEx = CmsLanguages.languagesRegExPattern;
        
        this.translate.use(browserLang.match(languagesRegEx) ? browserLang : this.appConfig.defaultLanguage);

        //update text direction
        this.setTextDirectionByLanguageKey(browserLang);
    }
}
