import { TestBed, async } from "@angular/core/testing";
import { APIResponse } from "../../../../app/cms/models/api-response.model";

describe("API-Response Model: ", () => {

    let apiResponse;
    let expectedStatus = true;
    let expectedErrorMessage = "Some Error Message.";
    let expectedResponse = {};

    beforeEach(async () =>
        TestBed.configureTestingModule({}));

    beforeEach(() => {
        apiResponse = new APIResponse(expectedStatus, expectedErrorMessage, expectedResponse);
    });

    it("should be defined", () => {
        expect(apiResponse).toBeDefined();
        expect(apiResponse.status).toBe(expectedStatus);
        expect(apiResponse.errorMessage).toBe(expectedErrorMessage);
        expect(apiResponse.response).toBe(expectedResponse);
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
