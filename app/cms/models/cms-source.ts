/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { CmsResource } from "./cms-resource";

/**
 * The class defines the model for the source object.
 */
export class Source extends CmsResource {
    type: string;
    x: number;
    y: number;
    zOrder: number;
    width: number;
    height: number;
    selected?: boolean;

    constructor(sourceModel) {
        if (!sourceModel) {
            return null;
        };
        super(sourceModel);

        this.type = sourceModel.type;
        this.x = sourceModel.x;
        this.y = sourceModel.y;
        this.zOrder = sourceModel.zOrder;
        this.width = sourceModel.width;
        this.height = sourceModel.height;
        this.selected = sourceModel.selected;
    }
}