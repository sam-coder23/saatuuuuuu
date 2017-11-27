import { TestBed, async } from "@angular/core/testing";
import { UserConfig, User } from "../../../../app/launchpad/models/cms-user.model";

describe("User Model: ", () => {

    let user, expectedLoggedInState = true;

    let expectedUserConfig: UserConfig = {
        username: "bcd-se-test",
        password: "bcdsetest"
    };

    let expectedSerializableObj = {
        username: "bcd-se-test",
        loggedIn: expectedLoggedInState
    };

    beforeEach(async () =>
        TestBed.configureTestingModule({}));

    beforeEach(() => {
        user = new User(expectedUserConfig);
    });

    it("should be defined", () => {
        expect(user).toBeDefined();
        expect(user.username).toBe(expectedUserConfig.username);
        expect(user.password).toBe(expectedUserConfig.password);
    });

    it("should set and get LoggedIn method", () => {
        // LoggedIn setter to set loggedIn property
        user.LoggedIn = expectedLoggedInState;
        // Expect loggedIn property to be set right
        expect(user.loggedIn).toBe(expectedLoggedInState);
        // Expect LoggedIn getter method to return the right state of login
        expect(user.LoggedIn).toBe(expectedLoggedInState);
    });

    it("should get UserName and Password", () => {
        expect(user.Username).toBe(expectedUserConfig.username);
        expect(user.Password).toBe(expectedUserConfig.password);
    });

    it("should return expected object from asSerializable method", () => {
        // LoggedIn setter to set loggedIn property
        user.LoggedIn = expectedLoggedInState;

        let serializableObj = user.asSerializable();
        expect(serializableObj).toEqual(expectedSerializableObj);
    });

    it("should return expected object from toJSON method", () => {
        let userJSON = user.toJSON();
        expect(userJSON).toEqual(expectedUserConfig);
    });

});
