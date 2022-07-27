/**
 * Test specification for Tile model
 */
import { Tile } from "../../../../app/cms/models/cms-tile";
import { tile } from "../../core/mock-stubs/tile.mock";

const tileModel: Tile = tile;
describe("Tile Model - ", () => {
    it("should set and get Tile Model attributes ", () => {
        const tile: Tile = new Tile(tileModel);
        const xPosition: number = 0.50;
        const yPosition: number = 2.50;
        expect(tile.x).toBe(tileModel.x);
        expect(tile.y).toBe(tileModel.y);
        expect(tile.width).toBe(tileModel.width);
        expect(tile.height).toBe(tileModel.height);

        tile.x = xPosition;
        tile.y = yPosition;
        expect(tile.x).toEqual(xPosition);
        expect(tile.y).toEqual(yPosition);
    });

    it("should set and get null Tile Model attributes ", () => {
        const tile: Tile  = new Tile({
            x: undefined,
            y: undefined,
            width: undefined,
            height: undefined
        });
        expect(tile.x).toBeUndefined();
        expect(tile.y).toBeUndefined();
        expect(tile.width).toBeUndefined();
        expect(tile.height).toBeUndefined();
    });

    it("should check for undefined tile model ", () => {
        const tile: Tile = new Tile();
        expect(tile.x).toBeUndefined();
        expect(tile.y).toBeUndefined();
        expect(tile.width).toBeUndefined();
        expect(tile.height).toBeUndefined();
    });
});
