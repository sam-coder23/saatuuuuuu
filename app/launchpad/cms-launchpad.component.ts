/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { Component, OnInit, ElementRef, EventEmitter, OnDestroy } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs/Rx";
import { Router } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { MdIconRegistry } from "@angular/material";

import { EventManager } from "../utils/event-manager.util";

import { CmsApiService } from "../cms/api/cms-api.service";
import { CmsSettingsService } from "./settings/cms-settings.service";
import { CmsLanguages } from "../i18n/cms-languages";
import { StorageManager } from "../cms/api/cms-storagemanager.service";
import { CMS_SESSION_STORAGE_ITEM } from "../cms/models/cms-session-storage-item";
import { IUserToken } from "./models/cms-user-token";
import { CMS_EVENTS } from "../cms/api/cms-events.enum";
import { CmsEventEmitterService } from "../cms/api/cms-event-emitter.service";
import { AppConfig } from "../config";

import "../global.global.scss";
import "../themes.global.scss";
import "../override.global.scss";

import "../resources/fonts/cmslaunchpad-fonts.css";
import "../resources/fonts/material-fonts.css";

/**
 * This is the main component that is bootstrapped and provides a router outlet for all other application pages to be shown.
 */
@Component({
  //moduleId: module.id,
  selector: "cms-launchpad",
  template: `<router-outlet></router-outlet>
    <nd-popup *ngIf="showSystemDialog" id="sytem-events-alert-popup" class="confirm-popup" title="{{'systemDialog.confirmationTitlePopup' | translate }}"
      (done)="onDialogConfirmation()" (closing)="showSystemDialog = false;" okText="{{'common.ok' | translate}}">
      <popup-body>
        {{dialogMessage}}
      </popup-body>
    </nd-popup>
    <div *ngIf="showProgressDialog"  class="cms-dialog-content-block">
      <div class="cms-dialog-content">
        <md-card>
          <md-card-content>
            <div class="cms-dialog-message-container">
              <md-progress-circle color="primary" mode="indeterminate"></md-progress-circle>
            </div>
            <div class="message">
              {{dialogMessage}}
            </div>
          </md-card-content>
        </md-card>
      </div>
    <div class="cms-dialog-overlay"></div>
  </div>`,
  styles: [require("./cms-launchpad.component.scss")]
})
export class CmsLaunchpadComponent implements OnInit, OnDestroy {

  /**
   * Properties
   */

  // hold last time of user action like click or mousemove
  private userLastActionTime: number;

  private calculateUserWrapperHash: any;

  // it saves the CMS events subscription and unsubscribe them on component destruction
  private applicationLevelEvent: EventEmitter<any>;

  private showProgressDialog: boolean;
  private showSystemDialog: boolean;
  private dialogMessage: string;
  private applicationEventType: string;

  /**
   * Public Methods
   */

  /**
   * The constructor is defining various services and initializing Internationalization for
   * the entire application.
   */
  constructor
    (private translate: TranslateService,
    private cmsServerApi: CmsApiService,
    private cmsSettingsService: CmsSettingsService,
    private storageManager: StorageManager,
    private element: ElementRef,
    private router: Router,
    private appConfig: AppConfig,
    private mdIconRegistry: MdIconRegistry,
    private sanitizer: DomSanitizer) {
    this.showSystemDialog = false;
    this.showProgressDialog = false;

    // add svg icons to icon registry
    mdIconRegistry
      .addSvgIcon("fit_height", sanitizer.bypassSecurityTrustResourceUrl("resources/icons/fit_height.svg"))
      .addSvgIcon("display_offline", sanitizer.bypassSecurityTrustResourceUrl("resources/icons/display_offline_black_36.svg"))
      .addSvgIcon("display_online", sanitizer.bypassSecurityTrustResourceUrl("resources/icons/display_online_black_36.svg"))
  }

