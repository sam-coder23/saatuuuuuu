/**
 * Specfies set of constants used across applicartion.
 * This public static class defines keys as constants to be used at number of places commonly.
 * @class CMSConstants
 */
export class CMSConstants {
    public static RTLLANGUAGES = ["ar"];
    public static DISPLAYUPDATED = "DisplayUpdated";
    public static DEFAULTLANGUAGE = "en";
    public static COPYRIGHTYEAR = "2018";
    public static WALL_CONNECTION = {
        DISPLAY_WALL_LIST: "show-available-walls-list",
        SPECIFIC_WALL: "auto-connect-to-specific-wall",
        RECENT_WALL: "auto-connect-to-most-recent-wall"
    };
    public static MAXSELECTION = 20;
    public static SOURCE_TYPE = {
        PERSPECTIVE: "perspective",
        SOURCE: "source"
    };
    public static SELECT_DISPLAY = "select-display";
    public static DEFAULT_FONT_SIZE = 16;
    public static FONT_SIZES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
    public static DEFAULT_PAGE_SIZE = 20;
    public static PAGE_SIZES = [20, 30, 40, 50];
    public static DEFAULT_TRANSPARENCY = 50;
    public static TRANSPARENCY_STEPS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    public static DEFAULT_LOGOFF_TIME = 0;
    public static LOGOFF_TIME_STEPS = [0, 10, 20, 30, 40, 50, 60];
    public static DEFAULT_FONT_COLOR = "#000";
    public static DEFAULT_BACKGROUND_COLOR = "#bdbdbd"
}