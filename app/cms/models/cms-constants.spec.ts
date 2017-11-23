import { ComponentFixture, TestBed, async, inject } from "@angular/core/testing";
import { CMSConstants } from "../../cms/models/cms-constants";

describe("CMSConstants", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CMSConstants]
        })
    });
    it("should expect the static values not to be changed", async(() => {
        expect(typeof CMSConstants.RTLLANGUAGES).not.toBeUndefined();
        expect(CMSConstants.RTLLANGUAGES).toContain("ar");
        expect(CMSConstants.DISPLAYUPDATED).toEqual("DisplayUpdated");
        expect(CMSConstants.DEFAULTLANGUAGE).toEqual("en");
        expect(CMSConstants.COPYRIGHTYEAR).toEqual("2018");
        expect(CMSConstants.WALL_CONNECTION.DISPLAY_WALL_LIST).toEqual("show-available-walls-list");
        expect(CMSConstants.WALL_CONNECTION.SPECIFIC_WALL).toEqual("auto-connect-to-specific-wall");
        expect(CMSConstants.WALL_CONNECTION.RECENT_WALL).toEqual("auto-connect-to-most-recent-wall");
        expect(CMSConstants.MAXSELECTION).toEqual(20);
        expect(CMSConstants.SOURCE_TYPE.PERSPECTIVE).toEqual("perspective");
        expect(CMSConstants.SOURCE_TYPE.SOURCE).toEqual("source");
        expect(CMSConstants.SELECT_DISPLAY).toEqual("select-display");
        expect(CMSConstants.DEFAULT_FONT_SIZE).toEqual(16);
        expect(CMSConstants.FONT_SIZES).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72]);
        expect(CMSConstants.DEFAULT_PAGE_SIZE).toEqual(20);
        expect(CMSConstants.PAGE_SIZES).toEqual([20, 30, 40, 50]);
        expect(CMSConstants.DEFAULT_TRANSPARENCY).toEqual(50);
        expect(CMSConstants.TRANSPARENCY_STEPS).toEqual([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
        expect(CMSConstants.DEFAULT_LOGOFF_TIME).toEqual(0);
        expect(CMSConstants.LOGOFF_TIME_STEPS).toEqual([0, 10, 20, 30, 40, 50, 60]);
        expect(CMSConstants.DEFAULT_FONT_COLOR).toEqual("#000");
        expect(CMSConstants.DEFAULT_BACKGROUND_COLOR).toEqual("#bdbdbd");
    }));
});