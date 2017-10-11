import { CmsResource } from "../../cms/models/cms-resource";
import { Tile } from "../../cms/models/cms-tile";

export const MockDisplay = [
    {
        "id": 31,
        "name": "DND!! AKAAR is working on this display. Display [NOICLT28523]",
        "type": "DisplayWall",
        "description": "",
        "snapshotPath": "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fdisplays%2Fdisplay-defaultimage.jpg&_=1507532920418",
        "resolution": {
            "width": 1920,
            "height": 1080
        },
        "online": false,
        "acknowledged": true,
        "computerName": "NOICLT28523",
        "tags": "",
        "startUpAction": "RestoreLastKnownConfiguration",
        "favorite": true,
        "loggedInUserName": "",
        "autoloadLayout": 0,
        "windowOption": "NoTitleBarAndNoResizableBorder",
        "vdsDisplay": false,
        "defaultAreaEnabled": false,
        "defaultArea": {
            "left": 0,
            "top": 0,
            "width": 0,
            "height": 0
        },
        "isDecoderDisplay": false,
        "sourceRoutingRequired": false,
        "tilerId": 10,
        "tiles": [
            {
                "left": 0,
                "top": 0,
                "width": 960,
                "height": 1080
            },
            {
                "left": 960,
                "top": 0,
                "width": 960,
                "height": 1080
            }
        ],
        "modules": [
            {
                "id": 93,
                "geometry": {
                    "left": 0,
                    "top": 0,
                    "width": 1920,
                    "height": 1080
                }
            }
        ]
    }
];

export const MockCmsResource: Array<CmsResource> = [
    {
        "id": 35,
        "name": "Auto_edited_src11",
        "description": "",
        //"type": "perspective",
        //"width": 600,
        //"height": 450,
        "snapshotPath": "https://10.98.0.231/mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F35.jpeg",
        "favorite": false,
        "disabled": false
    },
    {
        "id": 36,
        "name": "Auto_edited_src2",
        "description": "",
        // "type": "perspective",
        // "width": 600,
        // "height": 450,
        "snapshotPath": "https://10.98.0.231/mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F36.jpeg",
        "favorite": false,
        "disabled": false
    }
];

export const MockTilePreset = [
    {
        "id": 9,
        "name": "1x1",
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
        "isDefault": false,
        "noOfTiles": 1,
        "isGrid": false
    },
    {
        "id": 10,
        "name": "2x1",
        "description": "",
        "tags": "",
        "base": {
            "rowBound": 1,
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
            }
        ],
        "isDefault": false,
        "noOfTiles": 2,
        "isGrid": false
    }
]

export const MockMiniDisplayContents = [
    {
        "id": 21,
        "name": "Axis: 10.99.20.40: Video",
        "type": "Perspective",
        "resourceId": 19,
        "x": 50.42056074766355,
        "y": 0.7476635514018692,
        "width": 49.1588785046729,
        "height": 98.50467289719627,
        "snapshotPath": "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F2.jpeg",
        "zOrder": 2,
        "absoluteSize": {
            "x": 960,
            "y": 0,
            "width": 960,
            "height": 1080
        },
        "lastModified": "1507527531431",
        "description": "",
        "disabled": false,
        "favorite": false
    },
    {
        "id": 33,
        "name": "Auto_edited_src11",
        "type": "Perspective",
        "resourceId": 35,
        "x": 0.4205607476635514,
        "y": 0.7476635514018692,
        "width": 49.1588785046729,
        "height": 98.50467289719627,
        "snapshotPath": "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F35.jpeg",
        "zOrder": 1,
        "absoluteSize": {
            "x": 0,
            "y": 0,
            "width": 960,
            "height": 1080
        },
        "lastModified": "1507527531431",
        "description": "",
        "disabled": false,
        "favorite": false
    }
];

export const MockMiniDisplayTiler = [
    {
        "x": null,
        "y": null,
        "width": 49.1588785046729,
        "height": 98.50467289719627
    },
    {
        "x": null,
        "y": null,
        "width": 49.1588785046729,
        "height": 98.50467289719627
    }
];

export const MockDisplayTiler = [ new Tile(
    {
        "left": 0,
        "top": 0,
        "width": 960,
        "height": 1080
    }),
    new Tile({
        "left": 960,
        "top": 0,
        "width": 960,
        "height": 1080
    })
];