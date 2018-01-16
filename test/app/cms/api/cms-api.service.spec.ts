/**
 * ERROR HANDLING TEST CASES PENDING
 * GET DISPLAY LIST IS BRAKING BECAUSE OF LATEST CHANGES
 */
import { TestBed, inject, async, fakeAsync, tick } from "@angular/core/testing";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Router } from "@angular/router";
import { MockBackend, MockConnection } from "@angular/http/testing";
import { HttpModule, Http, BaseRequestOptions, XHRBackend, ResponseOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Injector } from "@angular/core";

import { CmsApiService } from "../../../../app/cms/api/cms-api.service";
import { APIRequest } from "../../../../app/cms/api/api-request";
import { AppConfig } from "../../../../app/config";
import { StorageManager } from "../../../../app/cms/api/cms-storagemanager.service";
import { User } from "../../../../app/cms/models/cms-user.model";
import { Display } from "../../../../app/cms/models/cms-display";

import {
    MockDisplayData, MockSourceListData, MockPutContentsOnDisplayData, MockSelectedDisplayData,
    MocksUerProfileSettingsData, MockServerInfoData, MockTilerData, MockGeometryContentForDisplay, MockSystemEventData, MockPerspectivesPostedData, MockPerspectivesDeletedData, MockPerspectivesPutData, MockUpdateSingleDisplayData, MockDisplaysPostData, MockDisplaysDeleteData, MockupdateDisplayContentData, MockAddSingleAppData, MockDeletedSingleAppData, MockUpdateDisplaySingleAppData, MockAddSourceData, MockDeleteSourceData, MockUpdateSingleSourceData, MockUpdateHandleUserEventsData, MockDeleteHandleUserEventsData, MockAddTilerEventData, MockDeleteTilerEventData, MockUpdateTilerEventData, MockupdateDisplayContentElement
} from "./../../core/mock-stubs/api-service.mock";
import { CmsSessionStorageItem } from "../../../../app/cms/models/cms-session-storage-item";

let spyRouter = {
    navigate: jasmine.createSpy("APIService")
};

