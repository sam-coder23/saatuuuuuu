/**
 * Display list component fetches the list of available displays from CMS Server API and
 * loads the list in UI in the form of cards (representing a single display with available information
 * about the display).
 */
import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";

import { CmsApiService } from "../../cms/api/cms-api.service";
import { CMS_EVENTS } from "../../cms/api/cms-events.enum";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { CMSConstants } from "../../cms/models/cms-constants";
import { Display } from "../../cms/models/cms-display";
import { ICmsEvent } from "../../cms/models/cms-event";
import { CmsSessionStorageItem } from "../../cms/models/cms-session-storage-item";
import { CmsSettingsService } from "../../launchpad/settings/cms-settings.service";
import { CmsFavoriteService } from "../cms-favorite.service";
import { CmsEventEmitterService } from "./../../cms/api/cms-event-emitter.service";

@Component({
    selector: 'cms-display-list',
    templateUrl: './cms-display-list.component.html',
    styleUrls: ['./cms-display-list.component.scss']
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
    @Output("change") public changeEmitter: EventEmitter<{}> = new EventEmitter();
    @Input() public favoriteFilter: boolean;
    @Input() public searchFilter: string;

    public displays: Display[];
    private eventSubscription: Subscription;
    private action: string;
    public showConfirmationPopup: boolean = false;
    public dialogMessage: string;

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

    public ngOnChanges(changes: SimpleChanges): void {
        this.displays = [];
        this.getDisplays();
    }

    public ngOnDestroy(): void {
        if (this.eventSubscription) {
            this.eventSubscription.unsubscribe();
        }
    }

    public connectWall(display: Display): void {
        if (display.disabled) {
            return;
        }
        // fetch the param and select the display for wall auto-connection
        this.route.params.forEach((params: Params) => {
            const actionParam: string = params['action'];
            // Check for change in settings for specific selected wall.
            if (actionParam === CMSConstants.SELECT_DISPLAY) {
                this.cmsSettingsService.updateWallConnectionSpecificDisplay(display);
            } else {
                //update recentDisplayId on user profile data
                this.cmsSettingsService.updateWallConnectionRecentDisplay(display);
                this.storageManager.setItem(CmsSessionStorageItem.DISPLAY, JSON.stringify(display));
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
    public toggleDisplayFavorite(display: Display): void {
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
        } else {
            // if display is unfavorite, mark it as favorite
            this.favoriteService.markObjectAsFavorite(display.id, display.type, this.displays);
        }
    }

    /**
     * On displays unavailable dialog confirmation, route user to display panel.
     * @method onConfirmation
     * @returns {void}
     */
    public onConfirmation(): void {
        this.route.params.forEach((params: Params) => {
            const actionParam: string = params['action'];
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
    private getDisplays(): Subscription {
        return this.cmsServerApi.getDisplayList(1, 0, this.searchFilter, this.favoriteFilter)
            .subscribe(
            (displays: Display[]) => {
                this.displays.push(...displays);
                // subscribe for display list change events
                if (!this.eventSubscription) {
                    this.eventSubscription = CmsEventEmitterService.REGISTER(CMS_EVENTS.DisplayList)
                        .subscribe((event: ICmsEvent) => this.handleDisplayListEvents(event));
                }
                // show dialog if no displays are available
                if (this.displays.length === 0 && this.searchFilter === "" && !this.favoriteFilter) {
                    this.showDialogMessage();
                }
            },
            (error: any) => {
                this.showDialogMessage();
            });
    }

    /**
     * This methods show dialog for confirmation
     * @method showDialogMessage
     * @returns {void}
     */
    private showDialogMessage(): void {
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
    private handleDisplayListEvents(event: ICmsEvent): void {
        //show confimation dialog
        this.showConfirmationPopup = false;
        if (event.verb.toLowerCase() === "deleted") {
            const id: number = (<{ id: number }>event.body).id;
            let filteredDisplay: Display = this.displays.find((display: Display) => display.id === id);
            if (filteredDisplay) {
                filteredDisplay.disabled = true;
            }
            filteredDisplay = JSON.parse(this.storageManager.getItem(CmsSessionStorageItem.DISPLAY));
            if (filteredDisplay && filteredDisplay.id === id) {
                this.storageManager.removeItem(CmsSessionStorageItem.DISPLAY);
            }
        }
        this.changeEmitter.emit();
    }
}
