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
 * @property {string} searchFilter
 * @property {string} searchKey
 */
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { fromEvent, map, debounceTime, finalize } from "rxjs";
import { CmsApiService } from "../../cms/api/cms-api.service";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { CMSConstants } from "../../cms/models/cms-constants";
import { CmsSessionStorageItem } from "../../cms/models/cms-session-storage-item";
import { Source } from "../../cms/models/cms-source";
import { TileContent } from "../../cms/models/cms-tile-content";
import { ITilePreset } from "../../cms/models/cms-tile-preset";
import { AppConfig } from "../../config";
import { CmsSourceListComponent } from "../../shared/source-list/cms-source-list.component";
import { DomManager } from "../../utils/dom-manager.util";
import { SourceRepositionUtility } from "../../utils/source-reposition.util";
import { TilePresetManager } from "../../utils/tilepreset-manager.util";
import { CmsSettingsService } from "../settings/cms-settings.service";
import { Display } from "./../../cms/models/cms-display";
import { ParsingManager } from "./../../utils/parsing-manager-util";

@Component({
    selector: 'cms-sources-panel',
    templateUrl: './cms-sources-panel.component.html',
    styleUrls: ['./cms-sources-panel.component.scss'],
    standalone: false
})
export class CmsSourcesPanelComponent implements OnInit {
    @ViewChild("sourceListComp", {static: false}) private sourceListComp: CmsSourceListComponent;
    public searchFilter: string;
    public searchKey: string;
    public showClearWallPopup: boolean;
    public isFavoriteFilter: boolean;
    private domManager: DomManager;
    public displayId?: number;
    private panelTitle: string;
    public maxSelection: number = CMSConstants.MAXSELECTION;
    public errorMessage: string;
    public reloadState: boolean = false;
    public listState: boolean = true;
    public dialogMessage: string = "";

    constructor(
        private route: ActivatedRoute,
        private appConfig: AppConfig,
        private storageManager: StorageManager,
        private router: Router,
        public cmsSettingService: CmsSettingsService,
        private translate: TranslateService,
        private cmsServerApi: CmsApiService,
        private element: ElementRef) {
        this.isFavoriteFilter = (this.storageManager.getItem(CmsSessionStorageItem.SOURCES_FAVORITE_FILTER) === "true") || false;
        this.searchFilter = this.storageManager.getItem(CmsSessionStorageItem.SOURCES_SEARCH_FILTER) || "";
        this.searchKey = this.searchFilter;
        this.domManager = new DomManager(this.element);
    }

    public ngOnInit(): void {
        this.route.params.forEach(
            (params: Params) => {
                this.displayId = ParsingManager.TO_INTEGER(params['id']);
            });

        this.translate.get("sourceList.connectTo", { value: CMSConstants.MAXSELECTION }).subscribe((response: string) => {
            this.panelTitle = response;
        });

        this.translate.get('common.clearWallMessage').subscribe((response: string) => {
            this.dialogMessage = response;
        });
    }

    public ngAfterViewInit(): void {
        /**
         * Making an Observable to get the string token from
         * HTML search input control and update the searchFilter by
         * subscribing this Observable
         */
        const searchInput: HTMLElement = this.domManager.getElementById("sources-panel-search-input");
        const dTime: number = 500;
        fromEvent(searchInput, "keyup").pipe(
            map((e: any) => e.target.value.trim()),
            debounceTime(dTime)
            )
            .subscribe((searchString: string) => {
                this.searchFilter = searchString;
                this.storageManager.setItem(CmsSessionStorageItem.SOURCES_SEARCH_FILTER, searchString);
            });
    }

