import {TestBed, inject, async } from "@angular/core/testing";
import { CmsVirtualScrollService } from "./cms-virtual-scroll.service";
import { CmsSettingsService } from "./../launchpad/settings/cms-settings.service";

describe("Service: CmsVirtualScrollService", () => {
    let cmsVirtualScrollService;
    let cmsSettingsService;
    let scrollElement: HTMLElement;
    let dataStatus = "";

    class MockedCmsSettingsService {
        userSettings = {
            defaultPageSize: 20
        }
    };

    function getCmsData() {
        dataStatus = "recordsFetched";
        cmsVirtualScrollService.loading = false;
    }

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

    beforeEach(inject([CmsSettingsService], sr => {
        cmsSettingsService = sr;
    }));

    beforeEach(() => {
        cmsVirtualScrollService = new CmsVirtualScrollService(cmsSettingsService);
    });

    it("service should be able to attach scroll event listener and able to call scroll function", () => {
        let scrollContainer = document.createElement("div");
        scrollContainer.setAttribute("id", "cms-scroller");
        scrollContainer.style.width = "1050px";
        scrollContainer.style.height = "550px";
        scrollContainer.style.overflow = "auto";
        scrollContainer.style.backgroundColor = "#bababa";

        let scrollDiv = document.createElement("div");
        scrollDiv.setAttribute("id", "scroll-element");
        scrollDiv.style.width = "1000px";
        scrollDiv.style.height = "2000px";

        scrollContainer.appendChild(scrollDiv);
        document.body.appendChild(scrollContainer);

        scrollElement = document.getElementById("cms-scroller");

        // set total number of records
        cmsVirtualScrollService.dataCount = 100;

        // add scroll event listener
        cmsVirtualScrollService.addScrollListener(scrollElement, () => {
            getCmsData();
        });

        // scroll to bottom
        document.getElementById("cms-scroller").scrollBy(0, 1800);

        window.setTimeout(() => {
            expect(dataStatus).toBe("recordsFetched");
        }, 0)
    });

    it("service should be able to attach scroll event listener and able to call scroll function", () => {
        let scrollContainer = document.createElement("div");
        scrollContainer.setAttribute("id", "cms-scroller");
        scrollContainer.style.width = "1050px";
        scrollContainer.style.height = "550px";
        scrollContainer.style.overflow = "auto";
        scrollContainer.style.backgroundColor = "#bababa";

        let scrollDiv = document.createElement("div");
        scrollDiv.setAttribute("id", "scroll-element");
        scrollDiv.style.width = "1000px";
        scrollDiv.style.height = "2000px";

        scrollContainer.appendChild(scrollDiv);
        document.body.appendChild(scrollContainer);

        scrollElement = document.getElementById("cms-scroller");

        // set total number of records
        cmsVirtualScrollService.dataCount = 100;

        // add scroll event listener
        cmsVirtualScrollService.addScrollListener(scrollElement, () => {
            getCmsData();
        });

        // scroll to bottom
        document.getElementById("cms-scroller").scrollBy(0, 1950);

        window.setTimeout(() => {
            expect(dataStatus).toBe("recordsFetched");
            dataStatus = "";
        }, 0);
    });

    it("service should be able to remove attached scroll event listener", () => {
        // remove scroll event listener
        cmsVirtualScrollService.removeScrollListener();

        // scroll to bottom
        document.getElementById("cms-scroller").scrollBy(0, 1980);

        window.setTimeout(() => {
            expect(dataStatus).toBe("");
        }, 0);
    });

});