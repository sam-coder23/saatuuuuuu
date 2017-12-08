import { TestBed, inject, async, fakeAsync, tick } from "@angular/core/testing";
import { CmsFavoriteService } from "../../../app/shared/cms-favorite.service";
import { CmsApiService } from "../../../app/cms/api/cms-api.service";
import { AppConfig } from "../../../app/config";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/toPromise";

describe("Service: CmsFavoriteService", () => {

    let displays = [
        {
            "id": 31,
            "name": "Display [NOICLT28523]",
            "type": "DisplayWall",
            "description": "",
            "snapshotPath": "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fdisplays%2Fdisplay-defaultimage.jpg",
            "resolution": {
                "width": 1920.0,
                "height": 1080.0
            },
            "online": true,
            "acknowledged": true,
            "computerName": "NOICLT28523",
            "tags": "",
            "startUpAction": "RestoreLastKnownConfiguration",
            "favorite": false,
            "loggedInUserName": "BARCO\\BCD-SE-test",
            "autoloadLayout": 0,
            "windowOption": "NoTitleBarAndNoResizableBorder",
            "vdsDisplay": false,
            "defaultAreaEnabled": false,
            "defaultArea": {
                "left": 0.0,
                "top": 0.0,
                "width": 0.0,
                "height": 0.0
            },
            "isDecoderDisplay": false,
            "sourceRoutingRequired": false,
            "tilerId": 9,
            "tiles": [],
            "modules": []
        },
        {
            "id": 46,
            "name": "ngp_display",
            "type": "NGPWall",
            "description": "dadassdas",
            "snapshotPath": "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fdisplays%2Fdisplay-defaultimage.jpg",
            "resolution": {
                "width": 1280.0,
                "height": 1024.0
            },
            "online": false,
            "acknowledged": true,
            "computerName": "NGP-210",
            "tags": "",
            "startUpAction": "RestoreLastKnownConfiguration",
            "favorite": true,
            "loggedInUserName": "",
            "autoloadLayout": 0,
            "tilerId": 12,
            "tiles": [],
            "ngpLocale": "en_US",
            "ngpModules": [

            ]
        }
    ];

    let sources = [
        {
            "id": 34,
            "name": "DefaultProSource[workstation1113]",
            "description": "",
            "type": "perspective",
            "width": 600.0,
            "height": 450.0,
            "snapshotPath": "https://10.98.0.231/mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F18.jpeg",
            "favorite": false
        },
        {
            "id": 555,
            "name": "DefaultProSource[workstation1114221]",
            "description": "",
            "type": "source",
            "width": 200.0,
            "height": 200.0,
            "snapshotPath": "https://10.98.0.231/mediaconfiguration?action=get&path=images%2Fsnapshots%2Fsources%2Fsource-defaultimage.jpg",
            "favorite": true
        }
    ];

    let cmsFavoriteService;
    let cmsServerApi;
    let appConfig;

    /**
     * Mocked service for api service
     */
    class MockCmsApiService {
        markAsFavorite(objectId, objectTypePrefix): Promise<any> {
            if (objectId === -1) {
                return Promise.reject(null);
            } else {
                return Promise.resolve({ id: `${objectTypePrefix}_{objectId}` });
            }
        }

        markAsUnfavorite(objectId, objectTypePrefix): Promise<any> {
            if (objectId === -1) {
                return Promise.reject(null);
            } else {
                return Promise.resolve({ id: `${objectTypePrefix}_{objectId}` });
            }
        }
    }

    /**
     * Mocked service for app config
     */
    class MockAppConfig {
        log(): void { }
    }

    beforeEach(async () =>
        TestBed.configureTestingModule({
            providers: [
                CmsFavoriteService,
                {
                    provide: CmsApiService,
                    useClass: MockCmsApiService
                },
                {
                    provide: AppConfig,
                    useClass: MockAppConfig
                }
            ]
        }));

    beforeEach(inject([CmsApiService, AppConfig], (sr1, sr2) => {
        cmsServerApi = sr1;
        appConfig = sr2;
    }));

    beforeEach(() => {
        cmsFavoriteService = new CmsFavoriteService(cmsServerApi, appConfig);
    });

    it("Service should be defined", () => {
        expect(cmsFavoriteService).toBeDefined();
    });

    it("display: Service should mark favorite", fakeAsync(() => {
        cmsFavoriteService.markObjectAsFavorite(displays[0].id, displays[0].type, displays);
        tick();
        expect(displays[0].favorite).toBeTruthy();
    }));

    it("display: Service should unmark favorite display", fakeAsync(() => {
        cmsFavoriteService.markObjectAsUnfavorite(displays[1].id, displays[1].type, displays);
        tick();
        expect(displays[1].favorite).toBeFalsy();
    }));

    it("source: Service should mark favorite", fakeAsync(() => {
        cmsFavoriteService.markObjectAsFavorite(sources[0].id, sources[0].type, sources);
        tick();
        expect(sources[0].favorite).toBeTruthy();
    }));

    it("Source: Service should unmark favorite display", fakeAsync(() => {
        cmsFavoriteService.markObjectAsUnfavorite(sources[1].id, sources[1].type, sources);
        tick();
        expect(sources[1].favorite).toBeFalsy();
    }));

    it("Service should return without invoking markAsFavorite API when objectType is empty", fakeAsync(() => {
        let spyMarkAsFavorite = spyOn(cmsServerApi, "markAsFavorite").and.returnValue(Observable.of(null));
        cmsFavoriteService.markObjectAsFavorite(0, "", []);
        tick();
        expect(spyMarkAsFavorite.calls.count()).toEqual(0);
    }));

    it("Service should return without invoking markAsUnFavorite API when objectType is empty", fakeAsync(() => {
        let spyMarkAsUnFavorite = spyOn(cmsServerApi, "markAsUnfavorite").and.returnValue(Observable.of(null));
        cmsFavoriteService.markObjectAsUnfavorite(0, "", []);
        tick();
        expect(spyMarkAsUnFavorite.calls.count()).toEqual(0);
    }));

    it("Service should throw error while invoking markAsFavorite API", fakeAsync(() => {
        cmsFavoriteService.markObjectAsFavorite(-1, displays[0].type, displays);
        tick();
        expect(cmsFavoriteService.refreshSnapshot).toBeTruthy();
    }));

    it("Service should throw error while invoking markAsUnFavorite API", fakeAsync(() => {
        cmsFavoriteService.markObjectAsUnfavorite(-1, displays[0].type, displays);
        tick();
        expect(cmsFavoriteService.refreshSnapshot).toBeTruthy();
    }));

    it("display: Service should remove card from list when favourite filter is active", fakeAsync(() => {
        cmsFavoriteService.markObjectAsUnfavorite(displays[1].id, displays[1].type, displays, true);
        tick();
        expect(displays.length).toEqual(1);
        expect(cmsFavoriteService.refreshSnapshot).toBeTruthy();
    }));
});