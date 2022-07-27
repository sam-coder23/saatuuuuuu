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

    public width: number;
    public height: number;
    public left?: number;
    public top?: number;

    /**
     * Creates an instance of Tile.
     * @param {any} [tileModel]
     * @memberof Tile
     */
    constructor(tileModel?: object) {
        const tile: Tile = <Tile>(tileModel || {});

        this.width = tile.width;
        this.height = tile.height;
        this.left = tile.left >= 0 ? tile.left : tile.x;
        this.top = tile.top >= 0 ? tile.top : tile.y;
    }
}
