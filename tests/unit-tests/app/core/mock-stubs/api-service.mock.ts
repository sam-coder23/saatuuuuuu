/**
 * Api Service Mock api data.
 */
export const mockDisplayData: any = [
    {
        id: 9,
        name: "Auditorium",
        type: "DisplayWall",
        description: "Auditorium\rNoida",
        snapshotPath: "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fdisplays%2F17.jpeg",
        resolution: {
            width: 2048,
            height: 1080
        },
        online: false,
        acknowledged: true,
        computerName: "AudiComp",
        tags: "",
        startUpAction: "RestoreLastKnownConfiguration",
        favorite: false,
        loggedInUserName: ""
    }
];

export const mockSourceListData: any = {
    id: 113,
    name: "Airport Entrance",
    description: "",
    type: "perspective",
    width: 600,
    height: 450,
    snapshotPath: "https://10.98.0.231/mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F113.jpeg",
    favorite: false
};

export const mockPutContentsOnDisplayData: any = {
    resources: [
        {
            id: 113,
            name: "Airport Entrance",
            description: "",
            type: "perspective",
            width: 600,
            height: 450,
            snapshotPath: "https://10.98.0.231/mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F113.jpeg&_=1510639368542",
            favorite: false
        }
    ]
};

export const mockSelectedDisplayData: any = {
    favorite: false,
    id: 10,
    name: "Conference Room",
    description: "Customer and Demo Center\r2nd Floor, A Block, Noida\rFor meeting with guests",
    snapshotPath: "display_snapshot.jpg",
    type: "DisplayWall",
    online: false,
    resolution: {
        width: 3840,
        height: 1080
    },
    tiles: [
        {
            left: 0,
            top: 0,
            width: 1920,
            height: 540
        },
        {
            left: 1920,
            top: 0,
            width: 1920,
            height: 540
        },
        {
            left: 960,
            top: 540,
            width: 1920,
            height: 540
        }
    ],
    content: [
        {
            id: 484,
            name: "Baggage Hall Cam 2",
            type: "Perspective",
            resourceId: 133,
            x: 1920,
            y: 0,
            width: 1920,
            height: 540,
            snapshotPath: "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F133.jpeg",
            zOrder: 1
        },
        {
            id: 485,
            name: "Airport Entrance",
            type: "Perspective",
            resourceId: 113,
            x: 960,
            y: 540,
            width: 1920,
            height: 540,
            snapshotPath: "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F113.jpeg",
            zOrder: 2
        }
    ],
    tilerId: 25
};

export const mocksUerProfileSettingsData: any = {
    language: "de",
    wallConnection: {
        startUpAction: "show-available-walls-list",
        specificDisplay: "Coffee Corner",
        recentDisplay: "Coffee Corner"
    },
    sourceLabel: {
        displaySourceNameLabels: true,
        useMultipleLines: false,
        fontColor: "#C62828",
        fontSize: 20,
        backgroundColor: "#81C784",
        transparency: 10
    },
    wallContent: {
        requireConfirmationForLoadingLayouts: true,
        allowChangingSources: true,
        clipboardEnabled: true,
        clipboardSize: "large"
    },
    logOffTime: 0,
    pageSize: 50
};

export const mockServerInfoData: any = {
    ServerInfo: {
        ip: "10.98.0.231",
        version: "0.70.37 Build 0130"
    },
    LicenseInfo: {
        customerName: "CMS Evaluation",
        projectName: "CMS Evaluation",
        licenseStatus: "EvaluationLicense",
        daysRemaining: 6,
        localization: 1
    }
};

export const mockTilerData: any = [{
        id: 23,
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
    }
];

export const mockGeometryContentForDisplay: any = {
    id: 35,
    name: "2 Ragu Perspective",
    type: "Perspective",
    resourceId: 75,
    snapshotPath: "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F469.jpeg",
    zOrder: 1,
    x: 0,
    y: 0,
    width: 1024,
    height: 1080
};

export const mockPerspectivesPostedData: any = [
    {
        verb: "posted",
        uri: "/perspectives",
        body: {
        }
    }
];

export const mockPerspectivesDeletedData: any = [
    {
        verb: "deleted",
        uri: "/perspectives",
        body: {
        }
    }
];

export const mockPerspectivesPutData: any = [
    {
        verb: "put",
        uri: "/perspectives/25",
        body: {
            type: "Perspective"
        }
    }
];
export const mockDisplaysPostData: any[] = [
    {
        verb: "posted",
        uri: "/displays"
    }
];
export const mockDisplaysDeleteData: any[] = [
    {
        verb: "deleted",
        uri: "/displays"
    }
];
export const mockUpdateSingleDisplayData: any[] = [
    {
        verb: "PUT",
        uri: "/displays/1"
    }
];
export const mockupdateDisplayContentData: any[] = [
    {
        verb: "PUT",
        uri: "/displays/1/content"
    }
];
export const mockupdateDisplayContentElement: any[] = [
    {
        verb: "PUT",
        uri: "/displays/1/content/1"
    }
];

export const mockAddSingleAppData: any[] = [
    {
        verb: "posted",
        uri: "/displays/1/applications"
    }
];

export const mockDeletedSingleAppData: any[] = [
    {
        verb: "deleted",
        uri: "/displays/1/applications"
    }
];
export const mockUpdateDisplaySingleAppData: any[] = [
    {
        verb: "put",
        uri: "/displays/1/applications/1",
        body: {
            type: "Application"
        }
    }
];

export const mockAddSourceData: any[] = [
    {
        verb: "posted",
        uri: "/sources",
        body: {
        }
    }
];
export const mockDeleteSourceData: any[] = [
    {
        verb: "deleted",
        uri: "/sources",
        body: {
        }
    }
];
export const mockUpdateSingleSourceData: any[] = [
    {
        verb: "put",
        uri: "/sources/1",
        body: {
        }
    }
];

export const mockSystemEventData: any[] = [
    {
        verb: "posted",
        uri: "/system",
        body: {
            eventName: "DatabaseResetStarted"
        }
    }
];

export const mockUpdateHandleUserEventsData: any[] = [
    {
        verb: "put",
        uri: "/users/current",
        body: [{
            name: "bcd-se-test"
        }]
    }
];
export const mockDeleteHandleUserEventsData: any[] = [
    {
        verb: "deleted",
        uri: "/users/current",
        body: {
            name: "bcd-se-test"
        }
    }
];

export const mockAddTilerEventData: any[] = [
    {
        verb: "posted",
        uri: "/tilers",
        body: {
        }
    }
];

export const mockDeleteTilerEventData: any[] = [
    {
        verb: "deleted",
        uri: "/tilers",
        body: {
        }
    }
];
export const mockUpdateTilerEventData: any[] = [
    {
        verb: "put",
        uri: "/tilers/1",
        body: {
        }
    }
];
