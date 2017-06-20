export
/**
 * @class Validation
 * Holds validation methods.
 * Shouldn't hold anything except static.
 */
class Validation {    

    /**
     * Returns true if value is null
     * @method IsNull
     * @return {boolean}
     */
    public static IsNull(value) : boolean {
        return value === null;
    }

    /**
     * Returns true if value is undefined
     * @method IsNull
     * @return {boolean}
     */
    public static IsUndefined(value) : boolean {
        return typeof value === "undefined";
    }

    /**
     * Returns true if value is either null or undefined
     * @method IsNullOrUndefined
     * @return {boolean}
     */
    public static IsNullOrUndefined(value) : boolean {
        return Validation.IsNull(value) || Validation.IsUndefined(value);
    }
}