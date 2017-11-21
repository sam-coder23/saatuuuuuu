import { RegExManager } from "./RegEx";
import { Const } from "../util/Const";

describe("RegExManager method", () => {

    let mockUrl1 = "127.0.0.1:3000";
    let mockUrl2 = "255.255.255:3000";
    let expectedValue = "localhost:3000";

    it("IPToHost should return the converted url where IP is replaced with hostname", () => {
        expect(RegExManager.IPToHost(mockUrl1, "localhost")).toBe(expectedValue);
    });

    it("IPToHost should return same url if IP is not matched", () => {
        expect(RegExManager.IPToHost(mockUrl2, "localhost")).toBe(mockUrl2);
    });

});