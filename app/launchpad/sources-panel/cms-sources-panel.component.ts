import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { DomManager } from "../../utils/dom-manager.util";
import { Observable } from "rxjs/Rx";
import { AppConfig } from "../../config";
import { CMS_SESSION_STORAGE_ITEM } from "../../cms/models/cms-session-storage-item";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { TranslateService } from "@ngx-translate/core";
import { TilePresetManager } from "../../utils/tilepreset-manager.util";
import { CmsApiService } from "../../cms/api/cms-api.service";
import { CmsSettingsService } from "../settings/cms-settings.service";
import { CMSConstants } from "../../cms/models/cms-constants";
import { Source } from "../../cms/models/cms-source";
import { Display } from "./../../cms/models/cms-display";
import { Validation } from "../../core/util/Validation";
import { SourceRepositionUtility } from "../../utils/source-reposition.util";
import { TileContent } from "../../cms/models/cms-tile-content";
import { ITilePreset } from "../../cms/models/cms-tile-preset";
import { CmsSourceListComponent } from "../../shared/source-list/cms-source-list.component";

/**
 * This is a panel component that defines the layout of a page which includes toolbar and source list.
 * @class CmsSourcesPanelComponent
 * @property {CmsApiService} cmsServerApi
 * @property {boolean} isFavoriteFilter
 * @property {string} searchFilter
 * @property {DomManager} domManager
 * @property {ActivatedRoute} route
 * @property {number} displayId
 * @property {string} panelTitle
 * @property {number} maxSelection
 * @property {string} errorMessage
 * @property {object} states
 * @property {string} searchFilter
 * @property {string} searchKey
 */
@Component({
    //moduleId: module.id,
    selector: "cms-sources-panel",
    template: require("./cms-sources-panel.component.html"),
    styles: [require("./cms-sources-panel.component.scss")]
})
export class CmsSourcesPanelComponent implements OnInit {
    @ViewChild("sourceListComp") private sourceListComp: CmsSourceListComponent;
    private searchFilter: string;
    private searchKey: string;
    private showClearWallPopup: boolean;
    private isFavoriteFilter: boolean;
    private domManager: DomManager;
    private displayId: number;
    private panelTitle: string;
    private maxSelection: number = CMSConstants.MAXSELECTION;
    private errorMessage: string;
    private states: any = {
        reload: false,
        list: true
    };

    constructor(
        private route: ActivatedRoute,
        private appConfig: AppConfig,
        private storageManager: StorageManager,
        private router: Router,
        private cmsSettingService: CmsSettingsService,
        private translate: TranslateService,
        private cmsServerApi: CmsApiService,
        private element: ElementRef) {

        this.isFavoriteFilter = (this.storageManager.get(CMS_SESSION_STORAGE_ITEM.SOURCES_FAVORITE_FILTER) === "true") || false;
        this.searchFilter = this.storageManager.get(CMS_SESSION_STORAGE_ITEM.SOURCES_SEARCH_FILTER) || "";
        this.searchKey = this.searchFilter;
        this.domManager = new DomManager(this.element);
    }

