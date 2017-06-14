/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Source } from './../../cms/models/cms-source';
import { CmsClipboardService } from './cms-clipboard.service';
import { Subscription } from 'rxjs/Rx';
import { CmsMiniDisplayService } from './../mini-display/cms-mini-display.service';

import { CmsSettingsService } from '../../launchpad/settings/cms-settings.service';

import { AppConfig } from '../../config';
import { RegExManager } from '../../core/util/RegEx';
import { Url } from '../../core/util/Url';
import { Validation } from '../../core/util/Validation';


/**
 * Acts as a clipboard for a source.
 * 
 * 
 * Complete documentation can be found at
 * https://itrack.barco.com/browse/TSM0041-12014
 */

@Component({
    //moduleId: module.id,
    selector: 'cms-clipboard',
    template: require('to-string!./cms-clipboard.component.html'),
    styles: [require('to-string!./cms-clipboard.component.scss')]
})
export class CmsClipboardComponent implements OnInit, OnDestroy {
    /**
     * Properties
     */

    // clipboard source
    source: Source;

    //holds clipboard snapshot path
    clipboardSnapshot: string;

    // holds display status of clipboard
    clipboardStatus: string

    // reposition active flag
    private reposition: boolean = false;

    // holds initial value for mouse down or touch start for reposition
    private mouseOldX: number = 0;

    // subscrition for clipboard source update observable
    private clipboardSubscription: Subscription;

    // window resize subscription
    private windowResizeSubscription: Subscription;

    /**
     * Methods
     */
    constructor(
        private cmsClipboardService: CmsClipboardService,
        private router: Router,
        private cmsMiniDisplayService: CmsMiniDisplayService,
        private cmsSettingsService: CmsSettingsService,
        private appConfig: AppConfig
    ) { }

    ngOnInit() {
        if (!this.cmsClipboardService.isClipboardEnabled()) {
            this.cmsClipboardService.clear();
            return;
        }

        this.cmsClipboardService.tile = null;
        this.clipboardStatus = this.cmsClipboardService.clipboardDisplayStatus();
        this.loadClipboard();
        this.clipboardSubscription = this.cmsClipboardService.clipboardUpdated.subscribe(() => this.loadClipboard());
        this.subscribeWindowResize();
    }


    ngOnDestroy() {
        if (this.clipboardSubscription) {
            this.clipboardSubscription.unsubscribe();
        }
        this.unsubscribeWindowResize();
    }

    /**
     * Removes source in the ClipboardComponent 
     */
    clearSource(): void {
        this.cmsClipboardService.clear();
    }

    /**
     * Load clipboard source from clipboard service
     */
    loadClipboard(): void {
        this.source = this.cmsClipboardService.Clipboard;

        if (this.source) {
            let snapshotPath = this.source.snapshotpath;

            if (Url.HasHostName() && !Validation.IsNullOrUndefined(snapshotPath) && Url.HasIP(snapshotPath)) {
                this.clipboardSnapshot = RegExManager.IPToHost(snapshotPath, this.appConfig.Host);
            }
            else {
                this.clipboardSnapshot = snapshotPath;
            }
        }
    }

    /**
     * return display type of clipboard based on user config and availability of source
     */
    displayClipboard(displayType: string[]): boolean {
        if (this.cmsClipboardService.CanShareUnshare()
            && this.cmsClipboardService.isClipboardEnabled()
            && this.cmsClipboardService.Clipboard
            && displayType && displayType instanceof Array) {
            this.clipboardStatus = this.cmsClipboardService.clipboardDisplayStatus();
            return displayType.indexOf(this.clipboardStatus) !== -1;
        }

        return false;
    }

    /**
     * handler method for mouse move for clipboard
     */
    onMouseMove(e: MouseEvent | TouchEvent) {
        let element, pageX, deltaPosition;

        if (!this.reposition) return;

        element = <HTMLElement>e.currentTarget;
        pageX = this.getPageX(e);
        deltaPosition = this.mouseOldX - pageX;

        this.repositionClipboard(element, deltaPosition);

        this.mouseOldX = pageX;
    }

