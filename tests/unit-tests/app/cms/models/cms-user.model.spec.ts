/**
 * Test specification for User model.
 */
import { IUserToken } from "../../../../app/cms/models/cms-user-token";
import { IUserConfig, User } from "../../../../app/cms/models/cms-user.model";

describe("User Model: ", () => {
    let user: User;
    const expectedLoggedInState: boolean = true;

    const expectedIUserConfig: IUserConfig = {
        username: "bcd-se-test",
        password: "bcdsetest"
    };

    const expectedSerializableObj: IUserToken = {
        username: "bcd-se-test",
        loggedIn: expectedLoggedInState
    };
    beforeEach(() => {
        user = new User(expectedIUserConfig);
    });

    it("should be defined", () => {
        expect(user).toBeDefined();
        expect(user.username).toBe(expectedIUserConfig.username);
        expect(user.password).toBe(expectedIUserConfig.password);
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
        expect(user.Username).toBe(expectedIUserConfig.username);
        expect(user.Password).toBe(expectedIUserConfig.password);
    });

    it("should return expected object from asSerializable method", () => {
        // LoggedIn setter to set loggedIn property
        user.LoggedIn = expectedLoggedInState;

        const serializableObj: IUserToken = user.asSerializable();
        expect(serializableObj).toEqual(expectedSerializableObj);
    });

    it("should return expected object from toJSON method", () => {
        const userJSON: IUserConfig = user.toJSON();
        expect(userJSON).toEqual(expectedIUserConfig);
    });

});
