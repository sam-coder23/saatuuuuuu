/**
 * Roles of this class is to store the value into session storage
 * or get the value from session storage for a specific key
 * @class StorageManager
 * @property {Storage} appStorage
 * @constructor
 */

import { Injectable } from "@angular/core";

@Injectable()
export class StorageManager {
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
     * @return void
     */
    public setItem(key: string, val: any): void {
        this.appStorage.setItem(key, val);
    }

    /**
     * This method is responsible to get the already store value from sesssion storage for specfic key
     * @method get
     * @param {any} key  Session storage store the value with name of this key
     * @return any
     */
    public getItem(key: string): any {
        return this.appStorage.getItem(key);
    }

    /**
     * This method is responsible to remove the specific key and its value from storage
     * @method remove
     * @param {any} key Key name , application will remove the key and its value from storage
     * @return void
     */
    public removeItem(key: string): void {
        this.appStorage.removeItem(key);
    }

    /**
     * This method is responsible to remove the all key and their value from storage
     * @method removeStorage
     * @return void
     */
    public removeStorage(): void {
        this.appStorage.clear();
    }
}
