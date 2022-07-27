/**
 * Test specification for Validation utility class.
 */
import { Validation } from "../../../../app/core/util/Validation";

describe("Validation method", () => {
// tslint:disable:no-null-keyword
    it("IsNull should return true if value is null otherwise false", () => {
        expect(Validation.IS_NULL(null)).toBe(true);
        expect(Validation.IS_NULL({})).toBe(false);
    });

    it("IsUndefined should  return true if value is undefined otherwise false", () => {
        expect(Validation.IS_UNDEFINED(undefined)).toBe(true);
        expect(Validation.IS_UNDEFINED({})).toBe(false);
    });

    it("IsNullOrUndefined should  return true if value is null or undefined otherwise false", () => {
        expect(Validation.IS_NULL_OR_UNDEFINED(null)).toBe(true);
        expect(Validation.IS_NULL_OR_UNDEFINED(undefined)).toBe(true);
        expect(Validation.IS_NULL_OR_UNDEFINED({})).toBe(false);
    });
});
