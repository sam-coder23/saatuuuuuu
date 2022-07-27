/**
 * The responsibility of this class is to handle calculation related to Integer
 * @class ParsingManager
 */
import { CMSConstants } from "./../cms/models/cms-constants";

export class ParsingManager {
    /**
     * @method TO_INTEGER
     * function parses a string argument and returns an integer of the 10
     *  radix
     * @return {number} return numberValue
     */

    public static TO_INTEGER(value: any): number {
        return parseInt(value, CMSConstants.DECIMAL_SYSTEM);
    }

}
