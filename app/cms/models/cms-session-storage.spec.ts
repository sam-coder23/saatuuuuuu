import { ComponentFixture, TestBed, async, inject } from "@angular/core/testing";
import { CMS_SESSION_STORAGE_ITEM } from "../../cms/models/cms-session-storage-item";

describe("CMS_SESSION_STORAGE_ITEM", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CMS_SESSION_STORAGE_ITEM]
        })
    });
    it("should expect the Storage Items Constants values not to be changed", async(() => {
      expect(CMS_SESSION_STORAGE_ITEM.User).toEqual("User");
      expect(CMS_SESSION_STORAGE_ITEM.Display).toContain("Display");
      expect(CMS_SESSION_STORAGE_ITEM.Clipboard).toContain("Clipboard");
      expect(CMS_SESSION_STORAGE_ITEM.Settings).toEqual("Settings");
      expect(CMS_SESSION_STORAGE_ITEM.UserLastActionTime).toContain("UserLastActionTime");
      expect(CMS_SESSION_STORAGE_ITEM.LayoutsSearchFilter).toContain("LayoutsSearchFilter");
      expect(CMS_SESSION_STORAGE_ITEM.DisplaysSearchFilter).toEqual("DisplaysSearchFilter");
      expect(CMS_SESSION_STORAGE_ITEM.SourcesSearchFilter).toContain("SourcesSearchFilter");
      expect(CMS_SESSION_STORAGE_ITEM.LayoutsFavoriteFilter).toContain("LayoutsFavoriteFilter");
      expect(CMS_SESSION_STORAGE_ITEM.DisplaysFavoriteFilter).toEqual("DisplaysFavoriteFilter");
      expect(CMS_SESSION_STORAGE_ITEM.SourcesFavoriteFilter).toContain("SourcesFavoriteFilter");
      expect(CMS_SESSION_STORAGE_ITEM.ClipboardSelectedSources).toContain("ClipboardSelectedSources");
    }));
});