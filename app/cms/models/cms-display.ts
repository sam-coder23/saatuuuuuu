/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { ITile } from "./cms-tile";
import { TileContent } from "./cms-tile-content";
import { CmsResource } from "./cms-resource";

/**
 * The interface defines the model for the display object.
 */
export class Display extends CmsResource {
    type: string;
    online: boolean;
    private resolution: {
        width: number;
        height: number;
    }


    public get width(): number {
        return this.resolution.width;
    }

    public get height(): number {
        return this.resolution.height;
    }

    tiles: ITile[];
    content: TileContent[];

    constructor(display) {
        super(display);

        this.type = display.type;
        this.online = display.online;
        this.resolution = display.resolution;
        this.tiles = display.tiles;
        this.content = display.content;
    }
}