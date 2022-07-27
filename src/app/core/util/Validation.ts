/**
 * Holds validation methods.
 * Shouldn't hold anything except static.
 * @class Validation
 */
import { CMSConstants } from "../../cms/models/cms-constants";

export class Validation {
    /**
     * Returns true if value is null
     * @method IsNull
     * @return {boolean}
     */
    public static IS_NULL (value: any) : boolean {
        return value === CMSConstants.NULL_VALUE;
    }

    /**
     * Returns true if value is undefined
     * @method IsNull
     * @return {boolean}
     */
    public static IS_UNDEFINED (value: any) : boolean {
        return value === undefined;
    }

    /**
     * Returns true if value is either null or undefined
     * @method IsNullOrUndefined
     * @return {boolean}
     */
    public static IS_NULL_OR_UNDEFINED (value: any) : boolean {
        return Validation.IS_NULL(value) || Validation.IS_UNDEFINED(value);
    }
}
