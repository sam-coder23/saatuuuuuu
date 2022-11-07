/**
 * This is the main module which defines various its own components and services along with other dependent modules
 * such as router, shared and CMS.
 * This module is used for bootstrapping the application.
 */
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClient, HttpClientModule } from "@angular/common/http";

import { MatIconRegistry, MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSliderModule } from "@angular/material/slider";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatMenuModule } from "@angular/material/menu";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatCardModule } from "@angular/material/card";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTabsModule } from "@angular/material/tabs";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatChipsModule } from "@angular/material/chips";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSnackBarModule } from "@angular/material/snack-bar";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule, HammerModule } from "@angular/platform-browser";

import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
// import { BuilderService, RobotModule } from "core-components/app";

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
    HttpClientModule,
    launchpadRouter,
    FormsModule,
    CmsSharedModule,
    CmsModelModule,
    // RobotModule,
    MatCheckboxModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    HammerModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient): TranslateHttpLoader => new TranslateHttpLoader(http, "./app/i18n/",
          `.json?${new Date().toLocaleDateString().replace(/\//g, "")}`),
        deps: [HttpClient]
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
    MatIconRegistry,
    CmsCanActivateViaAuthorizationService,
    CmsSettingsService,
    // BuilderService
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class CmsLaunchapadModule {
}
