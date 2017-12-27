import { ComponentFixture, TestBed, async, inject } from "@angular/core/testing";
import { Display } from "../../../../app/cms/models/cms-display";


let displayModel = {
    "type": "NGPWALL",
    "online": true,
    "tilerId": 2048112,
    "resolution": {
        "width": 1024,
        "height": 512
    },
    "tiles": [{
        "left": 0,
        "top": 0,
        "width": 682.6666666666666,
        "height": 360
    },
    {
        "left": 682.6666666666666,
        "top": 0,
        "width": 682.6666666666666,
        "height": 360
    }],
    "content": [
        {
            "id": 57,
            "name": "DefaultProSource[NOICLT27275-1-5-1-1]",
            "type": "Perspective",
            "resourceId": 20,
            "x": 0,
            "y": 0,
            "width": 3520,
            "height": 1080,
            "snapshotPath": "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F29.jpeg",
            "zOrder": 1
        }
    ]
};

describe("display Model - ", () => {

    it("should set and get display Model attributes ", () => {
        let display = new Display(displayModel);
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

        expect(display.content.length).toEqual(1);
        expect(display.content[0].name).toEqual(displayModel.content[0].name);
    });

    it("should set and get null display Model attributes ", () => {
        let display = new Display({
            "type": null,
            "online": false,
            "tilerId": null,
            "resolution": null,
            "tiles": [],
            "content": []
        });
        expect(display.type).toBeNull();
        expect(display.online).toBeFalsy();
        expect(display.resolution).toBeNull();
        expect(display.tilerId).toBeNull();
        expect(display.tiles).toEqual([]);
        expect(display.content).toEqual([]);
    });


    it("should check for undefined display model ", () => {
        let display = new Display({});
        expect(display.type).toBeUndefined();
        expect(display.online).toBeUndefined();
        expect(display.resolution).toBeUndefined();
        expect(display.tilerId).toBeUndefined();
        expect(display.tiles).toBeUndefined([]);
        expect(display.content).toBeUndefined([]);
    });
});
