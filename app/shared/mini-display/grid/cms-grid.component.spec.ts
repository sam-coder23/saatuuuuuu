import { ComponentFixture, TestBed, async, inject } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ElementRef } from "@angular/core";
import { CmsGridComponent } from "./cms-grid.component";
import { HttpModule, Http } from "@angular/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { AppConfig } from "../../../config";
import { CmsClipboardService } from "../../clipboard/cms-clipboard.service";
import { CmsSettingsService } from "../../../launchpad/settings/cms-settings.service";
import { CmsApiService } from "../../../cms/api/cms-api.service";
import { CmsMiniDisplayService } from "../cms-mini-display.service";
import { Router } from "@angular/router";
import { APIRequest } from "../../../cms/api/api-request";
import { StorageManager } from "../../../cms/api/cms-storagemanager.service";
import { Subject } from "rxjs/Subject";
import { IUserProfileSettings } from "../../../cms/models/cms-user-profile-settings";
import { Observable } from "rxjs/Observable";
import { TileContent } from "../../../cms/models/cms-tile-content";
import { Source } from "../../../cms/models/cms-source";

let content: TileContent = {
    absoluteSize: {
        height: 600,
        left: 0,
        top: 600,
        width: 960,
        x: 0,
        y: 600
    },
    height: 49.01234567901235,
    id: 160,
    lastModified: "1507553259660",
    name: "DefaultProSource[NOICLT28523]",
    resourceId: 21,
    snapshotPath: "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F4.jpeg",
    type: "Perspective",
    width: 49.382716049382715,
    x: 0.30864197530864196,
    y: 50.49382716049383,
    zOrder: 3,
    description: "",
    disabled: false,
    favorite: false
}

let clipboardSource: Source = {
    id: content.resourceId,
    name: content.name,
    type: content.type,
    description: content.description,
    snapshotPath: `${content.snapshotPath}`,
    x: content.x,
    y: content.y,
    width: content.width,
    height: content.height,
    zOrder: content.zOrder,
    disabled: false,
    favorite: false
};

let spyUnloadContentFromDisplay: jasmine.Spy;
let spyContentClickHandler: jasmine.Spy;

let mUserSettings: IUserProfileSettings = {
    "language": "en",
    "wallConnection": {
        "atStartup": {
            "status": "show-available-walls-list",
            "selectedDisplayId": 37,
            "recentDisplayId": 37
        }
    },
    "sourceLabels": {
        "displaySourceNameLabels": true,
        "useMultipleLines": false,
        "fontColor": "#FFFFFF",
        "fontSize": 14,
        "background": "#BDBDBD",
        "transparency": 50
    },
    "manageWallContent": {
        "requireConfirmationforLoadingLayouts": true,
        "allowChangingSources": false,
        "clipboard": {
            "isEnabled": true,
            "status": "large"
        }
    },
    "logOffTime": 0,
    "defaultPageSize": 50
}

export class MockElementRef extends ElementRef { }

class RouterStub {
    navigateByUrl(url: string) { return url; }
}

class MockCmsApiService {
    unloadContentFromDisplay(displayId: number, contentId: number): Observable<any> {
        return Observable.of(null);
    }

    getUserProfileSettings(): Promise<IUserProfileSettings> {
        return Promise.resolve(mUserSettings);
    }
}

class MockCmsMiniDisplayService {
    display = {
        id: 3
    }
    panend: boolean = false;
}

