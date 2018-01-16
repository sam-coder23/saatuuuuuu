/**
 * This class is responsible to handle parsing logic test case.
 */
import { CMSConstants } from "./../../../app/cms/models/cms-constants";
import { ParsingManager } from "./../../../app/utils/parsing-manager-util";

describe("TO_INTEGER method", () => {
    it("IsNull should return true if value is null otherwise false", () => {
        const data: string = "41";
        const six: number = 6;
        const fourtyOne: number = 41;
        expect(ParsingManager.TO_INTEGER(six)).toBe(six);
        expect(ParsingManager.TO_INTEGER(data)).toBe(fourtyOne);
        expect(ParsingManager.TO_INTEGER(undefined)).toBeNaN();
        expect(ParsingManager.TO_INTEGER(CMSConstants.NULL_VALUE)).toBeNaN();
        expect(ParsingManager.TO_INTEGER("")).toBeNaN();
    });
});
