import { Component, Input } from "@angular/core";
import { ITilePreset } from "../../cms/models/cms-tile-preset";
import { ITile } from "../../cms/models/cms-tile";

@Component({
    selector: "cms-tile-grid",
    template: require("to-string!./tile-grid.component.html"),
    styles: [require("to-string!./tile-grid.component.scss")]
})

export class TileGridComponent {
    @Input()
    displayBase: { height: number, width: number };

    @Input()
    tilePreset: ITilePreset;

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

    public tileStyle(tile: ITile) {

        let tilePresetBase = {
            height: this.tilePreset.base.rowBound,
            width: this.tilePreset.base.colBound
        };

        let ratioDisplayBaseToTilePresetBase = {
            height: this.displayBase.height / tilePresetBase.height,
            width: this.displayBase.width / tilePresetBase.width
        };

        let tileStyleModel: ITile = {
            left: tile.left * ratioDisplayBaseToTilePresetBase.width,
            top: tile.top * ratioDisplayBaseToTilePresetBase.height,
            width: (tile.width * ratioDisplayBaseToTilePresetBase.width) - this.border,
            height: (tile.height * ratioDisplayBaseToTilePresetBase.height) - this.border
        };

        let tileStyle = Object.assign({}, tileStyleModel);
        Object.keys(tileStyleModel).forEach(key => tileStyle[key] += "px");
        return tileStyle;
    }

}