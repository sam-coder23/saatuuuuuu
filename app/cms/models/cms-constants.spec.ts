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
      expect(CMSConstants.DisplayUpdated).toContain("DisplayUpdated");
    }));
});