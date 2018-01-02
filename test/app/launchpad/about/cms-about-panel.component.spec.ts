import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement, NO_ERRORS_SCHEMA, Injector } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { HttpModule, Http } from "@angular/http";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { CmsAboutPanelComponent } from "../../../../app/launchpad/about/cms-about-panel.component";
import { CmsApiService } from "../../../../app/cms/api/cms-api.service";
import { AppConfig } from "../../../../app/config";
import { CMSConstants } from "../../../../app/cms/models/cms-constants";

//Fake CmsApiService Service
class MockCmsApiService {

    getSystemInfo(): Observable<any> {
        return Observable.of(mockSystemInfo);
    }

    getAppVersion(): Promise<string> {
        return Promise.resolve(appVersion);
    }
};

let mockSystemInfo = {
    "ServerInfo": {
        "ip": "10.98.0.231",
        "version": "0.70.37 Build 0125"
    },
    "LicenseInfo": {
        "customerName": "CMS Evaluation",
        "projectName": "CMS Evaluation",
        "licenseStatus": "EvaluationLicense",
        "daysRemaining": 8,
        "localization": 1
    }
};

let appVersion = "1.0.1";

let systemInfo = {
    licensedTo: "",
    projectName: "",
    licenseStatus: "",
    server: "",
    version: "",
    serverVersion: "",
    daysRemaining: ""
};

let copyright: string = "";

describe("Cms About Panel Component", () => {
    let component: CmsAboutPanelComponent;
    let fixture: ComponentFixture<CmsAboutPanelComponent>;
    let debugInstance, nativeElement,
        translate: TranslateService,
        cmsApiService: CmsApiService,
        appConfig: AppConfig;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CmsAboutPanelComponent],
            providers: [
                {
                    provide: CmsApiService,
                    useClass: MockCmsApiService
                },
                TranslateService,
                AppConfig
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
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(CmsAboutPanelComponent);
            component = fixture.componentInstance;
            nativeElement = fixture.nativeElement;
            debugInstance = fixture.debugElement.componentInstance;

            cmsApiService = fixture.debugElement.injector.get(CmsApiService);
            translate = fixture.debugElement.injector.get(TranslateService);
            appConfig = fixture.debugElement.injector.get(AppConfig);

            translate.setDefaultLang("en");
            translate.get("about.copyrightText", { value: appConfig.CopyrightYear }).subscribe((response: string) => {
                copyright = response;
            });

            translate.get("about.daysRemaining", { value: mockSystemInfo.LicenseInfo.daysRemaining }).subscribe((response: string) => {
                systemInfo.licenseStatus = response;
            });

        });
    }));

    it("should be defined", () => {
        expect(component).toBeDefined();
        expect(debugInstance.loading).toBeFalsy();
    });

    it("should assign value to system info on ngOnInit() call", async(() => {
        let updateCopyrightTextCall = spyOn(debugInstance, "updateCopyrightText").and.returnValue(null);
        component.ngOnInit();

        expect(debugInstance.systemInfo.licensedTo).toEqual(mockSystemInfo.LicenseInfo.customerName);
        expect(debugInstance.systemInfo.projectName).toEqual(mockSystemInfo.LicenseInfo.projectName);
        expect(debugInstance.systemInfo.server).toEqual(mockSystemInfo.ServerInfo.ip);
        expect(debugInstance.systemInfo.serverVersion).toEqual(mockSystemInfo.ServerInfo.version);
        delay(100).then(() => {
            expect(debugInstance.systemInfo.version).toEqual(appVersion);
        });

        expect(updateCopyrightTextCall.calls.count()).toEqual(1);
    }));

    it("should show copyright year in copyright text ", async(() => {
        expect(copyright).toContain(CMSConstants.COPYRIGHTYEAR);
    }));

    it("should show about information", () => {
        let loadingContent = nativeElement.querySelector(".loading-content");
        expect(loadingContent).toBeNull();
        let aboutContent = nativeElement.querySelector(".about-content-wrapper");
        expect(aboutContent).toBeDefined();
    });

    it("should have navigate back button and should call goBack() on click of arrow", () => {
        let buttonBack: DebugElement = fixture.debugElement.query(By.css("#about-panel-back-button"));
        expect(buttonBack).toBeTruthy();

        let goBackCall = spyOn(debugInstance, "goBack").and.returnValue(null);

        buttonBack.triggerEventHandler("click", null);
        expect(goBackCall.calls.count()).toEqual(1);
    });

    it("should have remaining days in License status", () => {
        let remainingDays: any = mockSystemInfo.LicenseInfo.daysRemaining;
        expect(systemInfo.licenseStatus).toContain(remainingDays);
    });

});