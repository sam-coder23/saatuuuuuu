import { Const } from "../util/Const";
import { Validation } from "../util/Validation";

/**
 * Holds logic related to Url related method.
 * Shouldn't hold anything except static. 
 * @class Url
 * @property {boolean} HasIP
 * @property {boolean} HasHostName
 */
export class Url {
    /**
     * Accepts a string and returns true of that string has IP in it.
     * @method HasIP
     * @return {boolean} return true if it has ip in url
     */
    public static HasIP(url): boolean {
        let status = false;
        status = url.match(Const.IPRegex);
        return !Validation.IsNullOrUndefined(status);
    }

    /**
     * Checks application url and returns true if url has hostname not ip address in it.
     * @method HasHostName
     * @return {boolean} return true if it has ip in url
     */
    public static HasHostName(): boolean {
        return !Url.HasIP(window.location.host);
    }
}