    /**
     * handler method for mouse up for clipboard
     */
    onMouseUp() {
        this.reposition = false;
    }

    /**
     * handler method for mouse leave for clipboard
     */
    onMouseLeave() {
        this.reposition = false;
    }

    /**
     * handler method for mouse down for clipboard
     */
    onMouseDown(e: MouseEvent | TouchEvent) {
        let event: Event;
        let nodes;

        //Removes source in the ClipboardComponent 
        if (this.closest(e.target, 'clipboard-cancel')) {
            this.cmsClipboardService.clear();
            return false;
        }

        e.preventDefault();
        this.reposition = true;
        // store current location of mouse or touch interface
        this.mouseOldX = this.getPageX(e);

        // triger event for observing autologoff time
        event = new Event('onClipboardDrag');
        nodes = document.getElementsByTagName("cms-launchpad");
        if (nodes.length) {
            nodes[0].dispatchEvent(event);
        }
    }
    /**
     * This method will be check the closest element for specific element by id
     * @method closest
     */
    closest(element, id): boolean {
        let parentNode = element.parentNode,
            status = false;

        while (parentNode) {
            if (parentNode.id === id) {
                status = true;
                break;
            }
            else {
                parentNode = parentNode.parentNode;
            }
        }

        return status;
    }


    /**
     * return pageX for touch or non-touch device
     */
    private getPageX(e: MouseEvent | TouchEvent): number {
        if (e instanceof MouseEvent) {
            return e.pageX;
        } else if (e instanceof TouchEvent) {
            // for single point of touch interface
            if (e.touches && e.touches.length === 1) {
                return e.touches[0].pageX;
            }
        };
    }

    /**
    *This method will be navigate to source panel route
    *@method navigateToSourcesPanel
    */
    private navigateToSourcesPanel() {
        this.router.navigate(['displays', this.cmsMiniDisplayService.display.id, 'sources-panel']);
    }


    /**
    * Subscribe for window resize events
    */
    private subscribeWindowResize() {
        this.windowResizeSubscription = this.cmsMiniDisplayService.windowResizeEndEvent
            .subscribe(() => {
                this.limitClipboardPosition();
            });
    }


    /**
     * Unsubscribe for window resize events
     */
    private unsubscribeWindowResize() {
        if (this.windowResizeSubscription)
            this.windowResizeSubscription.unsubscribe();
    }


    /**
     * Reposition clipboard within the viable limits after window is resized
     */
    private limitClipboardPosition() {
        let clipboard = document.getElementById("clipboard-preview");
        if (!clipboard) return;

        this.repositionClipboard(clipboard, 0);
    }


    /**
     * Reposition clipboard by delta position
     */
    private repositionClipboard(clipboard: HTMLElement, deltaPosition: number) {
        let rtlLanguage = false,
            position = 0,
            userSettings = this.cmsSettingsService.mUserSettings;

        // use cms settings serivce to get to know whether it is RTL language.
        if (userSettings) {
            rtlLanguage = this.cmsSettingsService.isRTLLanguage(userSettings.language);
        }

        if (!rtlLanguage) {
            // Non-RTL
            if (clipboard.style.right === "") {
                position = 50;
            } else {
                position = parseInt(clipboard.style.right);
            }

            position += deltaPosition;
            //check bounds for clipboard
            if (position <= 0) {
                clipboard.style.right = `0px`;
            } else if (position < (window.innerWidth - clipboard.clientWidth - 10)) {
                clipboard.style.right = `${position}px`;
            } else {
                clipboard.style.right = `${window.innerWidth - clipboard.clientWidth - 10}px`;
            }
        }
        else {
            // RTL
            if (clipboard.style.left === "") {
                position = 50;
            } else {
                position = parseInt(clipboard.style.left);
            }

            position -= deltaPosition;
            //check bounds for clipboard
            if (position <= 0) {
                clipboard.style.left = `0px`;
            } else if (position < (window.innerWidth - clipboard.clientWidth - 10)) {
                clipboard.style.left = `${position}px`;
            } else {
                clipboard.style.left = `${window.innerWidth - clipboard.clientWidth - 10}px`;
            }
        }
    }
}