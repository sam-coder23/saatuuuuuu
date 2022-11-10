/**
 * This is the main component that is bootstrapped and provides a router outlet for all other application pages to be shown.
 * @class CmsLaunchpadComponent
 * @property {number} userLastActionTime
 * @property {any} calculateUserWrapperHash
 * @property {EventEmitter<any>} applicationLevelEvent
 * @property {boolean} showProgressDialog
 * @property {boolean} showSystemDialog
 * @property {string} dialogMessage
 * @property {string} applicationEventType
 */
import '../../app/resources/fonts/material-fonts.css';
import '../../app/resources/fonts/cmslaunchpad-fonts.css';
import '../../app/_variables.global.scss';
import '../../app/themes.global.scss';
import '../../app/global.global.scss';
import '../../app/override.global.scss';

import { Component, ElementRef, EventEmitter, OnDestroy, OnInit } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from 'rxjs';

import { CmsApiService } from "../cms/api/cms-api.service";
import { CmsEventEmitterService } from "../cms/api/cms-event-emitter.service";
import { CMS_EVENTS } from "../cms/api/cms-events.enum";
import { StorageManager } from "../cms/api/cms-storagemanager.service";
import { CmsSessionStorageItem } from "../cms/models/cms-session-storage-item";
import { IUserProfileSettings } from "../cms/models/cms-user-profile-settings";
import { IUserToken } from "../cms/models/cms-user-token";
import { AppConfig } from "../config";
import { Validation } from "../core/util/Validation";
import { CmsLanguages } from "../i18n/cms-languages";
import { EventManager } from "../utils/event-manager.util";
import { CmsSettingsService } from "./settings/cms-settings.service";

@Component({
  selector: 'cms-launchpad',
  templateUrl: './cms-launchpad.component.html'
})

export class CmsLaunchpadComponent implements OnInit, OnDestroy {
  // hold last time of user action like click or mousemove
  public userLastActionTime: number = 0;
  public calculateUserWrapperHash: any;
  // it saves the CMS events subscription and unsubscribe them on component destruction
  public applicationLevelEvent: Subscription;
  public showProgressDialog: boolean;
  public showSystemDialog: boolean;
  public dialogMessage: string = '';
  public applicationEventType: string = '';

  constructor(
    private translate: TranslateService,
    private cmsServerApi: CmsApiService,
    private cmsSettingsService: CmsSettingsService,
    private storageManager: StorageManager,
    private element: ElementRef,
    private router: Router,
    private appConfig: AppConfig,
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    this.showSystemDialog = false;
    this.showProgressDialog = false;

    // add svg icons to icon registry
    this.matIconRegistry
      .addSvgIcon("fit_height", sanitizer.bypassSecurityTrustResourceUrl("resources/icons/fit_height.svg"))
      .addSvgIcon("display_offline", sanitizer.bypassSecurityTrustResourceUrl("resources/icons/display_offline_black_36.svg"))
      .addSvgIcon("display_online", sanitizer.bypassSecurityTrustResourceUrl("resources/icons/display_online_black_36.svg"));
  }

  public ngOnInit(): void {
    this.preventBrowserDefaults();

    //add all supported languages
    this.addAppSupportedLanguages();

    // set application language as browser language
    this.cmsSettingsService.setBrowserLanguage();

    // on browser refresh create session with the server again
    const userData: IUserToken = this.getUserStorageData();
    if (userData && userData.loggedIn) {
      this.appConfig.log("CmsLaunchpadComponent: User is already logged in. Recreating session with server after refresh!!");
      this.cmsServerApi.reconnectSessionWithServer();

      // Read user settings from storage manager
      const settingsStorageData: any = this.storageManager.getItem(CmsSessionStorageItem.SETTINGS);
      if (settingsStorageData) {
        this.cmsSettingsService.userSettings = JSON.parse(settingsStorageData);
      } else {
        this.appConfig.error("ERR_NO_USER_SETTINGS: No user settings found after refresh.");
      }

      // apply user"s selected language
      this.cmsSettingsService.applyUserSelectedLanguage();

      // set UserLastActionTime after refresh
      this.storageManager.setItem(CmsSessionStorageItem.USER_LASTACTION_TIME, Date.now());
    }

    // add event listener for auto logOff Time
    this.addLogOffTimeObservable();

    this.applicationLevelEvent = CmsEventEmitterService.REGISTER(CMS_EVENTS.Application)
      .subscribe((res: { eventName: string, eventType: string }) => {
        this.appConfig.log("CmsLaunchpadComponent: Application level event received. ",
          res.eventName);

        // handle system events when user is logged in
        const user: IUserToken = this.getUserStorageData();
        if (user && user.loggedIn) {
          this.applicationEventType = res.eventType;

          if (this.applicationEventType === "permission") {
            this.handlePermissionEvents(res.eventName);
          } else {
            this.handleSystemEvents(res.eventName);
          }
        } else {
          this.appConfig.log("CmsLaunchpadComponent: System events will not be handled as user is not logged in.");
        }
      });
  }

