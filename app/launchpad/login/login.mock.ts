import { UserConfig } from "../models/cms-user.model";
import { IUserProfileSettings } from "../../cms/models/cms-user-profile-settings";

export const MockUser: UserConfig = {
    username: "bcd-se-test",
    password: "bcdsetest"
}

export const MockUserProfileSettings: IUserProfileSettings = {
  "language": "en",
  "wallConnection": {
    "atStartup": {
      "status": "show-available-walls-list",
      "selectedDisplayId": 50,
      "recentDisplayId": 50
    }
  },
  "sourceLabels": {
    "displaySourceNameLabels": true,
    "useMultipleLines": false,
    "fontColor": "#FFFFFF",
    "fontSize": 14,
    "background": "#BDBDBD",
    "transparency": 50
  },
  "manageWallContent": {
    "requireConfirmationforLoadingLayouts": true,
    "allowChangingSources": true,
    "clipboard": {
      "isEnabled": true,
      "status": "large"
    }
  },
  "logOffTime": 0,
  "defaultPageSize": 50
}

export const MoclLicenseinfo = {
    licenseinfo: {
        localization: false
    }
}