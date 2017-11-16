import { TestBed, inject, async, fakeAsync, tick } from "@angular/core/testing";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Router } from "@angular/router";
import { MockBackend, MockConnection } from "@angular/http/testing";
import { HttpModule, Http, BaseRequestOptions, XHRBackend, ResponseOptions, Response } from "@angular/http";

import { CmsApiService } from "./cms-api.service";
import { CMS_EVENTS } from "./cms-events.enum";
import { CmsEventEmitterService } from "./cms-event-emitter.service";
import { Display } from "../models/cms-display";
import { Source } from "../models/cms-source";
import { ICmsEvent } from "../models/cms-event";
import { Tile } from "./../models/cms-tile";
import { UserConfig, User } from "../../launchpad/models/cms-user.model";
import { APIRequest } from "./api-request";
import { IUserProfileSettings } from "../models/cms-user-profile-settings";
import { StorageManager } from "./cms-storagemanager.service";
import { AppConfig } from "../../config";
import { CMS_SESSION_STORAGE_ITEM } from "../models/cms-session-storage-item";
import { ITilePreset } from "../models/cms-tile-preset";
import { Validation } from "../../core/util/Validation";

import { CmsLanguages } from "../../i18n/cms-languages";
import { CMSConstants } from "../../cms/models/cms-constants";
import { Observable } from "rxjs/Observable";
import {MockDisplayData, MockSourceListData, MockPutContentsOnDisplayData, MockSelectedDisplayData, MocksUerProfileSettingsData} from "./api.service.mock";

let spyRouter = {
    navigate: jasmine.createSpy("APIService")
};



describe("Service: CmsApiService", () => {
    let cmsApiService: CmsApiService;
    let apiRequest: APIRequest
    let appConfig: AppConfig;
    let translate: TranslateService;
    let storageManager: StorageManager;
    let mockbackend;

    beforeEach(async(() =>
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                MockBackend,
                StorageManager,
                BaseRequestOptions, 
                APIRequest,
                AppConfig,
                {
                    deps: [
                        MockBackend,
                        BaseRequestOptions
                    ],
                    provide: Http,
                    useFactory: (mockBackend: MockBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(mockBackend, defaultOptions);
                    }
                },
                {
                    provide: Router,
                    useValue: spyRouter
                }
            ]
        })));

    beforeEach(inject([Http, Router, APIRequest, StorageManager, AppConfig, MockBackend], (http, router, apiRequest, storageManager, appConfig, mb) => {
        appConfig = appConfig;
        translate = translate;
        storageManager = storageManager;
        router = router;
        apiRequest = APIRequest;
        mockbackend = mb;
        apiRequest = new APIRequest(http, router, appConfig);
        cmsApiService = new CmsApiService(http, router, apiRequest, storageManager, appConfig);
    }));

    //SERVICE DEFINED
    it("should be defined", async(() => {
        expect(cmsApiService).toBeDefined();
    }));

    //USER LOGIN REQUEST TO CMS SERVER
    it("Should be able to login to CMS Server", async(() => {
        let requestBody = { "username": "bcd-se-test", "password": "bcdsetest" };
        let responseBody: any = { "Message": "Login Successful" };
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        let user = new User(requestBody);
        cmsApiService.login(user).subscribe(data => {
            expect(responseBody).toEqual(data);
        });
    }));

    //USER LOGOUT REQUEST TO CMS SERVER
    it("Should be able to logout to CMS Server", async(() => {
        let responseBody: any = { "Message": "Logout Sucessfull" };
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.logout().subscribe(data => {
            expect(responseBody).toEqual(data);
        });
    }));

    //CLEAR SESSION AND NAVIGATE TO LOGIN ON LOGOUT CALL.
    it("Should performs clear sessionstorage on logout call and navigates user to login page ", () => {
        cmsApiService.performOnlogout();
        expect(spyRouter.navigate).toHaveBeenCalledWith(["/login"]);
    });

    //RETURN DISPLAY LIST FROM SERVER
    it("Should return display list from CMS Server ", async(() => {
        let responseBody = MockDisplayData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getDisplayList().subscribe(data => {
            let displayData = new Display(data);
            expect(responseBody).toEqual(data);
        });
    }));

    //RETURN SOURCE LIST FROM SERVER
    it("Should return source list from CMS Server ", () => {
        let responseBody = MockSourceListData;
        let start: number = 1;
        let count: number = 1;
        let aDisplayId: number = 9; 
        let search: string = "";
        let favorite: boolean = false;

        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getSourceList(start, count, aDisplayId, search, favorite).subscribe(data => {
            expect(data).toEqual(responseBody);
        });

    });

    //PUT CONTENTS ON DISPLAY
    it("Should return contents for display ", () => {
        let responseBody = MockPutContentsOnDisplayData;
        let displayId: number = 18;
        let tilerId: number = 23;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.putContentsOnDisplay(displayId, tilerId, MockPutContentsOnDisplayData).subscribe(data => {
            expect(responseBody).toBe(data);
        });

    });

    //SELECTED DISPLAY DETAILS FROM SERVER
    it("Should return selected display detail info from CMS Server ", () => {
        let responseBody = MockSelectedDisplayData;
        let aDisplayId: number = 9;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getSelectedDisplayContent(aDisplayId).subscribe(data => {
            let selectedDisplayData = new Display(data);
            let selectedDisplayResponseBody = new Display(responseBody);
            expect(selectedDisplayResponseBody).toEqual(selectedDisplayData);
        });
    });

    //MARK AN OBJECT DISPLAY/SOURCE AS FAVRORITE
    it("Should mark an object as favorite ", () => {
        let responseBody = { "id": "DIS_1" };
        let objectId: number = 1; 
        let objectType: string = "DIS"
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.markAsFavorite(objectId, objectType).then(data => {
            expect(JSON.stringify(data)).toBe(JSON.stringify(responseBody));
        });

    });

    //MARK AN OBJECT DISPLAY/SOURCE AS UNFAVRORITE
    it("Should mark an object as unfavorite ", () => {
        let responseBody = { "Message": "Favorite has been deleted successfully." };
        let objectId: number = 1; 
        let objectType: string = "DIS"
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.markAsUnfavorite(objectId, objectType).then(data => {
            expect(JSON.stringify(data)).toBe(JSON.stringify(responseBody));
        });

    });

    //GET USER PROFILE SETTING DATA
    it("Should return user profile setting data from server ", () => {
        let responseBody = MocksUerProfileSettingsData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getUserProfileSettings().then(data => {
            expect(data).toEqual(responseBody);
        });
    });

});