/**
 * Test specification for session storage item.
 */
import { CmsSessionStorageItem } from "../../../../app/cms/models/cms-session-storage-item";

describe("CMS_SESSION_STORAGE_ITEM", () => {
    it("should expect the Storage Items Constants values not to be changed", () => {
        expect(CmsSessionStorageItem.USER).toEqual("User");
        expect(CmsSessionStorageItem.DISPLAY).toContain("Display");
        expect(CmsSessionStorageItem.SETTINGS).toEqual("Settings");
        expect(CmsSessionStorageItem.USER_LASTACTION_TIME).toContain("UserLastActionTime");
        expect(CmsSessionStorageItem.DISPLAYS_SEARCH_FILTER).toEqual("DisplaysSearchFilter");
        expect(CmsSessionStorageItem.SOURCES_SEARCH_FILTER).toContain("SourcesSearchFilter");
        expect(CmsSessionStorageItem.LAYOUTS_FAVORITE_FILTER).toContain("LayoutsFavoriteFilter");
        expect(CmsSessionStorageItem.DISPLAYS_FAVORITE_FILTER).toEqual("DisplaysFavoriteFilter");
        expect(CmsSessionStorageItem.SOURCES_FAVORITE_FILTER).toContain("SourcesFavoriteFilter");
    });
});
