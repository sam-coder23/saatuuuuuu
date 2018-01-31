/**
 * Test Specification for CMS Favorites service.
 */
import "rxjs/add/operator/toPromise";

import { fakeAsync, inject, TestBed, tick } from "@angular/core/testing";
import { Observable } from "rxjs/Observable";
import { CmsApiService } from "../../../app/cms/api/cms-api.service";
import { Display } from "../../../app/cms/models/cms-display";
import { Source } from "../../../app/cms/models/cms-source";
import { AppConfig } from "../../../app/config";
import { CmsFavoriteService } from "../../../app/shared/cms-favorite.service";
import { mockDisplays } from "./../core/mock-stubs/tile.mock";

describe("Service: CmsFavoriteService", () => {
    const displays: Display[] = mockDisplays;
    const sources: any[] = [
        {
            id: 34,
            name: "DefaultProSource[workstation1113]",
            description: "",
            type: "perspective",
            width: 600.0,
            height: 450.0,
            x: 100,
            y: 0,
            snapshotPath: "https://10.98.0.231/mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F18.jpeg",
            favorite: false
        },
        {
            id: 555,
            name: "DefaultProSource[workstation1114221]",
            description: "",
            type: "source",
            width: 200.0,
            height: 200.0,
            snapshotPath: "https://10.98.0.231/mediaconfiguration?action=get&path=images%2Fsnapshots%2Fsources%2Fsource-defaultimage.jpg",
            favorite: true
        }
    ];

    let cmsFavoriteService: CmsFavoriteService;
    let cmsServerApi: CmsApiService;
    let appConfig: AppConfig;

    /**
     * Mocked service for api service
     */
    class MockCmsApiService {
        public markAsFavorite(objectId: number, objectTypePrefix: string): Promise<any> {
            if (objectId === -1) {
                return Promise.reject(undefined);
            } else {
                return Promise.resolve({ id: `${objectTypePrefix}_{objectId}` });
            }
        }

        public markAsUnfavorite(objectId: number, objectTypePrefix: string): Promise<any> {
            if (objectId === -1) {
                return Promise.reject(undefined);
            } else {
                return Promise.resolve({ id: `${objectTypePrefix}_{objectId}` });
            }
        }
    }

    /**
     * Mocked service for app config
     */
    class MockAppConfig {
        public log(): string {
            return " ";
         }
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

    beforeEach(inject([CmsApiService, AppConfig], (sr1: CmsApiService, sr2: AppConfig) => {
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
        const spyMarkAsFavorite: any = spyOn(cmsServerApi, "markAsFavorite").and.returnValue(Observable.of(undefined));
        cmsFavoriteService.markObjectAsFavorite(0, "", []);
        tick();
        expect(spyMarkAsFavorite.calls.count()).toEqual(0);
    }));

    it("Service should return without invoking markAsUnFavorite API when objectType is empty", fakeAsync(() => {
        const spyMarkAsUnFavorite: any = spyOn(cmsServerApi, "markAsUnfavorite").and.returnValue(Observable.of(undefined));
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