describe("CmsGridComponent", () => {
    let component: CmsGridComponent;
    let fixture: ComponentFixture<CmsGridComponent>;
    let debugInstance, nativeElement;

    let cmsClipboardService: CmsClipboardService;
    let cmsSettingsService: CmsSettingsService;
    let element: ElementRef;
    let cmsApiService: CmsApiService;
    let appConfig: AppConfig;
    let cmsMiniDisplayService: CmsMiniDisplayService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CmsGridComponent],
            providers: [
                AppConfig,
                APIRequest,
                StorageManager,
                CmsClipboardService,
                CmsSettingsService,
                { provide: CmsApiService, useClass: MockCmsApiService },
                { provide: CmsMiniDisplayService, useClass: MockCmsMiniDisplayService },
                { provide: ElementRef, useClass: MockElementRef },
                { provide: Router, useClass: RouterStub }
            ],
            imports: [
                HttpModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: (http: Http) => new TranslateHttpLoader(http, "/app/i18n", ".json"),
                        deps: [Http]
                    }
                })
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(CmsGridComponent);
            component = fixture.componentInstance;
            nativeElement = fixture.nativeElement;
            debugInstance = fixture.debugElement.componentInstance;
            cmsSettingsService = fixture.debugElement.injector.get(CmsSettingsService);
            cmsClipboardService = fixture.debugElement.injector.get(CmsClipboardService);
            cmsMiniDisplayService = fixture.debugElement.injector.get(CmsMiniDisplayService);
        });
    }));

    beforeEach(inject([AppConfig, CmsClipboardService, CmsApiService], (appConfig: AppConfig, cmsClipboardService: CmsClipboardService,
        cmsApiService: CmsApiService, cmsMiniDisplayService: CmsMiniDisplayService, cmsSettingsService: CmsSettingsService) => {
        appConfig = appConfig;
        cmsClipboardService = cmsClipboardService;
        cmsApiService = cmsApiService;
        cmsMiniDisplayService = cmsMiniDisplayService;
        cmsSettingsService = cmsSettingsService;
        spyUnloadContentFromDisplay = spyOn(cmsApiService, "unloadContentFromDisplay").and.returnValue(Observable.of(null));
    }));

    it("should be a defined component", async(() => {
        expect(component).toBeDefined();
    }));

    it("should execute ngOnInit as required", async(() => {
        cmsSettingsService.setUserProfileSettings();
        cmsSettingsService.isLongPressed = true;
        fixture.whenStable().then(() => {
            component.ngOnInit();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(debugInstance.isTileHighlightDisabled).toBe(true);
            });
        });
    }));

    it("should not call unLoadContent when content is null", async(() => {
        debugInstance.unLoadContent(null);
        expect(spyUnloadContentFromDisplay.calls.any()).toBe(false, "unloadContentFromDisplay not yet called");
    }));

    it("should call unLoadContent when content and display object is not null", async(() => {
        debugInstance.unLoadContent(content);
        let args = spyUnloadContentFromDisplay.calls.mostRecent().args;
        expect(cmsMiniDisplayService.display.id).toBe(args[0]);
        expect(content.id).toBe(args[1]);
    }));

    it("should not call contentClickHandler on click of contentClickWrapper", async(() => {
        let event: MouseEvent;
        debugInstance.isLongPressed = true;
        mUserSettings.manageWallContent.allowChangingSources = true;
        cmsSettingsService.setUserProfileSettings();
        fixture.whenStable().then(() => {
            component.contentClickWrapper(event, content);
            setTimeout(() => {
                expect(cmsClipboardService.Clipboard).toBeNull();
            }, 500);
        });
    }));

    it("should call contentClickHandler on click of contentClickWrapper", async(() => {
        let event: MouseEvent;
        debugInstance.isLongPressed = false;
        mUserSettings.manageWallContent.allowChangingSources = true;
        cmsSettingsService.setUserProfileSettings();
        fixture.whenStable().then(() => {
            component.contentClickWrapper(event, content);
            setTimeout(() => {
                expect(cmsClipboardService.Clipboard).toBeDefined();
            }, 500);
        });
    }));

    it("should not call contentClickHandler", async(() => {
        mUserSettings.manageWallContent.allowChangingSources = false;
        cmsSettingsService.setUserProfileSettings();
        fixture.whenStable().then(() => {
            debugInstance.contentClickHandler(content);
            expect(spyUnloadContentFromDisplay.calls.any()).toBe(false, "unloadContentFromDisplay not yet called");
        });
    }));

    it("should call contentClickHandler", async(() => {
        mUserSettings.manageWallContent.allowChangingSources = true;
        cmsSettingsService.setUserProfileSettings();
        fixture.whenStable().then(() => {
            debugInstance.contentClickHandler(content);
            let args = spyUnloadContentFromDisplay.calls.mostRecent().args;
            expect(cmsMiniDisplayService.display.id).toBe(args[0]);
            expect(content.id).toBe(args[1]);
        });
    }));

});