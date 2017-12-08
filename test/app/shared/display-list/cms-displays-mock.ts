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

