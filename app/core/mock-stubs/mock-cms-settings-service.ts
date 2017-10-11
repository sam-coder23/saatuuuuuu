import { CmsSettingsService } from "../../launchpad/settings/cms-settings.service";
import { IUserProfileSettings } from "../../cms/models/cms-user-profile-settings";

export class MockCmsSettingsServiceStub {
    mUserSettings: IUserProfileSettings;
    constructor() {

    }
}