import { IUserToken } from "./cms-user-token";

/**
 * This interface is reponsible for user model type checks
 * @interface UserConfig
 * @property {string} username For username type check
 * @property {string} password For password type check
 */
export interface UserConfig {
    username: string;
    password: string;
}

/**
 * Roles of this class is handle to user related stuff
 * @class User
 * @constructor
 * @property {string} userName To contain username value
 * @property {string} password To contain the user password
 * @property {string} loggedIn Stand for varaible which will keep the status of login whether user is login or not
 */
export class User {
    public username: string;
    public password: string;
    public loggedIn: boolean;

    constructor(user: UserConfig) {
        this.username = user.username;
        this.password = user.password;
    }

    /**
     * This getter method will keep the status of login means whether user is login or not
     * @method LoggedIn
     * @return boolean
     */
    public get LoggedIn(): boolean {
        return this.loggedIn;
    }

    /**
     * This setter method will set the loggedIn status of user
     * @method LoggedIn:
     * @param {boolean} loggedIn With the help of this method
     */
    public set LoggedIn(loggedIn: boolean) {
        this.loggedIn = loggedIn;
    }

    /**
     * This getter method is reponsible to get the userName
     * @method Username
     * @return string
     */
    public get Username(): string {
        return this.username;
    }

    /**
     * This getter method is reponsible to get the user password
     * @method Password
     * @return string
     */
    public get Password(): string {
        return this.password;
    }

    /**
     * With the help of this method, application can get the username and loggedIn status of user
     * into one object form
     * @method getSerializable
     * @return IUserToken
     */
    public asSerializable(): IUserToken {
        return {
            username : this.username,
            loggedIn: this.loggedIn
        };
    }

    /**
     * With the help of this getter method, application can get the username and password
     * @method toJSON
     * @return UserConfig
     */
     public toJSON() : UserConfig {
        return {
            username : this.username,
            password: this.password
        };
    }

}
