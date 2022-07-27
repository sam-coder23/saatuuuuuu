/**
 * Test specification for event emitter service.
 */
import { TestBed } from "@angular/core/testing";
import { CmsEventEmitterService } from "../../../../app/cms/api/cms-event-emitter.service";
import { CMS_EVENTS } from "../../../../app/cms/api/cms-events.enum";

describe("Service: cms-event-emitter", () => {
    const maxEmitters: number = 5;
    beforeEach(() => {
        /**
         * Clearing emitter for running dry test cases
         */
        if (CmsEventEmitterService && (<any>CmsEventEmitterService).emitters) {
            for (let emitter in (<any>CmsEventEmitterService).emitters) {
                delete (<any>CmsEventEmitterService).emitters[emitter];
            }
        }
    });

    it("Registered for MiniDisplay events", () => {
        CmsEventEmitterService.REGISTER(CMS_EVENTS.MiniDisplay);
        expect((<any>CmsEventEmitterService).emitters[0]).toBeDefined();
    });

    it("Registered for TileList events", () => {
        CmsEventEmitterService.REGISTER(CMS_EVENTS.TileList);
        expect((<any>CmsEventEmitterService).emitters[maxEmitters]).toBeDefined();
    });

    it("Not registered for Display events", () => {
        expect((<any>CmsEventEmitterService).emitters[1]).toBeUndefined();
    });
});
