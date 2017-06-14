/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { ITile } from './cms-tile';
import { TileContent } from './cms-tile-content';
import { CmsResource } from './cms-resource';

/**
 * The interface defines the model for the display object.
 */
export class Display extends CmsResource {
    type: string;
    online: boolean;
    width: number;
    height: number;
    tiles: ITile[];
    content: TileContent[];
}