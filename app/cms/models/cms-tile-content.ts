/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { Tile } from "./cms-tile";
import { Source } from "./cms-source";

/**
 * The interface defines the model for the tile content object.
 */
export class TileContent extends Source {
    // id of any type of resource shared on display
    resourceId: number;
    
	// last modified timestamp for snapshot
    // the reason we marked it as string type is that it holds a number not a real date
	lastModified: string;

    // keeps absolute tile info as per display wall
    absoluteSize: Tile;


    constructor(contentModel) {
        if (!contentModel) {
            return null;
        };
        super(contentModel);

        this.resourceId = contentModel.resourceId;
        this.lastModified = contentModel.lastModified;
        if (contentModel.absoluteSize) {
            if (contentModel.absoluteSize instanceof Tile) {
                this.absoluteSize = contentModel.absoluteSize;
            } else {
                this.absoluteSize = new Tile(contentModel.absoluteSize);
            }
        } 
    }
}