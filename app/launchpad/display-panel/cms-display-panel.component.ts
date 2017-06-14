/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/toPromise';

import { CmsResource } from './../../cms/models/cms-resource';
import { CMS_SESSION_STORAGE_ITEM } from '../../cms/models/cms-session-storage-item';
import { Source } from './../../cms/models/cms-source';
import { StorageManager } from '../../cms/api/cms-storagemanager.service';
import { CmsSettingsService } from './../../launchpad/settings/cms-settings.service';
import { IManageWallContent } from './../../cms/models/cms-user-profile-settings';
import { CmsEventEmitterService } from '../../cms/api/cms-event-emitter.service';
import { CMS_EVENTS } from '../../cms/api/cms-events.enum';
import { TranslateService } from '@ngx-translate/core';
import { CMSConstants } from './../../cms/models/cms-constants';
import { AppConfig } from '../../config';


/**
 * This is a panel component that defines the layout of a page which includes toolbar, mini-display component
 * and options sidenav.
 * @component loadDisplay
 */
@Component({
    //moduleId: module.id,
    selector: 'cms-display-panel',
    template: require('to-string!./cms-display-panel.component.html'),
    styles: [require('to-string!./cms-display-panel.component.scss')]
})

/**
 * This class will hold the logic of cms display panel where it will display
 * toolbar, mini-display and sidenav etc options
 * @class CmsDisplayPanelComponent
 * @constructor constructor This will inject the following dependency Htttp, Router, StorageManager etc.
 * @property {number} zoomLevel
 * @property {boolean} viewOptions
 * @property {CmsResource} display
 */

export class CmsDisplayPanelComponent implements OnInit, OnDestroy {

    //Holds current zoom level of mini-display
    public zoomLevel: number;

    // counter for fit height, to be changed whenever fit height is triggered from options panel
    public fitHeightCount: number;

    //Holds settings related to wall content
    settings: IManageWallContent;

    //@pending - var name To control visibility of Options sidebar
    private viewOptions: boolean;

    //Holds currently selected display from display list
    private display: CmsResource;

    // hold long press state
    private isLongPressed: boolean;

    // hold subscription for isLongPressed
    private longPressSubcription;

    // we are using selected display id as string as it can also provide string value as "nodisplay"
    private displayId: string;

    private displayName: string;

    private isDisplaySelected: boolean;

    // it saves the CMS events subscription and unsubscribe them on component destruction
    private mDisplayPanelCmsEvent: EventEmitter<any>;

    // hold save layout state
    private isSaveLayoutEnabled: boolean;

    /**
     * The constructor initializes various dependencies.
     */
    constructor(private http: Http, private router: Router, private route: ActivatedRoute, private storageManager: StorageManager, private cmsSettingsService: CmsSettingsService, private translate: TranslateService, private appConfig: AppConfig) {

        this.viewOptions = false;
        this.zoomLevel = 100;
        this.fitHeightCount = 0;
        this.settings = this.cmsSettingsService.mUserSettings ? this.cmsSettingsService.mUserSettings.manageWallContent : null;
        this.isSaveLayoutEnabled = true;
    }

    /**
     * This method is called on component initialization.
     */
    public ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.displayId = params['id'];
        });
        if (this.displayId !== CMSConstants.NoDisplay) {
            this.isDisplaySelected = true;
            this.loadDisplay();
        }
        else {
            this.isDisplaySelected = false;
            
            // display name using TranslateService
            this.translate.get('displayPanel.selectDisplay').subscribe((response: string) => {
                this.displayName = response;
            });

            this.mDisplayPanelCmsEvent = CmsEventEmitterService.get(CMS_EVENTS.DisplayPanel).subscribe((res: { eventType: string, body: any, displayId: number }) => {
                this.appConfig.log('CmsDisplayPanelComponent: New Display added! Routing to display list.');
                this.router.navigate(['/displays-panel']);
            });
        }

        // subscribe to observable and update local 'isLongPressed' property
        this.longPressSubcription = this.cmsSettingsService.longPressedSubject.subscribe(() => {
            this.isLongPressed = this.cmsSettingsService.isLongPressed;
        });
    }

    /**
     * Cleanup just before Angular destroys the component. 
     * Unsubscribe observables and detach event handlers to avoid memory leaks.
     */
    public ngOnDestroy() {
        // Unsubscribe cms events for display panel component
        if (this.mDisplayPanelCmsEvent !== undefined) {
            this.mDisplayPanelCmsEvent.unsubscribe();
        }

        this.longPressSubcription.unsubscribe();
    }

    /**
     * This method will load the selected display.
     * @method loadDisplay
     */
    public loadDisplay(): void {
        let display = this.storageManager.get(CMS_SESSION_STORAGE_ITEM.Display);

        // If selected display is not available, route to display list.
        if (display === null) {
            this.appConfig.log('Display not found! Routing to display list.');
            this.router.navigate(['/displays-panel'])
        }

        this.display = <CmsResource>JSON.parse(display);
        this.displayName = this.display.name;
    }



    /**
     * This increases the fit height count
     * @method {void} fitHeight
     */
    public fitHeight() {
        this.fitHeightCount++;
    }


    /**
     * This method revert back to display panel state when longpress is released and remose source icon is disappeared
     */
    private backToDisplayPanel() {
        this.cmsSettingsService.updateIsLongPress(false);
    }

    /**
     * This will be reponsible to update the display property 
     * once it will get notify from its children component in 
     * case of display title and content update 
     * @method {void} onDisplayUpdate
     */
    private onDisplayUpdate(display:any): void{
         this.displayName = display.name;
         this.appConfig.log(`CmsDisplayPanelComponent: onDisplayUpdate:: Display [id: ${display.id}] name updated to [Name: ${display.name}].`);
    }
}