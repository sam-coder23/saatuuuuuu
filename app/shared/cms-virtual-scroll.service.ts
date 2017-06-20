/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

/**
 * @pending
 * Comment TARJU-
 * Services are meant to be designed in a way which will make them flexible.
 * This service need few fixes inorder to make it flexible and easy to use.
 * In general we need to use callback model to overcome the problem.
 */

import { Injectable } from "@angular/core";
import { EventManager } from "../utils/event-manager.util";
import { CmsSettingsService } from "./../launchpad/settings/cms-settings.service";

@Injectable()

/**
 * This service is used to implement virtual scroll in large lists to load content on scroll down.
 */
export class CmsVirtualScrollService {

    public loading: boolean;
    public count: number;
    public max: number;
    private scrollTarget: HTMLElement;
    private scrollCallback: Function;
    public dataCount = 0; 

    constructor(private cmsSettingsService: CmsSettingsService) { 
        this.loading = false;
        this.count = cmsSettingsService.mUserSettings.defaultPageSize || 20;
    }

    // add scroll event listener on scrollTarget
    public addScrollListener(scrollTarget: HTMLElement, scrollCallback: Function) {
        this.scrollTarget = scrollTarget;
        this.scrollCallback = scrollCallback;

        if (this.scrollTarget) {
            EventManager.addEventOnElement(this.scrollTarget, "scroll", this.onScroll.bind(this));
        }
    }

    // remove scroll event listener on mScrollTarget
    public removeScrollListener() {
        if (this.scrollTarget) {
            EventManager.removeEventOnElement(this.scrollTarget, "scroll", this.onScroll.bind(this));
        }
    }

    /**
     * Scroll event handler
     */
    private onScroll() {
        let scrollPercent;

        if (this.loading) {
            return;
        }

        //@pending - understand condition and possible values and merge with above
        if (!this.scrollTarget) {
            return;
        }

        scrollPercent = (this.scrollTarget.scrollTop + this.scrollTarget.offsetHeight) / this.scrollTarget.scrollHeight;
    
        if (scrollPercent >= 0.8 && this.dataCount > 0) {
            this.loading = true;
            this.scrollCallback();
        }
    }
}
