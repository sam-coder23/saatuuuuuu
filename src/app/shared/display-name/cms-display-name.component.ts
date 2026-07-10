/**
 * Component serves as a shared component for displaying name of the selected display wall
 * across the application.
 */
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { CmsEventEmitterService } from "../../cms/api/cms-event-emitter.service";
import { CMS_EVENTS } from "../../cms/api/cms-events.enum";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { CmsSessionStorageItem } from "../../cms/models/cms-session-storage-item";
import { Validation } from "../../core/util/Validation";

@Component({
    selector: "cms-display-name",
    template: "<span id='display-name'>{{ displayName }}</span>",
    standalone: false
})
/**
 * This class contains the behaviour for display-name component used in all the launchpad
 * components to use the selected display namae across application.
 * @class CmsDisplayNameComponent
 * @property {Subscription} displayEventsSubscription
 * @property {string} displayName
 * @constructor injects all the nessecary dependencies required for the component intilalizes
 * display name to a blank screen at start.
 */
export class CmsDisplayNameComponent implements OnInit, OnDestroy {
    public displayEventsSubscription: Subscription;
    public displayName: string;
    constructor(private storageManager: StorageManager) {
        this.displayName = "";
    }

    public ngOnInit(): void {
        this.setDisplayName();
        this.subscribeDisplayEvents();
    }

    public ngOnDestroy(): void {
        this.unsubscribeDisplayEvents();
    }

    /**
     * subscribeDisplayEvents: subscribes to the display name component.
     * @method subscribeDisplayEvents
     * @return {void}.
     */
    public subscribeDisplayEvents(): void {
        this.displayEventsSubscription = CmsEventEmitterService.REGISTER(CMS_EVENTS.DisplayList)
            .subscribe((response: { uri: string, body: any, verb: string }) => {
                let display: any = this.storageManager.getItem(CmsSessionStorageItem.DISPLAY);
                if (Validation.IS_NULL_OR_UNDEFINED(response)
                    || response.verb !== "PUT"
                    || Validation.IS_NULL_OR_UNDEFINED(response.body)
                    || Validation.IS_NULL_OR_UNDEFINED(display)) {
                    return;
                }
                display = JSON.parse(display);
                if (display && response.body.id === display.id) {
                    this.displayName = response.body.name;
                }
            });
    }

    /**
     * unscubscribes the subscribed observables.
     * @method unsubscribeDisplayEvents
     * @return {void}.
     */
    private  unsubscribeDisplayEvents(): void {
        if (!Validation.IS_NULL_OR_UNDEFINED(this.displayEventsSubscription)) {
            this.displayEventsSubscription.unsubscribe();
        }
    }

    /**
     * This method will set the selected display's name.
     * @method setDisplayName
     * @return {void}.
     */
    private setDisplayName(): void {
        let display: any = this.storageManager.getItem(CmsSessionStorageItem.DISPLAY);
        if (!Validation.IS_NULL(display)) {
            display = JSON.parse(display);
            if (display && display.name) {
                this.displayName = display.name;
            }
        }
    }
}
