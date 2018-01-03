//This is the shared module contains all the shared components and services.
// Core Moudules
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Http, HttpModule } from "@angular/http";
import { MaterialModule, MdIconRegistry } from "@angular/material";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { BuilderService, RobotModule } from "core-components/app";

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
    HttpModule,
    MaterialModule.forRoot(),
    RouterModule,
    FormsModule,
    RobotModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: Http): TranslateHttpLoader => new TranslateHttpLoader(http, "./i18n/", ".json"),
        deps: [Http]
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
    MdIconRegistry,
    CmsVirtualScrollService,
    CmsMiniDisplayService,
    CmsFavoriteService,
    BuilderService
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class CmsSharedModule {
}
