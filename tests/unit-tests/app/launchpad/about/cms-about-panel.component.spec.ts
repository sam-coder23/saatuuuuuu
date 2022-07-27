/**
 * This class is responsible to handle unit test case of CmsAboutPanelComponent component
 */
import { DebugElement, Injector, NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed, tick } from "@angular/core/testing";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { By } from "@angular/platform-browser";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Observable } from "rxjs/Observable";
import { CmsApiService } from "../../../../app/cms/api/cms-api.service";
import { CMSConstants } from "../../../../app/cms/models/cms-constants";
import { AppConfig } from "../../../../app/config";
import { CmsAboutPanelComponent } from "../../../../app/launchpad/about/cms-about-panel.component";

//Fake CmsApiService Service
class MockCmsApiService {
    public getSystemInfo(): Observable<any> {
        return Observable.of(mockSystemInfo);
    }

    public getAppVersion(): Promise<string> {
        return Promise.resolve(appVersion);
    }
}

const mockSystemInfo: any = {
    ServerInfo: {
        ip: "10.98.0.231",
        version: "0.70.37 Build 0125"
    },
    LicenseInfo: {
        customerName: "CMS Evaluation",
        projectName: "CMS Evaluation",
        licenseStatus: "EvaluationLicense",
        daysRemaining: 8,
        localization: 1
    }
};

const appVersion: string = "1.0.1";

const systemInfo: any = {
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
    let debugInstance: any;
    let nativeElement: any;
    let translate: TranslateService;
    let cmsApiService: CmsApiService;
    let appConfig: AppConfig;

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
                HttpClientModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: (http: HttpClient): TranslateHttpLoader => new TranslateHttpLoader(http, "/base/app/i18n/", ".json"),
                        deps: [HttpClient]
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
        const updateCopyrightTextCall: jasmine.Spy = spyOn(debugInstance, "updateCopyrightText");
        component.ngOnInit();

        expect(debugInstance.systemInfo.licensedTo).toEqual(mockSystemInfo.LicenseInfo.customerName);
        expect(debugInstance.systemInfo.projectName).toEqual(mockSystemInfo.LicenseInfo.projectName);
        expect(debugInstance.systemInfo.server).toEqual(mockSystemInfo.ServerInfo.ip);
        expect(debugInstance.systemInfo.serverVersion).toEqual(mockSystemInfo.ServerInfo.version);
        const delayTime: number = 100;

        delay(delayTime).then(() => {
            expect(debugInstance.systemInfo.version).toEqual(appVersion);
        });

        expect(updateCopyrightTextCall.calls.count()).toEqual(1);
    }));

    it("should display status as valid if license info is set to Valid,", () => {
        mockSystemInfo.LicenseInfo.licenseStatus = "LicenseAccepted";
        component.ngOnInit();
        expect(debugInstance.systemInfo.licenseStatus).toEqual("License valid");
    });

    it("should show copyright year in copyright text ", async(() => {
        expect(copyright).toContain(CMSConstants.COPYRIGHTYEAR);
    }));

    it("should show about information", () => {
        const loadingContent: jasmine.Spy = nativeElement.querySelector(".loading-content");
        expect(loadingContent).toBeNull();
        const aboutContent: jasmine.Spy = nativeElement.querySelector(".about-content-wrapper");
        expect(aboutContent).toBeDefined();
    });

    it("should have navigate back button and should call goBack() on click of arrow", () => {
        const buttonBack: DebugElement = fixture.debugElement.query(By.css("#about-panel-back-button"));
        expect(buttonBack).toBeTruthy();

        const goBackCall: jasmine.Spy = spyOn(window.history, "back");

        buttonBack.triggerEventHandler("click", undefined);
        expect(goBackCall.calls.count()).toEqual(1);
    });

    it("should have remaining days in License status", () => {
        const remainingDays: any = mockSystemInfo.LicenseInfo.daysRemaining;
        expect(systemInfo.licenseStatus).toContain(remainingDays);
    });

});
