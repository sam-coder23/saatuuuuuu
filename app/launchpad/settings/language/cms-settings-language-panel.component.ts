/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

import { CmsLanguages } from "../../../i18n/cms-languages";
import { CmsApiService } from "../../../cms/api/cms-api.service";
import { CmsSettingsService } from "./../../settings/cms-settings.service";

/**
 * This is a panel component that defines the layout of language page.
 * 
 * @author: CHERA
 * @version: CMS 3.0
 */

@Component({
    //moduleId: module.id,
    selector: "cms-settings-language-panel",
    template: require("to-string!./cms-settings-language-panel.component.html"),
    styles: [require("to-string!./cms-settings-language-panel.component.scss")]

})
export class CmsSettingsLanguagePanelComponent implements OnInit {
    /**
     * Properties
     */

    // User selected language key
    private mUserSelectedLanguageKey: string;

    // get all available cms-languages
    private mCmsLanguages: CmsLanguages = CmsLanguages.languages;

    /**
     * Public Methods
     */

    /**
     * The constructor initializes various services.
     */
    constructor(private translate: TranslateService, private cmsServerApi: CmsApiService, private router: Router, private route: ActivatedRoute, private cmsSettingsService: CmsSettingsService) {
    }

    /**
     * On component initialization.
     */
    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.mUserSelectedLanguageKey = params["key"];
        });
    }

    /**
     * This method set lanaguage via user click action
     */
    private setLanguage(languageKey: string): void {
        // set language key
        this.translate.use(languageKey);
        this.mUserSelectedLanguageKey = languageKey

        //update user settings in service
        let userprofileSettings = this.cmsSettingsService.mUserSettings;
        userprofileSettings.language = languageKey;

        //update text direction
        this.cmsSettingsService.setTextDirectionByLanguageKey(languageKey);

        //update user setiings in DB
        this.cmsSettingsService.updateUserProfileData(userprofileSettings, () => this.router.navigate(["/settings"]));
    }

    private navigateBack() {
        history.back();
    }
}