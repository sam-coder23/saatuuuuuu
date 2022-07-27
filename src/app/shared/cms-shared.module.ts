//This is the shared module contains all the shared components and services.
// Core Modules
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClient, HttpClientModule } from "@angular/common/http";

/* Angular Material */
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

import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
// import { BuilderService, RobotModule } from "core-components/app";

import { CmsCardComponent } from "./card/cms-card.component";
import { CmsFavoriteService } from "./cms-favorite.service";
import { CmsVirtualScrollService } from "./cms-virtual-scroll.service";
import { CmsDisplayListComponent } from "./display-list/cms-display-list.component";
import { CmsDisplayNameComponent } from "./display-name/cms-display-name.component";
import { CmsMiniDisplayComponent } from "./mini-display/cms-mini-display.component";
import { CmsMiniDisplayService } from "./mini-display/cms-mini-display.service";
import { CmsGridComponent } from "./mini-display/grid/cms-grid.component";
import { CmsSourceListComponent } from "./source-list/cms-source-list.component";
import { TileGridComponent } from "./tile-grid/tile-grid.component";
import { CmsTileListComponent } from "./tile-list/cms-tile-list.component";

/**
 * This module defines various components that are designed keeping in
 * mind their reusability in future.
 */
@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
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

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient): TranslateHttpLoader => new TranslateHttpLoader(http, "./i18n/",
          `.json?${new Date().toLocaleDateString().replace(/\//g, "")}`),
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    CmsCardComponent,
    CmsMiniDisplayComponent,
    CmsGridComponent,
    CmsDisplayListComponent,
    CmsSourceListComponent,
    TileGridComponent,
    CmsTileListComponent,
    CmsDisplayNameComponent
  ],
  exports: [
    CmsCardComponent,
    CmsMiniDisplayComponent,
    CmsGridComponent,
    CmsDisplayListComponent,
    CmsSourceListComponent,
    TileGridComponent,
    CmsTileListComponent,
    CmsDisplayNameComponent
  ],
  providers: [
    MatIconRegistry,
    CmsVirtualScrollService,
    CmsMiniDisplayService,
    CmsFavoriteService,
    // BuilderService
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class CmsSharedModule {
}
