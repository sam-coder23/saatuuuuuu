import { ITilePreset } from "../../cms/models/cms-tile-preset";

export const TilePresets: ITilePreset[] = [{
    "id": 1,
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
},

{
    "id": 2,
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
    "isDefault": false,
    "noOfTiles": 2,
    "isGrid": false
}]