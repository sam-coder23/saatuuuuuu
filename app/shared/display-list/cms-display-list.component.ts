/**
 * Display list component fetches the list of available displays from CMS Server API and
 * loads the list in UI in the form of cards (representing a single display with available information 
 * about the display).
 */
import { Subscription } from "rxjs/Rx";
import { Component, OnInit, OnDestroy, EventEmitter, Input, Output, OnChanges, SimpleChanges } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { CmsApiService } from "../../cms/api/cms-api.service";
import { CmsEventEmitterService } from "./../../cms/api/cms-event-emitter.service";
import { CMS_EVENTS } from "../../cms/api/cms-events.enum";
import { CMS_SESSION_STORAGE_ITEM } from "../../cms/models/cms-session-storage-item";
import { ICmsEvent } from "../../cms/models/cms-event";
import { Display } from "../../cms/models/cms-display";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { CmsFavoriteService } from "../cms-favorite.service";
import { CmsSettingsService } from "../../launchpad/settings/cms-settings.service";
import { TranslateService } from "@ngx-translate/core";
import { CMSConstants } from "../../cms/models/cms-constants";

@Component({
    selector: "cms-display-list",
    template: require("./cms-display-list.component.html"),
    styles: [require("./cms-display-list.component.scss")]
})
/**
 * This class contains the behaviour for display list component, contains methods that comprise of
 * functionality for making API request on selecting the display Wall.
 * @class CmsDisplayListComponent
 * @property {boolean} favoriteFilter filter for favorite marked displays 
 * @property {string} searchFilter search string to filter out textbased search
 * @property {EventEmitter} changeEmitter emits each change to the displays panel.
 * @property {Display[]} displays all the displays to be listed
 * @property {Subscription} eventSubscription
 * @property {string} action
 * @property {boolean} showConfirmationPopup flag to open or close nd-popup
 * @property {string} dialogMessage
 */
export class CmsDisplayListComponent implements OnChanges, OnDestroy {
    @Input() favoriteFilter: boolean;
    @Input() searchFilter: string;
    @Output("change") changeEmitter = new EventEmitter();
    private displays: Display[];
    private eventSubscription: Subscription;
    private action: string;
    private showConfirmationPopup: boolean = false;
    private dialogMessage: string;

    constructor(
        private router: Router,
        private cmsServerApi: CmsApiService,
        private storageManager: StorageManager,
        private cmsSettingsService: CmsSettingsService,
        private route: ActivatedRoute,
        private favoriteService: CmsFavoriteService,
        private translate: TranslateService
    ) {
    }

    public ngOnChanges(cahnges: SimpleChanges) {
        this.displays = [];
        this.getDisplays();
    }

    public ngOnDestroy() {
        if (this.eventSubscription) {
            this.eventSubscription.unsubscribe();
        }
    }

    private connectWall(display: Display) {
        if (display.disabled) {
            return;
        }
        // fetch the param and select the display for wall auto-connection
        this.route.params.forEach((params: Params) => {
            let actionParam = params["action"];
            // Check for change in settings for specific selected wall.
            if (actionParam === CMSConstants.SELECT_DISPLAY) {
                this.cmsSettingsService.updateWallConnectionSpecificDisplay(display);
            }
            else {
                //update recentDisplayId on user profile data 
                this.cmsSettingsService.updateWallConnectionRecentDisplay(display);
                this.storageManager.set(CMS_SESSION_STORAGE_ITEM.DISPLAY, JSON.stringify(display));
                this.cmsSettingsService.selectedSources.length = 0;
                this.router.navigate([`/displays/${display.id}/sources-panel`]);
            }
        });
    }

    /**
     * On selecting favorite button on card, the respective display will be
     * marked as favorite\unfavorite.
     * @method toggleDisplayFavorite
     * @param {Display} display specifies the toggled sources to be favorited.
     * @returns {void}.
     */
    private toggleDisplayFavorite(display: Display) {
        if (display.disabled) {
            return;
        }
        // if display is favorite, mark it as unfavorite
        if (display.favorite) {
            this.favoriteService.markObjectAsUnfavorite(
                display.id,
                display.type,
                this.displays,
                this.favoriteFilter
            );
        }
        // if display is unfavorite, mark it as favorite
        else {
            this.favoriteService.markObjectAsFavorite(display.id, display.type, this.displays);
        }
    }

    /**
     * On displays unavailable dialog confirmation, route user to display panel.
     * @method onConfirmation
     * @returns {void}
     */
    private onConfirmation() {
        this.route.params.forEach((params: Params) => {
            let actionParam = params["action"];
            if (actionParam === CMSConstants.SELECT_DISPLAY) {
                this.router.navigate(["/settings"]);
            }
        });
        this.showConfirmationPopup = false;
    }

    /**
     * This method gets all displays from CMS Server API.
     * @method getDisplays
     * @returns {void}
     */
    private getDisplays() {
        return this.cmsServerApi.getDisplayList(1, 0, this.searchFilter, this.favoriteFilter)
            .subscribe(
            (displays: Display[]) => {
                this.displays.push(...displays);
                // subscribe for display list change events
                if (!this.eventSubscription) {
                    this.eventSubscription = CmsEventEmitterService.get(CMS_EVENTS.DisplayList)
                        .subscribe((event: ICmsEvent) => this.handleDisplayListEvents(event));
                }
                // show dialog if no displays are available
                if (this.displays.length === 0 && this.searchFilter === "" && !this.favoriteFilter) {
                    this.showDialogMessage();
                }
            },
            error => {
                this.showDialogMessage();
            });
    }

    /**
     * This methods show dialog for confirmation
     * @method showDialogMessage
     * @returns {void}
     */
    private showDialogMessage() {
        //show confimation dialog
        this.showConfirmationPopup = true;
        // dialog message using TranslateService
        this.translate.get("displayList.unavailableConfirmation").subscribe(
            (response: string) => {
                this.dialogMessage = response;
            });
    }

    /**
     * Event listener to handle display list related events
     * @method handleDisplayListEvents
     * @param {ICmsEvent} event subscription event of type Display.
     * @returns {void}
     */
    private handleDisplayListEvents(event: ICmsEvent) {
        //show confimation dialog
        this.showConfirmationPopup = false;
        if (event.verb.toLowerCase() === "deleted") {
            let id = (<{ id: number }>event.body).id;
            let display = this.displays.find(display => display.id === id);
            if (display) {
                display.disabled = true;
            }
            display = JSON.parse(this.storageManager.get(CMS_SESSION_STORAGE_ITEM.DISPLAY));
            if (display && display.id === id) {
                this.storageManager.remove(CMS_SESSION_STORAGE_ITEM.DISPLAY);
            }
        }
        this.changeEmitter.emit();
    }
}