  public ngOnDestroy(): void {
    // Unsubscribe cms events for launchpad component
    if (!Validation.IS_NULL_OR_UNDEFINED(this.applicationLevelEvent)) {
      this.applicationLevelEvent.unsubscribe();
    }
  }

  /**
   * This method get user information from storeManager
   * @method getUserStorageData
   * @return any
   */
  private getUserStorageData(): any {
    const userStorageData: any = this.storageManager.getItem(CmsSessionStorageItem.USER);
    if (!userStorageData) {
      this.router.navigate(["/login"]);

      return undefined;
    }

    return JSON.parse(userStorageData);
  }

  /**
   * This method takes user to login screen on system dialog confirmation.
   * @method onDialogConfirmation
   * @return void
   */
  public onDialogConfirmation(): void {
    this.showSystemDialog = false;

    if (this.applicationEventType === "system") {
      // perform logout
      this.appConfig.log("CmsLaunchpadComponent: Performing logoff for the user...");
      this.cmsServerApi.logout().subscribe();
    } else if (this.applicationEventType === "user") {
      // refresh application
      window.location.reload();
    }
  }

  /**
   * prevent default behaviours of browser at app level
   * @method preventBrowserDefaults
   * @return void
   */
  private preventBrowserDefaults(): void {
    const touchLength: number = 2;
    // disable zoom in browser with ctrl + mousewheel
    EventManager.ADD_EVENT("wheel", this.onMouseWheel.bind(this));

    // Block certain keys for zooming and browser refresh
    EventManager.ADD_EVENT("keydown", this.onKeyDown.bind(this));

    // Block native pinch zoom
    document.addEventListener("touchstart", (e: TouchEvent) => {
      // check if its a 2 finger touch
      if (e.touches.length === touchLength) {
        e.preventDefault();
      }
    });
  }

  /**
   * This event handler will be invoked when user will press keys.
   * @method onMouseWheel
   * @param e - Native event object provided by the browser on mousewheel
   * @returns {void}
   */
  private onKeyDown(event): void {
    // 107 Num Key  +
    // 109 Num Key  -
    // 173 Min Key  hyphen/underscor Hey
    // 61 Plus key  +/= key
    const eventCtrlKeys: any = {
      numAddKey: 107,
      numMinusKey: 109,
      minKey: 173,
      plusKey: 61,
      defaultKey: 187,
      default2Key: 189,
      f5key: 116,
      ctrlrKey: 82
    };
    // disable zoom in browser with ctrl++ and ctrl--
    if (event.ctrlKey &&
      (event.which === eventCtrlKeys.plusKey ||
        event.which === eventCtrlKeys.minKey ||
        event.which === eventCtrlKeys.numAddKey ||
        event.which === eventCtrlKeys.numMinusKey ||
        event.which === eventCtrlKeys.defaultKey ||
        event.which === eventCtrlKeys.default2Key
      )) {
      event.preventDefault();
    }
    // blocking browser refresh with F5 and CTRL+R
    if (event.which === eventCtrlKeys.f5key || (event.ctrlKey && event.which === eventCtrlKeys.ctrlrKey)) {
      this.appConfig.log("Blocking keys for browser refresh.");
      event.preventDefault();
    }
  }

  /**
   * This event handler will be invoked when user will sroll with mousewheel.
   * @method onMouseWheel
   * @param e - Native event object provided by the browser on mousewheel
   * @returns {void}
   */
  private onMouseWheel(e): void {
    if (e.ctrlKey) {
      console.log('scrolling with mouse wheel invoked');
      e.preventDefault();
    }
  }

  /**
   * This method sets application language as per user preferences.
   * @method addAppSupportedLanguages
   * @return void
   */
  private addAppSupportedLanguages(): void {
    const languageKeys: string[] = (new CmsLanguages()).languageKeys;
    this.translate.addLangs(languageKeys);
  }

