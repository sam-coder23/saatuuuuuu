/**
 * Roles of this class is handle to keyboard related functionality.
 * Should hold all logic related to that in this class.
 * Only logic which will reused across.
 * We will plan to rename it to KeyboardManager in coming days.
 * @class User
 * @constructor
 */

import { GenericCollection } from "../core/type/extended/GenericCollection";

// This must trun into Singleton, Okay for now.

export class KeyManager {
    private keyCollection : GenericCollection<number>;

    constructor() {
        const escapeKeyCode: number = 27;

        this.keyCollection = new GenericCollection<number>();
        this.keyCollection.add("Escape", escapeKeyCode);
        //I don't want to hardcode important string, consider using Enum over here and make it visible to entire application
    }

    /**
     * This is responsible for checking whether a key is added to collection
     * @method HasKey
     * @param  {String} keyName
     * This is the key for which item will be returned from the collection.
     * @return {Boolean}
     * true if key exists flase if does not.
     */
    public hasKey (keyName: string) : boolean {
        return this.keyCollection.hasKey(keyName);
    }

    /**
     * This is responsible for checking whether a key is added to collection
     * @method hasKey
     * @param {String} keyName
     * This is the key for which item will be returned from the collection.
     * @return {Boolean}
     * 0 if key does not exists or the actual keycode for the key you have asked.
     */
    public keyCode (keyName: string) : number {
        const exists: boolean = this.hasKey(keyName);
        let returnValue: number = 0; // 0 in javascript represents empty string i.e ""

        if (exists) {
            returnValue = this.keyCollection.item(keyName);
        }

        return returnValue;
    }

    /**
     * This will check and return true if it was ESC key press by user false otherwise.
     * @method IsEscapeKey
     * @param {KeyboardEvent} e
     * This will provide access to keyCode and which those will be used to get to know whether its escape key.
     * @return {Boolean} true
     * if it is escape key otherwise false
     */
    public isEscapeKey (e: KeyboardEvent): boolean {
        const value: number = this.keyCode("Escape");
        const keyCode: number = e.keyCode;
        const which: number = e.which;

        return keyCode === value || which === value;
    }
}
