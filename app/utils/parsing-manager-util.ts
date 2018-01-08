/**
 * The responsibility of this class is to handle calculation related to Integer
 * @class ParsingManager
 */

export class ParsingManager {
    /**
     * @method TO_INTEGER
     * function parses a string argument and returns an integer of the 10
     *  radix
     * @return {number} return numberValue
     */

    public static TO_INTEGER(value: any): number {
        const radix: number = 10;

        return parseInt(value, radix);
    }

}