describe("Service: CmsApiService", () => {
    let cmsApiService: CmsApiService;
    let apiRequestHandler: APIRequest
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
                CmsApiService,
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
        apiRequestHandler = new APIRequest(http, router, appConfig, storageManager);
        cmsApiService = new CmsApiService(http, router, apiRequestHandler, storageManager, appConfig);
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

    //USER LOGOUT API AND ALSO PERFORM CLEANUP
    it("Should be able to logoutuser to CMS Server", async(() => {
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

    //MARK AN OBJECT DISPLAY/SOURCE AS FAVRORITE => CHECK CATCH
    it("Should execute catch block while mark object as favorite ", () => {
        let objectId: number = 1;
        let objectType: string = "DIS"
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockError(new ErrorResponse(
                new ResponseOptions({
                    body: {},
                    status: 404
                })
            ));
        });
        cmsApiService.markAsFavorite(objectId, objectType).then(data => {
            // do nothing
        }, err => {
            expect(err.status).toBe(404);
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

    //UPDATE USER PROFILE SETTING DATA
    it("Should update user profile setting data from server and return success message ", () => {
        let responseBody: any = { "Message": "UserSettings updated sucessfully" };
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.updateUserProfileSettings(MocksUerProfileSettingsData).then(data => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //RECONNECT WITH SERVER SHOULD MAKE SESSION EXPIRE AND KEEP SESSION ALIVE
    it("Should call makeSessionExpire and keepSessionAlive from reconnectSessionWithServer ", () => {
        spyOn(cmsApiService, "makeSessionExpire").and.returnValue(() => { });
        spyOn(cmsApiService, "keepSessionAlive").and.returnValue(() => { });
        cmsApiService.reconnectSessionWithServer();
        expect(cmsApiService.makeSessionExpire).toHaveBeenCalled();
        expect(cmsApiService.keepSessionAlive).toHaveBeenCalled();
    });

    //APP BUID VERSION
    it("Should return app build version ", () => {
        let responseBody: string = "launchpad.buildnumber=0101";
        let buildInfo = "1.1 Build 0101";
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getAppVersion().then(data => {
            expect(data).toEqual(buildInfo);
        });
    });

    //APP BUID VERSION => CATCH BLOCK
    it("Should execute catch for app build version ", () => {
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockError(new ErrorResponse(
                new ResponseOptions({
                    body: {},
                    status: 404
                })
            ));
        });
        cmsApiService.getAppVersion().then(data => {
        }, err => {
            expect(err.status).toBe(404);
        });
    });

    //SERVER INFO DATA
    it("Should return server info data ", () => {
        let responseBody: any = MockServerInfoData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getSystemInfo().subscribe(data => {
            expect(data).toEqual(responseBody);
        });
    });

    //GET TILER INFO DATA TILE COUNT 1
    it("Should return tiler info for tilesCount 1 ", () => {
        let tilesCount: number = 1;
        let responseBody: any = MockTilerData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getTilePresets(tilesCount).subscribe(data => {
            expect(data).toEqual(responseBody);
        });
    });

    //GET TILER INFO DATA TILE COUNT 0
    it("Should return tiler info for tilesCount 0 ", () => {
        let tilesCount: number = 0;
        let responseBody: any = MockTilerData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getTilePresets(tilesCount).subscribe(data => {
            expect(data).toEqual(responseBody);
        });
    });

    //UPDATE CONTENT GEOMETRY ON DISPLAY
    it("Should update content geormetry on display ", () => {
        let body = MockGeometryContentForDisplay;
        let responseBody: any = { "Message": "Operation Successful." };
        let displayId: number = 10, contentId: number = 35;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.updateContentGeormetryOnDisplay(displayId, contentId, body).subscribe(data => {
            expect(data).toEqual(responseBody);
        });
    });

    //FETCH EVENTS FROM CMS SERVER
    it("Should fetch events from CMS Server ", () => {
        let responseBody = [];
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe(data => {
            expect(data.json()).toEqual(responseBody);
        });
    });
    //GET EVENTS FOR CATCH
    it("Should execute catch for getEvents ", () => {
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockError(new ErrorResponse(
                new ResponseOptions({
                    body: {},
                    status: 404
                })
            ));
        });
        cmsApiService.getEvents().subscribe(data => {
        }, err => {
            expect(err.status).toBe(404);
        });
    });

    //GET EVENT HANDLE PERSPECTIVES => /perspectives => POSTED
    it("Should fetch events using getEvents and handle /perspectives POSTED ", () => {
        let responseBody = MockPerspectivesPostedData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe(data => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT HANDLE PERSPECTIVES => /perspectives => DELETED
    it("Should fetch events using getEvents and handle /perspectives DELETED ", () => {
        let responseBody = MockPerspectivesDeletedData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe(data => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT HANDLE PERSPECTIVES => /perspectives/{id} => PUT
    it("Should fetch events using getEvents and handle /perspectives/{id} PUT ", () => {
        let responseBody = MockPerspectivesPutData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe(data => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT FOR DISPLAYS => /displays/{id} => PUT
    it("Should fetch events using getEvents and handle /displays/{id} PUT ", () => {
        let responseBody = MockUpdateSingleDisplayData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe(data => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT FOR DISPLAYS => /displays => POSTED
    it("Should fetch events using getEvents and handle /displays POSTED ", () => {
        let responseBody = MockDisplaysPostData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe(data => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT FOR DISPLAYS => /displays => DELETED
    it("Should fetch events using getEvents and handle /displays DELETED ", () => {
        let responseBody = MockDisplaysDeleteData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe(data => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT FOR DISPLAYS => /displays/{id}/content => PUT
    it("Should fetch events using getEvents and handle /displays/{id}/content PUT ", () => {
        let responseBody = MockupdateDisplayContentData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe(data => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT FOR DISPLAYS => /displays/{id}/content/{id} => PUT
    it("Should fetch events using getEvents and handle /displays/{id}/content/{id} PUT ", () => {
        let responseBody = MockupdateDisplayContentElement;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe(data => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT FOR DISPLAYS /displays/{id}/applications => POSTED
    it("Should fetch events using getEvents and handle /displays/{id}/applications POSTED ", () => {
        let responseBody = MockAddSingleAppData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe(data => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT FOR DISPLAYS /displays/{id}/applications => DELETED
    it("Should fetch events using getEvents and handle /displays/{id}/applications DELETED ", () => {
        let responseBody = MockDeletedSingleAppData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe(data => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT FOR DISPLAYS /displays/{id}/applications/{id} => PUT
    it("Should fetch events using getEvents and handle /displays/{id}/applications{id} PUT ", () => {
        let responseBody = MockUpdateDisplaySingleAppData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe(data => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT FOR SOURCES ADD SOURCE TO LIST /sources => PUT
    it("Should fetch events using getEvents and handle /sources PUT ", () => {
        let responseBody = MockAddSourceData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe(data => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT FOR SOURCES DELETE SOURCE /sources => DELETE
    it("Should fetch events using getEvents and handle /sources DELETE ", () => {
        let responseBody = MockDeleteSourceData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe(data => {
            expect(data.json()).toEqual(responseBody);
        });
    });
    //GET EVENT FOR SOURCES UPDATE SOURCE /sources/{ id } => PUT
    it("Should fetch events using getEvents and handle /sources/1 PUT ", () => {
        let responseBody = MockUpdateSingleSourceData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe(data => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT FOR SYSTEM /system
    it("Should fetch events using getEvents and handle /system ", () => {
        let responseBody = MockSystemEventData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe(data => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT FOR USER /users/current => DELETED
    it("Should fetch events using getEvents and handle /users/current DELETED ", () => {
        let userInfo = { "username": "bcd-se-test", "loggedIn": true };
        storageManager = new StorageManager();
        storageManager.setItem(CmsSessionStorageItem.USER, JSON.stringify(userInfo));
        let responseBody = MockDeleteHandleUserEventsData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe(data => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT FOR USER /users/current => UPDATE
    it("Should fetch events using getEvents and handle /users/current PUT ", () => {
        let responseBody = MockUpdateHandleUserEventsData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe(data => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT FOR TILERS /tilers => POST
    it("Should fetch events using getEvents and handle /tilers POST ", () => {
        let responseBody = MockAddTilerEventData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe(data => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT FOR TILERS /tilers => DELETE
    it("Should fetch events using getEvents and handle /tilers DELETE ", () => {
        let responseBody = MockDeleteTilerEventData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe(data => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT FOR TILERS /tilers/{id} => PUT
    it("Should fetch events using getEvents and handle /tilers/{id} PUT ", () => {
        let responseBody = MockUpdateTilerEventData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe(data => {
            expect(data.json()).toEqual(responseBody);
        });
    });

});

class ErrorResponse extends Response implements Error {
    name: any;
    message: any;
}
