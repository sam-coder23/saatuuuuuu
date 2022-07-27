/**
 * This module defines root level routes for entire application.
 */
import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CmsAboutPanelComponent } from "./about/cms-about-panel.component";
import { CmsDisplayPanelComponent } from "./display-panel/cms-display-panel.component";
import { CmsDisplaysPanelComponent } from "./displays-panel/cms-displays-panel.component";
import { CmsHomePanelComponent } from "./home/cms-home-panel.component";
import { CmsCanActivateViaAuthorizationService, CmsLoginComponent } from "./login/index";
import { CmsSettingsPanelComponent } from "./settings/cms-settings-panel.component";
import { CmsSettingsLanguagePanelComponent } from "./settings/language/cms-settings-language-panel.component";
import { CmsSourcesPanelComponent } from "./sources-panel/cms-sources-panel.component";
import { CmsTilesPanelComponent } from "./tiles-panel/cms-tiles-panel.component";

export const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "login", component: CmsLoginComponent },
  { path: "display-panel/:id", component: CmsDisplayPanelComponent, canActivate: [CmsCanActivateViaAuthorizationService] },
  { path: "displays-panel", component: CmsDisplaysPanelComponent, canActivate: [CmsCanActivateViaAuthorizationService] },
  { path: "displays/:id/sources-panel", component: CmsSourcesPanelComponent, canActivate: [CmsCanActivateViaAuthorizationService] },
  { path: "settings", component: CmsSettingsPanelComponent, canActivate: [CmsCanActivateViaAuthorizationService] },
  { path: "settings/language/:key", component: CmsSettingsLanguagePanelComponent, canActivate: [CmsCanActivateViaAuthorizationService] },
  { path: "about", component: CmsAboutPanelComponent, canActivate: [CmsCanActivateViaAuthorizationService] },
  { path: "displays/:id/tiles-panel", component: CmsTilesPanelComponent, canActivate: [CmsCanActivateViaAuthorizationService] },
  { path: "home/:displayId", component: CmsHomePanelComponent, canActivate: [CmsCanActivateViaAuthorizationService] },
  { path: "**", redirectTo: "/login" }
];

export const launchpadRouter: ModuleWithProviders<RouterModule> = RouterModule.forRoot(routes);
