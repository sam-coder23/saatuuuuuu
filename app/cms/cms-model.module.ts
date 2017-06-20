/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

/* Core */
import { NgModule } from "@angular/core";

/* CMS API */
import { CmsApiService } from "./api/cms-api.service";

/* Event emitter */
import { CmsEventEmitterService } from "./api/cms-event-emitter.service";
import { StorageManager } from "./api/cms-storagemanager.service";
import { APIRequest } from "./api/api-request";
import { AppConfig } from "../config";


/**
 * This module defines various services which connect with CMS API and handle CMS events.
 * Also it contains variuos model objects corresponding to CMS models.
 */
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