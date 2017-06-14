/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

/* Core */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import { FormsModule } from '@angular/forms';

/* Ngx-Translate */
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

/* Angular Material */
import { MaterialModule, MdIconRegistry, MdUniqueSelectionDispatcher } from '@angular/material';

/* App Root */
import { CmsLaunchpadComponent } from './cms-launchpad.component';
import { CmsLaunchpadRouter } from './cms-launchpad.routing';

/* Login */
import { CmsLoginComponent, CmsCanActivateViaAuthorizationService } from './login/index';

/* Displays Panel */
import { CmsDisplaysPanelComponent } from './displays-panel/cms-displays-panel.component';

/* Layouts Panel */
import { CmsLayoutsPanelComponent } from './layouts-panel/cms-layouts-panel.component';
import { CmsSaveLayoutComponent } from './layouts-panel/save-layout/cms-save-layout.component';

/* Display Panel */
import { CmsDisplayPanelComponent } from './display-panel/cms-display-panel.component';
import { CmsOptionsComponent } from './display-panel/options/cms-options.component';

/* Sources Panel */
import { CmsSourcesPanelComponent } from './sources-panel/cms-sources-panel.component';

/* CMS Settings */
import { CmsSettingsPanelComponent } from './settings/cms-settings-panel.component'; 
import { CmsSettingsLanguagePanelComponent } from './settings/language/cms-settings-language-panel.component'; 

/* Shared Module */
import { CmsSharedModule } from '../shared/cms-shared.module';

/* CMS Model Module */
import { CmsModelModule } from '../cms/cms-model.module';

/* cms settings service to be registered at module level */
import { CmsSettingsService } from './settings/cms-settings.service';

/* cms about panel */
import { CmsAboutPanelComponent } from './about/cms-about-panel.component';


/**
 * This is the main module which defines various its own components and services along with other dependent modules
 * such as router, shared and CMS.
 * This module is used for bootstrapping the application.
 */
@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    CmsLaunchpadRouter,
    FormsModule,
    CmsSharedModule,
    CmsModelModule,

    MaterialModule.forRoot(),

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: Http) => new TranslateHttpLoader(http, './i18n/', '.json'),
        deps: [Http]
      }
    })
  ],

  declarations: [
    CmsLaunchpadComponent,
    CmsLoginComponent,
    CmsDisplayPanelComponent,
    CmsOptionsComponent,
    CmsDisplaysPanelComponent,
    CmsLayoutsPanelComponent,
    CmsSaveLayoutComponent,
    CmsSourcesPanelComponent,
    CmsSettingsPanelComponent,
    CmsSettingsLanguagePanelComponent,
    CmsAboutPanelComponent
  ],

  bootstrap: [CmsLaunchpadComponent],
  providers: [
    MdIconRegistry,
    CmsCanActivateViaAuthorizationService,
    CmsSettingsService,
	  MdUniqueSelectionDispatcher
  ]
})
export class CmsLaunchapadModule {

}