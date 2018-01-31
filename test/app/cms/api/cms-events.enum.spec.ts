/**
 * test specification for  cms-events enumeration
 */
import { CMS_EVENTS } from "../../../../app/cms/api/cms-events.enum";
describe("CMS-Events - ", () => {
    it("should expect enums not to be changed", () => {
        expect(CMS_EVENTS[CMS_EVENTS.MiniDisplay]).toBe("MiniDisplay");
        expect(CMS_EVENTS[CMS_EVENTS.DisplayList]).toBe("DisplayList");
        expect(CMS_EVENTS[CMS_EVENTS.SourceList]).toBe("SourceList");
        expect(CMS_EVENTS[CMS_EVENTS.Display]).toBe("Display");
        expect(CMS_EVENTS[CMS_EVENTS.Application]).toBe("Application");
        expect(CMS_EVENTS[CMS_EVENTS.TileList]).toBe("TileList");
    });

});
