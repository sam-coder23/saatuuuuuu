/**
 * Test specification for api-service service.
 */
import { async, inject, TestBed } from "@angular/core/testing";
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from "@angular/http";
import { MockBackend, MockConnection } from "@angular/http/testing";
import { Router } from "@angular/router";

import { APIRequest } from "../../../../app/cms/api/api-request";
import { CmsApiService } from "../../../../app/cms/api/cms-api.service";
import { StorageManager } from "../../../../app/cms/api/cms-storagemanager.service";
import { Display } from "../../../../app/cms/models/cms-display";
import { CmsSessionStorageItem } from "../../../../app/cms/models/cms-session-storage-item";
import { User } from "../../../../app/cms/models/cms-user.model";
import { AppConfig } from "../../../../app/config";
import {
    mockAddSingleAppData,
    mockAddSourceData,
    mockAddTilerEventData,
    mockDeletedSingleAppData,
    mockDeleteHandleUserEventsData,
    mockDeleteSourceData,
    mockDeleteTilerEventData,
    mockDisplayData,
    mockDisplaysDeleteData,
    mockDisplaysPostData,
    mockGeometryContentForDisplay,
    mockPerspectivesDeletedData,
    mockPerspectivesPostedData,
    mockPerspectivesPutData,
    mockPutContentsOnDisplayData,
    mockSelectedDisplayData,
    mockServerInfoData,
    mockSourceListData,
    mocksUerProfileSettingsData,
    mockSystemEventData,
    mockTilerData,
    mockupdateDisplayContentData,
    mockupdateDisplayContentElement,
    mockUpdateDisplaySingleAppData,
    mockUpdateHandleUserEventsData,
    mockUpdateSingleDisplayData,
    mockUpdateSingleSourceData,
    mockUpdateTilerEventData
} from "./../../core/mock-stubs/api-service.mock";

