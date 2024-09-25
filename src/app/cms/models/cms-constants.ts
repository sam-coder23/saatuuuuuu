/**
 * Specfies set of constants used across applicartion.
 * This public static class defines keys as constants to be used at number of places commonly.
 * @class CMSConstants
 * @class CMSConstants
 */

// tslint:disable:no-magic-numbers

export class CMSConstants {
    public static NO_DISPLAY: string = "nodisplay";
    public static DISPLAYS_PANEL: string = "/displays-panel";
    public static RTLLANGUAGES: string[] = ["ar"];
    public static DISPLAYUPDATED: string = "DisplayUpdated";
    public static DEFAULTLANGUAGE: string = "en";
    public static COPYRIGHTYEAR: string = "2024";
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
    public static DEFAULT_PAGE_SIZE: number = 100;
    public static PAGE_SIZES: number[] = [20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];
    public static DEFAULT_TRANSPARENCY: number = 50;
    public static TRANSPARENCY_STEPS: number[] = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    public static DEFAULT_LOGOFF_TIME: number = 0;
    public static LOGOFF_TIME_STEPS: number[] = [0, 10, 20, 30, 40, 50, 60];
    public static DEFAULT_FONT_COLOR: string = "#000";
    public static DEFAULT_BACKGROUND_COLOR: string = "#bdbdbd";
    public static NO_DISPLAY_FOUND: string = "nodisplayfound";
    public static APP_VERSION: string = "2.0.0";
    public static BUILD_VERSION: string = "1.1 Build";
    public static DECIMAL_SYSTEM: number = 10;
    // tslint:disable-next-line:no-null-keyword
    public static NULL_VALUE: object = null;
    public static ERRORCODE: any = {
        LICENSE_ERROR: 403,
        SERVER_ERROR: 503,
        SETTING_ERROR: 406,
        USER_DISABLED: 409,
        NOT_FOUND: 404,
        SERVER_UNAVAILABLE: 0,
        OTHER_ERROR : -1
    };
    public static HTTP_STATUS_CODES: {
        [key: string]: number
    } = {
            UNAUTHORIZED: 401,
            FORBIDDEN: 403,
            NOT_FOUND: 404,
            NOT_ACCEPTABLE: 406,
            CONFLICT: 409,
            INTERNAL_SERVER_ERROR: 500,
            SERVICE_UNAVAILABLE: 503
        };
}
