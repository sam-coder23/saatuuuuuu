import { CmsSettingsService } from "../../launchpad/settings/cms-settings.service";
import { IUserProfileSettings } from "../../cms/models/cms-user-profile-settings";
import { Subject } from "rxjs";

export class MockCmsSettingsServiceStub {
   public userSettings: IUserProfileSettings;
   public longPressedSubject: Subject<boolean> = new Subject<boolean>();
   public selectedSources = [];

    constructor() {

    }

    updateIsLongPress(state: boolean) { }
}