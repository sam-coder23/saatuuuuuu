import { CmsSettingsService } from "../../launchpad/settings/cms-settings.service";
import { IUserProfileSettings } from "../../cms/models/cms-user-profile-settings";
import { Subject } from "rxjs";

export class MockCmsSettingsServiceStub {
    mUserSettings: IUserProfileSettings;
    longPressedSubject: Subject<boolean> = new Subject<boolean>();

    constructor() {

    }

    updateIsLongPress(state: boolean) { }
}