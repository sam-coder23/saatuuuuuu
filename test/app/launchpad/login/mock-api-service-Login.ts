/**
 * This class is mock for cms api service for Login component
 */
import { Observable } from "rxjs/Observable";

import { CMSConstants } from "../../../../app/cms/models/cms-constants";
import { IUserProfileSettings } from "../../../../app/cms/models/cms-user-profile-settings";
import { User } from "../../../../app/cms/models/cms-user.model";
import { MockLicenseInfo, MockUser, MockUserProfileSettings } from "./../../core/mock-stubs/login.mock";

export class MockCmsApiService {
    public login(mockUser: User): Observable<any> {
        const response: any = {
            error: {
                status: 0
            }
        };

        if (mockUser.username === MockUser.username && mockUser.password === MockUser.password) {
            return Observable.of(MockUser);
        } else if (mockUser.username === "license-error") {
            response.error.status = CMSConstants.ERRORCODE.LICENSE_ERROR;
        } else if (mockUser.username === "settings-error") {
            response.error.status = CMSConstants.ERRORCODE.SETTING_ERROR;
        } else if (mockUser.username === "user-disabled-error") {
            response.error.status = CMSConstants.ERRORCODE.USER_DISABLED;
        } else if (mockUser.username === "server-unavailable-error") {
            response.error.status = CMSConstants.ERRORCODE.SERVER_UNAVAILABLE;
        } else if (mockUser.username === "not-found-error") {
            response.error.status = CMSConstants.ERRORCODE.NOT_FOUND;
        } else if (mockUser.username === "server-not-ready-error") {
            response.error.status = CMSConstants.ERRORCODE.SERVER_ERROR;
        } else if (mockUser.username === "other-error") {
            response.error.status = CMSConstants.ERRORCODE.OTHER_ERROR;
        }

        return Observable.throw(response.error);
    }

    public keepSessionAlive() : void {
        // No code required as it is mock
    }

    public getUserProfileSettings(): Promise<IUserProfileSettings> {
        return Promise.resolve(MockUserProfileSettings);
    }

    public updateUserProfileSettings(): Promise<IUserProfileSettings> {
        return Promise.resolve(MockUserProfileSettings);
    }

    public getSystemInfo(): Observable<any> {
        return Observable.of(MockLicenseInfo);
    }

    public logout(): Observable<any> {
        return Observable.of("LOGOUT");
    }

    public performOnlogout(): void {
        // new StorageManager().removeStorage();
        // router.navigate(["/login"]);
    }

    public makeSessionExpire(): void {
         //no code required here.
    }
}
