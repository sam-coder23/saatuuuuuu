import { ITilePreset } from "../../../../app/cms/models/cms-tile-preset";

/**
 * DO NOT CHANGE THE INDEX OF THE TILE-PRESETS IN THE ARRAY BELOW
 */
export const TilePresets: ITilePreset[] = [
    {
        "id": 1,
        "name": "2*1",
        "description": "",
        "tags": "",
        "base": {
            "rowBound": 1, // height
            "colBound": 2 // width
        },
        "tiles": [
            {
                "left": 0,
                "top": 0,
                "width": 1,
                "height": 1
            },
            {
                "left": 1,
                "top": 0,
                "width": 1,
                "height": 1
            }
        ],
        "isDefaultForAllDisplays": false,
        "noOfTiles": 2,
        "isGrid": false
    },
    {
        "id": 2,
        "name": "2x2",
        "description": "",
        "tags": "",
        "base": {
            "rowBound": 2,
            "colBound": 2
        },
        "tiles": [
            {
                "left": 0,
                "top": 0,
                "width": 1,
                "height": 1
            },
            {
                "left": 1,
                "top": 0,
                "width": 1,
                "height": 1
            },
            {
                "left": 0,
                "top": 1,
                "width": 1,
                "height": 1
            },
            {
                "left": 1,
                "top": 1,
                "width": 1,
                "height": 1
            }
        ],
        "isDefaultForAllDisplays": true,
        "noOfTiles": 4,
        "isGrid": false
    },
    {
        "id": 3,
        "name": "2x3",
        "description": "",
        "tags": "",
        "base": {
            "rowBound": 2,
            "colBound": 2
        },
        "tiles": [
            {
                "left": 0,
                "top": 0,
                "width": 1,
                "height": 1
            },
            {
                "left": 1,
                "top": 0,
                "width": 1,
                "height": 1
            },
            {
                "left": 0,
                "top": 1,
                "width": 1,
                "height": 1
            },
            {
                "left": 1,
                "top": 1,
                "width": 1,
                "height": 1
            }
        ],
        "isDefaultForAllDisplays": false,
        "noOfTiles": 6,
        "isGrid": false,
        "defaultForDisplays": [56, 1]
    },
    {
        "id": 4,
        "name": "2*1-default",
        "description": "",
        "tags": "",
        "base": {
            "rowBound": 1, // height
            "colBound": 2 // width
        },
        "tiles": [
            {
                "left": 0,
                "top": 0,
                "width": 1,
                "height": 1
            },
            {
                "left": 1,
                "top": 0,
                "width": 1,
                "height": 1
            }
        ],
        "isDefaultForAllDisplays": true,
        "noOfTiles": 2,
        "isGrid": false
    },
]