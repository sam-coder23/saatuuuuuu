/**
 * Mock data for login component.
 */
import { IUserProfileSettings } from "../../../../app/cms/models/cms-user-profile-settings";
import { IUserConfig } from "../../../../app/cms/models/cms-user.model";

export const mockUser: IUserConfig = {
    username: "bcd-se-test",
    password: "bcdsetest"
};

export const mockUserProfileSettings: IUserProfileSettings = {
    language: "en",
    wallConnection: {
        startUpAction: "show-available-walls-list",
        specificDisplay: "Board Meeting Room",
        recentDisplay: "Board Meeting Room"
    },
    sourceLabel: {
        displaySourceNameLabels: true,
        useMultipleLines: false,
        fontColor: "#FFFFFF",
        fontSize: 14,
        backgroundColor: "#BDBDBD",
        transparency: 50
    },
    logOffTime: 0,
    pageSize: 50
};

export const mockLicenseInfo: any = {
    licenseinfo: {
        localization: false
    }
};
