/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { TranslateService } from "@ngx-translate/core";

import { CmsApiService } from '../../cms/api/cms-api.service';
import { AppConfig } from '../../config';

@Component({
    //moduleId: module.id,
    selector: 'cms-about-panel',
    template: require('to-string!./cms-about-panel.component.html'),
    styles: [require('to-string!./cms-about-panel.component.scss')]
})
/**
 * This class will be responsible to display the about content 
 * @class CmsAboutPanelComponent
 * @property {boolean} loading To show or hide loading process.
 */
export class CmsAboutPanelComponent implements OnInit {  

    private loading: boolean = false;
    private systemInfo = {
        licensedTo: '',
        projectName: '',
        licenseStatus: '',
        server: '',
        version:'',
        serverVersion:'',
        daysremaining:''
    }

    private copyRightText: string;

     constructor(private cmsServerApi: CmsApiService, private location:Location, private translate: TranslateService,  private appConfig: AppConfig) {
         
      }

     ngOnInit() { 
        /**
         * Fetching system info.
         */ 
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
                    this.systemInfo.licensedTo = response.licenseinfo.customername;
                    this.systemInfo.projectName = response.licenseinfo.projectname;
                    this.systemInfo.server = response.serverinfo.ip;
                    this.systemInfo.serverVersion = response.serverinfo.version;
                    
                    if(response.licenseinfo.licensestatus){
                        if(response.licenseinfo.licensestatus === "LicenseAccepted"){
                         this.systemInfo.licenseStatus = "License valid";
                        }else{
                            this.systemInfo.daysremaining = response.licenseinfo.daysremaining + " day(s) left for evaluation";
                            this.systemInfo.licenseStatus = response.licenseinfo.licensestatus + ", " + this.systemInfo.daysremaining;
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
      goBack(){
         this.location.back();
      }

      /**
       * This method fetch year from client and update copyright text
       */
      updateCopyrightText() {
          this.translate.get('about.copyrightText', { value: this.appConfig.copyRightYear }).subscribe((response: string) => {
              this.copyRightText = response;

              // hide loading state
              this.loading = false;
          });
      }
}