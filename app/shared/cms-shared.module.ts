/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

/* Core */
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule, Http } from "@angular/http";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

/* Ngx-Translate */
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

/* Angular Material */
import { MaterialModule, MdIconRegistry } from "@angular/material";

/* Card */
import { CmsCardComponent } from "./card/cms-card.component";

/* Mini-Display */
import { CmsMiniDisplayComponent } from "./mini-display/cms-mini-display.component";
import { CmsMiniDisplayService } from "./mini-display/cms-mini-display.service";
import { CmsGridComponent } from "./mini-display/grid/cms-grid.component";

/* Display List */
import { CmsDisplayListComponent } from "./display-list/cms-display-list.component";

/* Source List */
import { CmsSourceListComponent } from "./source-list/cms-source-list.component";

/** Common Services for Lists */
import { CmsVirtualScrollService } from "./cms-virtual-scroll.service";
import { CmsFavoriteService } from "./cms-favorite.service";

import { CmsClipboardComponent } from "./clipboard/cms-clipboard.component";

/* clipboard service to be registered at module level */
import { CmsClipboardService } from "./clipboard/cms-clipboard.service";

/* colorpicker component */
import { CmsColorPickerComponent } from "./colorpicker/cms-colorpicker.component";
import { TileGridComponent } from "./tile-grid/tile-grid.component";
import { CmsTileListComponent } from "./tile-list/cms-tile-list.component";

import { RobotModule, BuilderService } from "core-components/app";

/**
 * This module defines various components that are designed keeping in mind their reusability in future.
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
        useFactory: (http: Http) => new TranslateHttpLoader(http, "./i18n/", ".json"),
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
    CmsClipboardComponent,
    CmsColorPickerComponent,
    TileGridComponent,
    CmsTileListComponent
  ],
  exports: [
    CmsCardComponent,
    CmsMiniDisplayComponent,
    CmsGridComponent,
    CmsDisplayListComponent,
    CmsSourceListComponent,
    CmsClipboardComponent,
    CmsColorPickerComponent,
    TileGridComponent,
    CmsTileListComponent
  ],
  providers: [
    MdIconRegistry,
    CmsVirtualScrollService,
    CmsMiniDisplayService,
    CmsFavoriteService,
    CmsClipboardService,
    BuilderService
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class CmsSharedModule {

}