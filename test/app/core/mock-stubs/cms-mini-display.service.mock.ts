/**
 * Mock data for mini display service.
 */
import { Display } from "../../../../app/cms/models/cms-display";
import { Tile } from "../../../../app/cms/models/cms-tile";
import { TileContent } from "../../../../app/cms/models/cms-tile-content";

const mockDisplay1: Display = {
    type: "DisplayWall",
    id: 31,
    name: "Coffee Corner",
    description: "A Block Noida",
    snapshotPath: "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fdisplays%2F26.jpeg",
    resolution: {
        width: 1920,
        height: 1200
    },
    online: false,
    favorite: false,
    disabled: false,
    width: 1920,
    height: 1200,
    tilerId: 24,
    tiles: [
        {
            left: 0,
            top: 0,
            width: 960,
            height: 1200,
            x: 0,
            y: 0
        },
        {
            left: 960,
            top: 0,
            width: 960,
            height: 1200,
            x: 0,
            y: 0
        }
    ],
    content: [
        {
            id: 279,
            name: "Baggage Hall Cam 1",
            type: "Perspective",
            resourceId: 8,
            description: " ",
            disabled: false,
            width: 960,
            height: 1200,
            snapshotPath: "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F145.jpeg",
            zOrder: 1,
            lastModified: "",
            absoluteSize: {
                left: 960,
                top: 0,
                width: 960,
                height: 1200,
                x: 0,
                y: 0
            },
            x: 0,
            y: 0,
            favorite: true
        },
        {
            id: 306,
            name: "Airport Entrance",
            type: "Perspective",
            description: " ",
            resourceId: 86,
            disabled: false,
            width: 960,
            height: 1200,
            snapshotPath: "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F86.jpeg",
            zOrder: 2,
            lastModified: "",
            absoluteSize: {
                left: 960,
                top: 0,
                width: 960,
                height: 1200,
                x: 0,
                y: 0
            },
            x: 0,
            y: 0,
            favorite: true
        }
    ]
};

const expectedMiniDisplayResponse1: any = {
    displaySize: {
        height: 1200,
        width: 1920
    },
    miniDisplayTilerList: [
        new Tile({
            width: 48.938428874734605,
            height: 98.30148619957538,
            left: 0.5307855626326964,
            top: 0.8492569002123143
        }),
        new Tile({
            width: 48.938428874734605,
            height: 98.30148619957538,
            left: 50.530785562632694,
            top: 0.8492569002123143
        })
    ],
    miniDisplayContentList: [
        new TileContent({
            id: 279,
            name: "Baggage Hall Cam 1",
            type: "Perspective",
            resourceId: 8,
            disabled: false,
            favorite: true,
            description: " ",
            x: 0.5307855626326964,
            y: 0.8492569002123143,
            width: 48.938428874734605,
            height: 98.30148619957538,
            snapshotPath: "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F145.jpeg",
            zOrder: 1,
            absoluteSize: new Tile({
                width: 960,
                height: 1200,
                left: 0,
                top: 0
            }),
            lastModified: Date.now().toString()
        }),
        new TileContent({
            id: 306,
            name: "Airport Entrance",
            type: "Perspective",
            resourceId: 86,
            x: 0.5307855626326964,
            y: 0.8492569002123143,
            width: 48.938428874734605,
            height: 98.30148619957538,
            snapshotPath: "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F86.jpeg",
            zOrder: 2,
            disabled: false,
            favorite: true,
            description: " ",
            absoluteSize: new Tile({
                width: 960,
                height: 1200,
                left: 0,
                top: 0
            }),
            lastModified: Date.now().toString()
        })
    ],
    displayTilerList: [
        new Tile({
            left: 0,
            top: 0,
            width: 960,
            height: 1200
        }),
        new Tile({
            left: 960,
            top: 0,
            width: 960,
            height: 1200
        })
    ],
    miniDisplaySize: {
        height: 471,
        width: 753.6
    }
};

