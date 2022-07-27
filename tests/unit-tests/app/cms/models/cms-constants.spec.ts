/**
 * CMS Constants model contains all the nessecary application level constants.
 */
import { async, TestBed } from "@angular/core/testing";

import { CMSConstants } from "../../../../app/cms/models/cms-constants";

// tslint:disable:no-magic-numbers
describe("CMSConstants", () => {
    const expectedFontSize: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
    const expectedSteps: number[] = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const specConstants: any = {
        default_page_size: 20,
        default_font_size: 16,
        default_transparency: 50,
        max_selection: 20
    };
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CMSConstants]
        });
    });
    it("should expect the static values not to be changed", async(() => {
        expect(typeof CMSConstants.RTLLANGUAGES).not.toBeUndefined();
        expect(CMSConstants.RTLLANGUAGES).toContain("ar");
        expect(CMSConstants.DISPLAYUPDATED).toEqual("DisplayUpdated");
        expect(CMSConstants.DEFAULTLANGUAGE).toEqual("en");
        expect(CMSConstants.
            COPYRIGHTYEAR).toEqual("2018");
        expect(CMSConstants.WALL_CONNECTION.DISPLAY_WALL_LIST).toEqual("show-available-walls-list");
        expect(CMSConstants.WALL_CONNECTION.RECENT_WALL).toEqual("auto-connect-to-most-recent-wall");
        expect(CMSConstants.MAXSELECTION).toEqual(20);
        expect(CMSConstants.SOURCE_TYPE.PERSPECTIVE).toEqual("perspective");
        expect(CMSConstants.SOURCE_TYPE.SOURCE).toEqual("source");
        expect(CMSConstants.SELECT_DISPLAY).toEqual("select-display");
        expect(CMSConstants.DEFAULT_FONT_SIZE).toEqual(specConstants.default_font_size);
        expect(CMSConstants.FONT_SIZES).toEqual(expectedFontSize);
        expect(CMSConstants.DEFAULT_PAGE_SIZE).toEqual(specConstants.default_page_size);
        expect(CMSConstants.PAGE_SIZES).toEqual(expectedSteps.slice(2, 6));
        expect(CMSConstants.DEFAULT_TRANSPARENCY).toEqual(specConstants.default_transparency);
        expect(CMSConstants.TRANSPARENCY_STEPS).toEqual(expectedSteps);
        expect(CMSConstants.DEFAULT_LOGOFF_TIME).toEqual(0);
        expect(CMSConstants.LOGOFF_TIME_STEPS).toEqual(expectedSteps.slice(0, 7));
        expect(CMSConstants.DEFAULT_FONT_COLOR).toEqual("#000");
        expect(CMSConstants.DEFAULT_BACKGROUND_COLOR).toEqual("#bdbdbd");
    }));
});
