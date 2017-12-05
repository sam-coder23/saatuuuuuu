/**
 * Roles of this class is to put all eventListener into single unit that add/remove into document.
 * @pending - We need to see of the future of this class can be Very same how jQuery works. Must act as jQuery replacement of adding
 * and removing event. That shouldn't impact overall design. 
 * @class EventManager
 */

export class EventManager {
    private static document = window.document;

    /**
     * This method removes event listener to event loop on document.
     * @method removeEvent
     * @property {event} eventName 
     * @property {method} handler 
     */
    public static removeEvent(eventName, handler) {
        this.document.removeEventListener(eventName, handler);
    }

    /**
     * This method adds event listener to event loop on document.
     * @method addEvent
     * @property {event} eventName 
     * @property {method} handler 
     */
    public static addEvent(eventName, handler) {
       this.document.addEventListener(eventName, handler);
    }

    /**
     * This method adds event listener to event loop on element given as parameter.
     * @method addEvent
     * @property {HTMLElement} element 
     * @property {event} eventName 
     * @property {method} handler 
     */
    public static addEventOnElement(element: HTMLElement, eventName, handler) {
       element.addEventListener(eventName, handler);        
    }  

    /**
     * This method removes event listener to event loop on element given as parameter.
     * @method addEvent
     * @property {HTMLElement} element 
     * @property {event} eventName 
     * @property {method} handler 
     */
    public static removeEventOnElement(element: HTMLElement, eventName, handler) {
       element.removeEventListener(eventName, handler);        
    }  
}
