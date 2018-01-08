
/**
 * This service is used to implement virtual scroll in large lists to load content on scroll down.
 */
import { Injectable } from "@angular/core";
import { EventManager } from "../utils/event-manager.util";
import { CmsSettingsService } from "./../launchpad/settings/cms-settings.service";

@Injectable()
/**
 * This class contains the behaviour for the service, it contains method that adds or remove the
 * scroll listener to the HTMLElement
 * @property {boolean} loading
 * @property {number} count
 * @property {number} max
 * @property {HTMLElement} scrollTarget
 * @property {void} scrollCallback
 * @property {number} dataCount
 * @constructor sets the loading to false on initialization of service and sets count to
 * default page size for inifinite scroll.
 */
export class CmsVirtualScrollService {
    public loading: boolean;
    public count: number;
    public dataCount: number = 0;
    public max: number;
    private scrollTarget: HTMLElement;
    private scrollCallback: () => void;

    constructor(private cmsSettingsService: CmsSettingsService) {
        const defaultPageSize: number = 20;
        this.loading = false;
        this.count = cmsSettingsService.userSettings.pageSize || defaultPageSize;
    }

    /**
     * add scroll event listener on scrollTarget
     * @method addScrollListener
     * @param {HTMLElement} scrollTarget
     * @param {void} scrollCallback
     * @return {void}
     */
    public addScrollListener(scrollTarget: HTMLElement, scrollCallback: () => void): void {
        this.scrollTarget = scrollTarget;
        this.scrollCallback = scrollCallback;
        if (this.scrollTarget) {
            EventManager.ADD_EVENT_ON_ELEMENT(
                this.scrollTarget,
                "scroll",
                this.onScroll.bind(this)
            );
        }
    }

    /**
     * remove scroll event listener on mScrollTarget
     * @method removeScrollListener
     * @return {void}
     */
    public removeScrollListener(): void {
        if (this.scrollTarget) {
            EventManager.REMOVE_EVENT_ON_ELEMENT(
                this.scrollTarget,
                "scroll",
                this.onScroll.bind(this)
            );
        }
    }

    /**
     * Scroll event handler
     * @method onScroll
     * @return {void}
     */
    private onScroll(): void {
        const defaultScrollPercent: number = 0.8;
        let scrollPercent: number;
        if (this.loading || !this.scrollTarget) {
            return;
        }
        scrollPercent = (this.scrollTarget.scrollTop + this.scrollTarget.offsetHeight)
            / this.scrollTarget.scrollHeight;
        if (scrollPercent >= defaultScrollPercent && this.dataCount > 0) {
            this.loading = true;
            this.scrollCallback();
        }
    }
}
