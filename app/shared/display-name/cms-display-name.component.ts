import { OnInit, Component, OnDestroy } from "@angular/core";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { CMS_SESSION_STORAGE_ITEM } from "../../cms/models/cms-session-storage-item";
import { Router } from "@angular/router";
import { CmsEventEmitterService } from "../../cms/api/cms-event-emitter.service";
import { CMS_EVENTS } from "../../cms/api/cms-events.enum";
import { Subscription } from "rxjs";
import { Validation } from "../../core/util/Validation";

@Component({
    selector: "cms-display-name",
    template: `<span id="display-name">{{ displayName }}</span>`
})

export class CmsDisplayNameComponent implements OnInit, OnDestroy {
    public displayEventsSubscription: Subscription;
    public displayName: string;

    constructor(
        private storageManager: StorageManager) {
        this.displayName = "";
    }

    ngOnInit() {
        this.setDisplayName();

        this.subscribeDisplayEvents();
    }

    ngOnDestroy() {
        this.unsubscribeDisplayEvents();
    }

    /**
     * This method will set the selected display's name.
     * @method setDisplayName
     */
    public setDisplayName() {
        let display = this.storageManager.get(CMS_SESSION_STORAGE_ITEM.Display);

        if (!Validation.IsNull(display)) {
            display = JSON.parse(display);
            if (display && display.name) {
                this.displayName = display.name;
            }
        }
    }

    /**
     * subscribeDisplayEvents
     */
    public subscribeDisplayEvents() {
        this.displayEventsSubscription = CmsEventEmitterService.get(CMS_EVENTS.DisplayList)
            .subscribe((response: { uri: string, body: any, verb: string }) => {
                let display = this.storageManager.get(CMS_SESSION_STORAGE_ITEM.Display);

                /**
                 *  return 
                 *      if no response
                 *      handle only PUT for same display id
                 *      no display found
                 */
                if (Validation.IsNullOrUndefined(response)
                    || response.verb !== "PUT"
                    || Validation.IsNullOrUndefined(response.body)
                    || Validation.IsNullOrUndefined(display)) {
                    return;
                }

                display = JSON.parse(display);

                if (display && response.body.id === display.id) {
                    this.displayName = response.body.name;
                }
            });
    }

    public unsubscribeDisplayEvents() {
        if (!Validation.IsNullOrUndefined(this.displayEventsSubscription)) {
            this.displayEventsSubscription.unsubscribe();
        }
    }
}