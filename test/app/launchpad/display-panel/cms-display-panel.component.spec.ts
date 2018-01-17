/**
 * This class is responsible to handle unit test case of CmsDisplayPanelComponent
 */
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, Injector } from "@angular/core";
import { async, ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { Http, HttpModule } from "@angular/http";
import { By } from "@angular/platform-browser";
import { ActivatedRoute, Params, RouterModule } from "@angular/router";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

import { StorageManager } from "../../../../app/cms/api/cms-storagemanager.service";
import { CmsResource } from "../../../../app/cms/models/cms-resource";
import { CmsSessionStorageItem } from "../../../../app/cms/models/cms-session-storage-item";
import { AppConfig } from "../../../../app/config";
import { CmsDisplayPanelComponent } from "../../../../app/launchpad/display-panel/cms-display-panel.component";
import { MockCmsSettingsServiceStub } from "../../core/mock-stubs/cms-settings-service.stub";
import { MockLogger } from "../../core/mock-stubs/logger.mock";

// Fake CmsApiService Service with the below stub
class MockCmsApiServiceStub {
    public putContentsOnDisplay(displayId: number, tilerId: number, body: any): Observable<any> {
        if (isNaN(displayId)) {
            return Observable.throw("Invalid displayId");
        } else {
            return Observable.of(undefined);
        }
    }

    public logout(): Observable<Response>   {
        return Observable.of(undefined);
    }
}

describe("CmsDisplayPanelComponent - Test Suite", () => {
    let component: CmsDisplayPanelComponent;
    let fixture: ComponentFixture<CmsDisplayPanelComponent>;
    let debugInstance: any;
    let nativeElement : any;
    let injector: Injector;
    let activatedRoute : ActivatedRoute;
    const display : any = {
        name: "My display",
        id: 1
    };
    let mockSettings: MockCmsSettingsServiceStub;
    let params: Subject<Params>;

    beforeEach(async(() => {
        params = new Subject<Params>();
        mockSettings = new MockCmsSettingsServiceStub();
        activatedRoute = new ActivatedRoute();
        TestBed.configureTestingModule({
            declarations: [CmsDisplayPanelComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: { params }
                },
                StorageManager,
                {
                    provide: AppConfig,
                    useClass: MockLogger
                }
            ],
            imports: [
                HttpModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: (http: Http): TranslateHttpLoader => new TranslateHttpLoader(http, "/base/app/i18n/", ".json"),
                        deps: [Http]
                    }
                }),
                RouterModule
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(CmsDisplayPanelComponent);
            component = fixture.componentInstance;
            nativeElement = fixture.nativeElement;
            debugInstance = fixture.debugElement.componentInstance;
            injector = fixture.debugElement.injector;

            activatedRoute.params = Observable.of({
                id: 1
            });

            const translate: TranslateService = injector.get(TranslateService);
            translate.use("en");

            setDisplay();
        });
    }));

    afterEach(() => {
        removeDisplay();
    });

    it("Component should be instantiated", () => {
        expect(component instanceof CmsDisplayPanelComponent).toBeTruthy();
        const zoomLevel: number = 100;
        expect(debugInstance.zoomLevel).toEqual(zoomLevel);
        expect(debugInstance.fitHeightCount).toEqual(0);
    });

    it("should load a saved display", () => {
        // Display should be successfully loaded from the storage manager
        removeDisplay();
        setDisplay();
        debugInstance.loadDisplay();
        expect(debugInstance.display.id).toEqual(display.id);
        expect(debugInstance.display instanceof CmsResource).toBeTruthy();
    });

    it("should load a display if displayId is available", fakeAsync(() => {
        // When display id is available then display is loaded
        removeDisplay();
        setDisplay();

        fixture.detectChanges();
        params.next({ id: 1 });
        tick();
        let id : number;
        activatedRoute.params.subscribe((value: any) => {
            id = value.id;
            expect(debugInstance.displayId).toEqual(id);
        });

        const spyLoadDisplay : jasmine.Spy = spyOn(debugInstance, "loadDisplay");
        component.ngOnInit();

        expect(spyLoadDisplay.calls.count()).toEqual(1);
    }));

    it("should increment the fitHeightCount counter", () => {
        expect(debugInstance.fitHeightCount).toEqual(0);
        debugInstance.fitHeight();
        expect(debugInstance.fitHeightCount).toEqual(1);
        debugInstance.fitHeight();
        const fitHeightCount: number = 2;
        expect(debugInstance.fitHeightCount).toEqual(fitHeightCount);
    });

    it("should have back button and onclick should navigate back", () => {
        const buttonBack : any = fixture.debugElement.query(By.css("#display-panel-back-button"));
        expect(buttonBack instanceof DebugElement).toBeTruthy();

        const spyNavigateBack : jasmine.Spy = spyOn(window.history, "back");
        buttonBack.nativeElement.dispatchEvent(new Event("ndClick"));

        expect(spyNavigateBack.calls.count()).toEqual(1);
    });

    it("should give display null if no display in session storage", () => {
        removeDisplay();

        debugInstance.loadDisplay();
        expect(debugInstance.display).toBeUndefined();
    });

    const removeDisplay: any = (): void => {
        window.sessionStorage.removeItem(CmsSessionStorageItem.DISPLAY);
    };

    const setDisplay: any = (): void => {
        window.sessionStorage.setItem(CmsSessionStorageItem.DISPLAY, JSON.stringify(display));
    };
});
