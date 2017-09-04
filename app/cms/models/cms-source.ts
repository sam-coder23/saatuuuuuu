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
    selected?: boolean
}