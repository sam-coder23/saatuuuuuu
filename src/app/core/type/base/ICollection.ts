/**
 * This type will be used to create a dictionary of any type.
 * So you can define arrays which will
 * Expected signature over the period of time
 * Remove
 * Keys
 * Values
 * Count or Length
 * @interface ICollection
 */

export interface ICollection <T> {
    add (key: string, value: T): any;
    hasKey (key: string): boolean;
    item (key: string): T;
}
