/**
 * Test specification for display model.
 */
import { Display } from "../../../../app/cms/models/cms-display";
import { mockDisplay1 } from "../../core/mock-stubs/cms-mini-display.service.mock";

const displayModel: Display = mockDisplay1;
const contentLength: number = 2;
describe("display Model - ", () => {
    it("should set and get display Model attributes ", () => {
        const display: Display = new Display(displayModel);
        expect(display.type).toBe(displayModel.type);
        expect(display.online).toBe(displayModel.online);
        expect(display.resolution.width).toBe(displayModel.resolution.width);
        expect(display.resolution.height).toBe(displayModel.resolution.height);
        expect(display.width).toBe(displayModel.resolution.width);
        expect(display.height).toBe(displayModel.resolution.height);
        expect(display.tilerId).toBe(displayModel.tilerId);

        expect(display.tiles[0].left).toEqual(displayModel.tiles[0].left);
        expect(display.tiles[0].top).toEqual(displayModel.tiles[0].top);
        expect(display.tiles[0].width).toEqual(displayModel.tiles[0].width);
        expect(display.tiles[0].height).toEqual(displayModel.tiles[0].height);
        expect(display.content.length).toEqual(contentLength);
        expect(display.content[0].name).toEqual(displayModel.content[0].name);
    });

    it("should set and get null display Model attributes ", () => {
        const display: Display = new Display({
            type: undefined,
            online: false,
            tilerId: undefined,
            resolution: undefined,
            tiles: [],
            content: []
        });
        expect(display.type).toBeUndefined();
        expect(display.online).toBeFalsy();
        expect(display.resolution).toBeUndefined();
        expect(display.tilerId).toBeUndefined();
        expect(display.tiles).toEqual([]);
        expect(display.content).toEqual([]);
    });

    it("should check for undefined display model ", () => {
        const display: Display = new Display({});
        expect(display.type).toBeUndefined();
        expect(display.online).toBeUndefined();
        expect(display.resolution).toBeUndefined();
        expect(display.tilerId).toBeUndefined();
        expect(display.tiles).toBeUndefined([]);
        expect(display.content).toBeUndefined([]);
    });
});
