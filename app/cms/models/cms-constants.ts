/**
 * Specfies set of constants used across applicartion.
 * This static class defines keys as constants to be used at number of places commonly.
 */
export class CMSConstants {
    static RTLLANGUAGES = ["ar"];
    static DISPLAYUPDATED = "DisplayUpdated";
    static DEFAULTLANGUAGE = "en";
    static COPYRIGHTYEAR = "2018";
    static WALL_CONNECTION = {
        DISPLAY_WALL_LIST: "show-available-walls-list",
        SPECIFIC_WALL: "auto-connect-to-specific-wall",
        RECENT_WALL: "auto-connect-to-most-recent-wall"
    };
    static MAXSELECTION = 20;
    static SOURCE_TYPE = {
        PERSPECTIVE: "perspective",
        SOURCE: "source"
    };
    static SELECT_DISPLAY = "select-display";
    static DEFAULT_FONT_SIZE = 16;
    static FONT_SIZES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
    static DEFAULT_PAGE_SIZE = 20;
    static PAGE_SIZES = [20, 30, 40, 50];
    static DEFAULT_TRANSPARENCY = 50;
    static TRANSPARENCY_STEPS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    static DEFAULT_LOGOFF_TIME = 0;
    static LOGOFF_TIME_STEPS = [0, 10, 20, 30, 40, 50, 60];
    static DEFAULT_FONT_COLOR = "#000";
    static DEFAULT_BACKGROUND_COLOR = "#bdbdbd"
}