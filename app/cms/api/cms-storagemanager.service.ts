/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import {Injectable} from "@angular/core";

@Injectable()
export /**
 * Roles of this class is to store the value into session storage 
 * or get the value from session storage for a specific key
 * @class StorageManager
 * @constructor
 */
class StorageManager {
    
    private appStorage: Storage;
    
    constructor() {
        /**
         * Basically in appStorage variable, application is defining the storage type means storage which application 
         * is using. If in future, due to some reason, application need to switch its storage type from 
         * sessionStorage to localstorage then developer need to change here only 
         * For ex: this.appStorage = window.localStorage
         * @property appStorage
         * @type {any}  
         */
        this.appStorage = window.sessionStorage;
    }

    /**
     * This method is responsible to store value into storage for specfic key
     * @method set
     * @param {any} key  Application store the value with name of this key into the storage
     * @param {any} val  Value which Application want to store 
     */
    public set(key: any, val: any) {
        this.appStorage.setItem(key, val);
    }

    /**
     * This method is responsible to get the already store value from sesssion storage for specfic key
     * @method get
     * @param {any} key  Session storage store the value with name of this key
     */
    public get(key: any): any {
        return this.appStorage.getItem(key);
    }

    /**
     * This method is responsible to remove the specific key and its value from storage
     * @method remove
     * @param {any} key Key name , application will remove the key and its value from storage 
     */
    public remove(key: any) {
        this.appStorage.removeItem(key);
    }
    
    /**
     * This method is responsible to remove the all key and their value from storage
     * @method removeStorage
     */
    public removeStorage() {
      this.appStorage.clear();
    }
}