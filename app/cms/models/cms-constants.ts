/**
 * Specfies set of constants used across applicartion.
 * This public static class defines keys as constants to be used at number of places commonly.
 * @class CMSConstants
 * @class CMSConstants
 */
export class CMSConstants {
    public static RTLLANGUAGES: string[] = ["ar"];
    public static DISPLAYUPDATED: string = "DisplayUpdated";
    public static DEFAULTLANGUAGE: string = "en";
    public static COPYRIGHTYEAR: string = "2018";
    public static WALL_CONNECTION: any = {
        DISPLAY_WALL_LIST: "show-available-walls-list",
        SPECIFIC_WALL: "auto-connect-to-specific-wall",
        RECENT_WALL: "auto-connect-to-most-recent-wall"
    };
    public static MAXSELECTION: number = 20;
    public static SOURCE_TYPE: any = {
        PERSPECTIVE: "perspective",
        SOURCE: "source"
    };
    public static SELECT_DISPLAY: string = "select-display";
    public static DEFAULT_FONT_SIZE: number = 16;
    public static FONT_SIZES: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
    public static DEFAULT_PAGE_SIZE: number = 20;
    public static PAGE_SIZES: number[] = [20, 30, 40, 50];
    public static DEFAULT_TRANSPARENCY: number = 50;
    public static TRANSPARENCY_STEPS: number[] = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    public static DEFAULT_LOGOFF_TIME: number = 0;
    public static LOGOFF_TIME_STEPS: number[] = [0, 10, 20, 30, 40, 50, 60];
    public static DEFAULT_FONT_COLOR: string = "#000";
    public static DEFAULT_BACKGROUND_COLOR: string = "#bdbdbd";
    public static NO_DISPLAY_FOUND: string = "nodisplayfound";
    public static APP_VERSION: string = "1.0.1";
    public static BUILD_VERSION: string = "1.1 Build";
}
