import { Tile } from "./../../../../../app/cms/models/cms-tile";
import { ComponentFixture, TestBed, async, inject } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ElementRef, style } from "@angular/core";
import { HttpModule, Http } from "@angular/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Router } from "@angular/router";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { TileContent } from "../../../../../app/cms/models/cms-tile-content";
import { IUserProfileSettings } from "../../../../../app/cms/models/cms-user-profile-settings";
import { Validation } from "../../../../../app/core/util/Validation";
import { CmsGridComponent } from "../../../../../app/shared/mini-display/grid/cms-grid.component";
import { CmsSettingsService } from "../../../../../app/launchpad/settings/cms-settings.service";
import { CmsApiService } from "../../../../../app/cms/api/cms-api.service";
import { AppConfig } from "../../../../../app/config";
import { CmsMiniDisplayService } from "../../../../../app/shared/mini-display/cms-mini-display.service";
import { APIRequest } from "../../../../../app/cms/api/api-request";
import { StorageManager } from "../../../../../app/cms/api/cms-storagemanager.service";
import { MockCmsSettingsServiceStub } from "../../../core/mock-stubs/cms-settings-service.stub";

let contents: TileContent[] = [
    {
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
        snapshotPath: "http://0.0.0.0/display_snapshot.jpg?",
        type: "Perspective",
        width: 49.382716049382715,
        x: 0.30864197530864196,
        y: 50.49382716049383,
        zOrder: 3,
        description: "",
        disabled: false,
        favorite: false
    },
    {
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
        snapshotPath: "http://0.0.0.0/display_snapshot.jpg?",
        type: "Perspective",
        width: 49.382716049382715,
        x: 0.30864197530864196,
        y: 50.49382716049383,
        zOrder: 4,
        description: "",
        disabled: false,
        favorite: false
    }
];

let miniTiles: any[] = [
    {
        height: 49.01234567901235,
        left: 0.30864197530864196,
        top: 50.49382716049383,
        width: 49.382716049382715,
        x: 0.30864197530864196,
        y: 50.49382716049383,
        snapshotPath: "http://0.0.0.0/display_snapshot.jpg?",
        lastModified: "1507553259660"
    }
]

let swappedGeometeryContent: any[] = [{
    id: 160,
    name: "DefaultProSource[NOICLT28523]",
    type: "Perspective",
    resourceId: 21,
    snapshotPath: "http://0.0.0.0/display_snapshot.jpg?",
    zOrder: 3,
    height: 2280,
    width: 3840,
    x: 3840,
    y: 0,
    lastModified: "1507553259660"
},
{
    id: 170,
    name: "DefaultProSource[NOICLT28523]",
    type: "Perspective",
    resourceId: 21,
    snapshotPath: "http://0.0.0.0/display_snapshot.jpg?",
    zOrder: 4,
    height: 2280,
    width: 3840,
    x: 0,
    y: 0,
    lastModified: "1507553259660"
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

let mockSettings = new MockCmsSettingsServiceStub();
mockSettings.userSettings = userSettings;
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
        if (displayId > 0 && contentId > 0 && !Validation.IS_NULL_OR_UNDEFINED(body)) {
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
                { provide: CmsSettingsService, useValue: mockSettings },
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
                        useFactory: (http: Http) => new TranslateHttpLoader(http, "/base/app/i18n/", ".json"),
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
        updateContentGeormetryOnDisplay = spyOn(cmsApiService, "updateContentGeormetryOnDisplay").and.callThrough();
    }));

    it("should be a defined component", async(() => {
        expect(component).toBeDefined();
        expect(debugInstance.selectedContent).toBeUndefined();
        expect(debugInstance.swappingContent).toBeUndefined();
        expect(debugInstance.loading).toBeFalsy();
    }));

    it("should set SourceLabelStyles and MultiLine value onInit", () => {
        debugInstance.miniTiles = miniTiles;
        debugInstance.contents = contents;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const sourceLabelStyleNew: HTMLElement = document.getElementById("sourceLabelStylesheet");
            expect(sourceLabelStyleNew).toBeDefined();
            expect(debugInstance.isMultiLine).toBeFalsy();

            // should remove old styles and replace new styles
            debugInstance.ngOnInit();
            const sourceLabelStyleUpdated: HTMLElement = document.getElementById("sourceLabelStylesheet");
            expect(sourceLabelStyleUpdated).toBeDefined();
        });
    });

    // Can not test actual stylesheet value
    // it test branch of code
    it("should set transparent background for source-label if transparency is 100", () => {
        mockSettings.userSettings.sourceLabel.transparency = 100;

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            debugInstance.applySourceLabelSettings();
            const sourceLabelStyleUpdated: HTMLElement = document.getElementById("sourceLabelStylesheet");
            expect(sourceLabelStyleUpdated).toBeDefined();
        });
    });

    // it test branch of code
    it("should not set formattedStyles when miniTiles is blank", () => {
        const styles = debugInstance.formattedStyle();
        expect(JSON.stringify(styles)).toBe(JSON.stringify({}));
    });

    it("should show box-shadow if selected Content and contentId is same", () => {
        debugInstance.selectedContent = contents[0];
        debugInstance.swappingContent = contents[0];
        const showSelected = debugInstance.showSelected(contents[0].id);
        expect(showSelected).toBeTruthy();
    });

    // it test branch of code
    it("should show box-shadow if selected Content and swapping content is same", () => {
        debugInstance.selectedContent = contents[0];
        debugInstance.swappingContent = contents[1];
        const showSelected = debugInstance.showSelected(contents[1].id);
        expect(showSelected).toBeTruthy();
    });

    it("should call contentClickHandler on click of contentClickWrapper", async(() => {
        component.contentClick(contents[0]);
        expect(debugInstance.selectedContent).toBeTruthy();
        component.contentClick(contents[0]);
        expect(debugInstance.selectedContent).toBeUndefined();
        component.contentClick(contents[0]);
        component.contentClick(contents[1]);
        expect(debugInstance.selectedContent).toBeUndefined();
        expect(debugInstance.swappingContent).toBeUndefined();
    }));

    it("should call updateContentGeormetryOnDisplay() 2 times to swap the geometery of the content", async(() => {
        debugInstance.selectedContent = contents[0];
        debugInstance.swappingContent = contents[1];
        debugInstance.swapSource();
        expect(updateContentGeormetryOnDisplay).toHaveBeenCalledTimes(2);
    }));

    it("should swap the geometery and prepare content once swapContentGeometeryandCreateContent() is called", async(() => {
        debugInstance.selectedContent = contents[0];
        debugInstance.swappingContent = contents[1];
        let swappedContentGeometeryOutput: any[] = debugInstance.swapContentGeometeryandCreateContent();
        for (let index = 0; index < swappedContentGeometeryOutput.length; index++) {
            expect(swappedContentGeometeryOutput[index].x).toBe(swappedGeometeryContent[index].x);
            expect(swappedContentGeometeryOutput[index].y).toBe(swappedGeometeryContent[index].y);
            expect(swappedContentGeometeryOutput[index].width).toBe(swappedGeometeryContent[index].width);
            expect(swappedContentGeometeryOutput[index].height).toBe(swappedGeometeryContent[index].height);
        }
    }));

    it("should lost focus on click outside grid", () => {
        nativeElement.click()
        expect(debugInstance.selectedContent).toBeUndefined();
        expect(debugInstance.swappingContent).toBeUndefined();
    });
});
