/**
 * This is a card component which uses md-card provided by ng2-material. 
 * The card layout is customized as per the design provided for launchpad application cards.
 */
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from "@angular/core";
import { CmsResource } from "./../../cms/models/cms-resource";
import { AppConfig } from "../../config";
import { RegExManager } from "../../core/util/RegEx";
import { Url } from "../../core/util/URL";
import { Validation } from "../../core/util/Validation";
import { CmsFavoriteService } from "../cms-favorite.service";
import { Source } from "../../cms/models/cms-source";

@Component({
    selector: "cms-card",
    template: require("./cms-card.component.html"),
    styles: [require("./cms-card.scss")]
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
    private isFavorite: boolean;
    private cardSnapshot: string;
    private refreshSnapshot: boolean;
    /**
     * Above variable is used to decided whether we need to refresh image. When we just mark image as fav 
     * then due to current implementation it will
     * Update the object somewhere else and that will refresh entire componnent. Due to same we will see 
     * image is flickered because its timestamp is updated.
     */
    @Input() card: CmsResource;
    @Input() multi: boolean;
    @Output("select") selectedEventEmitter = new EventEmitter(); // card selection    
    @Output("toggleFavorite") favoriteEventEmitter = new EventEmitter();

    constructor(
        private appConfig: AppConfig,
        private favoriteService: CmsFavoriteService
    ) {
        this.refreshSnapshot = this.favoriteService.refreshSnapshot;
    }

    ngOnInit() {
        let snapshotPath = this.card.snapshotPath;
        this.isFavorite = this.card.favorite;
        if (snapshotPath && this.refreshSnapshot === true) {
            if (Url.HasHostName() && !Validation.IsNullOrUndefined(snapshotPath) 
            && Url.HasIP(snapshotPath)) {
                this.cardSnapshot = RegExManager.IPToHost(snapshotPath, this.appConfig.Host);
            }
            else {
                this.cardSnapshot = snapshotPath;
            }
            this.cardSnapshot = `${this.cardSnapshot}&_=${Date.now()}`;
            this.card.snapshotPath = this.cardSnapshot;
        }
        else {
            this.cardSnapshot = snapshotPath;
        }
        this.refreshSnapshot = true;
    }

    ngOnChanges(changes: SimpleChanges) {
        this.favoriteService.refreshSnapshot = true;
        this.isFavorite = this.card.favorite;
    }

    /**
     * sets the card to selected.
     * @method selectCard
     * @param {CmsResource} card, specifies the base type of the card object.
     * @return {void}.
     */
    private selectCard(card: CmsResource) {
        if (card.disabled) {
            return;
        }
        if (card instanceof Source) {
            this.selectedEventEmitter.emit((<Source>card).selected);
        }
        else {
            this.selectedEventEmitter.emit();
        }
    }

    /**
     * This methods emits an event to its host component with the card favorite information.
     * @method markFavorite
     * @param {MouseEvent} event Mouse Event
     * @param {CmsResource} card specifies the base type of the card object.
     * @return {void}
     */
    private markFavorite(event: MouseEvent, card: CmsResource) {
        this.appConfig.log(`Toggle Card [Name: ${card.name}] as favorite ${!this.card.favorite}`);
        this.favoriteEventEmitter.emit();
        event.stopPropagation();
    }
}
