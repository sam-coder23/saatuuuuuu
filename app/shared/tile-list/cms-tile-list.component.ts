/**
 * This Component displays the list of layouts available for the user to map the selected sources to.
 * This component renders inside the TilesPanel component.
 */
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Rx";
import { CMS_EVENTS } from "../../cms/api/cms-events.enum";
import { Display } from "../../cms/models/cms-display";
import { CmsSettingsService } from "../../launchpad/settings/cms-settings.service";

import { CmsApiService } from "../../cms/api/cms-api.service";
import { ITilePreset } from "../../cms/models/cms-tile-preset";
import { TilePresetManager } from "../../utils/tilepreset-manager.util";
import { CmsEventEmitterService } from "./../../cms/api/cms-event-emitter.service";

import { ICmsEvent } from "../../cms/models/cms-event";
import { Validation } from "../../core/util/Validation";
import { CMSConstants } from "./../../cms/models/cms-constants";

import { Source } from "../../cms/models/cms-source";

@Component({
    selector: "cms-tile-list",
    template: require("./cms-tile-list.component.html"),
    styles: [require("./cms-tile-list.component.scss")]
})
/**
 * This class contains the behaviour for CmsTileListComponent, which shows the list of available
 * Tilers for a display wall, contains methods that handles logic like API request for getting
 * list of available Tilers available for a particular Display.
 * @class CmsTileListComponent
 * @property {number} sourceCount
 * @property {{ "width": number, "height": number }} displayResolution
 * @property {EventEmitter} tileSelectEmitter an event to emit changes to sources-panel
 * @property {ITilePreset[]} tilePresets
 * @property {Subscription} tileListEventSubscription
 * @property {number} defaultTilerID
 * @property {number} displayID
 * @property {EventEmitter} miniDisplayEventSubscription CMS events subscription and unsubscribe them on
 * component destruction
 * @constructor injects the nessecary dependencies in the component initialize the tilePresets
 */
export class CmsTileListComponent implements OnInit, OnDestroy {
    public tilePresets: ITilePreset[];
    public defaultTilerID: number;
    @Output("select") public tileSelectEmitter: EventEmitter<any> = new EventEmitter();
    @Output("change") public changeEmitter: EventEmitter<any> = new EventEmitter();
    @Input() public sourceCount: number = 0;
    @Input() public displayResolution: { "width": number, "height": number };

    private tileListEventSubscription: Subscription;
    private displayID: number;
    // it saves the
    private miniDisplayEventSubscription: EventEmitter<any>;
    private parseIntBase: number = 10;

    constructor(
        private activatedRoute: ActivatedRoute,
        private cmsServerApi: CmsApiService,
        private cmsSettingService: CmsSettingsService
    ) {
        this.tilePresets = [];
        // tslint:disable-next-line:no-string-literal
        this.displayID = parseInt(this.activatedRoute.params["value"].id, this.parseIntBase);
    }

    public ngOnInit(): void {
        if (!this.checkSourceCount()) {
            return;
        }
        this.getTilePresets();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.tilePresets = [];
        this.getTilePresets();
    }

    public ngOnDestroy(): void {
        // Unsubscribe cms events for tile list component
        if (!Validation.IS_NULL_OR_UNDEFINED(this.miniDisplayEventSubscription)) {
            this.miniDisplayEventSubscription.unsubscribe();
        }
        if (!Validation.IS_NULL_OR_UNDEFINED(this.tileListEventSubscription)) {
            this.tileListEventSubscription.unsubscribe();
        }
    }

    /**
     * This method check for source count.
     * @method checkSourceCount
     * @return {boolean}
     */
    public checkSourceCount(): boolean {
        if (!(this.sourceCount > 0)) {
            return false;
        }
        if (!(this.sourceCount === this.cmsSettingService.selectedSources.length)) {
            return false;
        }

        return true;
    }

    /**
     * This method load tile preset on display
     * @method loadTilePreset
     * @param {ITilePreset} tilePreset
     * @return {void}
     */
    public loadTilePreset(tilePreset: ITilePreset): void {
        this.selectTile(tilePreset);
        const requestPayload: any = {
            resources: [...this.cmsSettingService.selectedSources]
        };
        // API rejects extra properties
        requestPayload.resources.forEach((resource: Source) => {
            resource.selected = undefined;
        });
        this.cmsServerApi.putContentsOnDisplay(this.displayID, tilePreset.id, requestPayload)
            .subscribe((response: any) => {
                this.tileSelectEmitter.emit();
                    }, (error: any) => {
                        console.error(error);
                });
    }