  /**
   * This method listen user actions for auto log-off.
   * @method addLogOffTimeObservable
   * @return void
   */
  private addLogOffTimeObservable(): void {
    const rootElement: HTMLElement = this.element.nativeElement;
    rootElement.addEventListener("scroll", () => this.calculateUserLastActionTimes(), true);
    rootElement.addEventListener("click", () => this.calculateUserLastActionTimes(), true);
    rootElement.addEventListener("input", () => this.calculateUserLastActionTimes(), true);
  }

  /**
   * This method act as function throttling for calculate user actions
   * @method calculateUserLastActionTimes
   * @return void
   */
  private calculateUserLastActionTimes(): void {
    const actionCount: number = 500;
    if (this.calculateUserWrapperHash) {
      window.clearTimeout(this.calculateUserWrapperHash);
      this.calculateUserWrapperHash = 0;
    }
    this.calculateUserWrapperHash = window.setTimeout(() => {
      this.calculateUserLastActionTimesFn();
    }, actionCount);
  }

  /**
   * This method listen user actions and calculate time for auto log-off.
   * @method calculateUserLastActionTimesFn
   * @return void
   */
  private calculateUserLastActionTimesFn(): void {
    const userSettings: IUserProfileSettings = this.cmsSettingsService.userSettings;
    const isUserLoggedIn: any = this.storageManager.getItem(CmsSessionStorageItem.USER);
    const timeInterval: number = 60;
    const basisValue: number = 1000;

    // if user settings is present and user is logged-in
    if (userSettings && isUserLoggedIn) {
      const userAutoLogOffTime: number = userSettings.logOffTime;

      // if userAutoLogOffTime in user settings is not "never" and greater than 0
      if (userAutoLogOffTime > 0) {
        //update local property from sessionStorage
        this.userLastActionTime = this.storageManager.getItem(CmsSessionStorageItem.USER_LASTACTION_TIME);
        if (!this.userLastActionTime) {
          // set user last action time if it is not present in sessionStorage
          this.userLastActionTime = Date.now();
          this.storageManager.setItem(CmsSessionStorageItem.USER_LASTACTION_TIME, Date.now());
        } else {
          const userCurrentActionTime: number = Date.now();
          const timeDiff: number = userCurrentActionTime - this.userLastActionTime;
          const minDiff: number = timeDiff / timeInterval / basisValue;
          if (minDiff > userAutoLogOffTime) {
            //logoff user
            this.appConfig.log("CmsLaunchpadComponent: Performing auto logoff for the user due to inactivity...");
            this.cmsServerApi.logout().subscribe();
          } else {
            //update user time in session
            this.userLastActionTime = Date.now();
            this.storageManager.setItem(CmsSessionStorageItem.USER_LASTACTION_TIME, Date.now());
          }
        }
      }
    }
  }

  /**
   * This method handles various system events.
   * @method handleSystemEvents
   * @param {string} eventName
   * @return {void}
   */
  private handleSystemEvents(eventName: string): void {
    const isProgressDialog: boolean = (eventName === "ServerDisconnected"
      || eventName === "RestoreStarted"
      || eventName === "DatabaseResetStarted");
    const isSystemDialog: boolean = (eventName === "ServerConnected"
      || eventName === "LicenseChanged"
      || eventName === "RestoreFinished"
      || eventName === "UserDeleted"
      || eventName === "UserModified");
    const messageKey: string = `systemDialog.${this.camelize(eventName)}`;

    // This event is received when successful reconnection with server is established again after network connection within 2mins
    if (eventName === "EventReconnectionSuccess") {
      this.showProgressDialog = false;
    } else {
      // Show relevent dialog in case of system events
      this.showSystemEventDialog(isProgressDialog, isSystemDialog, messageKey);
    }
  }

  /**
   * This method handles various permission events.
   * @method
   * @param {string} eventName
   * @return void
   */
  private handlePermissionEvents(eventName: string): void {
    const messageKey: string = `systemDialog.${this.camelize(eventName)}`;
    this.showSystemEventDialog(false, true, messageKey);
  }

  /**
   * This method shows progress or system dialog based on system event.
   * @method showSystemEventDialog
   * @param {boolean} progress
   * @param {boolean} system
   * @param {string} messageKey
   * @return void
   */
  private showSystemEventDialog(progress: boolean, system: boolean, messageKey: string): void {
    this.showProgressDialog = progress;
    this.showSystemDialog = system;

    // dialog message using TranslateService
    this.translate.get(messageKey).subscribe((response: string) => {
      this.dialogMessage = response;
    });
  }

  /**
   * This method converts first letter of a string to lowercase
   * @method camelize
   * @param {string} name
   * @return string
   */
  private camelize(name: string): string {
    return name.charAt(0).toLowerCase() + name.slice(1);
  }

}
