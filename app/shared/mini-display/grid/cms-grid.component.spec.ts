import { ComponentFixture, TestBed, async, inject } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ElementRef } from "@angular/core";
import { CmsGridComponent } from "./cms-grid.component";
import { HttpModule, Http } from "@angular/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { AppConfig } from "../../../config";
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
import { Validation } from "../../../core/util/Validation";

let content1: TileContent = {
    absoluteSize: {
        height: 2280,
        left: 0,
        top: 0,
        width: 3840,
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
};

let content2: TileContent = {
    absoluteSize: {
        height: 2280,
        left: 3840,
        top: 0,
        width: 3840,
        x: 3840,
        y: 0
    },
    height: 49.01234567901235,
    id: 170,
    lastModified: "1507553259660",
    name: "DefaultProSource[NOICLT28523]",
    resourceId: 21,
    snapshotPath: "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F4.jpeg",
    type: "Perspective",
    width: 49.382716049382715,
    x: 0.30864197530864196,
    y: 50.49382716049383,
    zOrder: 4,
    description: "",
    disabled: false,
    favorite: false
};

let swappedGeometeryContent: any[] = [{
    id: 160,
    name: "DefaultProSource[NOICLT28523]",
    type: "Perspective",
    resourceId: 21,
    snapshotPath: "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F4.jpeg",
    zOrder: 3,
    height: 2280,
    width: 3840,
    x: 3840,
    y: 0
},
{
    id: 170,
    name: "DefaultProSource[NOICLT28523]",
    type: "Perspective",
    resourceId: 21,
    snapshotPath: "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fperspectives%2F4.jpeg",
    zOrder: 4,
    height: 2280,
    width: 3840,
    x: 0,
    y: 0
}];

let spyContentClickHandler: jasmine.Spy;
let updateContentGeormetryOnDisplay: jasmine.Spy;

let userSettings: IUserProfileSettings = {
    "language": "en",
    "wallConnection": {
        "startUpAction": "show-available-walls-list",
        "specificDisplay": "Board Meeting Room",
        "recentDisplay": "Board Meeting Room"
    },
    "sourceLabel": {
        "displaySourceNameLabels": true,
        "useMultipleLines": false,
        "fontColor": "#FFFFFF",
        "fontSize": 14,
        "backgroundColor": "#BDBDBD",
        "transparency": 50
    },
    "logOffTime": 0,
    "pageSize": 50
};

export class MockElementRef extends ElementRef { }

class RouterStub {
    navigateByUrl(url: string) { return url; }
}

class MockCmsApiService {
    unloadContentFromDisplay(displayId: number, contentId: number): Observable<any> {
        return Observable.of(null);
    }

    getUserProfileSettings(): Promise<IUserProfileSettings> {
        return Promise.resolve(userSettings);
    }

    updateContentGeormetryOnDisplay(displayId: number, contentId: number, body: any) {
        if (displayId > 0 && contentId > 0 && !Validation.IsNullOrUndefined(body)) {
            return Observable.of(null);
        } else {
            return Observable.throw("Invalid input for the API call");
        }
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
            cmsMiniDisplayService = fixture.debugElement.injector.get(CmsMiniDisplayService);
        });
    }));

    beforeEach(inject([AppConfig, CmsApiService], (appConfig: AppConfig,
        cmsApiService: CmsApiService, cmsMiniDisplayService: CmsMiniDisplayService, cmsSettingsService: CmsSettingsService) => {
        appConfig = appConfig;
        cmsApiService = cmsApiService;
        cmsMiniDisplayService = cmsMiniDisplayService;
        cmsSettingsService = cmsSettingsService;
        updateContentGeormetryOnDisplay = spyOn(cmsApiService, "updateContentGeormetryOnDisplay").and.callThrough();;
    }));

    it("should be a defined component", async(() => {
        expect(component).toBeDefined();
        expect(debugInstance.selectedContentList.length).toBe(0);
    }));

    it("should call contentClickHandler on click of contentClickWrapper", async(() => {
        component.contentClick(content1);
        expect(debugInstance.selectedContent).toBeTruthy();

        component.contentClick(content1);
        expect(debugInstance.selectedContent).toBeNull();

        component.contentClick(content1);
        component.contentClick(content2);

        expect(debugInstance.selectedContent).toBeNull();
        expect(debugInstance.swappingContent).toBeNull();
    }));

    it("should call updateContentGeormetryOnDisplay() 2 times to swap the geometery of the content", async(() => {
        debugInstance.selectedContent = content1;
        debugInstance.swappingContent = content2;

        debugInstance.swapSource();
        expect(updateContentGeormetryOnDisplay).toHaveBeenCalledTimes(2);
    }));

    it("should swap the geometery and prepare content once swapContentGeometeryandCreateContent() is called", async(() => {
        debugInstance.selectedContent = content1;
        debugInstance.swappingContent = content2;

        let swappedContentGeometeryOutput: any[] = debugInstance.swapContentGeometeryandCreateContent();

        for (var index = 0; index < swappedContentGeometeryOutput.length; index++) {
            expect(swappedContentGeometeryOutput[index].x).toBe(swappedGeometeryContent[index].x);
            expect(swappedContentGeometeryOutput[index].y).toBe(swappedGeometeryContent[index].y);
            expect(swappedContentGeometeryOutput[index].width).toBe(swappedGeometeryContent[index].width);
            expect(swappedContentGeometeryOutput[index].height).toBe(swappedGeometeryContent[index].height);
        }

    }));
});