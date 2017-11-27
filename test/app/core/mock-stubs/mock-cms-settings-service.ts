import { CmsSettingsService } from "../../../../app/launchpad/settings/cms-settings.service";
import { Subject } from "rxjs";
import { IUserProfileSettings } from "../../../../app/cms/models/cms-user-profile-settings";

export class MockCmsSettingsServiceStub {
   public userSettings: IUserProfileSettings;
   public longPressedSubject: Subject<boolean> = new Subject<boolean>();
   public selectedSources = [];

    constructor() {

    }

    updateIsLongPress(state: boolean) { }
}