    public ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.displayId = +params["id"];
        });

        this.translate.get("sourceList.connectTo", { value: CMSConstants.MAXSELECTION }).subscribe((response: string) => {
            this.panelTitle = response;
        });
    }

    public ngAfterViewInit(): void {
        /**
         * Making an Observable to get the string token from
         * HTML search input control and update the searchFilter by
         * subscribing this Observable
         */
        const searchInput: HTMLElement = this.domManager.getElementById("sources-panel-search-input");
        Observable.fromEvent(searchInput, "keyup")
            .map((e: any) => e.target.value.trim())
            .debounceTime(500)
            .subscribe((searchString: string) => {
                this.searchFilter = searchString;
                this.storageManager.set(CMS_SESSION_STORAGE_ITEM.SOURCES_SEARCH_FILTER, searchString);
            });
    }

    /**
     * This method listen list changes
     * @method onListChanged
     * @return void
     */
    public onListChanged(): void {
        this.states.reload = true;
    }

    /**
     * This method navigate to back page
     * @method navigateBack
     * @return void
     */
    public navigateBack(): void {
        this.router.navigateByUrl(`/home/${this.displayId}`);
    }

    /**
     * This method use this method to mark and unmark favorite sources
     * @method setFavourite
     * @return void
     */
    private setFavourite(): void {
        this.isFavoriteFilter = !this.isFavoriteFilter;
        this.storageManager.set(CMS_SESSION_STORAGE_ITEM.SOURCES_FAVORITE_FILTER, this.isFavoriteFilter);
    }

    /**
     * This method reload sources list
     * @method reloadList
     * @return void
     */
    private reloadList(): void {
        this.states.reload = false;
        this.states.list = false;
        window.setTimeout(() => {
            this.states.list = true;
        }, 0);
    }

    /**
     * This method focus on search input box
     * @method initializeSearch
     * @param {event} e
     * @return void
     */
    private initializeSearch(e: any): void {
        const mdsearch: HTMLElement = this.domManager.getElementById("sources-panel-search-input");
        let searchInput: NodeListOf<HTMLInputElement>;
        if (mdsearch) {
            searchInput = mdsearch.getElementsByTagName("input");
            if (searchInput.length) {
                searchInput[0].focus();
            }
        }
    }

    /**
     * This method navigate to Next page
     * @method shareTheSources
     * @return void
     */
    private shareTheSources(): void {
        const selectedSourcesLength: number = this.cmsSettingService.selectedSources.length;
        this.isSelectedSameAsSharedSource(
            (sameAsShared: boolean) => {
                if (!sameAsShared) {
                    this.updateDisplayWall();
                }
            });
    }

    /**
     * This method update wall as per selected sources
     * @method updateDisplayWall
     * @return void
     */
    private updateDisplayWall(): void {
        const selectedSourcesLength: number = this.cmsSettingService.selectedSources.length;
        const resources: any[] = new Array(selectedSourcesLength);
        let selectedSources: Source[] = [...this.cmsSettingService.selectedSources];
        let sharedSources: Source[] = [...this.cmsSettingService.sourcesOnDisplay];
        let contentsOnDislay: TileContent[] = [];
        let sortedShareSources: any[] = [];
        let reStructuredPayload: any[] = [];

        this.cmsServerApi.getSelectedDisplayContent(this.displayId)
            .subscribe(
                (display: Display) => {
                if (display) {
                    contentsOnDislay = display.content;

                    if ((this.cmsSettingService.sourcesOnDisplay.length > 0) &&
                        (this.cmsSettingService.selectedSources.length === this.cmsSettingService.sourcesOnDisplay.length)) {
                        reStructuredPayload = SourceRepositionUtility.stickySources(
                            sharedSources,
                            selectedSources
                        );
                    } else {
                        if (sharedSources.length === 0 && selectedSources.length > 1) {
                            if (contentsOnDislay.length > 0) {
                                selectedSources = [...this.cmsSettingService.selectedSources];
                                sharedSources = SourceRepositionUtility.sortSourceArray(contentsOnDislay);
                                sortedShareSources = SourceRepositionUtility.convertSourcesFromDisplayContent(sharedSources);
                                reStructuredPayload = SourceRepositionUtility.stickySources(
                                    sharedSources,
                                    selectedSources
                                );
                            } else {
                                this.cmsSettingService.selectedSources.forEach(
                                    (element: any) => {
                                        reStructuredPayload.push(element);
                                    });
                            }

                        } else {
                            this.cmsSettingService.selectedSources.forEach(
                                (element: any) => {
                                    reStructuredPayload.push(element);
                                });
                        }

                    }
                    // Clone sources and delete selected property; API service rejects extra properties;
                    for (let resourceIndex: number = 0; resourceIndex < resources.length; resourceIndex++) {
                        resources[resourceIndex] = new Source(reStructuredPayload[resourceIndex]);
                        delete resources[resourceIndex].selected;
                    }
                    const requestPayload: any = {
                        "resources": resources
                    };

                    this.cmsServerApi.getTilePresets().subscribe((tilers: ITilePreset[]) => {
                        const tileId: number = TilePresetManager.GetTileId(tilers, selectedSourcesLength, this.displayId);

                        if (tileId === 0) {
                            this.setErrorMessage("sourceList.tileLayoutNotAvailable");
                        } else {
                            this.cmsServerApi.putContentsOnDisplay(this.displayId, tileId, requestPayload)
                                .subscribe(
                                (response: any) => {
                                },
                                (error: any) => {
                                    this.appConfig.error(error);
                                });
                        }
                    }, (error: any) => {
                        this.appConfig.error(error);
                        this.setErrorMessage("sourceList.tileLayoutNotAvailable");
                    });
                }
            });
    }

    /**
     * This method will check if all selected source are same as shared sources
     * Then sameAsShared is true, a new tile will not be applied
     * @method isSelectedSameAsSharedSource
     * @param {method} callback
     */
    private isSelectedSameAsSharedSource(callback: any): void {
        const selectedSources: Source[] = this.cmsSettingService.selectedSources;
        let selectedSourceMatched: boolean = false;
        this.cmsServerApi.getSelectedDisplayContent(this.displayId).subscribe((display: Display) => {
            if (display) {
                const sharedcontent: TileContent[] = SourceRepositionUtility.sortSourceArray(display.content);
                if (selectedSources.length === sharedcontent.length) {
                    for (let selectedSourceIndex: number = 0; selectedSourceIndex < selectedSources.length; selectedSourceIndex++) {
                        const source: Source = selectedSources[selectedSourceIndex];
                        for (let contentIndex: number = 0; contentIndex < sharedcontent.length; contentIndex++) {
                            if ((source.id === sharedcontent[contentIndex].resourceId) && (source.type.toLowerCase() === sharedcontent[contentIndex].type.toLowerCase())) {
                                selectedSourceMatched = true;
                                break;
                            } else {
                                selectedSourceMatched = false;
                            }
                        }
                    }
                } else {
                    selectedSourceMatched = false;
                }

                if (typeof callback === "function") {
                    callback(selectedSourceMatched);
                }
            }
        });
    }

    /**
     * Sets translated error message
     * @param messageKey : key for translation
     * @return void
     */
    private setErrorMessage(messageKey: string): void {
        this.translate.get(messageKey).subscribe((value: string) => {
            this.errorMessage = value;
        });
    }

    /**
  * This method close clear-wall-popup
  * @method closingClearWallPopup
  * @return void
  */
    private closingClearWallPopup(): void {
        this.showClearWallPopup = false;
    }

    /**
     * This method cancel clear-wall-popup and logout
     * @method cancelClearWallPopup
     * @return void
     */
    private cancelClearWallPopup(): void {
        this.showClearWallPopup = false;
    }

    /**
     * This will be reponsible to clear the mini display wall
     * @method clearMiniDisplayWall
     * @return void
     */
    private clearMiniDisplayWall(): void {
        this.cmsServerApi.putContentsOnDisplay(this.displayId, 0, {})
            .finally(
                () => {
                    this.showClearWallPopup = false;
                }
            )
            .subscribe((response: any) => {
                for (let index: number = 0; index < this.cmsSettingService.selectedSources.length; index++) {
                    this.cmsSettingService.selectedSources[index].selected = false;
                }
                this.cmsSettingService.selectedSources.length = 0;
                if (this.sourceListComp) {
                    this.sourceListComp.clearSelectedSourceList();
                }
            },
            (error: any) => {
                console.error(error);
            });
    }
}
