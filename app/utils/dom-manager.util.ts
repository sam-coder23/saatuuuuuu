/**
 * The responsibility of this class is to act as a replacement of jQuery
 * So we should write functions for all DOM queries, manipulation in this class.
 * This should also hold anything where window object is being accessed by the application.
 * @class DomManager
 * @constructor constructor This will inject the ElementRef dependency
 */

import { ElementRef } from "@angular/core";

export class DomManager {
    private nativeElement: any;

    constructor (element: ElementRef) {
        this.nativeElement = element.nativeElement;
    }

    /**
     * Return the first child of current DOM element
     * @method FirstChild
     * @return {HTMLElement}
     */
    public firstChild () : HTMLElement {
        return <HTMLElement>this.nativeElement.firstChild;
    }

    /**
     * Return the last child of current DOM element
     * @method FirstChild
     * @return {HTMLElement}
     */
    public lastChild () : HTMLElement {
        return <HTMLElement>this.nativeElement.lastChild;
    }

    /**
     * This will return Nth-child of current DOM element
     * @method NthChild
     * @param {number} Index of the child element which you are looking for
     * @return {HTMLElement}
     */
    public nthChild (index: number) : HTMLElement {
        return <HTMLElement>this.nativeElement.children[index];
    }

    /**
     * @method ElementByClassName This method is used to get the element with the help of class name
     * @param {string} class name of the dom element you are trying to find
     * @return {HTMLElement}
     */
    public getElementsByClassName (className: string) : HTMLElement[] {
        return <HTMLElement[]>this.nativeElement.getElementsByClassName(className);
    }

    /**
     * @method getElementById This method is used to get the element with the help of id attribute
     * @param {string} id attribute of the dom element eg. "source-list"
     * @return {HTMLElement}
     */
    public getElementById (id: string) : HTMLElement {
       return <HTMLElement>this.nativeElement.querySelector(`#${id}`);
    }
}
