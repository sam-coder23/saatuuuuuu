/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { Component, OnInit } from "@angular/core";
// import { Router } from "@angular/router";
import {Location} from "@angular/common";
import { TranslateService } from "@ngx-translate/core";

import { CmsApiService } from "../../cms/api/cms-api.service";
import { AppConfig } from "../../config";

@Component({
    //moduleId: module.id,
    selector: "cms-about-panel",
    template: require("to-string!./cms-about-panel.component.html"),
    styles: [require("to-string!./cms-about-panel.component.scss")]
})
/**
 * This class will be responsible to display the about content 
 * @class CmsAboutPanelComponent
 * @property {boolean} loading To show or hide loading process.
 */
export class CmsAboutPanelComponent implements OnInit {  

    private loading: boolean = false;
    private systemInfo = {
        licensedTo: "",
        projectName: "",
        licenseStatus: "",
        server: "",
        version:"",
        serverVersion:"",
        daysRemaining:""
    };
    private copyRightText: string;

    constructor(private cmsServerApi: CmsApiService, private location:Location, private translate: TranslateService,  private appConfig: AppConfig) {
    }

     public ngOnInit() { 
         this.getSystemInfo();
     }

    /**
     * This method will be fetch all system info, those will be display into about panel.
     * @method  getSystemInfo
     */
     private getSystemInfo(){
         this.cmsServerApi.getSystemInfo()
            .subscribe(
                response => {
                    this.systemInfo.licensedTo = response.LicenseInfo.customerName;
                    this.systemInfo.projectName = response.LicenseInfo.projectName;
                    this.systemInfo.server = response.ServerInfo.ip;
                    this.systemInfo.serverVersion = response.ServerInfo.version;
                    
                    if(response.LicenseInfo.licenseStatus){
                        if(response.LicenseInfo.licenseStatus === "LicenseAccepted"){
                         this.systemInfo.licenseStatus = "License valid";
                        }else{
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



        this.cmsServerApi.getAppVersion().then(version => {
            this.systemInfo.version = version;
        });
     }

     /**
      * Just go back from the about panel.
      * @method goBack
      */    
      public goBack(){
         this.location.back();
      }

      /**
       * This method fetch year from client and update copyright text
       */
      public updateCopyrightText() {
          this.translate.get("about.copyrightText", { value: this.appConfig.CopyrightYear }).subscribe((response: string) => {
              this.copyRightText = response;              
              this.loading = false; // hide loading state
          });
      }
}