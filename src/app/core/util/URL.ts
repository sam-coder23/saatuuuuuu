/**
 * Holds logic related to Url related method.
 * Shouldn't hold anything except static.
 * @class Url
 * @property {boolean} HasIP
 * @property {boolean} HasHostName
 */

import { Const } from "../util/Const";
import { Validation } from "../util/Validation";

export class Url {
    /**
     * Accepts a string and returns true of that string has IP in it.
     * @method HASIP
     * @return {boolean} return true if it has ip in url
     */
    public static HAS_IP (url: any): boolean {
        let status: boolean = false;
        status = url.match(Const.ipRegex);

        return !Validation.IS_NULL_OR_UNDEFINED(status);
    }

    /**
     * Checks application url and returns true if url has hostname not ip address in it.
     * @method HASHOSTNAME
     * @return {boolean} return true if it has ip in url
     */
    public static HAS_HOST_NAME (): boolean {
        return !Url.HAS_IP(window.location.host);
    }
}
