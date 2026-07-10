/**
 * This class will be responsible to display the about page content
 * @class CmsAboutPanelComponent
 * @property {boolean} loading To show or hide loading process.
 * @property {object} systemInfo conatin system information of project name, license, version etc.
 * @property {string} copyRightText
 */
import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { CmsApiService } from "../../cms/api/cms-api.service";
import { AppConfig } from "../../config";
import { CMSConstants } from "./../../cms/models/cms-constants";

@Component({
    selector: 'cms-about-panel',
    templateUrl: './cms-about-panel.component.html',
    styleUrls: ['./cms-about-panel.component.scss'],
    standalone: false
})

export class CmsAboutPanelComponent implements OnInit {
    public loading: boolean = false;
    public systemInfo: any = {
        licensedTo: "",
        projectName: "",
        licenseStatus: "",
        server: "",
        version: "",
        serverVersion: "",
        daysRemaining: ""
    };
    public copyRightText: string;

    constructor(
        private cmsServerApi: CmsApiService,
        private translate: TranslateService,
        private appConfig: AppConfig) {
    }

    public ngOnInit(): void {
        this.getSystemInfo();
    }

    /**
     * This method will be fetch all system info, those will be display into about panel.
     * @method getSystemInfo
     * @return void
     */
    private getSystemInfo(): void {
        this.cmsServerApi.getSystemInfo()
            .subscribe(
            (response: any) => {
                if (response) {
                    this.systemInfo.licensedTo = response.LicenseInfo.customerName;
                    this.systemInfo.projectName = response.LicenseInfo.projectName;
                    this.systemInfo.server = response.ServerInfo.ip;
                    this.systemInfo.serverVersion = response.ServerInfo.version;

                    if (response.LicenseInfo.licenseStatus) {
                        if (response.LicenseInfo.licenseStatus === "LicenseAccepted") {
                            this.translate.get("about.licenceValid").subscribe((licenseStatus: string) => {
                                this.systemInfo.licenseStatus = licenseStatus;
                            });
                        } else {
                            this.translate.get("about.daysRemaining", { value: response.LicenseInfo.daysRemaining })
                                .subscribe((daysRemaining: string) => {
                                    this.systemInfo.daysRemaining = daysRemaining;
                                });
                            this.systemInfo.licenseStatus = `${response.LicenseInfo.licenseStatus}, ${this.systemInfo.daysRemaining}`;
                        }
                    }
                }

                //update copyright text with year,
                //after success set "loading" false as translate is asyn call
                this.updateCopyrightText();
            },
            (error: any) => {
                this.appConfig.log("Error in getSystemInfo", error);
                this.loading = false;
            });

        this.systemInfo.version = CMSConstants.APP_VERSION;
    }

    /**
     * This method just go back from the about panel.
     * @method goBack
     * @return void
     */
    public goBack(): void {
        window.history.back();
    }

    /**
     * This method fetch year from client and update copyright text
     * @method updateCopyrightText
     * @return void
     */
    private updateCopyrightText(): void {
        this.translate.get("about.copyrightText", { value: this.appConfig.CopyrightYear }).subscribe((response: string) => {
            this.copyRightText = response;
            this.loading = false;
        });
    }
}
