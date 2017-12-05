import { Source } from "../../../../app/cms/models/cms-source";

export const MockTilersData = [
    {
    "id": 66,
    "name": "TCR-01S",
    "description": "",
    "tags": "",
    "base": {
        "rowBound": 1,
        "colBound": 1
    },
    "tiles": [
        {
            "left": 0,
            "top": 0,
            "width": 1,
            "height": 1
        }
    ],
    "isDefaultForAllDisplays": true,
    "noOfTiles": 1,
    "isGrid": false,
    "defaultForDisplays": []
},
{
    "id": 69,
    "name": "TCR-04S",
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
    "noOfTiles": 2,
    "isGrid": false,
    "defaultForDisplays": []
}
];

export const MockDisplay = {
        "id": 1,
        "name": "Crisis room wall XYZ",
        "type": "DisplayWall",
        "description": "",
        "snapshotPath": "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fdisplays%2F1.jpeg",
        "resolution": {
            "width": 1920,
            "height": 1080
        },
        "online": true,
        "favorite": false,
        "disabled": false,
        "width": 1920,
        "height": 1080,
        "tiles": [],
        "content": []
    };

export const MockSources: Source[] = [
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
