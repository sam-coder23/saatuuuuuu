import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { CmsApiService } from "../../cms/api/cms-api.service";
import { AppConfig } from "../../config";

@Component({
    //moduleId: module.id,
    selector: "cms-about-panel",
    template: require("./cms-about-panel.component.html"),
    styles: [require("./cms-about-panel.component.scss")]
})

/**
 * This class will be responsible to display the about page content 
 * @class CmsAboutPanelComponent
 * @property {boolean} loading To show or hide loading process.
 * @property {object} systemInfo conatin system information of project name, license, version etc.
 * @property {string} copyRightText
 */
export class CmsAboutPanelComponent implements OnInit {
    private loading: boolean = false;
    private systemInfo = {
        licensedTo: "",
        projectName: "",
        licenseStatus: "",
        server: "",
        version: "",
        serverVersion: "",
        daysRemaining: ""
    };
    private copyRightText: string;

    constructor(
        private cmsServerApi: CmsApiService,
        private translate: TranslateService,
        private appConfig: AppConfig) {
    }

    public ngOnInit() {
        this.getSystemInfo();
    }

    /**
     * This method will be fetch all system info, those will be display into about panel.
     * @method getSystemInfo
     * @return {void} 
     */
    private getSystemInfo(): void {
        this.cmsServerApi.getSystemInfo()
            .subscribe(
            response => {
                this.systemInfo.licensedTo = response.LicenseInfo.customerName;
                this.systemInfo.projectName = response.LicenseInfo.projectName;
                this.systemInfo.server = response.ServerInfo.ip;
                this.systemInfo.serverVersion = response.ServerInfo.version;

                if (response.LicenseInfo.licenseStatus) {
                    if (response.LicenseInfo.licenseStatus === "LicenseAccepted") {
                        this.translate.get("about.licenceValid").subscribe((response: string) => {
                            this.systemInfo.licenseStatus = response;
                        });
                    } else {
                        this.translate.get("about.daysRemaining", { value: response.LicenseInfo.daysRemaining }).subscribe((response: string) => {
                            this.systemInfo.daysRemaining = response;
                        });
                        this.systemInfo.licenseStatus = response.LicenseInfo.licenseStatus + ", " + this.systemInfo.daysRemaining;
                    }
                }

                //update copyright text with year, 
                //after success set "loading" false as translate is asyn call 
                this.updateCopyrightText();
            },
            error => {
                this.appConfig.log("Error in getSystemInfo", error);
                this.loading = false;
            }
            );

        this.systemInfo.version = "1.0.0";
    }

    /**
     * Just go back from the about panel.
     * @method goBack
     * @return {void}
     */
    private goBack(): void {
        window.history.back();
    }

    /**
     * This method fetch year from client and update copyright text
     * @method updateCopyrightText
     * @return {void}
     */
    private updateCopyrightText(): void {
        this.translate.get("about.copyrightText", { value: this.appConfig.CopyrightYear }).subscribe((response: string) => {
            this.copyRightText = response;
            this.loading = false; // hide loading state
        });
    }
}