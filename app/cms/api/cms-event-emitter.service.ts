/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { Injectable, EventEmitter } from "@angular/core";

import { CMS_EVENTS } from "./cms-events.enum";

/**
 * This service creates a central event hub that keeps track of events using an event ID.
 * All this does is register events in an emitters object and emits them when they are called using the get() method.
 */
@Injectable()
export class CmsEventEmitterService {
    /**
     * Properties
     */

    // defining an event store
    private static emitters: { [ID: string]: EventEmitter<any> } = {};

    /**
     * Methods
     */

    /**
     * Set a new event in the event store with a given ID as key
     */
    static get(ID: CMS_EVENTS): EventEmitter<any> {
        if (!this.emitters[ID]){
            this.emitters[ID] = new EventEmitter();
        }
        
        return this.emitters[ID];
    }
}