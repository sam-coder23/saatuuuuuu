/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { Component, Input, Output, EventEmitter, OnInit, ElementRef, Renderer } from '@angular/core';

/**
 * This component defines a custom color picker.
 * 
 * @author: CHERA
 * @version: CMS 3.0
 */

@Component({
    //moduleId: module.id,
    selector: 'cms-colorpicker',
    template: require('to-string!./cms-colorpicker.component.html'),
    styles: [require('to-string!./cms-colorpicker.component.scss')]
})
export class CmsColorPickerComponent implements OnInit{
    /**
     * Properties
     */

    // color as input
    @Input() color: string;
    @Input() defaultColor: string;

    // event for color update
    @Output('change') colorChangePressEmitter = new EventEmitter();

    // contain current color (color input box)
    private mInputColor: string;

    private mDefaultColor: string;

    // to show and hide color palette
    public mShowColorPickerPalette: boolean = false;

    // color palette
    mColorShades = [
        "#FFFFFF", //1
        "#EEEEEE", //2
        "#BDBDBD", //3
        "#757575", //4
        "#424242", //5
        "#212121", //6
        "#B3E5FC", //7
        "#4FC3F7", //8
        "#03A9F4", //9
        "#0277BD", //10
        "#01579B", //11
        "#E57373", //12
        "#F44336", //13
        "#C62828", //14
        "#B71C1C", //15
        "#C8E6C9", //16
        "#81C784", //17
        "#4CAF50", //18
        "#2E7D32", //19
        "#D1C4E9", //20
        "#9575CD", //21
        "#673AB7", //22
        "#9C27B0", //23
        "#FFEB3B", //24
        "#E91E63", //25
        "#FFF3E0", //26
        "#FFB74D", //27
        "#FF9800", //28
        "#F57C00", //29
        "#ff0000", //30
        "#3F51B5", //31
        "#00BCD4", //32
        "#009688", //33
        "#CDDC39", //34
        "#795548", //35
        "#607D8B" //36
        ];

    constructor( private element: ElementRef, private renderer: Renderer) {}

    /**
     * This method is called on initialization of the component.
     */
    ngOnInit() {
        this.mInputColor = this.color;
    }

    /**
     * This method is show color palette on click on color box.
     */
    private showColorPaletteBox(): void{
        //open current cms-colorpicker
        let currentPicker = this.element.nativeElement;
        let currentElement = currentPicker.getElementsByClassName("cms-color-picker-palette")[0];
        let isCurrentPickerOpened = currentElement.getAttribute("isopened");

        if (isCurrentPickerOpened === "true") {
            this.renderer.setElementAttribute(currentElement, 'isopened', "false");
        } else{
           this.closeOpenedColorPickers();
           this.renderer.setElementAttribute(currentElement, 'isopened', "true");
        }
    }

    /**
     *  This method close all previously opened color pickers
     */
    private closeOpenedColorPickers(): void{
        let colorPickers = document.getElementsByClassName("cms-color-picker-palette");
        for (var i = 0; i < colorPickers.length; i++) {
            let isopened = colorPickers[i].getAttribute("isopened");
            if (isopened === "true") {
                this.renderer.setElementAttribute(colorPickers[i], 'isopened', "false");
            }
        }
    }

    /**
     * This method is called on initialization of the component.
     */
    private pickColor(color: string): void{
         this.mInputColor = this.validateColorData(color, this.defaultColor);
         this.colorChangePressEmitter.emit([color]);
         this.showColorPaletteBox();
    }

    /**
     * This method is validate color input as per default values
     */
    public validateColorData(color: string, defaultColor: string): string {
        var colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        if (colorRegex.test(color)) {
            return color;
        } else {
            return defaultColor;
        }
    }
}