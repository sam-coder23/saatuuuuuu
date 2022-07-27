/**
 * This class will be responsible to display language listing page
 * @class CmsSettingsLanguagePanelComponent
 * @property {string} userSelectedLanguageKey Key of selected language
 * @property {CmsLanguages} cmsLanguages
 */
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

import { CmsApiService } from "../../../cms/api/cms-api.service";
import { IUserProfileSettings } from "../../../cms/models/cms-user-profile-settings";
import { CmsLanguages } from "../../../i18n/cms-languages";
import { CmsSettingsService } from "./../../settings/cms-settings.service";

@Component({
    selector: 'cms-settings-language-panel',
    templateUrl: './cms-settings-language-panel.component.html',
    styleUrls: ['./cms-settings-language-panel.component.scss']
})

export class CmsSettingsLanguagePanelComponent implements OnInit {
    // User selected language key
    public userSelectedLanguageKey: string;

    // get all available cms-languages
    public cmsLanguages: { key: string, value: string }[] = (new CmsLanguages()).languages;

    constructor(
        private translate: TranslateService,
        private cmsServerApi: CmsApiService,
        private router: Router,
        private route: ActivatedRoute,
        private cmsSettingsService: CmsSettingsService) {}

    public ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.userSelectedLanguageKey = params['key'];
        });
    }

    /**
     * This method set lanaguage via user click action
     * @method setLanguage
     * @return void
     */
    public setLanguage(languageKey: string): void {
        // set language key
        this.translate.use(languageKey);
        this.userSelectedLanguageKey = languageKey;

        //update user settings in service
        const userprofileSettings: IUserProfileSettings = this.cmsSettingsService.userSettings;
        userprofileSettings.language = languageKey;

        //update text direction
        this.cmsSettingsService.setTextDirectionByLanguageKey(languageKey);

        //update user setiings in DB
        this.cmsSettingsService.updateUserProfileData(userprofileSettings, () => history.back());
    }

    /**
     * This method will navigate to back page
     * @method navigateBack
     * @return void
     */
    public navigateBack(): void {
        history.back();
    }
}
