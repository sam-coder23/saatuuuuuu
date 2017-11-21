import { Validation } from "./Validation";

describe("Validation method", () => {

    it("IsNull should return true if value is null otherwise false", () => {
        expect(Validation.IsNull(null)).toBe(true);
        expect(Validation.IsNull({})).toBe(false);
    });

    it("IsUndefined should  return true if value is undefined otherwise false", () => {
        expect(Validation.IsUndefined(undefined)).toBe(true);
        expect(Validation.IsUndefined({})).toBe(false);
    });

    it("IsNullOrUndefined should  return true if value is null or undefined otherwise false", () => {
        expect(Validation.IsNullOrUndefined(null)).toBe(true);
        expect(Validation.IsNullOrUndefined(undefined)).toBe(true);
        expect(Validation.IsNullOrUndefined({})).toBe(false);
    });
});