/**
 * Test Specification for CMS Grid component.
 */
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef, NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, inject, TestBed } from "@angular/core/testing";
import { Http, HttpModule } from "@angular/http";
import { Router } from "@angular/router";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Observable } from "rxjs/Observable";

import { APIRequest } from "../../../../../app/cms/api/api-request";
import { CmsApiService } from "../../../../../app/cms/api/cms-api.service";
import { StorageManager } from "../../../../../app/cms/api/cms-storagemanager.service";
import { IUserProfileSettings } from "../../../../../app/cms/models/cms-user-profile-settings";
import { AppConfig } from "../../../../../app/config";
import { Validation } from "../../../../../app/core/util/Validation";
import { CmsSettingsService } from "../../../../../app/launchpad/settings/cms-settings.service";
import { CmsMiniDisplayService } from "../../../../../app/shared/mini-display/cms-mini-display.service";
import { CmsGridComponent } from "../../../../../app/shared/mini-display/grid/cms-grid.component";
import { contents, miniTiles, swappedGeometeryContent, userSettings } from "../../../core/mock-stubs/cms-grid.mock";
import { MockCmsSettingsServiceStub } from "../../../core/mock-stubs/cms-settings-service.stub";

export class MockElementRef extends ElementRef { }

class RouterStub {
    public navigateByUrl(url: string): string {
        return url;
    }
}

class MockCmsApiService {
    public unloadContentFromDisplay(displayId: number, contentId: number): Observable<any> {
        return Observable.of(undefined);
    }

    public getUserProfileSettings(): Promise<IUserProfileSettings> {
        return Promise.resolve(userSettings);
    }

    public updateContentGeormetryOnDisplay(displayId: number, contentId: number, body: any): Observable<any> {
        if (displayId > 0 && contentId > 0 && !Validation.IS_NULL_OR_UNDEFINED(body)) {
            return Observable.of(undefined);
        } else {
            return Observable.throw("Invalid input for the API call");
        }
    }
}
class MockCmsMiniDisplayService {
    public display: any = {
        id: 3
    };
    public panend: boolean = false;
}

// tslint:disable-next-line:mocha-no-side-effect-code
const mockSettings: any = new MockCmsSettingsServiceStub();
mockSettings.userSettings = userSettings;

describe("CmsGridComponent", () => {
    let component: CmsGridComponent;
    let fixture: ComponentFixture<CmsGridComponent>;
    let debugInstance: any;
    let nativeElement: HTMLElement;
    let updateContentGeormetryOnDisplay: jasmine.Spy;

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
                        useFactory: (http: Http): TranslateHttpLoader => new TranslateHttpLoader(http, "/base/app/i18n/", ".json"),
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
        });
    }));

    beforeEach(inject([AppConfig, CmsApiService], (
        appConfig: AppConfig,
        cmsApiService: CmsApiService,
        cmsMiniDisplayService: CmsMiniDisplayService, cmsSettingsService: CmsSettingsService) => {
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
        const transparency: number = 100;
        mockSettings.userSettings.sourceLabel.transparency = transparency;

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            debugInstance.applySourceLabelSettings();
            const sourceLabelStyleUpdated: HTMLElement = document.getElementById("sourceLabelStylesheet");
            expect(sourceLabelStyleUpdated).toBeDefined();
        });
    });

    // it test branch of code
    it("should not set formattedStyles when miniTiles is blank", () => {
        const styles: any = debugInstance.formattedStyle();
        expect(JSON.stringify(styles)).toBe(JSON.stringify({}));
    });

    it("should show box-shadow if selected Content and contentId is same", () => {
        debugInstance.selectedContent = contents[0];
        debugInstance.swappingContent = contents[0];
        const showSelected: boolean = debugInstance.showSelected(contents[0].id);
        expect(showSelected).toBeTruthy();
    });

    // it test branch of code
    it("should show box-shadow if selected Content and swapping content is same", () => {
        debugInstance.selectedContent = contents[0];
        debugInstance.swappingContent = contents[1];
        const showSelected: boolean = debugInstance.showSelected(contents[1].id);
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
        const numberOfCalls: number = 2;
        debugInstance.selectedContent = contents[0];
        debugInstance.swappingContent = contents[1];
        debugInstance.swapSource();
        expect(updateContentGeormetryOnDisplay).toHaveBeenCalledTimes(numberOfCalls);
    }));

    it("should swap the geometery and prepare content once swapContentGeometeryandCreateContent() is called", async(() => {
        debugInstance.selectedContent = contents[0];
        debugInstance.swappingContent = contents[1];
        const swappedContentGeometeryOutput: any[] = debugInstance.swapContentGeometeryandCreateContent();
        for (const output  of  swappedContentGeometeryOutput) {
            expect(output.x).toBe(output.x);
            expect(output.y).toBe(output.y);
            expect(output.width).toBe(output.width);
            expect(output.height).toBe(output.height);
        }
    }));

    it("should lost focus on click outside grid", () => {
        nativeElement.click();
        expect(debugInstance.selectedContent).toBeUndefined();
        expect(debugInstance.swappingContent).toBeUndefined();
    });
});
