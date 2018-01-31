/**
 * Test Specification for Display Name component.
 */
import { Injector } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Subscriber } from "rxjs";

import { CmsEventEmitterService } from "../../../../app/cms/api/cms-event-emitter.service";
import { CMS_EVENTS } from "../../../../app/cms/api/cms-events.enum";
import { StorageManager } from "../../../../app/cms/api/cms-storagemanager.service";
import { CmsSessionStorageItem } from "../../../../app/cms/models/cms-session-storage-item";
import { CmsDisplayNameComponent } from "../../../../app/shared/display-name/cms-display-name.component";

describe("CmsDisplayNameComponent", () => {
    let component: CmsDisplayNameComponent;
    let fixture: ComponentFixture<CmsDisplayNameComponent>;
    let injector: Injector;
    const display: any = {
        name: "My display",
        id: 1
    };
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CmsDisplayNameComponent],
            providers: [
                StorageManager
            ]
        });

        fixture = TestBed.createComponent(CmsDisplayNameComponent);
        component = fixture.componentInstance;
        injector = fixture.debugElement.injector;
        setDisplay();
    });

    afterEach(() => {
        removeDisplay();
    });

    it("component should be defined", () => {
        expect(component).toBeDefined();
        expect(component.displayName).toEqual("");
    });

    it("should load display name", () => {
        fixture.detectChanges();
        expect(component.displayName).toEqual(display.name);
    });

    it("should subscribe display change event", () => {
        fixture.detectChanges();
        expect(component.displayEventsSubscription instanceof Subscriber).toBeTruthy();
        component.ngOnDestroy();
        expect(component.displayEventsSubscription.closed).toBeTruthy();
    });

    it("should update display name", () => {
        component.subscribeDisplayEvents();
        const newDisplay: any = {
            uri: "displays/1",
            body: {
                name: "New display name",
                id: 1
            },
            verb: "PUT"
        };
        CmsEventEmitterService.REGISTER(CMS_EVENTS.DisplayList).next(newDisplay);
        expect(component.displayName).toEqual(newDisplay.body.name);
    });

    const removeDisplay: any = (): void => {
        const storage: StorageManager = injector.get(StorageManager);
        storage.removeItem(CmsSessionStorageItem.DISPLAY);
    };

    const setDisplay: any = (): void => {
        const storage: StorageManager = injector.get(StorageManager);
        storage.setItem(CmsSessionStorageItem.DISPLAY, JSON.stringify(display));
    };
});
