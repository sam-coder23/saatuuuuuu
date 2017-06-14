import {ICollection} from '../base/ICollection';

/**
 * This class will act as a Generic collection for entire application.
 * This means when we will need to define a collection where data can be defined in form of
 * key value pair this must be used.
 * Initial draft - Subject to change based on application usage or might need more method as we go
 * @class GenericCollection
 */
export class GenericCollection <T> implements ICollection <T> {
    private items: { 
        [index: string]: T 
    };
 
    private length: number = 0;

    constructor() {
        this.items = {};
    }
 
    /**
     * @method HasKey
     * @param key {String} - The key which will used to store  
     * @return {Boolean}
     */
    public HasKey(key: string): boolean {
        return this.items.hasOwnProperty(key);
    }

    /**
     * @method HasKey
     * @param key {String} - The key which will used to store  
     * @return {Boolean}
     */    
    public Add(key: string, value: T) {
        this.items[key] = value;
        this.length++;
    }
 
     /**
     * This method is responsible for returning an item from the collection by its key. 
     * @method Item
     * @param key {String} - The key which will used to find an item in collection  
     * @return {T} This will be type of the object using which this class is instantiated
     */
    public Item(key: string): T {
        return this.items[key];
    } 
};
