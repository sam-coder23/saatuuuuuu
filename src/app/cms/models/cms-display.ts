/**
 * The class defines the model for the display object.
 * @class Display
 * @property {string} type display type
 * @property {boolean} online indicates if the display is online.
 * @property {number} tilerId optional
 * @property {{width, hieght}} resolution resolution of the display
 * @property {Tile[]} tiles
 * @property {TileContent[]} content source content mapped on the tile of tiler.
 */

import { CmsResource } from "./cms-resource";
import { Tile } from "./cms-tile";
import { TileContent } from "./cms-tile-content";

export class Display extends CmsResource {
    // tslint:disable-next-line:no-reserved-keywords
    public type?: string;
    public online?: boolean;
    public tilerId?: number;
    public resolution?: {
        width?: number;
        height?: number;
    };
    public tiles?: Tile[];
    public content?: TileContent[];

    public override get width(): number {
        return this.resolution?.width??0;
    }

    public override get height(): number {
        return this.resolution?.height??0;
    }

    public modules?: any[];

    constructor (display: object) {
        let displayObject: Display;
        if (display) {
            displayObject = <Display>display;
            super(displayObject);
            this.type = displayObject.type;
            this.online = displayObject.online;
            this.resolution = displayObject.resolution;
            this.modules = displayObject.modules;
            if (displayObject.tiles instanceof Array) {
                this.tiles = displayObject.tiles.map((tile: Tile) => new Tile(tile));
            }
            if (displayObject.content instanceof Array) {
                this.content = displayObject.content.map((content: TileContent) => new TileContent(content));
            }
            this.tilerId = displayObject.tilerId;
        }
    }
}
