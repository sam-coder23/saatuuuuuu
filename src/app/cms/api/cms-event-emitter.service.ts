/**
 * This service creates a central event hub that keeps track of events using
 * an event ID.
 * All this does is register events in an emitters object and emits them when
 * they are called using the get() method.
 * @class CmsEventEmitterService
 * @property {object} emitters An event store
 * @property get
 */

import { EventEmitter, Injectable } from "@angular/core";
import { CMS_EVENTS } from "./cms-events.enum";

@Injectable()
export class CmsEventEmitterService {
    // defining an event store
    private static emitters: { [ID: string]: EventEmitter<any> } = {};

    /**
     * Set a new event in the event store with a given ID as key
     * @method get
     * @param {CMS_EVENTS} ID
     * @return EventEmitter<any>
     */
    public static REGISTER(ID: CMS_EVENTS): EventEmitter<any> {
        if (!this.emitters[ID]) {
            this.emitters[ID] = new EventEmitter();
        }

        return this.emitters[ID];
    }
}
