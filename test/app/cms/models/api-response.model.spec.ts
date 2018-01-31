/**
 * Specification for API Response model.
 */
import { APIResponse } from "../../../../app/cms/models/api-response.model";

describe("API-Response Model: ", () => {
    let apiResponse: APIResponse;
    const expectedStatus: boolean = true;
    const expectedErrorMessage: string = "Some Error Message.";
    const expectedResponse: any = {};

    beforeEach(() => {
        apiResponse = new APIResponse(expectedStatus, expectedErrorMessage, expectedResponse);
    });
    it("should be defined", () => {
        expect(apiResponse).toBeDefined();
        expect(apiResponse.Status).toBe(expectedStatus);
        expect(apiResponse.ErrorMessage).toBe(expectedErrorMessage);
        expect(apiResponse.Response).toBe(expectedResponse);
    });

    it("should get Status, ErrorMessage and Response", () => {
        expect(apiResponse.Status).toBe(expectedStatus);
        expect(apiResponse.ErrorMessage).toBe(expectedErrorMessage);
        expect(apiResponse.Response).toBe(expectedResponse);
    });

    it("should return empty object from asSerializable method", () => {
        expect(apiResponse.asSerializable()).toEqual({});
    });

    it("should return empty object from toJSON method", () => {
        expect(apiResponse.toJSON()).toEqual({});
    });
});
