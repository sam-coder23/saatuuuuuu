import { Component, OnInit, Input } from "@angular/core";
import { ITilePreset } from "../../cms/models/cms-tile-preset";
import { ITile } from "../../cms/models/cms-tile";

@Component({
    selector: "cms-tile-grid",
    template: require("to-string!./tile-grid.component.html"),
    styles: [require("to-string!./tile-grid.component.scss")]
})

export class TileGridComponent implements OnInit {
    @Input()
    displayBase: { height: number, width: number };

    @Input()
    tilePreset: ITilePreset;

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

    ngOnInit() { }

    private tileStyle(tile: ITile) {
        let border: number = 2;

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
            width: (tile.width * ratioDisplayBaseToTilePresetBase.width) - border,
            height: (tile.height * ratioDisplayBaseToTilePresetBase.height) - border
        };

        let tileStyle = Object.assign({}, tileStyleModel);
        Object.keys(tileStyleModel).forEach(key => tileStyle[key] += "px");
        return tileStyle;
    }

}