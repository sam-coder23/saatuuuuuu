import { TestBed, ComponentFixture } from "@angular/core/testing";
import { CmsDisplayNameComponent } from "./cms-display-name.component";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { CMS_SESSION_STORAGE_ITEM } from "../../cms/models/cms-session-storage-item";
import { Subscriber } from "rxjs";
import { CmsEventEmitterService } from "../../cms/api/cms-event-emitter.service";
import { CMS_EVENTS } from "../../cms/api/cms-events.enum";

describe("CmsDisplayNameComponent", () => {
    let component: CmsDisplayNameComponent;
    let fixture: ComponentFixture<CmsDisplayNameComponent>;
    let debugInstance, nativeElement, debugInstanceGrid, nativeElementGrid,
        cmsClipboardService, cmsSettingsService, cmsMiniDisplayService, spyLoadContentOnTile;

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

        setDisplay();
    });

    afterEach(() => {
        removeDisplay();
        component.ngOnDestroy();
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

        CmsEventEmitterService.get(CMS_EVENTS.DisplayList).next(newDisplay);
        
        expect(component.displayName).toEqual(newDisplay.body.name);
    });


    function removeDisplay() {
        window.sessionStorage.removeItem(CMS_SESSION_STORAGE_ITEM.Display);
    }

    function setDisplay() {
        window.sessionStorage.setItem(CMS_SESSION_STORAGE_ITEM.Display, JSON.stringify(display));
    }
})