/**
 * Test specification for URL utility class.
 */
import { Url } from "../../../../app/core/util/URL";

describe("Url method", () => {
    const mockUrl1: string = "127.0.0.1:3000";
    const mockUrl2: string = "255.255.255:3000";

    it("HasIP should return true if it has ip in url otherwise false", () => {
        expect(Url.HAS_IP(mockUrl1)).toBe(true);
        expect(Url.HAS_IP(mockUrl2)).toBe(false);
    });

    it("HasHostName should return true if url has hostname, not ip address in it", () => {
        expect(Url.HAS_HOST_NAME()).toBe(true);
    });

});
