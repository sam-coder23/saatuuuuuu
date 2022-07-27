/**
 * Test Specification for Virtual Scroll service.
 */
import { inject, TestBed } from "@angular/core/testing";
import { CmsSettingsService } from "../../../app/launchpad/settings/cms-settings.service";
import { CmsVirtualScrollService } from "../../../app/shared/cms-virtual-scroll.service";

describe("Service: CmsVirtualScrollService", () => {
    let cmsVirtualScrollService: CmsVirtualScrollService;
    let cmsSettingsService: CmsSettingsService;
    let scrollElement: HTMLElement;
    let dataStatus: string = "";
    const specConstants: any = {
        dataCount: 100,
        scrollBy: 1800,
        maxScroll: 1950,
        delay: 1000,
        highScroll: 1980
    };

    class MockedCmsSettingsService {
        public userSettings: any = {
            defaultPageSize: 20
        };
    }

    const getCmsData: Function = (): void => {
        dataStatus = "recordsFetched";
        cmsVirtualScrollService.loading = false;
    };

    beforeEach(async () =>
        TestBed.configureTestingModule({
            providers: [
                CmsVirtualScrollService,
                {
                    provide: CmsSettingsService,
                    useClass: MockedCmsSettingsService
                }
            ]
        }));

    beforeEach(inject([CmsSettingsService], (service: CmsSettingsService) => {
        cmsSettingsService = service;
        cmsVirtualScrollService = new CmsVirtualScrollService(cmsSettingsService);
    }));

    it("service should be able to attach scroll event listener and able to call scroll function", () => {
        const scrollContainer: HTMLElement = document.createElement("div");
        scrollContainer.setAttribute("id", "cms-scroller");
        scrollContainer.style.width = "1050px";
        scrollContainer.style.height = "550px";
        scrollContainer.style.overflow = "auto";
        scrollContainer.style.backgroundColor = "#bababa";
        const scrollDiv: HTMLElement = document.createElement("div");
        scrollDiv.setAttribute("id", "scroll-element");
        scrollDiv.style.width = "1000px";
        scrollDiv.style.height = "2000px";
        scrollContainer.appendChild(scrollDiv);
        document.body.appendChild(scrollContainer);

        scrollElement = document.getElementById("cms-scroller");

        // set total number of records
        cmsVirtualScrollService.dataCount = specConstants.dataCount;

        // add scroll event listener
        cmsVirtualScrollService.addScrollListener(scrollElement, () => {
            getCmsData();
            expect(dataStatus).toBe("recordsFetched");
            dataStatus = "";
        });

        // scroll to bottom
        document.getElementById("cms-scroller").scrollBy(0, specConstants.scrollBy);
    });

    it("service should be able to attach scroll event listener and able to call scroll ",
        () => {
        if (document.getElementById("cms-scroller")) {
            document.body.removeChild(document.getElementById("cms-scroller"));
        }
        const scrollContainer: HTMLElement = document.createElement("div");
        scrollContainer.setAttribute("id", "cms-scroller");
        scrollContainer.style.width = "1050px";
        scrollContainer.style.height = "550px";
        scrollContainer.style.overflow = "auto";
        scrollContainer.style.backgroundColor = "#bababa";

        const scrollDiv: HTMLElement = document.createElement("div");
        scrollDiv.setAttribute("id", "scroll-element");
        scrollDiv.style.width = "1000px";
        scrollDiv.style.height = "2000px";

        scrollContainer.appendChild(scrollDiv);
        document.body.appendChild(scrollContainer);

        scrollElement = document.getElementById("cms-scroller");

        // set total number of records
        cmsVirtualScrollService.dataCount = specConstants.dataCount;

        // add scroll event listener
        cmsVirtualScrollService.addScrollListener(scrollElement, () => {
            getCmsData();
            expect(dataStatus).toBe("recordsFetched");
            dataStatus = "";
        });

        // scroll to bottom
        document.getElementById("cms-scroller").scrollBy(0, specConstants.maxScroll);
    });

    it("service should be able to remove attached scroll event listener", () => {
        // remove scroll event listener
        cmsVirtualScrollService.addScrollListener(undefined, undefined);
        cmsVirtualScrollService.removeScrollListener();

        cmsVirtualScrollService.addScrollListener(scrollElement, undefined);
        cmsVirtualScrollService.removeScrollListener();

        // scroll to bottom
        document.getElementById("cms-scroller").scrollBy(0, specConstants.highScroll);

        delay(specConstants.delay).then(() => {
            expect(dataStatus).toBe("");
        });
    });
});
