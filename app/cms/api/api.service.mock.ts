export const MockDisplayData: any = {
    "id": 9,
    "name": "Auditorium",
    "type": "DisplayWall",
    "description": "Auditorium\rNoida",
    "snapshotPath": "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fdisplays%2F17.jpeg",
    "resolution": {
        "width": 2048,
        "height": 1080
    },
    "online": false,
    "acknowledged": true,
    "computerName": "AudiComp",
    "tags": "",
    "startUpAction": "RestoreLastKnownConfiguration",
    "favorite": false,
    "loggedInUserName": ""
};

export const MockSourceListData: any = {
    "id": 113,
    "name": "Airport Entrance",
    "description": "",
    "type": "perspective",
    "width": 600,
    "height": 450,
    "snapshotPath": "https://10.98.0.231/mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F113.jpeg",
    "favorite": false
};

export const MockPutContentsOnDisplayData: any = {
    "resources": [
        {
            "id": 113,
            "name": "Airport Entrance",
            "description": "",
            "type": "perspective",
            "width": 600,
            "height": 450,
            "snapshotPath": "https://10.98.0.231/mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F113.jpeg&_=1510639368542",
            "favorite": false
        }
    ]
};

export const MockSelectedDisplayData: any = {
    "favorite": false,
    "id": 10,
    "name": "Conference Room",
    "description": "Customer and Demo Center\r2nd Floor, A Block, Noida\rFor meeting with guests",
    "snapshotPath": "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fdisplays%2F1.jpeg",
    "type": "DisplayWall",
    "online": false,
    "resolution": {
        "width": 3840,
        "height": 1080
    },
    "tiles": [
        {
            "left": 0,
            "top": 0,
            "width": 1920,
            "height": 540
        },
        {
            "left": 1920,
            "top": 0,
            "width": 1920,
            "height": 540
        },
        {
            "left": 960,
            "top": 540,
            "width": 1920,
            "height": 540
        }
    ],
    "content": [
        {
            "id": 484,
            "name": "Baggage Hall Cam 2",
            "type": "Perspective",
            "resourceId": 133,
            "x": 1920,
            "y": 0,
            "width": 1920,
            "height": 540,
            "snapshotPath": "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F133.jpeg",
            "zOrder": 1
        },
        {
            "id": 485,
            "name": "Airport Entrance",
            "type": "Perspective",
            "resourceId": 113,
            "x": 960,
            "y": 540,
            "width": 1920,
            "height": 540,
            "snapshotPath": "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F113.jpeg",
            "zOrder": 2
        }
    ],
    "tilerId": 25
};

export const MocksUerProfileSettingsData: any = {
    "language": "de",
    "wallConnection": {
        "startUpAction": "show-available-walls-list",
        "specificDisplay": "Coffee Corner",
        "recentDisplay": "Coffee Corner"
    },
    "sourceLabel": {
        "displaySourceNameLabels": true,
        "useMultipleLines": false,
        "fontColor": "#C62828",
        "fontSize": 20,
        "backgroundColor": "#81C784",
        "transparency": 10
    },
    "wallContent": {
        "requireConfirmationForLoadingLayouts": true,
        "allowChangingSources": true,
        "clipboardEnabled": true,
        "clipboardSize": "large"
    },
    "logOffTime": 0,
    "pageSize": 50
};