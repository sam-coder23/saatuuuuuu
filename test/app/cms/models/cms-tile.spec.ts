import { Tile } from "../../../../app/cms/models/cms-tile";

let tileModel = {
    "x": 0.7279344858962693,
    "y": 1.380379469551444,
    "width": 2048,
    "height": 1080
};

describe("Tile Model - ", () => {
    it("should set and get Tile Model attributes ", () => {
        let tile = new Tile(tileModel);
        expect(tile.x).toBe(tileModel.x);
        expect(tile.y).toBe(tileModel.y);
        expect(tile.width).toBe(tileModel.width);
        expect(tile.height).toBe(tileModel.height);
        /** setter */
        let xPosition = 0.50, yPosition = 2.50;
        tile.x = xPosition;
        tile.y = yPosition;
        expect(tile.x).toEqual(xPosition);
        expect(tile.y).toEqual(yPosition);
    });

    it("should set and get null Tile Model attributes ", () => {
        let tile = new Tile({
            "x": null,
            "y": null,
            "width": null,
            "height": null 
        });
        expect(tile.x).toBeNull();
        expect(tile.y).toBeNull();
        expect(tile.width).toBeNull();
        expect(tile.height).toBeNull();
    });

    it("should check for undefined tile model ", () => {
        let tile = new Tile();
        expect(tile.x).toBeUndefined();
        expect(tile.y).toBeUndefined();
        expect(tile.width).toBeUndefined();
        expect(tile.height).toBeUndefined();
    });
});
