import { Component, OnInit } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { TranslateService } from "@ngx-translate/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { CmsApiService } from "../../cms/api/cms-api.service";
import { CmsSettingsService } from "../settings/cms-settings.service";
import { CmsLanguages } from "../../i18n/cms-languages";
import { Display } from "../../cms/models/cms-display";

/**
 * This class contains the logic of cms home panel with multiple options, using these options
 * user will be able to navigate to specific panel directly.
 * @class CmsHomePanelComponent
 * @property {boolean} showClearWallPopup //it is responsible for show/hide the clear wall popup
 * @property {boolean} isDisabled //it is responsible for enable/disable options
 * @property {number} selectedSourcesLength //number of sources selected
 * @property {number} displayId //selected display id
 * @property {boolean} showHomePanel //contains boolean value
 */

@Component({
    selector: "cms-home-panel",
    template: require("./cms-home-panel.component.html"),
    styles: [require("./cms-home-panel.component.scss")]
})

export class CmsHomePanelComponent implements OnInit {
    private showHomePanel: any = false;
    private displayId: number;
    private selectedSourcesLength: number;
    private isDisabled: boolean = false;
    private showClearWallPopup: boolean = false;

    constructor(
        private translate: TranslateService,
        private cmsServerApi: CmsApiService,
        private activatedRoute: ActivatedRoute,
        private cmsSettingsService: CmsSettingsService,
        private router: Router) { }

    public ngOnInit(): void {
        this.displayId = parseInt(this.activatedRoute.params["value"]["displayId"], 10);
        this.updateOptions();
    }

    /**
     * Navigate to Source Panel Component
     * @method navigateToSource
     * @return {void}
     */
    private navigateToSource(): void {
        this.router.navigate([`/displays/${this.displayId}/sources-panel`]);
    }

    /**
     * Navigate to Layout Panel Component
     * @method navigateToLayout
     * @return {void}
     */
    private navigateToLayout(): void {
        if (!this.isDisabled) {
            this.router.navigateByUrl(`/displays/${this.displayId}/tiles-panel?sourceCount=${this.selectedSourcesLength}`);
        }
    }

    /**
     * Navigate to Reposition Panel Component
     * @method navigateToResposition
     * @return {void}
     */
    private navigateToResposition(): void {
        if (!this.isDisabled) {
            this.router.navigateByUrl(`display-panel/${this.displayId}`);
        }
    }

    /**
     * Navigate to setting Panel Component
     * @method navigateToSettings
     * @return {void}
     */
    private navigateToSettings(): void {
        this.router.navigate(["/settings"]);
    }

    /**
     * Navigate to About Panel Component
     * @method navigateToAbout
     * @return {void}
     */
    private navigateToAbout(): void {
        this.router.navigate(["/about"]);
    }

    /**
     * User Logoff show clear wall popup
     * @method userLogoff
     * @return {void}
     */
    private userLogoff(): void {
        if (this.selectedSourcesLength > 0) {
            this.showClearWallPopup = true;
        } else {
            this.navigateToLogin();
        }
    }

    /**
     * clear mini display
     * @method clearMiniDisplayWall
     * @return {void}
     */
    private clearMiniDisplayWall(): void {
        this.cmsServerApi.putContentsOnDisplay(this.displayId, 0, {})
            .finally(
            () => {
                this.closingClearWallPopup();
            })
            .subscribe(
            (response: any) => {
                this.cmsSettingsService.selectedSources.length = 0;
                this.navigateToLogin();
            },
            (error: any) => {
                console.error(error);
            });
    }

    /**
     * cancel popup
     * @method cancelClearWallPopup
     * @return {void}
     */
    private cancelClearWallPopup(): void {
        this.closingClearWallPopup();
        this.navigateToLogin();
    }

    /**
     * close popup
     * @method closingClearWallPopup
     * @return {void}
     */
    private closingClearWallPopup(): void {
        this.showClearWallPopup = false;
    }

    /**
     * navigate to login page
     * @method navigateToLogin
     * @return {void}
     */
    private navigateToLogin(): void {
        this.cmsServerApi.logoutUser();
    }

    /**
     * update options
     * @method updateOptions
     * @return {void}
     */
    private updateOptions(): void {
        const displayObservable: Observable<Display> = this.cmsServerApi.getSelectedDisplayContent(this.displayId);
        displayObservable.subscribe(
            (displayDetail: Display) => {
                this.selectedSourcesLength = displayDetail.content.length;
                this.isDisabled = this.selectedSourcesLength < 1;
                this.showHomePanel = true;
            },
            (error: any) => {
                console.log("ERROR: home panel", error);
            });
    }
}
