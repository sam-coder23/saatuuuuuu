/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { AppConfig } from '../../config';
/**
 * This component defines a custom dialog.
 *
 * @author: CHERA
 * @version: CMS 3.0
 */

@Component({
    selector: 'cms-dialog',
    templateUrl: './cms-dialog.component.html',
    styleUrls: ['./cms-dialog.component.scss']
})
export class CmsDialogComponent implements OnInit, OnChanges {
    /**
     * Properties
     */

    // dialog mesage as input
    @Input() message: string = '';

    // dialog type as "alert" or "confirmation"  as input
    @Input() type: string = '';

    @Input() yesNoDialog?: boolean = false;

    // create a 'OK' and 'Cancel' event
    @Output('okPress') okPressEmitter = new EventEmitter();
    @Output('cancelPress') cancelPressEmitter = new EventEmitter();

    public mMessage: string = '';

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
    public clickOnOk(){
        this.okPressEmitter.emit();
    }

    /**
     * This method emit "Cancel" event
     */
    public clickOnCancel() {
        this.cancelPressEmitter.emit();
    }
}