/**
 *  mockDisplay2 and expectedMiniDisplayResponse2 data is for the use case,
 *  when display width is more than height
 */
const mockDisplay2: Display = {
    favorite: false,
    id: 9,
    name: "Control Room",
    description: "Ground Floor",
    snapshotPath: "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fdisplays%2F31.jpeg",
    type: "DisplayWall",
    online: false,
    disabled: false,
    resolution: {
        width: 7680,
        height: 2280
    },
    width: 1920,
    height: 1200,
    tilerId: 24,
    tiles: [
        {
            width: 3840,
            height: 2280,
            left: 0,
            top: 0,
            x: 0,
            y: 0
        },
        {
            width: 3840,
            height: 2280,
            left: 3840,
            top: 0,
            x: 0,
            y: 0
        }
    ],
    content: [
        {
            id: 351,
            name: "Baggage Hall Cam 1",
            snapshotPath: "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F145.jpeg",
            type: "Perspective",
            description: "ABC",
            disabled: false,
            x: 3840,
            y: 0,
            zOrder: 1,
            width: 3840,
            height: 2280,
            lastModified: "",
            resourceId: 8,
            absoluteSize: {
                left: 960,
                top: 0,
                width: 960,
                height: 1200,
                x: 0,
                y: 0
            },
            favorite: true
        },
        {
            id: 352,
            name: "Airport Entrance",
            snapshotPath: "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F86.jpeg",
            type: "Perspective",
            description: "123",
            disabled: false,
            x: 0,
            y: 0,
            zOrder: 2,
            width: 3840,
            lastModified: "",
            height: 2280,
            resourceId: 86,
            absoluteSize: {
                left: 960,
                top: 0,
                width: 960,
                height: 1200,
                x: 0,
                y: 0
            },
            favorite: true
        }
    ]
};

const expectedMiniDisplayResponse2: any = {
    displaySize: {
        height: 2280,
        width: 7680
    },
    miniDisplayTilerList: [
        new Tile({
            width: 49.38603223330775,
            height: 97.93189804903663,
            left: 0.30698388334612436,
            top: 1.034050975481682
        }),
        new Tile({
            width: 49.38603223330775,
            height: 97.93189804903663,
            left: 50.30698388334613,
            top: 1.034050975481682
        })
    ],
    miniDisplayContentList: [
        new TileContent({
            id: 351,
            name: "Baggage Hall Cam 1",
            snapshotPath: "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F145.jpeg",
            type: "Perspective",
            x: 50.30698388334613,
            y: 1.034050975481682,
            zOrder: 1,
            width: 49.38603223330775,
            height: 97.93189804903663,
            resourceId: 8,
            disabled: false,
            favorite: true,
            description: "ABC",
            lastModified: Date.now().toString(),
            absoluteSize: {
                width: 3840,
                height: 2280,
                left: 3840,
                top: 0
            }
        }),
        new TileContent({
            id: 352,
            name: "Airport Entrance",
            snapshotPath: "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F86.jpeg",
            type: "Perspective",
            x: 0.30698388334612436,
            y: 1.034050975481682,
            zOrder: 2,
            width: 49.38603223330775,
            height: 97.93189804903663,
            resourceId: 86,
            disabled: false,
            favorite: true,
            description: "123",
            lastModified: Date.now().toString(),
            absoluteSize: {
                width: 3840,
                height: 2280,
                left: 0,
                top: 0
            }
        })
    ],
    displayTilerList: [
        new Tile({
            width: 3840,
            height: 2280,
            left: 0,
            top: 0
        }),
        new Tile({
            width: 3840,
            height: 2280,
            left: 3840,
            top: 0
        })
    ],
    miniDisplaySize: {
        height: 386.828125,
        width: 1303
    }
};

export { mockDisplay1, mockDisplay2, expectedMiniDisplayResponse1, expectedMiniDisplayResponse2 };
