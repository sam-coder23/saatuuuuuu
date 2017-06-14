import {Const} from '../util/Const';
import {Validation} from '../util/Validation';

export
/**
 * @class Url
 * Holds logic related to Url related method.
 * Shouldn't hold anything except static.
 */
class Url {
    
    /**
     * @method HasIP
     * Accepts a string and returns true of that string has IP in it.
     * @return {boolean} return true if it has ip in url
     */
    public static HasIP(url) : boolean {
        let status = false;
        status = url.match(Const.IPRegex);
        return !Validation.IsNullOrUndefined(status);
    }

    /**
     * @method HasIP
     * Checks application url and returns true if url has hostname not ip address in it.
     * @return {boolean} return true if it has ip in url
     */
    public static HasHostName() : boolean {
        return !Url.HasIP(window.location.host);
    }
}