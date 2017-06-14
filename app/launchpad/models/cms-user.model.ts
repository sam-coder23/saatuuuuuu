/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

/**
 * This interface is reponsible for user model type checks
 * @interface UserConfig
 * @property {string} username For username type check
 * @property {string} password For password type check
 */

export interface UserConfig {
    username: string,
    password: string
}

export /**
 * Roles of this class is handle to user related stuff
 * @class User
 * @constructor
 * @property {string} userName To contain username value
 * @property {string} password To contain the user password
 * @property {string} loggedIn Stand for varaible which will keep the status of login whether user is login or not
 */
class User {
    public username: string;
    public password: string;
    public loggedIn: boolean;
    
    constructor(user: UserConfig) {
        this.username = user.username;
        this.password = user.password;
    }

    /**
     * @method getter method LoggedIn: This method will keep the status of login means
     * whether user is login or not
     */
    public get LoggedIn() {
        return this.loggedIn;
    }
    
    /**
     * @method setter method LoggedIn: To ser user login status
     * @param {boolean} loggedIn With the help of this method, application will set the status
     * whether use is login or not
     */
    public set LoggedIn(loggedIn: boolean) {
        this.loggedIn = loggedIn;
    }

    /**
     * @method Username
     * This method is reponsible to get the userName 
     */

    public get Username() {
        return this.username;
    }

    /**
     * @method Password
     * This method is reponsible to get the user password 
     */
    public get Password() {
        return this.password;
    }

    /**
     * @method getSerializable
     * With the help of this method, application can get the username and loggedIn status of user
     * into one object form
     */
    public asSerializable() {
        return {
            username : this.username,
            loggedIn: this.loggedIn
        }
    }

    /**
     * @method toJSON
     * With the help of this getter method, application can get the username and password
     * */    
     public toJSON() : UserConfig {
        return {
            username : this.username,
            password: this.password
        }
    }

}