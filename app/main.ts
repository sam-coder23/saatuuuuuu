/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { CmsLaunchapadModule } from "./launchpad/cms-launchpad.module";
import { enableProdMode } from "@angular/core";

enableProdMode();
platformBrowserDynamic().bootstrapModule(CmsLaunchapadModule);