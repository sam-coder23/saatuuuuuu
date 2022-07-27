/**
 * Test specification for RegEx utility.
 */
import { RegExManager } from "../../../../app/core/util/RegEx";

describe("RegExManager method", () => {
    const mockUrl1: string = "127.0.0.1:3001";
    const mockUrl2: string = "255.255.255:3001";
    const expectedValue: string = "localhost:3001";

    it("IPToHost should return the converted url where IP is replaced with hostname", () => {
        expect(RegExManager.IPTOHOST(mockUrl1, "localhost")).toBe(expectedValue);
    });

    it("IPToHost should return same url if IP is not matched", () => {
        expect(RegExManager.IPTOHOST(mockUrl2, "localhost")).toBe(mockUrl2);
    });

});
