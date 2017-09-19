import { ITilePreset } from "../../cms/models/cms-tile-preset";

export const TILE_PRESET: ITilePreset = {
    "id": 611,
    "name": "2*2",
    "description": "",
    "tags": "",
    "base": {
        "rowBound": 4,
        "colBound": 4
    },
    "tiles": [
        {
            "left": 0,
            "top": 0,
            "width": 2,
            "height": 2
        },
        {
            "left": 2,
            "top": 0,
            "width": 2,
            "height": 2
        },
        {
            "left": 0,
            "top": 2,
            "width": 2,
            "height": 2
        },
        {
            "left": 2,
            "top": 2,
            "width": 2,
            "height": 2
        }
    ],
    "isDefault": false,
    "noOfTiles": 4,
    "isGrid": false
}

