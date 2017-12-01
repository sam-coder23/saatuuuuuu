import { TestBed, inject, async } from "@angular/core/testing";
import { Router } from "@angular/router";

import { MockBackend, MockConnection } from "@angular/http/testing";
import { HttpModule, Http, BaseRequestOptions, XHRBackend, ResponseOptions, Response } from "@angular/http";
import { AppConfig } from "../../../../app/config";
import { APIRequest } from "../../../../app/cms/api/api-request";
import { StorageManager } from "../../../../app/cms/api/cms-storagemanager.service";

class MockRouterStub {
    navigate(commands: any[]): any[] {
        return commands;
    }
}

class MockAppConfigStub {
    ServerURL = "https://0.0.0.0/cms-rest/v1";
    log() { }
}

describe("Service: APIRequest", () => {
    let mockbackend, router, appConfig, APIRequestService, 
    storageManager: StorageManager;

    beforeEach(async(() =>
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                MockBackend,
                BaseRequestOptions,
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
                    useClass: MockRouterStub
                },
                {
                    provide: AppConfig,
                    useClass: MockAppConfigStub
                },
                StorageManager
            ]
        })));

    beforeEach(inject([MockBackend, Router, AppConfig, Http, StorageManager], (mb, router, appConfig, http, storageManager) => {
        router = router;
        appConfig = appConfig;
        mockbackend = mb;
        storageManager = storageManager;
        APIRequestService = new APIRequest(http, router, appConfig, storageManager);
    }));

    it("Service should be defined", () => {
        expect(APIRequestService).toBeDefined();
        expect(APIRequestService.serverURL).toBe(APIRequestService.appConfig.ServerURL);
        expect(APIRequestService.headers).toBeDefined();
        expect(APIRequestService.requestOption).toBeDefined();
    });

    it("Should return specific url as per request - GetURL()", () => {
        let loginUrl = "login";
        let snapshotUrl = "mediaconfiguration?action=get&path=images%2Fsnapshots%2Fdisplays%2F1.jpeg";
        let resourceRequestUrl = "displays/11/resources?start=1&count=20&filter=&onlyfavorite=false"

        let serverUrlRegex = /^https:\/\/0.0.0.0\/cms-rest\/v1/;
        let dateQuestionRegex = /\?_=\d{10,14}\w+/;
        let dateAmpersandRegex = /\&_=\d{10,14}\w+/;

        let finalLoginUrl = APIRequestService.GetURL(loginUrl);
        let finalSnapshotUrl = APIRequestService.GetURL(snapshotUrl);
        let finalResourceRequestUrl = APIRequestService.GetURL(resourceRequestUrl);

        expect(serverUrlRegex.test(finalLoginUrl)).toBeTruthy();
        expect(dateQuestionRegex.test(finalLoginUrl)).toBeTruthy();

        expect(serverUrlRegex.test(finalSnapshotUrl)).toBeTruthy();
        expect(dateAmpersandRegex.test(finalSnapshotUrl)).toBeTruthy();

        expect(serverUrlRegex.test(finalResourceRequestUrl)).toBeTruthy();
        expect(dateAmpersandRegex.test(finalResourceRequestUrl)).toBeTruthy();
    });

    it("Should be able to make POST request", async(() => {
        let url = "/login";
        let requestBody = { "username": "barco", "password": "barco" }
        let responseBody = { "Message": "Login Successful" };

        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });

        APIRequestService.post(url, requestBody).subscribe(data => {
            expect(responseBody).toEqual(data);
        });
    }));

    it("Should be able to make GET request", async(() => {
        let url = "/users/current/profile/settings";
        let responseBody = { "language": "en", "wallConnection": { "startUpAction": "auto-connect-to-specific-wall", "specificDisplay": "Auditorium", "recentDisplay": "Board Meeting Room" }, "sourceLabel": { "displaySourceNameLabels": true, "useMultipleLines": false, "fontColor": "#E57373", "fontSize": 16, "backgroundColor": "#4FC3F7", "transparency": 50 }, "wallContent": { "requireConfirmationForLoadingLayouts": false, "allowChangingSources": false, "clipboardEnabled": false, "clipboardSize": "large" }, "logOffTime": 0, "pageSize": 20 };

        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });

        APIRequestService.get(url).subscribe(data => {
            expect(responseBody).toEqual(data);
        });
    }));

    it("Should be able to make PUT request", async(() => {
        let url = "/users/current/profile/settings";
        let requestBody = { "language": "en", "wallConnection": { "startUpAction": "auto-connect-to-specific-wall", "specificDisplay": "Auditorium", "recentDisplay": "Board Meeting Room" }, "sourceLabel": { "displaySourceNameLabels": true, "useMultipleLines": false, "fontColor": "#E57373", "fontSize": 16, "backgroundColor": "#4FC3F7", "transparency": 50 }, "wallContent": { "requireConfirmationForLoadingLayouts": false, "allowChangingSources": false, "clipboardEnabled": false, "clipboardSize": "large" }, "logOffTime": 0, "pageSize": 20 };
        let responseBody = { "Message": "UserSettings updated sucessfully" };

        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });

        APIRequestService.put(url, requestBody).subscribe(data => {
            expect(responseBody).toEqual(data);
        });
    }));

    it("Should be able to make DELETE request", async(() => {
        let url = "/users/current/profile/favorites/DIS_8";
        let responseBody = { "Message": "Favorite has been deleted successfully." };

        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });

        APIRequestService.delete(url).subscribe(data => {
            expect(responseBody).toEqual(data);
        });
    }));

    it("Should be able to handle 401 error", async(() => {
        let unAuthorizedError = {
            "_body": "{\"Message\":\"No valid session associated with this request. Perform login first.\"}",
            "status": 401,
            "ok": false,
            "statusText": "Unauthorized",
            "headers": {
                "content-type": [
                    "application/json"
                ]
            },
            "type": 2,
            "url": "https://10.98.0.153/cms-rest/v1/system/info?_=1510045756349"
        };

        mockbackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: { "Message": "Logout Successful" }
                })
            ));
        });

        let spyRouterNavigate = spyOn(APIRequestService.router, "navigate").and.callThrough();
        let spyOnConsole = spyOn(APIRequestService.appConfig, "log").and.returnValue(null);

        APIRequestService.handleError(unAuthorizedError);

        expect(spyRouterNavigate).toHaveBeenCalled();
        expect(spyOnConsole).toHaveBeenCalled();
    }));

});