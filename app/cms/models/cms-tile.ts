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