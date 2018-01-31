/**
 * Test specification for API Request service
 */
import { async, inject, TestBed } from "@angular/core/testing";
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from "@angular/http";
import { MockBackend, MockConnection } from "@angular/http/testing";
import { Router } from "@angular/router";

import { APIRequest } from "../../../../app/cms/api/api-request";
import { StorageManager } from "../../../../app/cms/api/cms-storagemanager.service";
import { AppConfig } from "../../../../app/config";
import { settingsMock } from "../../core/mock-stubs/tile.mock";

class MockRouterStub {
    public navigate(commands: any[]): any[] {
        return commands;
    }
}

// tslint:disable-next-line:max-classes-per-file
class MockAppConfigStub {
    public serverURL: string = "https://0.0.0.0/cms-rest/v1";

    public get ServerURL(): string {
        return this.serverURL;
    }
    public log(): undefined {
        return undefined;
    }
}

describe("Service: APIRequest", () => {
    let mockBackEnd: MockBackend;
    let router: Router;
    let appConfig: AppConfig;
    let apiRequestService: APIRequest;
    let storageManager: StorageManager;

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
                    useFactory: (mockBackend: MockBackend, defaultOptions: BaseRequestOptions): Http => {
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

    beforeEach(inject([MockBackend, Router, AppConfig, Http, StorageManager],
        (mockBackendService: MockBackend, routerService: Router, appConfigService: AppConfig, http: Http, storageManagerService: StorageManager) => {
            router = routerService;
            appConfig = appConfigService;
            mockBackEnd = mockBackendService;
            storageManager = storageManagerService;
            apiRequestService = new APIRequest(http, router, appConfig, storageManager);
        }));

    it("Service should be defined", () => {
        expect(apiRequestService).toBeDefined();
        //expect(apiRequestService.serverURL).toBe(apiRequestService.appConfig.ServerURL);
        expect(apiRequestService.headers).toBeDefined();
        expect(apiRequestService.requestOption).toBeDefined();
    });

    it("Should return specific url as per request - GetURL()", () => {
        const loginUrl: string = "login";
        const snapshotUrl: string = "display_snapshot.jpg";
        const resourceRequestUrl: string = "displays/11/resources?start=1&count=20&filter=&onlyfavorite=false";

        const serverUrlRegex: any = /^https:\/\/0.0.0.0\/cms-rest\/v1/;
        const dateQuestionRegex: any = /\?_=\d{10,14}\w+/;
        const dateAmpersandRegex: any = /\&_=\d{10,14}\w+/;

        const finalLoginUrl: string = apiRequestService.getUrl(loginUrl);
        const finalSnapshotUrl: string = apiRequestService.getUrl(snapshotUrl);
        const finalResourceRequestUrl: string = apiRequestService.getUrl(resourceRequestUrl);

        expect(serverUrlRegex.test(finalLoginUrl)).toBeTruthy();
        expect(dateQuestionRegex.test(finalLoginUrl)).toBeTruthy();

        expect(serverUrlRegex.test(finalSnapshotUrl)).toBeTruthy();
        expect(dateAmpersandRegex.test(finalSnapshotUrl)).toBeFalsy();

        expect(serverUrlRegex.test(finalResourceRequestUrl)).toBeTruthy();
        expect(dateAmpersandRegex.test(finalResourceRequestUrl)).toBeTruthy();
    });

    it("Should be able to make POST request", async(() => {
        const url: string = "/login";
        const requestBody: any = {
            username: "barco",
            password: "barco"
        };
        const responseBody: any = {
            Message: "Login Successful"
        };

        mockBackEnd.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });

        apiRequestService.postRequest(url, requestBody).subscribe( (data: any) => {
            expect(responseBody).toEqual(data);
        });
    }));

    it("Should be able to make GET request", async(() => {
        const url: string = "/users/current/profile/settings";
        const responseBody: any = settingsMock;
        mockBackEnd.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });

        apiRequestService.getRequest(url).subscribe( (data: any) => {
            expect(responseBody).toEqual(data);
        });
    }));

    it("Should be able to make PUT request", async(() => {
        const url: string = "/users/current/profile/settings";
        const requestBody: any = settingsMock;
        const responseBody: any = {
            Message: "UserSettings updated sucessfully"
        };
        mockBackEnd.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });

        apiRequestService.putRequest(url, requestBody).subscribe( (data: any) => {
            expect(responseBody).toEqual(data);
        });
    }));

    it("Should be able to make DELETE request", async(() => {
        const url: string = "/users/current/profile/favorites/DIS_8";
        const responseBody: any = {
            Message: "Favorite has been deconsted successfully."
        };

        mockBackEnd.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                })
            ));
        });

        apiRequestService.deleteRequest(url).subscribe( (data: any) => {
            expect(responseBody).toEqual(data);
        });
    }));

    it("Should be able to handle 401 error", async(() => {
        const unAuthorizedError: any = {
            _body: "{\"Message\":\"No valid session associated with this request. Perform login first.\"}",
            status: 401,
            ok: false,
            statusText: "Unauthorized",
            headers: {
                "content-type": [
                    "application/json"
                ]
            },
            type: 2,
            url: "https://10.98.0.153/cms-rest/v1/system/info?_=1510045756349"
        };

        mockBackEnd.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: {
                        Message: "Logout Successful"
                    }
                })
            ));
        });

        const spyRouterNavigate: jasmine.Spy = spyOn(router, "navigate").and.callThrough();
        const spyOnConsole: jasmine.Spy = spyOn(appConfig, "log").and.returnValue(undefined);
        apiRequestService.handleError(unAuthorizedError);
        expect(spyRouterNavigate).toHaveBeenCalled();
        expect(spyOnConsole).toHaveBeenCalled();
    }));

});
