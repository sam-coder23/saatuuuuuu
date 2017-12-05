import { CmsResource } from "../../../../app/cms/models/cms-resource";
import { IUserProfileSettings } from "../../../../app/cms/models/cms-user-profile-settings";

class MockDisplay extends CmsResource {
    type: string;
    online: boolean;
    resolution: {
        width: number;
        height: number;
    };
    width: number;
    height: number;
    tiles: any;
    content: any;
}

export const displays: MockDisplay[] = [
    {
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
    },
    {
        "id": 2,
        "name": "Crisis room wall ABC",
        "type": "DisplayWall",
        "description": "",
        "snapshotPath": "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fdisplays%2F1.jpeg",
        "resolution": {
            "width": 1920,
            "height": 1080
        },
        "online": true,
        "favorite": false,
        "disabled": true,
        "width": 1920,
        "height": 1080,
        "tiles": [],
        "content": []
    },
    {
        "id": 3,
        "name": "Crisis room wall 123",
        "type": "DisplayWall",
        "description": "",
        "snapshotPath": "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fdisplays%2F1.jpeg",
        "resolution": {
            "width": 1920,
            "height": 1080
        },
        "online": true,
        "favorite": true,
        "disabled": false,
        "width": 1920,
        "height": 1080,
        "tiles": [],
        "content": []
    },
    {
        "id": 4,
        "name": "Crisis room wall - jEFF",
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
    },
    {
        "id": 5,
        "name": "Crisis room wall -Commutor",
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
    },
    {
        "id": 6,
        "name": "Crisis room wall - Knight",
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
    }
];

export const settings: IUserProfileSettings = {
    "language": "en",
    "wallConnection": {
        "startUpAction": "show-available-walls-list",
        "specificDisplay": "Board Meeting Room",
        "recentDisplay": "Board Meeting Room"
    },
    "sourceLabel": {
        "displaySourceNameLabels": true,
        "useMultipleLines": false,
        "fontColor": "#FFFFFF",
        "fontSize": 14,
        "backgroundColor": "#BDBDBD",
        "transparency": 50
    },
    "logOffTime": 0,
    "pageSize": 3
};

