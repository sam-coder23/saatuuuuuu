/**
 * Mock stubs and data for Source List, selected sources and tilers.
 */
import { Source } from "../../../../app/cms/models/cms-source";
import { ITilePreset } from "../../../../app/cms/models/cms-tile-preset";
export const mockTilersData: ITilePreset[] = [
    {
        id: 66,
        name: "TCR-01S",
        description: "",
        tags: "",
        base: {
            rowBound: 1,
            colBound: 1
        },
        tiles: [
            {
                left: 0,
                top: 0,
                width: 1,
                height: 1
            }
        ],
        isDefaultForAllDisplays: true,
        noOfTiles: 1,
        isGrid: false,
        defaultForDisplays: []
    },
    {
        id: 69,
        name: "TCR-04S",
        description: "",
        tags: "",
        base: {
            rowBound: 2,
            colBound: 2
        },
        tiles: [
            {
                left: 0,
                top: 0,
                width: 1,
                height: 1
            },
            {
                left: 1,
                top: 0,
                width: 1,
                height: 1
            },
            {
                left: 0,
                top: 1,
                width: 1,
                height: 1
            },
            {
                left: 1,
                top: 1,
                width: 1,
                height: 1
            }
        ],
        isDefaultForAllDisplays: true,
        noOfTiles: 2,
        isGrid: false,
        defaultForDisplays: []
    }
];

export const mockSources: Source[] = [
    {
        id: 548,
        name: "Auto_edited_src11",
        type: "Web",
        description: "Auto_edited_desc",
        snapshotPath: "",
        x: 0,
        y: 0,
        zOrder: -1,
        width: 100,
        height: 200,
        disabled: false,
        favorite: true,
        selected: true
    },
    {
        id: 549,
        name: "Manual_edited_src11",
        type: "Web",
        description: "Auto_edited_desc1",
        snapshotPath: "x/y/z",
        x: 10,
        y: 20,
        zOrder: -1,
        width: 200,
        height: 200,
        disabled: false,
        favorite: true,
        selected: false
    }
];

export const mockDisplay: any = {
    id: 1,
    name: "Display [AutoTestDisplay1]",
    type: "DisplayWall",
    description: "",
    snapshotPath: "display_snapshot.jpg",
    resolution: {
        width: 3200,
        height: 900
    },
    online: true,
    favorite: false,
    disabled: false,
    width: 1920,
    height: 1080,
    tiles: [],
    content: [
        {
            id: 7,
            name: "ECU-100: NOIVUL-ECU01: Analog: Bus-11 : Input-0",
            type: "Perspective",
            resourceId: 4,
            x: 0,
            y: 0,
            width: 1600,
            height: 900,
            snapshotPath: "display_snapshot.jpg",
            zOrder: 1
        },
        {
            id: 8,
            name: "ECU-100: NOIVUL-ECU01: Analog: Bus-11 : Input-1",
            type: "Perspective",
            resourceId: 5,
            x: 1600,
            y: 0,
            width: 1600,
            height: 900,
            snapshotPath: "display_snapshot.jpg",
            zOrder: 2
        }
    ]
};
