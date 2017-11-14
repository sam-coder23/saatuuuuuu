import { ComponentFixture, TestBed, async, inject } from "@angular/core/testing";
import { CMSConstants } from "../../cms/models/cms-constants";

describe("CMSConstants", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CMSConstants]
        })
    });
    it("should expect the static values not to be changed", async(() => {
      expect(typeof CMSConstants.RTLLanguages).not.toBeUndefined();
      expect(CMSConstants.RTLLanguages).toContain("ar");
      expect(CMSConstants.DisplayUpdated).toEqual("DisplayUpdated");
      expect(CMSConstants.DefaultLanguage).toEqual("en");
      expect(CMSConstants.CopyrightYear).toEqual("2016");
      expect(CMSConstants.WALL_CONNECTION.DISPLAY_WALL_LIST).toEqual("show-available-walls-list");
      expect(CMSConstants.WALL_CONNECTION.SPECIFIC_WALL).toEqual("auto-connect-to-specific-wall");
      expect(CMSConstants.WALL_CONNECTION.RECENT_WALL).toEqual("auto-connect-to-most-recent-wall");
      expect(CMSConstants.MAXSELECTION).toEqual(20);
      expect(CMSConstants.SOURCE_TYPE.PERSPECTIVE).toEqual("perspective");
      expect(CMSConstants.SOURCE_TYPE.SOURCE).toEqual("source");
    }));
});