import { TestBed } from "@angular/core/testing";
import { CmsEventEmitterService } from "../../../../app/cms/api/cms-event-emitter.service";
import { CMS_EVENTS } from "../../../../app/cms/api/cms-events.enum";

describe("Service: cms-event-emitter", () => {

    it("Registered for MiniDisplay events", () => {
        CmsEventEmitterService.get(CMS_EVENTS.MiniDisplay);
        expect((<any>CmsEventEmitterService).emitters[0]).toBeDefined();
    });

    it("Registered for TileList events", () => {
        CmsEventEmitterService.get(CMS_EVENTS.TileList);
        expect((<any>CmsEventEmitterService).emitters[5]).toBeDefined();
    });

    it("Not registered for Display events", () => {
        expect((<any>CmsEventEmitterService).emitters[1]).toBeFalsy();
    });
});