  /**
   * This method is called on component initialization.
   */
  ngOnInit() {
    this.preventBrowserDefaults();

    //add all supported languages
    this.addAppSupportedLanguages();

    // set application language as browser language
    this.cmsSettingsService.setBrowserLanguage();

    // on browser refresh create session with the server again
    let user: IUserToken = this.getUserStorageData();
    if (user && user.loggedIn) {
      this.appConfig.log("CmsLaunchpadComponent: User is already logged in. Recreating session with server after refresh!!");
      this.cmsServerApi.reconnectSessionWithServer();

      // Read user settings from storage manager
      let settingsStorageData = this.storageManager.get(CMS_SESSION_STORAGE_ITEM.SETTINGS);
      if (settingsStorageData) {
        this.cmsSettingsService.userSettings = JSON.parse(settingsStorageData);
        if (!this.cmsSettingsService.userSettings) {
          this.appConfig.error("ERR_NO_USER_SETTINGS: No user settings found after refresh.");
        }
      }

      // apply user"s selected language
      this.cmsSettingsService.applyUserSelectedLanguage();

      // set UserLastActionTime after refresh 
      this.storageManager.set(CMS_SESSION_STORAGE_ITEM.USER_LASTACTION_TIME, Date.now());
    }

    // add event listener for auto logOff Time
    this.addLogOffTimeObservable();

    this.applicationLevelEvent = CmsEventEmitterService.get(CMS_EVENTS.Application)
      .subscribe((res: { eventName: string, eventType: string }) => {
        this.appConfig.log("CmsLaunchpadComponent: Application level event received. ",
          res.eventName);

        // handle system events when user is logged in
        let user: IUserToken = this.getUserStorageData();
        if (user && user.loggedIn) {
          this.applicationEventType = res.eventType;

          if (this.applicationEventType === "permission") {
            this.handlePermissionEvents(res.eventName);
          }
          else {
            this.handleSystemEvents(res.eventName);
          }
        }
        else {
          this.appConfig.log("CmsLaunchpadComponent: System events will not be handled as user is not logged in.");
        }
      });
  }

  private getUserStorageData(): any {
    let userStorageData = this.storageManager.get(CMS_SESSION_STORAGE_ITEM.USER);
    if (!userStorageData) {
      this.router.navigate(["/login"]);
      return null;
    }
    return JSON.parse(userStorageData);
  }

  /**
   * Cleanup just before Angular destroys the component. 
   * Unsubscribe observables and detach event handlers to avoid memory leaks.
   */
  public ngOnDestroy() {
    // Unsubscribe cms events for launchpad component
    if (this.applicationLevelEvent !== undefined) {
      this.applicationLevelEvent.unsubscribe();
    }
  }

  /**
   * This method takes user to login screen on system dialog confirmation.
   */
  public onDialogConfirmation() {
    this.showSystemDialog = false;

    if (this.applicationEventType === "system") {
      // perform logout
      this.appConfig.log("CmsLaunchpadComponent: Performing logoff for the user...");
      this.logoutUser();
    }
    else if (this.applicationEventType === "user") {
      // refresh application
      window.location.reload(true);
    }
  }

  /**
   * prevent default behaviours of browser at app level
   */
  private preventBrowserDefaults(): void {
    // disable zoom in browser with ctrl + mousewheel
    EventManager.addEvent("wheel", this.onMouseWheel.bind(this));

    // Block certain keys for zooming and browser refresh
    EventManager.addEvent("keydown", this.onKeyDown.bind(this));

    // Block native pinch zoom 
    document.addEventListener("touchstart", (e: TouchEvent) => {
      // check if its a 2 finger touch
      if (e.touches.length === 2) {
        e.preventDefault();
      }
    });
  }

  /**
   * This event handler will be invoked when user will press keys.
   * @method onMouseWheel
   * @param e - Native event object provided by the browser on mousewheel
   */
  private onKeyDown(event) {
    // disable zoom in browser with ctrl++ and ctrl--
    if (event.ctrlKey &&
      (event.which === 61 ||
        event.which === 173 ||
        event.which === 107 ||
        event.which === 109 ||
        event.which === 187 ||
        event.which === 189)) {
      event.preventDefault();
    }
    // 107 Num Key  +
    // 109 Num Key  -
    // 173 Min Key  hyphen/underscor Hey
    // 61 Plus key  +/= key

    // blocking browser refresh with F5 and CTRL+R
    if (event.which === 116 || (event.ctrlKey && event.which === 82)) {
      this.appConfig.log("Blocking keys for browser refresh.");
      event.preventDefault();
    }
  };

  /**
   * This event handler will be invoked when user will sroll with mousewheel.
   * @method onMouseWheel
   * @param e - Native event object provided by the browser on mousewheel
   */
  private onMouseWheel(e) {
    if (e.ctrlKey) {
      e.preventDefault()
    }
  };

