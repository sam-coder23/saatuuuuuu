/**
 * This component creates the UI for the user login page and performs user login on submit.
 * @class CmsLoginComponent
 * @constructor constructor This will inject the following dependency cmsServerApi, storageManager, router etc.
 * @property {boolean} hasError
 * @property {string} isLoginInProgress Filter property which will filter the display list
 * @property {string} errorMessage
 */
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

import { CmsApiService } from "../../cms/api/cms-api.service";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { CMSConstants } from "../../cms/models/cms-constants";
import { CmsSessionStorageItem } from "../../cms/models/cms-session-storage-item";
import { AppConfig } from "../../config";
import { CmsSettingsService } from "../settings/cms-settings.service";
import { IUserConfig, User } from "./../../../app/cms/models/cms-user.model";
import { CmsMiniDisplayService } from "./../../shared/mini-display/cms-mini-display.service";

@Component({
    //moduleId: module.id,
    selector: "cms-login",
    template: require("./cms-login.component.html"),
    styles: [require("./cms-login.component.scss")]
})

export class CmsLoginComponent implements OnInit, OnDestroy {
    // to show or hide login error
    private hasError: boolean = false;

    // to show or hide login progress animation
    private isLoginInProgress: boolean = false;

    private user: IUserConfig = {
        username: "",
        password: ""
    };

    // error message to be shown to the user
    private errorMessage: string;

    constructor(private cmsSettingsService: CmsSettingsService,
        private router: Router,
        private cmsServerApi: CmsApiService,
        private storageManager: StorageManager,
        private translate: TranslateService,
        private cmsMiniDisplayService: CmsMiniDisplayService,
        private appConfig: AppConfig) { }

    public ngOnInit(): void {
        this.storageManager.removeStorage();
        this.cmsMiniDisplayService.init();
        if (this.cmsSettingsService.selectedSources instanceof Array) {
            this.cmsSettingsService.selectedSources.length = 0;
        }
    }

    public ngOnDestroy(): void {
        // called on destroy event to avoid UI flickering on language change
        this.cmsSettingsService.applyUserSelectedLanguage();
    }

    /**
     * This event will triggered from html when user will enter a key in username box.
     * This will hide error as user has entered a new key.
     * @method userNameChanged
     * @return void
     */
    private userNameChanged(): void {
        this.hasError = false;
    }

    /**
     * This event will triggered from html when user will enter a key in password box.
     * This will hide error as user has entered a new key.
     * @method passwordChanged
     * @return void
     */
    private passwordChanged(): void {
        this.hasError = false;
    }

    /**
     * Login form submit handler
     * @event onLoginSubmit
     * @return void
     */
    private onLoginSubmit(): void {
        this.blurInputs();
        this.login();
    }

    /**
     * This event will triggered from html when user will press the login button.
     * This is responsible for sending authentcation information to API.
     * @event login
     * @return void
     */
    private login(): void {
        // remove white space at any (start and end of username)
        if (this.user.username) {
            this.user.username = this.user.username.trim();
        }

        const userModel: User = new User(this.user);
        const errorCode: number = 406;
        this.isLoginInProgress = true;

        this.cmsServerApi.login(userModel)
            .subscribe(
            (response: any) => {
                // Set user settings on login and set user selected language and wall connection
                this.cmsSettingsService.setUserProfileSettings(() => {
                    // fetch user settings success
                    // store logged in user info in storage
                    userModel.LoggedIn = true;
                    this.storageManager.setItem(CmsSessionStorageItem.USER, JSON.stringify(userModel.asSerializable()));
                    this.isLoginInProgress = false;

                    // create session with server
                    this.cmsServerApi.keepSessionAlive();

                    // store user setting in storage
                    this.storageManager.setItem(CmsSessionStorageItem.SETTINGS, JSON.stringify(this.cmsSettingsService.userSettings));
                    this.cmsSettingsService.applyUserSelectedLanguage();
                    this.cmsSettingsService.connectToWallAtStartup();
                }, () => {
                    // fetch user settings fail
                    this.appConfig.log("CmsLoginComponent: login:: User settings json is corrupt.");
                    this.isLoginInProgress = false;
                    this.hasError = true;
                    this.showErrorMessage(errorCode);
                });
            },
            (error: any) => {
                this.appConfig.log("CmsLoginComponent: login:: Login failed.");
                this.isLoginInProgress = false;
                this.hasError = true;
                this.showErrorMessage(error.status);
            });
    }

    /**
     * This method removes focus from all input boxes on the page.
     * @method blurInputs
     * @return void
     */
    private blurInputs(): void {
        const inputs: NodeListOf<HTMLInputElement> = document.getElementsByTagName("input");
        Array.prototype.forEach.call(inputs, (node: HTMLInputElement): void => {
            if (node.type === "text" || node.type === "password") {
                node.blur();
            }
        });
    }

    /**
     * This method will show appropriate message as per error status code.
     * @method showErrorMessage
     * @param {number} errorStatus
     * @return void
     */
    private showErrorMessage(errorStatus: number): void {
        const errorCode: any = {
            licenseError: 403,
            serverError: 503,
            settingsError: 406,
            userDisabled: 409,
            notFound: 404,
            serverUnavailable: 0
        };
        this.appConfig.log(`CmsLoginComponent: login:: Show login error message for error status ${errorStatus}`);

        let messageKey: string = "";

        if (errorStatus === CMSConstants.ERRORCODE.LICENSE_ERROR) {
            messageKey = "login.licenceError";
        } else if (errorStatus === CMSConstants.ERRORCODE.SERVER_ERROR) {
            messageKey = "login.serverNotReadyError";
        } else if (errorStatus === CMSConstants.ERRORCODE.SETTING_ERROR) {
            messageKey = "login.settingsReadyError";
        } else if (errorStatus === CMSConstants.ERRORCODE.USER_DISABLED) {
            messageKey = "login.userDisabledError";
        } else if (errorStatus === CMSConstants.ERRORCODE.SERVER_UNAVAILABLE || errorStatus === CMSConstants.ERRORCODE.NOT_FOUND) {
            messageKey = "login.serverUnavailableError";
        } else {
            messageKey = "login.error";
        }

        // error message using TranslateService
        if (messageKey !== "") {
            this.translate.get(messageKey).subscribe((response: string) => {
                this.errorMessage = response;
            });
        }
    }
}
