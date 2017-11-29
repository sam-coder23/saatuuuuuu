import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges, OnDestroy } from "@angular/core";
import { CmsApiService } from "../../cms/api/cms-api.service";
import { ITilePreset } from "../../cms/models/cms-tile-preset";
import { ActivatedRoute } from "@angular/router";
import { TilePresetManager } from "../../utils/tilepreset-manager.util";
import { Subscription } from "rxjs/Rx";
import { CmsEventEmitterService } from "./../../cms/api/cms-event-emitter.service";
import { CMS_EVENTS } from "../../cms/api/cms-events.enum";
import { ICmsEvent } from "../../cms/models/cms-event";
import { Validation } from "../../core/util/Validation";
import { CMSConstants } from "./../../cms/models/cms-constants";
import { CmsSettingsService } from "../../launchpad/settings/cms-settings.service";

@Component({
    selector: "cms-tile-list",
    template: require("./cms-tile-list.component.html"),
    styles: [require("./cms-tile-list.component.scss")]
})

export class CmsTileListComponent implements OnInit, OnDestroy {
    @Input()
    sourceCount: number = 0;
    @Input()
    displayResolution: { "width": number, "height": number };
    public tilePresets: ITilePreset[];
    @Output("select") tileSelectEmitter = new EventEmitter();
    // an event to emit changes to sources-panel
    @Output("change") changeEmitter = new EventEmitter();
    private tileListEventSubscription: Subscription;
    public defaultTilerID: number;
    private displayID: number;
    // it saves the CMS events subscription and unsubscribe them on component destruction
    private miniDisplayEventSubscription: EventEmitter<any> = null;

    constructor(
        private activatedRoute: ActivatedRoute,
        private cmsServerApi: CmsApiService,
        private cmsSettingService: CmsSettingsService,
    ) {
        this.tilePresets = [];
        this.displayID = parseInt(this.activatedRoute.params["value"]["id"]);
    }

    ngOnInit() {
        if (!this.checkSourceCount()) {
            return;
        };
        this.getTilePresets();
    }

    ngOnDestroy() {
        // Unsubscribe cms events for tile list component
        if (!Validation.IsNullOrUndefined(this.miniDisplayEventSubscription)) {
            this.miniDisplayEventSubscription.unsubscribe();
        }

        if (!Validation.IsNullOrUndefined(this.tileListEventSubscription)) {
            this.tileListEventSubscription.unsubscribe();
        }
    }

    /**
     * @method getTilePresets - It gets list of tilePresets.
     */
    private getTilePresets(): void {
        // get tile presets filtered by number of tiles
        this.cmsServerApi.getTilePresets(this.sourceCount).subscribe(tilePresets => {
            this.tilePresets = tilePresets;
            this.defaultTilerID = TilePresetManager.GetTileId(this.tilePresets, this.sourceCount, this.displayID);

            // mark tilePreset which is currently applied on the display wall
            this.markTileSelected();
            
            // subscribe for display change events
            if (Validation.IsNullOrUndefined(this.miniDisplayEventSubscription)) {
                this.miniDisplayEventSubscription = CmsEventEmitterService.get(CMS_EVENTS.MiniDisplay)
                    .subscribe((event: ICmsEvent) => {
                        this.handleDisplayEvents(event);
                    });
            };

            // subscribe for TileList events
            if (!this.tileListEventSubscription) {
                this.tileListEventSubscription = CmsEventEmitterService.get(CMS_EVENTS.TileList)
                    .subscribe((event: ICmsEvent) => this.handleTilePresetListEvents(event));
            };
        });
    }

    /**
     * This method check for source count.
     * @method checkSourceCount
     * @return boolean
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
     * @param tilePreset
     * @return void
     */
    loadTilePreset(tilePreset: ITilePreset) {
        this.selectTile(tilePreset);

        let requestPayload = {
            "resources": [...this.cmsSettingService.selectedSources]
        };

        // API rejects extra properties
        requestPayload.resources.forEach(resource => {
            resource.selected = undefined;
        });
        this.cmsServerApi.putContentsOnDisplay(this.displayID, tilePreset.id, requestPayload).subscribe(response => {
            this.tileSelectEmitter.emit();
        }, error => {
            console.error(error);
        });
    }

    /**
 * This will call the functionality written inside of this block
 * once it will get any changes in input of this component
 * @Hook ngOnChanges
 * @param {SimpleChanges} changes
 */
    ngOnChanges(changes: SimpleChanges) {
        this.tilePresets = [];
        this.getTilePresets();
    }

    /**
     * Event listener to handle Tiler list related events
     */
    private handleTilePresetListEvents(event: ICmsEvent) {
        this.changeEmitter.emit();
    }

    /* This method mark a tile selected based on current display tilerId.
     * @method markTileSelected
     * @return void
     */
    private markTileSelected() {
        let displayId = parseInt(this.activatedRoute.params["value"]["id"]);
        this.cmsServerApi.getSelectedDisplayContent(displayId).subscribe((display) => {
            if (display) {
                this.selectTileInPresets(display);
            }
        });
    }

    /**
     * This method select a tile on click.
     * @method selectTile
     * @param tilePreset
     * @return void
     */
    private selectTile(tilePreset) {
        if (Validation.IsNullOrUndefined(tilePreset)) { return; }

        // unmark previous selected tile
        for (let index = 0; index < this.tilePresets.length; index++) {
            if (this.tilePresets[index].isSelected) {
                this.tilePresets[index].isSelected = false;
            }
        }

        // mark current tile as selected
        tilePreset.isSelected = true;
    }

    /**
     * This method handle display update event and trigger change event if display tile is changed.
     * @method handleDisplayEvents
     * @param event
     * @return void
     */
    private handleDisplayEvents(event) {
        if (!event && !event.body) { return; }

        let displayId = parseInt(this.activatedRoute.params["value"]["id"]);
        if (event.eventType === CMSConstants.DISPLAYUPDATED) {
            if (event.displayId === displayId) {
                let tileAlreadySelected = false;
                let displayTilerId = event.body.tilerId;

                // looping through all tile-presets and find same selected tiler
                for (let tilePresetIndex = 0; tilePresetIndex < this.tilePresets.length; tilePresetIndex++) {
                    if ((this.tilePresets[tilePresetIndex].id === displayTilerId) && this.tilePresets[tilePresetIndex].isSelected) {
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
     * @param display
     * @return void
     */
    private selectTileInPresets(display) {
        if (!display) { return };

        let tilerId: number = display.tilerId;
        if (tilerId > 0) {
            for (let index = 0; index < this.tilePresets.length; index++) {
                if (tilerId === this.tilePresets[index].id) {
                    this.tilePresets[index].isSelected = true;
                } else {
                    this.tilePresets[index].isSelected = false;
                }
            }
        }
    }
}