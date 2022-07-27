/**
 * This is a card component which uses md-card provided by ng2-material.
 * The card layout is customized as per the design provided for launchpad application cards.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { AppConfig } from "../../config";
import { RegExManager } from "../../core/util/RegEx";
import { Url } from "../../core/util/URL";
import { Validation } from "../../core/util/Validation";
import { CmsFavoriteService } from "../cms-favorite.service";
import { CmsResource } from "./../../cms/models/cms-resource";

@Component({
    selector: 'cms-card',
    templateUrl: './cms-card.component.html',
    styleUrls: ['./cms-card.scss']
})
/**
 * This class has the behaviour for card component used as a shared component to display material
 * cards on diffrent launchpad panel components.
 * @class CmsCardComponent
 * @property {boolean} isFavorite
 * @property {string} string
 * @property {boolean} boolean
 * @property {CmsResource} card parent type to the card
 * @property {boolean} multi specifies multi selection
 * @property {EventEmitter} selectedEventEmitter emits the card selection event.
 * @property {EventEmitter} favoriteEventEmitter emits the favorite toggled value.
 * @constructor injects the nessecary dependencies to the component.
 */
export class CmsCardComponent implements OnInit, OnChanges {
    @Output("select") public selectedEventEmitter: EventEmitter<{}> = new EventEmitter(); // card selection
    @Output("toggleFavorite") public favoriteEventEmitter: EventEmitter<{}> = new EventEmitter();
    /**
     * Above variable is used to decided whether we need to refresh image. When we just mark image as fav
     * then due to current implementation it will
     * Update the object somewhere else and that will refresh entire componnent. Due to same we will see
     * image is flickered because its timestamp is updated.
     */
    @Input() public card?: CmsResource;
    @Input() public multi: boolean;
    public isFavorite?: boolean;
    public cardSnapshot?: string;
    private refreshSnapshot: boolean;

    constructor(
        private appConfig: AppConfig,
        private favoriteService: CmsFavoriteService
    ) {
        this.refreshSnapshot = this.favoriteService.refreshSnapshot;
    }

    public ngOnInit(): void {
        console.log('card--------',this.card);
        const snapshotPath: string | undefined = this.card?.snapshotPath;
        this.isFavorite = this.card?.favorite;
        if (snapshotPath && this.refreshSnapshot) {
            if (Url.HAS_HOST_NAME() && !Validation.IS_NULL_OR_UNDEFINED(snapshotPath) && Url.HAS_IP(snapshotPath)) {
                this.cardSnapshot = RegExManager.IPTOHOST(snapshotPath, this.appConfig.Host);
            } else {
                this.cardSnapshot = snapshotPath;
            }
            this.cardSnapshot = `${this.cardSnapshot}&_=${Date.now()}`;
            this.card.snapshotPath = this.cardSnapshot;
        } else {
            this.cardSnapshot = snapshotPath;
        }
        this.refreshSnapshot = true;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.favoriteService.refreshSnapshot = true;
        this.isFavorite = this.card?.favorite;
    }

    /**
     * sets the card to selected.
     * @method selectCard
     * @param {CmsResource} card, specifies the base type of the card object.
     * @return {void}.
     */
    public selectCard(card: CmsResource): void {
        if (card.disabled) {
            return;
        }

        this.selectedEventEmitter.emit();
    }

    /**
     * This methods emits an event to its host component with the card favorite information.
     * @method markFavorite
     * @param {MouseEvent} event Mouse Event
     * @param {CmsResource} card specifies the base type of the card object.
     * @return {void}
     */
    public markFavorite(event: MouseEvent, card: CmsResource): void {
        this.appConfig.log(`Toggle Card [Name: ${card.name}] as favorite ${!this.card?.favorite}`);
        this.favoriteEventEmitter.emit();
        event.stopPropagation();
    }
}
