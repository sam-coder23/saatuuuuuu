import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { CmsLanguages } from "../../../i18n/cms-languages";
import { CmsApiService } from "../../../cms/api/cms-api.service";
import { CmsSettingsService } from "./../../settings/cms-settings.service";

@Component({
    //moduleId: module.id,
    selector: "cms-settings-language-panel",
    template: require("to-string!./cms-settings-language-panel.component.html"),
    styles: [require("to-string!./cms-settings-language-panel.component.scss")]

})

/**
 * This class will be responsible to display language listing page 
 * @class CmsSettingsLanguagePanelComponent
 * @property {string} userSelectedLanguageKey Key of selected language
 * @property {CmsLanguages} cmsLanguages 
 */
export class CmsSettingsLanguagePanelComponent implements OnInit {
    // User selected language key
    private userSelectedLanguageKey: string;

    // get all available cms-languages
    private cmsLanguages: CmsLanguages = CmsLanguages.languages;

    constructor(
        private translate: TranslateService, 
        private cmsServerApi: CmsApiService, 
        private router: Router, 
        private route: ActivatedRoute, 
        private cmsSettingsService: CmsSettingsService) {}

    public ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.userSelectedLanguageKey = params["key"];
        });
    }

    /**
     * This method set lanaguage via user click action
     * @method setLanguage
     * @return {void}
     */
    private setLanguage(languageKey: string): void {
        // set language key
        this.translate.use(languageKey);
        this.userSelectedLanguageKey = languageKey

        //update user settings in service
        let userprofileSettings = this.cmsSettingsService.userSettings;
        userprofileSettings.language = languageKey;

        //update text direction
        this.cmsSettingsService.setTextDirectionByLanguageKey(languageKey);

        //update user setiings in DB
        this.cmsSettingsService.updateUserProfileData(userprofileSettings, () => this.router.navigate(["/settings"]));
    }

    /**
     * This method will navigate to back page
     * @method navigateBack
     * @return {void}
     */
    private navigateBack() {
        history.back();
    }
}