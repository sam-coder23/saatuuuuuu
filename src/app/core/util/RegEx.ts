/**
 * Holds logic related to how regex will be implemented in our app
 * Shouldn't hold anything except static.
 * @class Url
 */

import { Const } from "../util/Const";

export class RegExManager {
    /**
     * @method HasIP
     * Accepts a string and returns the converted url where ip is replaced with hostname.
     * incase there is no match that means url doesn't have IP it will return back the same url
     * @return {string} return converted url
     */
    public static IPTOHOST (url: string, hostName: string): string {
        const matchedArray: RegExpMatchArray = url.match(Const.ipRegex);
        let value: string = url;

        // we just need the very 1st entry as our regex is not global
        if (matchedArray && matchedArray.length > 0) {
            value = url.replace(matchedArray[0], hostName);
        }

        return value;
    }
}
