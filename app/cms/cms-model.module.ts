/**
 * This module defines various services which connect with CMS API and handle CMS events.
 * Also it contains variuos model objects corresponding to CMS models.
 */

import { NgModule } from "@angular/core";

import { AppConfig } from "../config";
import { APIRequest } from "./api/api-request";
import { CmsApiService } from "./api/cms-api.service";
import { CmsEventEmitterService } from "./api/cms-event-emitter.service";
import { StorageManager } from "./api/cms-storagemanager.service";

@NgModule({
    imports: [ ],
    declarations: [ ],
    exports: [ ],
    providers: [
        AppConfig,
        CmsApiService,
        CmsEventEmitterService,
        StorageManager,
        APIRequest
    ]
})
export class CmsModelModule { }
