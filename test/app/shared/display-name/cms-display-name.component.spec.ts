import { TestBed, ComponentFixture } from "@angular/core/testing";
import { Subscriber } from "rxjs";
import { Injector } from "@angular/core";
import { CmsDisplayNameComponent } from "../../../../app/shared/display-name/cms-display-name.component";
import { StorageManager } from "../../../../app/cms/api/cms-storagemanager.service";
import { CmsSessionStorageItem } from "../../../../app/cms/models/cms-session-storage-item";
import { CMS_EVENTS } from "../../../../app/cms/api/cms-events.enum";
import { CmsEventEmitterService } from "../../../../app/cms/api/cms-event-emitter.service";

describe("CmsDisplayNameComponent", () => {
    let component: CmsDisplayNameComponent;
    let fixture: ComponentFixture<CmsDisplayNameComponent>;
    let injector: Injector;
    let debugInstance, nativeElement, debugInstanceGrid, nativeElementGrid,
        cmsSettingsService, cmsMiniDisplayService, spyLoadContentOnTile;

    const display = {
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
        const newDisplay = {
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


    function removeDisplay() {
        let storage: StorageManager = injector.get(StorageManager);
        storage.removeItem(CmsSessionStorageItem.DISPLAY);
    }

    function setDisplay() {
        let storage: StorageManager = injector.get(StorageManager);
        storage.setItem(CmsSessionStorageItem.DISPLAY, JSON.stringify(display));
    }
})
