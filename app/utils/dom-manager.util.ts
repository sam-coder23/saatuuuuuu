/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import {ElementRef} from "@angular/core";

export 
/**
 * The responsibility of this class is to act as a replacement of jQuery
 * So we should write functions for all DOM queries, manipulation in this class.
 * This should also hold anything where window object is being accessed by the application.   
 * @class DomManager
 * @constructor constructor This will inject the ElementRef dependency
 */
class DomManager {
    private nativeElement;

    constructor(element: ElementRef) {
        this.nativeElement = element.nativeElement
    }

    /**
     * Return the first child of current DOM element
     * @method FirstChild 
     * @return {HTMLElement}
     */
    public FirstChild() : HTMLElement {
        return <HTMLElement>this.nativeElement.firstChild;
    }
    
    /**
     * Return the last child of current DOM element
     * @method FirstChild 
     * @return {HTMLElement}
     */
    public LastChild() : HTMLElement {
        return <HTMLElement>this.nativeElement.lastChild;
    }

    /**
     * This will return Nth-child of current DOM element
     * @method NthChild
     * @param {number} Index of the child element which you are looking for 
     * @return {HTMLElement}
     */
    public NthChild(index: number) : HTMLElement {
        return <HTMLElement>this.nativeElement.children[index];
    }
    
    /**
     * @method ElementByClassName This method is used to get the element with the help of class name
     * @param {string} class name of the dom element you are trying to find
     * @return {HTMLElement}
     */
    public GetElementsByClassName(className: string) : HTMLElement[] {
        return <HTMLElement[]>this.nativeElement.getElementsByClassName(className);
    }
}