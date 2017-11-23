/**
 * The class defines the model for the display object.
 */

import { Tile } from "./cms-tile";
import { TileContent } from "./cms-tile-content";
import { CmsResource } from "./cms-resource";


export class Display extends CmsResource {
    type: string;
    online: boolean;
    tilerId?: number;
    public  resolution: {
        width: number;
        height: number;
    }


    public get width(): number {
        return this.resolution.width;
    }

    public get height(): number {
        return this.resolution.height;
    }

    tiles: Tile[];
    content: TileContent[];

    constructor(display) {
        if (!display) {
            // TBD: should error be thrown?
            return null;
        }
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
        this.tilerId = display.tilerId
    }
}