describe("Service: CmsApiService", () => {
    let cmsApiService: CmsApiService;
    let apiRequestHandler: APIRequest;
    let appConfig: AppConfig;
    let router: Router;
    let storageManager: StorageManager;
    let mockbackend: MockBackend;
    const notFound: number = 404;
    // tslint:disable-next-line:mocha-no-side-effect-code
    const spyRouter: any = {
        navigate: jasmine.createSpy("APIService")
    };

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
                    useFactory: (mockBackend: MockBackend, defaultOptions: BaseRequestOptions): Http => {
                        return new Http(mockBackend, defaultOptions);
                    }
                },
                {
                    provide: Router,
                    useValue: spyRouter
                }
            ]
        })));

    beforeEach(inject([Http, Router, APIRequest, StorageManager, AppConfig, MockBackend], (http: Http, routerService: Router, apiRequestService: APIRequest, storageManagerService: StorageManager, appConfigService: AppConfig, mockBackEndService: MockBackend) => {
        appConfig = appConfigService;
        storageManager = storageManagerService;
        router = routerService;
        mockbackend = mockBackEndService;
        apiRequestHandler = new APIRequest(http, router, appConfig, storageManager);
        cmsApiService = new CmsApiService(http, router, apiRequestHandler, storageManager, appConfig);
    }));

    //SERVICE DEFINED
    it("should be defined", async(() => {
        expect(cmsApiService).toBeDefined();
    }));

    //USER LOGIN REQUEST TO CMS SERVER
    it("Should be able to login to CMS Server", async(() => {
        const requestBody: any = {
            username: "bcd-se-test",
            password: "bcdsetest"
        };
        const responseBody: any = {
            Message: "Login Successful"
        };
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        const user: User = new User(requestBody);
        cmsApiService.login(user).subscribe( (data: any) => {
            expect(responseBody).toEqual(data);
        });
    }));

    //USER LOGOUT REQUEST TO CMS SERVER
    it("Should be able to logout to CMS Server", async(() => {
        const responseBody: any = {
            Message: "Logout Sucessfull"
        };
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.logout().subscribe( (data: any) => {
            expect(responseBody).toEqual(data);
        });
    }));

    //USER LOGOUT API AND ALSO PERFORM CLEANUP
    it("Should be able to logoutuser to CMS Server", async(() => {
        const responseBody: any = {
            Message: "Logout Sucessfull"
        };
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });

        cmsApiService.logout().subscribe( (data: any) => {
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
        const responseBody: Display = mockDisplayData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getDisplayList().subscribe( (data: any) => {
            const displayData: Display = new Display(data);
            expect(responseBody).toEqual(data);
        });
    }));

    //RETURN SOURCE LIST FROM SERVER
    it("Should return source list from CMS Server ", () => {
        const responseBody: any = mockSourceListData;
        const start: number = 1;
        const count: number = 1;
        const aDisplayId: number = 9;
        const search: string = "";
        const favorite: boolean = false;

        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getSourceList(start, count, aDisplayId, search, favorite).subscribe( (data: any) => {
            expect(data).toEqual(responseBody);
        });

    });

    //PUT CONTENTS ON DISPLAY
    it("Should return contents for display ", () => {
        const responseBody: any = mockPutContentsOnDisplayData;
        const displayId: number = 18;
        const tilerId: number = 23;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.putContentsOnDisplay(displayId, tilerId, mockPutContentsOnDisplayData).subscribe( (data: any) => {
            expect(responseBody).toBe(data);
        });

    });

    //SELECTED DISPLAY DETAILS FROM SERVER
    it("Should return selected display detail info from CMS Server ", () => {
        const responseBody: any = mockSelectedDisplayData;
        const aDisplayId: number = 9;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getSelectedDisplayContent(aDisplayId).subscribe( (data: any) => {
            const selectedDisplayData: Display = new Display(data);
            const selectedDisplayResponseBody: Display = new Display(responseBody);
            expect(selectedDisplayResponseBody).toEqual(selectedDisplayData);
        });
    });

    //MARK AN OBJECT DISPLAY/SOURCE AS FAVRORITE
    it("Should mark an object as favorite ", () => {
        const responseBody: any = {
            id: "DIS_1"
        };
        const objectId: number = 1;
        const objectType: string = "DIS";
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.markAsFavorite(objectId, objectType).then( (data: any) => {
            expect(JSON.stringify(data)).toBe(JSON.stringify(responseBody));
        });

    });

    //MARK AN OBJECT DISPLAY/SOURCE AS FAVRORITE => CHECK CATCH
    it("Should execute catch block while mark object as favorite ", () => {
        const objectId: number = 1;
        const objectType: string = "DIS";
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockError(new ErrorResponse(
                new ResponseOptions({
                    body: {},
                    status: 404
                })
            ));
        });
        cmsApiService.markAsFavorite(objectId, objectType).then( (data: any) => {
            // do nothing
        }, (err: any) => {
            expect(err.status).toBe(notFound);
        });
    });

    //MARK AN OBJECT DISPLAY/SOURCE AS UNFAVRORITE
    it("Should mark an object as unfavorite ", () => {
        const responseBody: any = {
            Message: "Favorite has been deleted successfully."
        };
        const objectId: number = 1;
        const objectType: string = "DIS";
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.markAsUnfavorite(objectId, objectType).then( (data: any) => {
            expect(JSON.stringify(data)).toBe(JSON.stringify(responseBody));
        });

    });

    //GET USER PROFILE SETTING DATA
    it("Should return user profile setting data from server ", () => {
        const responseBody: any = mocksUerProfileSettingsData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getUserProfileSettings().then( (data: any) => {
            expect(data).toEqual(responseBody);
        });
    });

    //UPDATE USER PROFILE SETTING DATA
    it("Should update user profile setting data from server and return success message ", () => {
        const responseBody: any = {
            Message: "UserSettings updated sucessfully"
        };
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.updateUserProfileSettings(mocksUerProfileSettingsData).then( (data: any) => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //RECONNECT WITH SERVER SHOULD MAKE SESSION EXPIRE AND KEEP SESSION ALIVE
    it("Should call makeSessionExpire and keepSessionAlive from reconnectSessionWithServer ", () => {
        spyOn(cmsApiService, "makeSessionExpire").and.returnValue(() => {
            return undefined;
        });
        spyOn(cmsApiService, "keepSessionAlive").and.returnValue(() => {
            return undefined;
        });
        cmsApiService.reconnectSessionWithServer();
        expect(cmsApiService.makeSessionExpire).toHaveBeenCalled();
        expect(cmsApiService.keepSessionAlive).toHaveBeenCalled();
    });

    //APP BUID VERSION
    it("Should return app build version ", () => {
        const responseBody: string = "launchpad.buildnumber=0101";
        const buildInfo: string = "1.1 Build 0101";
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getAppVersion().then( (data: any) => {
            expect(data).toEqual(buildInfo);
        });
    });

    //APP BUID VERSION => CATCH BLOCK
    it("Should execute catch for app build version ", () => {
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockError(new ErrorResponse(
                new ResponseOptions({
                    body: {},
                    status: notFound
                })
            ));
        });
        cmsApiService.getAppVersion().then((data: any) => {
            return undefined;
        }, (err: any) => {
            expect(err.status).toBe(notFound);
        });
    });

    //SERVER INFO DATA
    it("Should return server info data ", () => {
        const responseBody: any = mockServerInfoData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getSystemInfo().subscribe( (data: any) => {
            expect(data).toEqual(responseBody);
        });
    });

    //GET TILER INFO DATA TILE COUNT 1
    it("Should return tiler info for tilesCount 1 ", () => {
        const tilesCount: number = 1;
        const responseBody: any = mockTilerData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getTilePresets(tilesCount).subscribe( (data: any) => {
            expect(data).toEqual(responseBody);
        });
    });

    //GET TILER INFO DATA TILE COUNT 0
    it("Should return tiler info for tilesCount 0 ", () => {
        const tilesCount: number = 0;
        const responseBody: any = mockTilerData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getTilePresets(tilesCount).subscribe( (data: any) => {
            expect(data).toEqual(responseBody);
        });
    });

    //UPDATE CONTENT GEOMETRY ON DISPLAY
    it("Should update content geormetry on display ", () => {
        const body: any = mockGeometryContentForDisplay;
        const responseBody: any = {
            Message: "Operation Successful."
        };
        const displayId: number = 10;
        const contentId: number = 35;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.updateContentGeormetryOnDisplay(displayId, contentId, body).subscribe( (data: any) => {
            expect(data).toEqual(responseBody);
        });
    });

    //FETCH EVENTS FROM CMS SERVER
    it("Should fetch events from CMS Server ", () => {
        const responseBody: any[] = [];
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe( (data: any) => {
            expect(data.json()).toEqual(responseBody);
        });
    });
    //GET EVENTS FOR CATCH
    it("Should execute catch for getEvents ", () => {
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockError(new ErrorResponse(
                new ResponseOptions({
                    body: {},
                    status: notFound
                })
            ));
        });
        cmsApiService.getEvents().subscribe((data: any) => {
            return undefined;
        }, (err: any) => {
            expect(err.status).toBe(notFound);
        });
    });

    //GET EVENT HANDLE PERSPECTIVES => /perspectives => POSTED
    it("Should fetch events using getEvents and handle /perspectives POSTED ", () => {
        const responseBody: any = mockPerspectivesPostedData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe( (data: any) => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT HANDLE PERSPECTIVES => /perspectives => DELETED
    it("Should fetch events using getEvents and handle /perspectives DELETED ", () => {
        const responseBody: any = mockPerspectivesDeletedData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe( (data: any) => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT HANDLE PERSPECTIVES => /perspectives/{id} => PUT
    it("Should fetch events using getEvents and handle /perspectives/{id} PUT ", () => {
        const responseBody: any = mockPerspectivesPutData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe( (data: any) => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT FOR DISPLAYS => /displays/{id} => PUT
    it("Should fetch events using getEvents and handle /displays/{id} PUT ", () => {
        const responseBody: any = mockUpdateSingleDisplayData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe( (data: any) => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT FOR DISPLAYS => /displays => POSTED
    it("Should fetch events using getEvents and handle /displays POSTED ", () => {
        const responseBody: any = mockDisplaysPostData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe( (data: any) => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT FOR DISPLAYS => /displays => DELETED
    it("Should fetch events using getEvents and handle /displays DELETED ", () => {
        const responseBody: any = mockDisplaysDeleteData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe( (data: any) => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT FOR DISPLAYS => /displays/{id}/content => PUT
    it("Should fetch events using getEvents and handle /displays/{id}/content PUT ", () => {
        const responseBody: any = mockupdateDisplayContentData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe( (data: any) => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT FOR DISPLAYS => /displays/{id}/content/{id} => PUT
    it("Should fetch events using getEvents and handle /displays/{id}/content/{id} PUT ", () => {
        const responseBody: any = mockupdateDisplayContentElement;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe( (data: any) => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT FOR DISPLAYS /displays/{id}/applications => POSTED
    it("Should fetch events using getEvents and handle /displays/{id}/applications POSTED ", () => {
        const responseBody: any = mockAddSingleAppData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe( (data: any) => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT FOR DISPLAYS /displays/{id}/applications => DELETED
    it("Should fetch events using getEvents and handle /displays/{id}/applications DELETED ", () => {
        const responseBody: any = mockDeletedSingleAppData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe( (data: any) => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT FOR DISPLAYS /displays/{id}/applications/{id} => PUT
    it("Should fetch events using getEvents and handle /displays/{id}/applications{id} PUT ", () => {
        const responseBody: any = mockUpdateDisplaySingleAppData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe( (data: any) => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT FOR SOURCES ADD SOURCE TO LIST /sources => PUT
    it("Should fetch events using getEvents and handle /sources PUT ", () => {
        const responseBody: any =  mockAddSourceData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe( (data: any) => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT FOR SOURCES DELETE SOURCE /sources => DELETE
    it("Should fetch events using getEvents and handle /sources DELETE ", () => {
        const responseBody: any =  mockDeleteSourceData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe( (data: any) => {
            expect(data.json()).toEqual(responseBody);
        });
    });
    //GET EVENT FOR SOURCES UPDATE SOURCE /sources/{ id } => PUT
    it("Should fetch events using getEvents and handle /sources/1 PUT ", () => {
        const responseBody: any =  mockUpdateSingleSourceData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe( (data: any) => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT FOR SYSTEM /system
    it("Should fetch events using getEvents and handle /system ", () => {
        const responseBody: any =  mockSystemEventData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe( (data: any) => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT FOR USER /users/current => DELETED
    it("Should fetch events using getEvents and handle /users/current DELETED ", () => {
        const userInfo: any = {
            username: "bcd-se-test",
            loggedIn: true
        };
        storageManager = new StorageManager();
        storageManager.setItem(CmsSessionStorageItem.USER, JSON.stringify(userInfo));
        const responseBody: any =  mockDeleteHandleUserEventsData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe( (data: any) => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT FOR USER /users/current => UPDATE
    it("Should fetch events using getEvents and handle /users/current PUT ", () => {
        const responseBody: any =  mockUpdateHandleUserEventsData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe( (data: any) => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT FOR TILERS /tilers => POST
    it("Should fetch events using getEvents and handle /tilers POST ", () => {
        const responseBody: any =  mockAddTilerEventData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe( (data: any) => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT FOR TILERS /tilers => DELETE
    it("Should fetch events using getEvents and handle /tilers DELETE ", () => {
        const responseBody: any =  mockDeleteTilerEventData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe( (data: any) => {
            expect(data.json()).toEqual(responseBody);
        });
    });

    //GET EVENT FOR TILERS /tilers/{id} => PUT
    it("Should fetch events using getEvents and handle /tilers/{id} PUT ", () => {
        const responseBody: any =  mockUpdateTilerEventData;
        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });
        cmsApiService.getEvents().subscribe( (data: any) => {
            expect(data.json()).toEqual(responseBody);
        });
    });

});

class ErrorResponse extends Response implements Error {
    public name: any;
    public message: any;
}
