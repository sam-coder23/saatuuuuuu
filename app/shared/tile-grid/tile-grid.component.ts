import { Component, Input } from "@angular/core";
import { ITilePreset } from "../../cms/models/cms-tile-preset";
import { Tile } from "../../cms/models/cms-tile";

@Component({
    selector: "cms-tile-grid",
    template: require("./tile-grid.component.html"),
    styles: [require("./tile-grid.component.scss")]
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
    @Input() displayBase: { height: number, width: number };
    @Input() tilePreset: ITilePreset;
    // default tile-grid broder depends on .cms-tile-rectangle in css
    public border: number = 2;
    private get displayBaseStyle(): any {
        if (!this.displayBase) {
            return null;
        }
        let style = Object.assign({}, this.displayBase);
        Object.keys(style).forEach(key => style[key] += "px");
        return style;
    }

    constructor() {
        this.displayBase = {
            height: 0,
            width: 0
        };
    }

    private tileStyle(tile: Tile) {
        let tilePresetBase = {
            height: this.tilePreset.base.rowBound,
            width: this.tilePreset.base.colBound
        };
        let ratioDisplayBaseToTilePresetBase = {
            height: this.displayBase.height / tilePresetBase.height,
            width: this.displayBase.width / tilePresetBase.width
        };
        let tileStyle = {
            left: `${tile.left * ratioDisplayBaseToTilePresetBase.width}px`,
            top: `${tile.top * ratioDisplayBaseToTilePresetBase.height}px`,
            width: `${(tile.width * ratioDisplayBaseToTilePresetBase.width) - this.border}px`,
            height: `${(tile.height * ratioDisplayBaseToTilePresetBase.height) - this.border}px`
        };
        return tileStyle;
    }
}