  /**
   * This method sets application language as per user preferences.
   */
  private addAppSupportedLanguages(): void {
    let languageKeys = CmsLanguages.languagesKeys;
    this.translate.addLangs(languageKeys);
  }

  /**
   * This method listen user actions for auto log-off.
   */
  private addLogOffTimeObservable(): void {
    let rootElement: HTMLElement = this.element.nativeElement;
    rootElement.addEventListener("scroll", () => this.calculateUserLastActionTimes(), true);
    rootElement.addEventListener("click", () => this.calculateUserLastActionTimes(), true);
    rootElement.addEventListener("input", () => this.calculateUserLastActionTimes(), true);
  }

  /**
   * This method act as function throttling for calculate user actions
   */
  private calculateUserLastActionTimes() {
    if (this.calculateUserWrapperHash) {
      window.clearTimeout(this.calculateUserWrapperHash);
      this.calculateUserWrapperHash = 0;
    }
    this.calculateUserWrapperHash = window.setTimeout(() => {
      this.calculateUserLastActionTimesFn()
    }, 500);
  }

  /**
   * This method listen user actions and calculate time for auto log-off.
   */
  private calculateUserLastActionTimesFn() {
    let userSettings = this.cmsSettingsService.userSettings;
    let isUserLoggedIn = this.storageManager.get(CMS_SESSION_STORAGE_ITEM.USER);

    // if user settings is present and user is logged-in 
    if (userSettings && isUserLoggedIn) {
      let userAutoLogOffTime = userSettings.logOffTime;

      // if userAutoLogOffTime in user settings is not "never" and greater than 0
      if (userAutoLogOffTime > 0) {
        //update local property from sessionStorage
        this.userLastActionTime = this.storageManager.get(CMS_SESSION_STORAGE_ITEM.USER_LASTACTION_TIME)

        if (!this.userLastActionTime) {
          // set user last action time if it is not present in sessionStorage
          this.userLastActionTime = Date.now();
          this.storageManager.set(CMS_SESSION_STORAGE_ITEM.USER_LASTACTION_TIME, Date.now());
        } else if (this.userLastActionTime) {
          let userCurrentActionTime = Date.now();
          let timeDiff = userCurrentActionTime - this.userLastActionTime;
          let minDiff = timeDiff / 60 / 1000;
          if (minDiff > userAutoLogOffTime) {
            //logoff user
            this.appConfig.log("CmsLaunchpadComponent: Performing auto logoff for the user due to inactivity...");
            this.logoutUser();
          } else {
            //update user time in session
            this.userLastActionTime = Date.now();
            this.storageManager.set(CMS_SESSION_STORAGE_ITEM.USER_LASTACTION_TIME, Date.now());
          }
        }
      }
    }
  }


  /**
   * This method log-off the user.
   */
  private logoutUser(): void {
    this.cmsServerApi.logoutUser();
  }

  /**
   * This method handles various system events.
   */
  private handleSystemEvents(eventName: string) {
    let isProgressDialog = (eventName === "ServerDisconnected"
      || eventName === "RestoreStarted"
      || eventName === "DatabaseResetStarted");
    let isSystemDialog = (eventName === "ServerConnected"
      || eventName === "LicenseChanged"
      || eventName === "RestoreFinished"
      || eventName === "UserDeleted"
      || eventName === "UserModified");
    let messageKey = "systemDialog." + this.camelize(eventName);

    // This event is received when successful reconnection with server is established again after network connection within 2mins
    if (eventName === "EventReconnectionSuccess") {
      this.showProgressDialog = false;
    }
    else {
      // Show relevent dialog in case of system events
      this.showSystemEventDialog(isProgressDialog, isSystemDialog, messageKey);
    }
  }

  /**
   * This method handles various permission events.
   */
  private handlePermissionEvents(eventName: string) {
    let messageKey = "systemDialog." + this.camelize(eventName);
    this.showSystemEventDialog(false, true, messageKey);
  }

  /**
   * This method shows progress or system dialog based on system event.
   */
  private showSystemEventDialog(progress: boolean, system: boolean, messageKey: string) {
    this.showProgressDialog = progress;
    this.showSystemDialog = system;

    // dialog message using TranslateService
    this.translate.get(messageKey).subscribe((response: string) => {
      this.dialogMessage = response;
    });
  }

  /**
   * This method converts first letter of a string to lowercase
   */
  private camelize(name) {
    return name.charAt(0).toLowerCase() + name.slice(1);
  }

}