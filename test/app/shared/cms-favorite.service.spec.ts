import { TestBed, inject, async} from "@angular/core/testing";
import { CmsFavoriteService } from "../../../app/shared/cms-favorite.service";
import { CmsApiService } from "../../../app/cms/api/cms-api.service";
import { AppConfig } from "../../../app/config";

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
    ]

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
            "favorite": false
        }
    ]

    let cmsFavoriteService;
    let cmsServerApi;
    let appConfig;

    /**
     * Mocked service for api service
     */
    class MockCmsApiService {
        markAsFavorite(objectId, objectTypePrefix): Promise<Response> {
            return new Promise((resolve, reject) => {
                resolve({ id: `${objectTypePrefix}_{objectId}` });
                reject(null)
            });
        }

        markAsUnfavorite(objectId, objectTypePrefix): Promise<Response> {
            return new Promise((resolve, reject) => {
                resolve({ id: `${objectTypePrefix}_{objectId}` });
                reject(null)
            });
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

    it("display: Service should mark favorite", async () => {
        cmsFavoriteService.markObjectAsFavorite(displays[0].id, displays[0].type, displays);
        window.setTimeout(() => {
            expect(displays[0].favorite).toBeTruthy();
        }, 0);
    });

    it("display: Service should unmark favorite display", async () => {
        cmsFavoriteService.markObjectAsUnfavorite(displays[1].id, displays[1].type, displays);
        window.setTimeout(() => {
            expect(displays[1].favorite).toBeFalsy();
        }, 0);
    });

    it("source: Service should mark favorite", async () => {
        cmsFavoriteService.markObjectAsFavorite(sources[0].id, sources[0].type, sources);
        window.setTimeout(() => {
            expect(sources[0].favorite).toBeTruthy();
        }, 0);
    });

    it("Source: Service should unmark favorite display", async () => {
        cmsFavoriteService.markObjectAsUnfavorite(sources[1].id, sources[1].type, sources);
        window.setTimeout(() => {
            expect(sources[1].favorite).toBeFalsy();
        }, 0);
    });

});