    /**
     * This method listen list changes
     * @method onListChanged
     * @return void
     */
    public onListChanged(): void {
        this.reloadState = true;
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
    public setFavourite(): void {
        this.isFavoriteFilter = !this.isFavoriteFilter;
        this.storageManager.setItem(CmsSessionStorageItem.SOURCES_FAVORITE_FILTER, this.isFavoriteFilter);
    }

    /**
     * This method reload sources list
     * @method reloadList
     * @return void
     */
    public reloadList(): void {
        this.reloadState = false;
        this.listState = false;
        window.setTimeout(() => {
            this.listState = true;
        }, 0);
    }

    /**
     * This method focus on search input box
     * @method initializeSearch
     * @param {event} e
     * @return void
     */
    public initializeSearch(e: any): void {
        const mdsearch: HTMLElement = this.domManager.getElementById("sources-panel-search-input");
        let searchInput: HTMLCollectionOf<HTMLInputElement>;
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
    public shareTheSources(): void {
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
        let selectedSources: Source[] = [...this.cmsSettingService.selectedSources];
        let sharedSources: Source[] = [...this.cmsSettingService.sourcesOnDisplay];
        let contentsOnDisplay: TileContent[] = [];
        let sortedShareSources: any[] = [];
        let reStructuredPayload: any[] = [];

        this.cmsServerApi.getSelectedDisplayContent(this.displayId)
            .subscribe(
            (display: Display) => {
                if (display) {
                    contentsOnDisplay = display.content;
                    if ((this.cmsSettingService.sourcesOnDisplay.length > 0) &&
                        (this.cmsSettingService.selectedSources.length === this.cmsSettingService.sourcesOnDisplay.length)) {
                        reStructuredPayload = SourceRepositionUtility.STICKY_SOURCES(
                            sharedSources,
                            selectedSources
                        );
                    } else {
                        if (sharedSources.length === 0 && selectedSources.length > 1) {
                            if (contentsOnDisplay.length > 0) {
                                selectedSources = [...this.cmsSettingService.selectedSources];
                                sharedSources = SourceRepositionUtility.SORT_SOURCE_ARRAY(contentsOnDisplay);
                                sortedShareSources = SourceRepositionUtility.CONVERT_SOURCES_FROM_DISPLAY_CONTENT(sharedSources);
                                reStructuredPayload = SourceRepositionUtility.STICKY_SOURCES(
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
                                    if (element) {
                                        reStructuredPayload.push(element);
                                    }
                                });
                        }

                    }

                    let sources: any[] = [];

                    // Clone sources without selected property; API service rejects extra properties
                    for (let resourceIndex: number = 0; resourceIndex < selectedSourcesLength; resourceIndex = resourceIndex + 1) {
                        sources[resourceIndex] = {
                            description: reStructuredPayload[resourceIndex].description,
                            favorite: reStructuredPayload[resourceIndex].favorite,
                            height: reStructuredPayload[resourceIndex].height,
                            id: reStructuredPayload[resourceIndex].id,
                            name: reStructuredPayload[resourceIndex].name,
                            snapshotPath: reStructuredPayload[resourceIndex].snapshotPath,
                            type: reStructuredPayload[resourceIndex].type,
                            width: reStructuredPayload[resourceIndex].width
                        };
                    }
                    const requestPayload: object = {
                        resources: sources
                    };

                    this.cmsServerApi.getTilePresets().subscribe((tilers: ITilePreset[]) => {
                        const tileId: number = TilePresetManager.GET_TILE_ID(tilers, selectedSourcesLength, this.displayId);

                        if (tileId === 0) {
                            this.setErrorMessage("sourceList.tileLayoutNotAvailable");
                        } else {
                            this.cmsServerApi.putContentsOnDisplay(this.displayId, tileId, requestPayload)
                                .subscribe(
                                (response: TileContent[]) => {
                                    this.appConfig.log("success ", response);
                                },
                                (error: any) => {
                                    this.appConfig.error('error: ', error);
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
                const sharedcontent: TileContent[] = SourceRepositionUtility.SORT_SOURCE_ARRAY(display.content);
                if (selectedSources.length === sharedcontent.length) {
                    for (const selectedSourceValue of selectedSources) {
                        const source: Source = selectedSourceValue;
                        for (const contentValue of sharedcontent) {
                            if ((source.id === contentValue.resourceId) && (source.type.toLowerCase() === contentValue.type.toLowerCase())) {
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
    public closingClearWallPopup(): void {
        this.showClearWallPopup = false;
    }

    /**
     * This method cancel clear-wall-popup and logout
     * @method cancelClearWallPopup
     * @return void
     */
    public cancelClearWallPopup(): void {
        this.showClearWallPopup = false;
    }

    /**
     * This will be reponsible to clear the mini display wall
     * @method clearMiniDisplayWall
     * @return void
     */
    public clearMiniDisplayWall(): void {
        this.cmsServerApi.putContentsOnDisplay(this.displayId, 0, {}).pipe(
            finalize(
            () => {
                this.showClearWallPopup = false;
            }
            ))
            .subscribe((response: TileContent[]) => {
                for (const selectedSourceItem of this.cmsSettingService.selectedSources) {
                    selectedSourceItem.selected = false;
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
