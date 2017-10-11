/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

/**
 * The class defines the tile object.
 */
export class Tile {

    public set x(v: number) {
        this.left = v;
    }


    public get x(): number {
        return this.left;
    }

    public set y(v: number) {
        this.top = v;
    }


    public get y(): number {
        return this.top;
    }

    width: number;
    height: number;
    left?: number;
    top?: number

    constructor(tileModel?) {
        if (tileModel) {
            this.width = tileModel.width;
            this.height = tileModel.height;
            this.left = tileModel.left >= 0 ? tileModel.left : tileModel.x;
            this.top = tileModel.top >= 0 ? tileModel.top : tileModel.y;
        }
    }
}