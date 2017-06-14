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
    Add(key: string, value: T);
    HasKey(key: string): boolean;
    Item(key: string): T;
};
