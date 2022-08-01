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
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";

import { CmsApiService } from "../../cms/api/cms-api.service";
import { Display } from "../../cms/models/cms-display";
import { AppConfig } from "../../config";
import { CmsSettingsService } from "../settings/cms-settings.service";
import { ParsingManager } from "./../../utils/parsing-manager-util";

@Component({
    selector: 'cms-home-panel',
    templateUrl: './cms-home-panel.component.html',
    styleUrls: ['./cms-home-panel.component.scss']
})

export class CmsHomePanelComponent implements OnInit {
    public showHomePanel: any = false;
    private displayId: number;
    private selectedSourcesLength: number;
    public isDisabled: boolean = false;
    public showClearWallPopup: boolean = false;
    public dialogMessage: string = "";

    constructor(
        private appConfig: AppConfig,
        private translate: TranslateService,
        private cmsServerApi: CmsApiService,
        private activatedRoute: ActivatedRoute,
        private cmsSettingsService: CmsSettingsService,
        private router: Router) { }

    public ngOnInit(): void {
        this.activatedRoute.params.subscribe((value: any) => {
            this.displayId = ParsingManager.TO_INTEGER(value.displayId);

            this.updateOptions();
        });
        this.translate.get('home.clearWallConfirmationPopupMessage').subscribe((response: string) => {
            this.dialogMessage = response;
        });
    }

    /**
     * Navigate to Source Panel Component
     * @method navigateToSource
     * @return {void}
     */
    public navigateToSource(): void {
        this.router.navigate([`/displays/${this.displayId}/sources-panel`]);
    }

    /**
     * Navigate to Layout Panel Component
     * @method navigateToLayout
     * @return {void}
     */
    public navigateToLayout(): void {
        if (!this.isDisabled) {
            this.router.navigateByUrl(`/displays/${this.displayId}/tiles-panel?sourceCount=${this.selectedSourcesLength}`);
        }
    }

    /**
     * Navigate to Reposition Panel Component
     * @method navigateToResposition
     * @return {void}
     */
    public navigateToResposition(): void {
        if (!this.isDisabled) {
            this.router.navigateByUrl(`display-panel/${this.displayId}`);
        }
    }

    /**
     * Navigate to setting Panel Component
     * @method navigateToSettings
     * @return {void}
     */
    public navigateToSettings(): void {
        this.router.navigate(["/settings"]);
    }

    /**
     * Navigate to About Panel Component
     * @method navigateToAbout
     * @return {void}
     */
    public navigateToAbout(): void {
        this.router.navigate(["/about"]);
    }

    /**
     * User Logoff show clear wall popup
     * @method userLogoff
     * @return {void}
     */
    public userLogoff(): void {
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
    public clearMiniDisplayWall(): void {
        this.cmsServerApi.putContentsOnDisplay(this.displayId, 0, {}).pipe(
            finalize(() => {
                this.closingClearWallPopup();
            }))
            .subscribe(
            (response: any) => {
                this.cmsSettingsService.selectedSources.length = 0;
                this.navigateToLogin();
            },
            (error: any) => {
                this.appConfig.log("ERROR: home panel", error);
            });
    }

    /**
     * cancel popup
     * @method cancelClearWallPopup
     * @return {void}
     */
    public cancelClearWallPopup(): void {
        this.closingClearWallPopup();
        this.navigateToLogin();
    }

    /**
     * close popup
     * @method closingClearWallPopup
     * @return {void}
     */
    public closingClearWallPopup(): void {
        this.showClearWallPopup = false;
    }

    /**
     * navigate to login page
     * @method navigateToLogin
     * @return {void}
     */
    private navigateToLogin(): void {
        this.cmsServerApi.logout().subscribe();
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
                if (displayDetail) {
                    this.selectedSourcesLength = displayDetail.content.length;
                    this.isDisabled = this.selectedSourcesLength < 1;
                    this.showHomePanel = true;
                }
            },
            (error: any) => {
                this.appConfig.log("ERROR: home panel", error);
            });
    }
}
