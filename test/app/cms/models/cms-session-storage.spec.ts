import { ComponentFixture, TestBed, async, inject } from "@angular/core/testing";
import { CMS_SESSION_STORAGE_ITEM } from "../../../../app/cms/models/cms-session-storage-item";

describe("CMS_SESSION_STORAGE_ITEM", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CMS_SESSION_STORAGE_ITEM]
        })
    });
    it("should expect the Storage Items Constants values not to be changed", async(() => {
      expect(CMS_SESSION_STORAGE_ITEM.USER).toEqual("User");
      expect(CMS_SESSION_STORAGE_ITEM.DISPLAY).toContain("Display");
      expect(CMS_SESSION_STORAGE_ITEM.SETTINGS).toEqual("Settings");
      expect(CMS_SESSION_STORAGE_ITEM.USER_LASTACTION_TIME).toContain("UserLastActionTime");
      expect(CMS_SESSION_STORAGE_ITEM.DISPLAYS_SEARCH_FILTER).toEqual("DisplaysSearchFilter");
      expect(CMS_SESSION_STORAGE_ITEM.SOURCES_SEARCH_FILTER).toContain("SourcesSearchFilter");
      expect(CMS_SESSION_STORAGE_ITEM.LAYOUTS_FAVORITE_FILTER).toContain("LayoutsFavoriteFilter");
      expect(CMS_SESSION_STORAGE_ITEM.DISPLAYS_FAVORITE_FILTER).toEqual("DisplaysFavoriteFilter");
      expect(CMS_SESSION_STORAGE_ITEM.SOURCES_FAVORITE_FILTER).toContain("SourcesFavoriteFilter");
    }));
});