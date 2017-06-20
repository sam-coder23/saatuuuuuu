/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, OnDestroy } from "@angular/core";
import { AppConfig } from "../../config";
/**
 * This component defines a custom dialog.
 * 
 * @author: CHERA
 * @version: CMS 3.0
 */

@Component({
    //moduleId: module.id,
    selector: "cms-dialog",
    template: require("to-string!./cms-dialog.component.html"),
    styles: [require("to-string!./cms-dialog.component.scss")]
})
export class CmsDialogComponent implements OnInit, OnChanges {
    /**
     * Properties
     */

    // dialog mesage as input
    @Input() message: string;

    // dialog type as "alert" or "confirmation"  as input
    @Input() type: string;

    // create a "OK" and "Cancel" event
    @Output("okPress") okPressEmitter = new EventEmitter();
    @Output("cancelPress") cancelPressEmitter = new EventEmitter();

    private mMessage: string;

    constructor(private appConfig: AppConfig) {}

    /**
     * This method is called on initialization of the component.
     */
    ngOnInit() {
        // update dialog message
        this.mMessage = this.message;
    }

    /**
     * This method is called when input property changes.
     */
    ngOnChanges(changes: SimpleChanges) {
        // update dialog message
        this.mMessage = this.message;
    }

    /**
     * This method emit "OK" event  
     */
    private clickOnOk(){
        this.okPressEmitter.emit();
    }

    /**
     * This method emit "Cancel" event  
     */
    private clickOnCancel() {
        this.cancelPressEmitter.emit();
    }
}