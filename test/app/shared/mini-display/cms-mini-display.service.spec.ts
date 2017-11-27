import { TestBed, inject, async } from "@angular/core/testing";
import { Observable } from "rxjs/Observable";
import { mockDisplay1, mockDisplay2, expectedMiniDisplayResponse1, expectedMiniDisplayResponse2 } from "./cms-mini-display.service.mock";
import { CmsMiniDisplayService } from "../../../../app/shared/mini-display/cms-mini-display.service";
import { CmsApiService } from "../../../../app/cms/api/cms-api.service";
import { AppConfig } from "../../../../app/config";
import { Display } from "../../../../app/cms/models/cms-display";
import { ISize } from "../../../../app/cms/models/cms-size";
import { TileContent } from "../../../../app/cms/models/cms-tile-content";
import { Tile } from "../../../../app/cms/models/cms-tile";


describe("Service: CmsMiniDisplayService", () => {

    let cmsMiniDisplayService: CmsMiniDisplayService;
    let cmsServerApi: CmsApiService;
    let appConfig: AppConfig;
    let mockDisplay;

    /**
     * Mocked service for api service
     */
    class MockCmsApiService {
        getSelectedDisplayContent(displayId: number): Observable<Display> {
            let display = new Display(mockDisplay);
            return Observable.of(display);
        }
    }

    /**
     * Method to create mock DOM element.
     */
    let createDOM = function () {
        let container = fetchDOM("mini-display-container");
        if (!container) {
            let testHTMLElement = document.createElement("div");
            testHTMLElement.id = "mini-display-container";
            testHTMLElement.style.width = "1366px";
            testHTMLElement.style.height = "534px";
            testHTMLElement.style.bottom = "598px";
            testHTMLElement.style.left = "0px";
            testHTMLElement.style.right = "1366px";
            testHTMLElement.style.top = "64px";
            document.body.appendChild(testHTMLElement);
        }
    };

    /**
     * Method to fetch mock DOM element.
     */
    let fetchDOM = function (id: string): HTMLElement {
        if (id) {
            return document.getElementById(id);
        }
    };

    beforeEach(async () =>
        TestBed.configureTestingModule({
            providers: [
                AppConfig,
                {
                    provide: CmsApiService,
                    useClass: MockCmsApiService
                }
            ]
        }));

    beforeEach(inject([CmsApiService, AppConfig], (cmsServerApi, appConfig) => {
        cmsServerApi = cmsServerApi;
        appConfig = appConfig;
        cmsMiniDisplayService = new CmsMiniDisplayService(cmsServerApi, appConfig);
    }));

    it("should be defined", () => {
        expect(cmsMiniDisplayService).toBeDefined();
    });

    it("should initialize mini-display service properties", () => {
        expect(cmsMiniDisplayService.display).toBeNull();
        expect(cmsMiniDisplayService.zoomLevel).toBe(0);
        expect(cmsMiniDisplayService.scrollPosition.Left).toBe(0);
        expect(cmsMiniDisplayService.scrollPosition.Top).toBe(0);
        expect(cmsMiniDisplayService.panend).toBeFalsy();
    });

    it("should return expected response from getMiniDisplayTilerInfoWithContent method when display width is less than height", () => {
        createDOM();
        let containerElement: HTMLElement = fetchDOM("mini-display-container");
        mockDisplay = mockDisplay1;

        cmsMiniDisplayService.getMiniDisplayTilerInfoWithContent(mockDisplay.id, containerElement)
            .subscribe((miniDisplayResponse: {
                displaySize: ISize,
                miniDisplayTilerList: Tile[],
                miniDisplayContentList: TileContent[],
                displayTilerList: Tile[],
                miniDisplaySize: ISize
            }) => {
                /**
                 * Compare lastModified property in miniDisplayResponse with the lastModified property in expectedMiniDisplayResponse.
                 * Also, since timestamp cannot be compared for equality, that is why GreaterThan is used. 
                 */
                expect(parseInt(miniDisplayResponse.miniDisplayContentList[0].lastModified)).toBeGreaterThan(parseInt(expectedMiniDisplayResponse1.miniDisplayContentList[0].lastModified));
                expect(parseInt(miniDisplayResponse.miniDisplayContentList[1].lastModified)).toBeGreaterThan(parseInt(expectedMiniDisplayResponse1.miniDisplayContentList[1].lastModified));
                miniDisplayResponse.miniDisplayContentList[0].lastModified = expectedMiniDisplayResponse1.miniDisplayContentList[0].lastModified;
                miniDisplayResponse.miniDisplayContentList[1].lastModified = expectedMiniDisplayResponse1.miniDisplayContentList[1].lastModified;

                expect(miniDisplayResponse.displaySize).toEqual(expectedMiniDisplayResponse1.displaySize);
                expect(miniDisplayResponse.miniDisplayTilerList).toEqual(expectedMiniDisplayResponse1.miniDisplayTilerList);
                expect(miniDisplayResponse.miniDisplayContentList).toEqual(expectedMiniDisplayResponse1.miniDisplayContentList);
                expect(miniDisplayResponse.displayTilerList).toEqual(expectedMiniDisplayResponse1.displayTilerList);
                expect(miniDisplayResponse.miniDisplaySize).toEqual(expectedMiniDisplayResponse1.miniDisplaySize);
            });
    });

    it("should return expected response from getMiniDisplayTilerInfoWithContent method when display width is more than height", () => {
        createDOM();
        let containerElement: HTMLElement = fetchDOM("mini-display-container");
        mockDisplay = mockDisplay2;

        cmsMiniDisplayService.getMiniDisplayTilerInfoWithContent(mockDisplay.id, containerElement)
            .subscribe((miniDisplayResponse: {
                displaySize: ISize,
                miniDisplayTilerList: Tile[],
                miniDisplayContentList: TileContent[],
                displayTilerList: Tile[],
                miniDisplaySize: ISize
            }) => {
                /**
                 * Compare lastModified property in miniDisplayResponse with the lastModified property in expectedMiniDisplayResponse.
                 * Also, since timestamp cannot be compared for equality, that is why GreaterThan is used. 
                 */
                expect(parseInt(miniDisplayResponse.miniDisplayContentList[0].lastModified)).toBeGreaterThan(parseInt(expectedMiniDisplayResponse2.miniDisplayContentList[0].lastModified));
                expect(parseInt(miniDisplayResponse.miniDisplayContentList[1].lastModified)).toBeGreaterThan(parseInt(expectedMiniDisplayResponse2.miniDisplayContentList[1].lastModified));
                miniDisplayResponse.miniDisplayContentList[0].lastModified = expectedMiniDisplayResponse2.miniDisplayContentList[0].lastModified;
                miniDisplayResponse.miniDisplayContentList[1].lastModified = expectedMiniDisplayResponse2.miniDisplayContentList[1].lastModified;

                expect(miniDisplayResponse.displaySize).toEqual(expectedMiniDisplayResponse2.displaySize);
                expect(miniDisplayResponse.miniDisplayTilerList).toEqual(expectedMiniDisplayResponse2.miniDisplayTilerList);
                expect(miniDisplayResponse.miniDisplayContentList).toEqual(expectedMiniDisplayResponse2.miniDisplayContentList);
                expect(miniDisplayResponse.displayTilerList).toEqual(expectedMiniDisplayResponse2.displayTilerList);
                expect(miniDisplayResponse.miniDisplaySize).toEqual(expectedMiniDisplayResponse2.miniDisplaySize);
            });
    });

    it("should return expected values from calculateAdjustedViewTilerRectangles method", () => {
        // When empty array is passed as an argument to calculateAdjustedViewTilerRectangles method
        expect(cmsMiniDisplayService.calculateAdjustedViewTilerRectangles([])).toBeUndefined();
    });

    it("should return expected values from calculateAdjustedViewSourceRectangles method", () => {
        // When undefined variable is passed as an argument to calculateAdjustedViewSourceRectangles method
        expect(cmsMiniDisplayService.calculateAdjustedViewSourceRectangles(undefined, [])).toBeUndefined();
    });

}); 
