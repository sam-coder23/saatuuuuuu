/**
 * Roles of this class is to put all eventListener into single unit that add/remove into document.
 * @pending - We need to see of the future of this class can be Very same how jQuery works. Must act as jQuery replacement of adding
 * and removing event. That shouldn't impact overall design.
 * @class EventManager
 */

export class EventManager {
    private static document: Document = window.document;

    /**
     * This method removes event listener to event loop on document.
     * @method removeEvent
     * @property {event} eventName
     * @property {method} handler
     */
    public static removeEvent(eventName: string, handler: EventListenerOrEventListenerObject): void {
        this.document.removeEventListener(eventName, handler);
    }

    /**
     * This method adds event listener to event loop on document.
     * @method addEvent
     * @property {event} eventName
     * @property {method} handler
     */
    public static addEvent(eventName: string, handler: EventListenerOrEventListenerObject): void {
        this.document.addEventListener(eventName, handler);
    }

    /**
     * This method adds event listener to event loop on element given as parameter.
     * @method addEvent
     * @property {HTMLElement} element
     * @property {event} eventName
     * @property {method} handler
     */
    public static addEventOnElement(element: HTMLElement, eventName: string, handler: EventListenerOrEventListenerObject): void {
        element.addEventListener(eventName, handler);
    }

    /**
     * This method removes event listener to event loop on element given as parameter.
     * @method addEvent
     * @property {HTMLElement} element
     * @property {event} eventName
     * @property {method} handler
     */
    public static removeEventOnElement(element: HTMLElement, eventName: string, handler: EventListenerOrEventListenerObject): void {
        element.removeEventListener(eventName, handler);
    }
}
