/**
 * Mock data for mockDisplay, mock TileList and Mock SourceList
 */
import { Display } from "../../../../app/cms/models/cms-display";
import { CmsResource } from "../../../../app/cms/models/cms-resource";
import { Tile } from "../../../../app/cms/models/cms-tile";

export const resource: CmsResource = {
    id: 8,
    name: "NGPWall",
    description: "Some description.",
    snapshotPath: "",
    disabled: false,
    favorite: false
};

export const tile: Tile = {
    x: 0.7279344858962693,
    y: 1.380379469551444,
    width: 2048,
    height: 1080
};

export const mockDisplays: Display[] = [
    {
        type: "NGPWall",
        id: 1,
        name: "NoidaWall",
        description: "desc",
        snapshotPath: "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fdisplays%2Fdisplay-defaultimage.jpg",
        resolution: {
            width: 1280,
            height: 1024
        },
        online: true,
        content: [],
        favorite: true,
        tilerId: 1,
        tiles: [],
        width: 1920,
        height: 1000,
        disabled: false
    },
    {
        id: 46,
        name: "ngp_display",
        type: "NGPWall",
        description: "dadassdas",
        snapshotPath: "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fdisplays%2Fdisplay-defaultimage.jpg",
        resolution: {
            width: 1280,
            height: 1024
        },
        width: 1920,
        height: 1000,
        online: false,
        favorite: true,
        tilerId: 12,
        tiles: [],
        content: [],
        disabled: false
    }
];

const sources: any[] = [
    {
        id: 34,
        name: "DefaultProSource[workstation1113]",
        description: "",
        type: "perspective",
        width: 600,
        height: 450,
        snapshotPath: "https://10.98.0.231/mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F18.jpeg",
        favorite: false
    },
    {
        id: 555,
        name: "DefaultProSource[workstation1114221]",
        description: "",
        type: "source",
        width: 200,
        height: 200,
        snapshotPath: "https://10.98.0.231/mediaconfiguration?action=get&path=images%2Fsnapshots%2Fsources%2Fsource-defaultimage.jpg",
        favorite: true
    }
];

export const sessionStorageMock: any = {
    userKey: "_User",
    userValue: {
        username: "bcd-se-test",
        loggedIn: true
    },
    settingKey: "_Settings",
    settingValue: {
        language: "en",
        wallConnection: {
            atStartup: {
                status: "show-available-walls-list",
                selectedDisplayId: 31,
                recentDisplayId: 34
            }
        },
        sourceLabels: {
            displaySourceNameLabels: true,
            useMultipleLines: false,
            fontColor: "#FFFFFF",
            fontSize: 14,
            background: "#BDBDBD",
            transparency: 50
        },
        logOffTime: 0,
        defaultPageSize: 50
    },
    displayKey: "_Display",
    displayValue: {
        id: 34,
        name: "NGP_Display1513",
        type: "OperatorWorkStation",
        description: "operator computer1513",
        snapshotPath: "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fdisplays%2Fdisplay-defaultimage.jpg&_=1507287494621",
        resolution: {
            width: 1600,
            height: 1440
        },
        online: false,
        acknowledged: true,
        computerName: "workstation1513",
        tags: "",
        startUpAction: "DefaultBehaviourAction",
        favorite: false,
        loggedInUserName: "",
        squidModeConfiguration: {
            id: 0,
            enabled: false,
            hoverDelay: 500,
            borderWidth: 2,
            leftSource: undefined,
            rightSource: undefined,
            topSource: undefined,
            bottomSource: undefined
        },
        autoloadPerspective: 0,
        modules: [
            {
                id: 38,
                geometry: {
                    left: 0,
                    top: 0,
                    width: 1600,
                    height: 1200
                }
            },
            {
                id: 39,
                geometry: {
                    left: 0,
                    top: 240,
                    width: 1600,
                    height: 1200
                }
            },
            {
                id: 40,
                geometry: {
                    left: 0,
                    top: 120,
                    width: 1600,
                    height: 1200
                }
            }
        ]
    },
    userLastActionTimeKey: "_UserLastActionTime",
    userLastActionTimeValue: 1507289580624,
    sourcesSearchFilterKey: "_SourcesSearchFilter",
    sourcesSearchFilterValue: "Noida Demo Room",
    sourcesFavoriteFilterKey: "_SourcesFavoriteFilter",
    sourcesFavoriteFilterValue: true
};

export const settingsMock: any = {
    language: "en",
    wallConnection: {
        startUpAction: "auto-connect-to-specific-wall",
        specificDisplay: "Auditorium",
        recentDisplay: "Board Meeting Room"
    },
    sourceLabel: {
        displaySourceNameLabels: true,
        useMultipleLines: false,
        fontColor: "#E57373",
        fontSize: 16,
        backgroundColor: "#4FC3F7",
        transparency: 50
    },
    wallContent: {
        requireConfirmationForLoadingLayouts: false,
        allowChangingSources: false,
        clipboardEnabled: false,
        clipboardSize: "large"
    },
    logOffTime: 0,
    pageSize: 20
};
