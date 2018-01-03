/**
 * This class intialize CMS LAUNCHPAD MODULE
 */
import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { CmsLaunchapadModule } from "./launchpad/cms-launchpad.module";

enableProdMode();
platformBrowserDynamic().bootstrapModule(CmsLaunchapadModule);
