/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CmsDisplaysPanelComponent } from "./displays-panel/cms-displays-panel.component";
import { CmsDisplayPanelComponent } from "./display-panel/cms-display-panel.component";
import { CmsLoginComponent, CmsCanActivateViaAuthorizationService } from "./login/index";
import { CmsSourcesPanelComponent } from "./sources-panel/cms-sources-panel.component";
import { CmsSettingsPanelComponent } from "./settings/cms-settings-panel.component";
import { CmsSettingsLanguagePanelComponent } from "./settings/language/cms-settings-language-panel.component"; 
import { CmsAboutPanelComponent } from "./about/cms-about-panel.component";
import { CmsTilesPanelComponent } from "./tiles-panel/cms-tiles-panel.component";

/**
 * This module defines root level routes for entire application.
 */
export const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "login", component: CmsLoginComponent },
  { path: "display-panel/:id", component: CmsDisplayPanelComponent, canActivate: [CmsCanActivateViaAuthorizationService] },
  { path: "displays-panel", component: CmsDisplaysPanelComponent, canActivate: [CmsCanActivateViaAuthorizationService] },
  { path: "displays/:id/sources-panel", component: CmsSourcesPanelComponent, canActivate: [CmsCanActivateViaAuthorizationService] },
  { path: "settings", component: CmsSettingsPanelComponent, canActivate: [CmsCanActivateViaAuthorizationService] },
  { path: "settings/language/:key", component: CmsSettingsLanguagePanelComponent, canActivate: [CmsCanActivateViaAuthorizationService] },
  { path: "about", component: CmsAboutPanelComponent, canActivate: [CmsCanActivateViaAuthorizationService] },
  { path: "displays/:id/tiles-panel", component: CmsTilesPanelComponent, canActivate: [CmsCanActivateViaAuthorizationService] }
];

export const CmsLaunchpadRouter: ModuleWithProviders = RouterModule.forRoot(routes);