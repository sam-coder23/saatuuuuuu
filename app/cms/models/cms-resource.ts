/**
* Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
* ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
* the terms of the license agreement you entered into with Barco.
*/

/**
 * This class defines a generic information that all cms resources like source, display etc contain.
 */
export class CmsResource {
    id: number;
    name: string;
    description: string;
    snapshotpath: string;
    disabled: boolean = false;
    favorite: boolean = false;
}