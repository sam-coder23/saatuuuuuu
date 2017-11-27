import { UserConfig } from "../../../../app/launchpad/models/cms-user.model";
import { IUserProfileSettings } from "../../../../app/cms/models/cms-user-profile-settings";

export const MockUser: UserConfig = {
    username: "bcd-se-test",
    password: "bcdsetest"
}

export const MockUserProfileSettings: IUserProfileSettings = {
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
    "pageSize": 50
}

export const MoclLicenseinfo = {
    licenseinfo: {
        localization: false
    }
}