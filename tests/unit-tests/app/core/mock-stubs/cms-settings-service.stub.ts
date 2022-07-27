/**
 * Mock stubs for CmsSettingsService
 */
import { Subject } from "rxjs";

import { IUserProfileSettings } from "../../../../app/cms/models/cms-user-profile-settings";

export class MockCmsSettingsServiceStub {
    public userSettings: IUserProfileSettings;
    public longPressedSubject: Subject<boolean> = new Subject<boolean>();
    public selectedSources: any[] = [];

    constructor() {
        const a: string = "1";
    }
    public updateIsLongPress(state: boolean): any {
        return undefined;
    }
}
