/**
 * Component serves as a shared component for displaying name of the selected display wall
 * across the application.
 */
import { OnInit, Component, OnDestroy } from "@angular/core";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { CMS_SESSION_STORAGE_ITEM } from "../../cms/models/cms-session-storage-item";
import { CmsEventEmitterService } from "../../cms/api/cms-event-emitter.service";
import { CMS_EVENTS } from "../../cms/api/cms-events.enum";
import { Subscription } from "rxjs";
import { Validation } from "../../core/util/Validation";

@Component({
    selector: "cms-display-name",
    template: `<span id="display-name">{{ displayName }}</span>`
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

    public ngOnInit() {
        this.setDisplayName();
        this.subscribeDisplayEvents();
    }

    public ngOnDestroy() {
        this.unsubscribeDisplayEvents();
    }

    /**
     * subscribeDisplayEvents: subscribes to the display name component.
     * @method subscribeDisplayEvents
     * @return {void}.
     */
    public subscribeDisplayEvents() {
        this.displayEventsSubscription = CmsEventEmitterService.get(CMS_EVENTS.DisplayList)
            .subscribe((response: { uri: string, body: any, verb: string }) => {
                let display = this.storageManager.get(CMS_SESSION_STORAGE_ITEM.DISPLAY);
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

     /**
     * unscubscribes the subscribed observables.
     * @method unsubscribeDisplayEvents
     * @return {void}.
     */
    private  unsubscribeDisplayEvents() {
        if (!Validation.IsNullOrUndefined(this.displayEventsSubscription)) {
            this.displayEventsSubscription.unsubscribe();
        }
    }

    /**
     * This method will set the selected display's name.
     * @method setDisplayName
     * @return {void}.
     */
    private setDisplayName() {
        let display = this.storageManager.get(CMS_SESSION_STORAGE_ITEM.DISPLAY);
        if (!Validation.IsNull(display)) {
            display = JSON.parse(display);
            if (display && display.name) {
                this.displayName = display.name;
            }
        }
    }
}