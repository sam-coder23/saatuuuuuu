/**
 * The class defines the tile object.
 * @class Tile
 * @property {number} width
 * @property {number} heigth
 * @property {number} left optional, marks the relative position
 * @property {number} top optional, marks relative position from the top
 * @property {number} x x co-ordinate values
 * @property {number} y y co-ordinate values
 */

export class Tile {
    public width: number;
    public height: number;
    public left?: number;
    public top?: number;
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

    constructor (tile?: object) {
        let tileModel: Tile;
        if (tile) {
            tileModel = <Tile>tile;
            this.width = tileModel.width;
            this.height = tileModel.height;
            this.left = tileModel.left >= 0 ? tileModel.left : tileModel.x;
            this.top = tileModel.top >= 0 ? tileModel.top : tileModel.y;
        }
    }
}
