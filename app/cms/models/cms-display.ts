import { Tile } from "./cms-tile";
import { TileContent } from "./cms-tile-content";
import { CmsResource } from "./cms-resource";

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

export class Display extends CmsResource {
    public type: string;
    public online: boolean;
    public tilerId?: number;
    public resolution: {
        width: number;
        height: number;
    }
    public tiles: Tile[];
    public content: TileContent[];

    public get width(): number {
        return this.resolution.width;
    }

    public get height(): number {
        return this.resolution.height;
    }

    constructor(display) {
        if (display) {
            super(display);
            this.type = display.type;
            this.online = display.online;
            this.resolution = display.resolution;
            if (display.tiles instanceof Array) {
                this.tiles = display.tiles.map(tile => new Tile(tile));
            }
            if (display.content instanceof Array) {
                this.content = display.content.map(content => new TileContent(content));
            }
            this.tilerId = display.tilerId;
        }
    }
}