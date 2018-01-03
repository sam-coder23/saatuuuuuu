/**
 * This is the main module which defines various its own components and services along with other dependent modules
 * such as router, shared and CMS.
 * This module is used for bootstrapping the application.
 */
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Http, HttpModule } from "@angular/http";
import { MaterialModule, MdIconRegistry, MdUniqueSelectionDispatcher } from "@angular/material";
import { BrowserModule } from "@angular/platform-browser";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { BuilderService, RobotModule } from "core-components/app";

import { CmsModelModule } from "../cms/cms-model.module";
import { CmsSharedModule } from "../shared/cms-shared.module";
import { CmsAboutPanelComponent } from "./about/cms-about-panel.component";
import { CmsLaunchpadComponent } from "./cms-launchpad.component";
import { launchpadRouter } from "./cms-launchpad.routing";
import { CmsDisplayPanelComponent } from "./display-panel/cms-display-panel.component";
import { CmsDisplaysPanelComponent } from "./displays-panel/cms-displays-panel.component";
import { CmsHomePanelComponent } from "./home/cms-home-panel.component";
import { CmsCanActivateViaAuthorizationService, CmsLoginComponent } from "./login/index";
import { CmsSettingsPanelComponent } from "./settings/cms-settings-panel.component";
import { CmsSettingsService } from "./settings/cms-settings.service";
import { CmsSettingsLanguagePanelComponent } from "./settings/language/cms-settings-language-panel.component";
import { CmsSourcesPanelComponent } from "./sources-panel/cms-sources-panel.component";
import { CmsTilesPanelComponent } from "./tiles-panel/cms-tiles-panel.component";

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    launchpadRouter,
    FormsModule,
    CmsSharedModule,
    CmsModelModule,
    RobotModule,

    MaterialModule.forRoot(),

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: Http): TranslateHttpLoader => new TranslateHttpLoader(http, "./i18n/", ".json"),
        deps: [Http]
      }
    })
  ],

  declarations: [
    CmsLaunchpadComponent,
    CmsLoginComponent,
    CmsDisplayPanelComponent,
    CmsDisplaysPanelComponent,
    CmsSourcesPanelComponent,
    CmsSettingsPanelComponent,
    CmsSettingsLanguagePanelComponent,
    CmsAboutPanelComponent,
    CmsTilesPanelComponent,
    CmsHomePanelComponent
  ],

  bootstrap: [CmsLaunchpadComponent],
  providers: [
    MdIconRegistry,
    CmsCanActivateViaAuthorizationService,
    CmsSettingsService,
    MdUniqueSelectionDispatcher,
    BuilderService
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class CmsLaunchapadModule {
}