    /**
     * It gets list of tilePresets.
     * @method getTilePresets
     * @return {void}
     */
    private getTilePresets(): void {
        // get tile presets filtered by number of tiles
        this.cmsServerApi.getTilePresets(this.sourceCount).subscribe((tilePresets: ITilePreset[]) => {
            this.tilePresets = tilePresets;
            this.defaultTilerID = TilePresetManager.GET_TILE_ID(
                this.tilePresets,
                this.sourceCount,
                this.displayID
            );
            // mark tilePreset which is currently applied on the display wall
            this.markTileSelected();
            // subscribe for display change events
            if (Validation.IS_NULL_OR_UNDEFINED(this.miniDisplayEventSubscription)) {
                this.miniDisplayEventSubscription = CmsEventEmitterService.REGISTER(CMS_EVENTS.MiniDisplay)
                    .subscribe((event: ICmsEvent) => {
                        this.handleDisplayEvents(event);
                    });
            }
            // subscribe for TileList events
            if (!this.tileListEventSubscription) {
                this.tileListEventSubscription = CmsEventEmitterService.REGISTER(CMS_EVENTS.TileList)
                    .subscribe((event: ICmsEvent) => this.handleTilePresetListEvents(event));
            }
        });
    }

    /**
     * Event listener to handle Tiler list related events
     * @method handleTilePresetListEvents
     * @return {void}
     */
    private handleTilePresetListEvents(event: ICmsEvent): void {
        this.changeEmitter.emit();
    }

    /**
     * This method mark a tile selected based on current display tilerId.
     * @method markTileSelected
     * @return {void}
     */
    private markTileSelected(): void {
        // tslint:disable-next-line:no-string-literal
        const displayId: number = parseInt(this.activatedRoute.params["value"].id, this.parseIntBase);
        this.cmsServerApi.getSelectedDisplayContent(displayId).subscribe((display: Display) => {
            if (display) {
                this.selectTileInPresets(display);
            }
        });
    }

    /**
     * Selects the tile
     * @method selectTile
     * @param {ITilePreset} tilePreset
     * @return {void}
     */
    private selectTile(tilePreset: ITilePreset): void {
        if (Validation.IS_NULL_OR_UNDEFINED(tilePreset)) {
            return;
        }
        // unmark previous selected tile
        for (const tile of this.tilePresets){
            if (tile.isSelected) {
                tile.isSelected = false;
            }
        }
        // mark current tile as selected
        tilePreset.isSelected = true;
    }

    /**
     * This method handle display update event and trigger change event if display tile is changed.
     * @method handleDisplayEvents
     * @param {Event} event
     * @return {void}
     */
    private handleDisplayEvents(event: any): void {
        if (!event && !event.body) { return; }

        // tslint:disable-next-line:no-string-literal
        const displayId: number = parseInt(this.activatedRoute.params["value"].id, this.parseIntBase);
        if (event.eventType === CMSConstants.DISPLAYUPDATED) {
            if (event.displayId === displayId) {
                let tileAlreadySelected: boolean = false;
                const displayTilerId: number = event.body.tilerId;
                // looping through all tile-presets and find same selected tiler
                for (const tilePreset of this.tilePresets) {
                    if ((tilePreset.id === displayTilerId) && tilePreset.isSelected) {
                        tileAlreadySelected = true;
                        break;
                    }
                }

                if (!tileAlreadySelected) {
                    this.changeEmitter.emit();
                }
            }
        }
    }

    /**
     * This method select a tile in tile preset list based on  dipslay tilerId.
     * @method selectTileInPresets
     * @param {any} display: Selected display wall
     * @return {void}
     */
    private selectTileInPresets(display: any): void {
        if (!display) {
            return;
        }
        const tilerId: number = display.tilerId;
        if (tilerId > 0) {
            for (const tile of this.tilePresets) {
                if (tilerId === tile.id) {
                    tile.isSelected = true;
                } else {
                    tile.isSelected = false;
                }
            }
        }
    }
}
