/**
 * This component contains the behavior for dynamic tile grid shown inside the layout tiles
 * based on the type of tiler selected.
 */
import { Component, Input } from "@angular/core";
import { Tile } from "../../cms/models/cms-tile";
import { ITilePreset } from "../../cms/models/cms-tile-preset";

@Component({
    selector: 'cms-tile-grid',
    templateUrl: './tile-grid.component.html',
    styleUrls: ['./tile-grid.component.scss'],
    standalone: false
})
/**
 * This class contains the behavior for dynamic tile grid shown inside the layout tiles
 * based on the type of tiler selected.
 * @class TileGridComponent
 * @property {{ height: number, width: number }} displayBase decorator property
 * @property {ITilePreset} tilePreset decorator property
 * @constructor the component's dependenices are injected here.
 */
export class TileGridComponent {
    // default tile-grid broder depends on .cms-tile-rectangle in css
    public border: number = 2;
    @Input() public displayBase: { height: number, width: number };
    @Input() public tilePreset: ITilePreset;

    public get displayBaseStyle(): any {
        if (!this.displayBase) {
            return;
        }
        const style: { height: number, width: number } = Object.assign({}, this.displayBase);
        Object.keys(style).forEach((key: string) => style[key] += "px");

        return style;
    }

    constructor() {
        this.displayBase = {
            height: 0,
            width: 0
        };
    }

    public tileStyle(tile: Tile): object {
        const tilePresetBase: { height: number, width: number } = {
            height: this.tilePreset.base.rowBound,
            width: this.tilePreset.base.colBound
        };
        const ratioDisplayBaseToTilePresetBase: { height: number, width: number } = {
            height: this.displayBase.height / tilePresetBase.height,
            width: this.displayBase.width / tilePresetBase.width
        };

        return {
            left: `${tile.left * ratioDisplayBaseToTilePresetBase.width}px`,
            top: `${tile.top * ratioDisplayBaseToTilePresetBase.height}px`,
            width: `${(tile.width * ratioDisplayBaseToTilePresetBase.width) - this.border}px`,
            height: `${(tile.height * ratioDisplayBaseToTilePresetBase.height) - this.border}px`
        };
    }
}
