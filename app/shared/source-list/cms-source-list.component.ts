/**
 * This a source list component that fetches the combined list of available sources, perspectives and display specific
 * applications from CMS Server API and loads the list in UI in the form of cards (representing a single source with 
 * available information about the source, perspective or application).
 */
import { Component, OnInit, ElementRef, OnDestroy, EventEmitter, Output, Input, OnChanges, SimpleChanges } from "@angular/core";
import { CmsApiService } from "../../cms/api/cms-api.service";
import { CmsEventEmitterService } from "./../../cms/api/cms-event-emitter.service";
import { CMS_EVENTS } from "../../cms/api/cms-events.enum";
import { CmsVirtualScrollService } from "../cms-virtual-scroll.service";
import { Source } from "../../cms/models/cms-source";
import { CmsFavoriteService } from "../cms-favorite.service";
import { StorageManager } from "./../../cms/api/cms-storagemanager.service";
import { DomManager } from "../../utils/dom-manager.util";
import { AppConfig } from "../../config";
import { CmsSettingsService } from "./../../launchpad/settings/cms-settings.service";
import { Tile } from "../../cms/models/cms-tile";
import { TranslateService } from "@ngx-translate/core";
import { CMSConstants } from "../../cms/models/cms-constants";
import { Display } from "../../cms/models/cms-display";
import { Validation } from "../../core/util/Validation";

@Component({
    selector: "cms-source-list",
    template: require("./cms-source-list.component.html"),
    styles: [require("./cms-source-list.component.scss")]
})
/**
 * This class contains the behaviour for sourelist component.
 * @class CmsSourceListComponent
 * @property {boolean} favoriteFilter @Input 
 * @property {string} searchFilter @Input
 * @property {boolean} selectedOnly @Input
 * @property {displayId} number @Input selected display's id.
 * @property {EventEmitter} changeEmitter @Output emit changes on source panel
 * @property {EventEmitter<string>} errorEmitter @Output emit changes on source panel
 * @property {Source[]} sources list of sources to be created as card list
 * @property {HTMLElement} scrollTarget scroll element
 * @constructor contains the dependencies required for the component to function.
 */
export class CmsSourceListComponent implements OnInit, OnChanges, OnDestroy {
    @Input() favoriteFilter: boolean;
    @Input() searchFilter: string;
    @Input() selectedOnly: boolean = false;
    @Input() displayId: number;
    @Output("change") changeEmitter = new EventEmitter();
    @Output("error") errorEmitter = new EventEmitter<string>();
    private sources: Source[];
    private scrollTarget: HTMLElement;
    // dependencies initialized in constructor
    private element: ElementRef;
    // it saves the CMS events subscription and unsubscribe them on component destruction
    private sourceListCmsEvent: EventEmitter<any> = null;
    //Define domManager variable of DomaManager type to handle dom related stuff
    private domManager: DomManager;
    private selectedDisplay;
    /**
     * The constructor initializes various dependencies.
     */
    constructor(
        private cmsServerApi: CmsApiService,
        private el: ElementRef,
        private scroller: CmsVirtualScrollService,
        private cmsSettingsService: CmsSettingsService,
        private storageManager: StorageManager,
        private favoriteService: CmsFavoriteService,
        private appConfig: AppConfig,
        private translateService: TranslateService) {
        this.element = el;
        this.domManager = new DomManager(this.element);
    }

    public ngOnInit() {
        this.getDisplayDetails();
    }

    public ngOnChanges(changes: SimpleChanges) {
        this.scroller.removeScrollListener();
        this.sources = [];
        this.scroller.dataCount = 0;
        this.scroller.max = null;
        this.scroller.count = this.cmsSettingsService.userSettings.pageSize || 20;
        this.scrollTarget = this.domManager.getElementById("source-list-card-container");
        this.getSources();
        if (this.scrollTarget) {
            this.scroller.addScrollListener(this.scrollTarget, function () {
                if (Validation.IsNull(this.scroller.max)) {
                    this.getSources();
                }
            }.bind(this));
        }
        else {
            this.appConfig.error("Scroll target not found on source list. Scrolling will not work.");
        }
    }

    public ngOnDestroy() {
        if (this.scroller) {
            this.scroller.removeScrollListener();
        }
        if (this.sourceListCmsEvent) {
            this.sourceListCmsEvent.unsubscribe();
        }
    }

    /**
     * On selecting a card, the respective source will added to
     * selectedSources of cms setings.
     * @method updateSelection
     * @param {boolean} selected indicates the selected status of the selected source 
     * @param {Source} source selected source
     * @return {void}.
     */
    private updateSelection(selected: boolean, source: Source) {
        if (source.selected) {
            let index = this.cmsSettingsService.selectedSources.findIndex(
                resource => resource.id === source.id
            );
            this.cmsSettingsService.selectedSources.splice(index, 1);
            source.selected = false;
            this.errorEmitter.emit("");
        }
        else if (this.cmsSettingsService.selectedSources.length < CMSConstants.MAXSELECTION) {
            this.cmsSettingsService.selectedSources.push(source);
            source.selected = true;
        }
        else {
            this.translateService.get("sourceList.maxSelection",
                { value: CMSConstants.MAXSELECTION }).subscribe((value) => {
                    this.errorEmitter.emit(value);
                });
        }
    }

    /**
     * On selecting favorite button on card, the respective source will be marked as favorite\unfavorite.
     * @method toggleSourceFavorite
     * @param {Source} source  source to be set to favorite.
     * @return {void}
     */
    private toggleSourceFavorite(source: Source) {
        if (source.disabled) {
            return;
        }
        // if source is favorite, mark it as unfavorite
        if (source.favorite) {
            this.favoriteService.markObjectAsUnfavorite(
                source.id,
                source.type,
                this.sources,
                this.favoriteFilter
            );
        }
        // if source is unfavorite, mark it as favorite
        else {
            this.favoriteService.markObjectAsFavorite(source.id, source.type, this.sources);
        }
    }

    /**
     * This method gets sources from CMS Server API.
     * @method getSources
     * @return {void}.
     */
    private getSources() {
        if (isNaN(this.displayId)) {
            return;
        }
        if (this.selectedOnly) {
            this.sources.push(...this.cmsSettingsService.selectedSources);
            return;
        }
        if (!Validation.IsNull(this.scroller.max)) {
            return;
        }
        this.cmsServerApi.getSourceList(
            this.sources.length + 1,
            this.scroller.count,
            this.displayId,
            this.searchFilter,
            this.favoriteFilter)
            .subscribe((sources: Source[]) => {
                this.appConfig.log(`CmsSourceListComponent: getSources:: Sources list from server = `);
                this.scroller.dataCount = sources.length;
                // mark selected source which are currently shared on display
                this.markSelectedSourcesSharedOnDisplay(this.selectedDisplay, sources);
                this.sources.push(...sources);
                // if max source has been loaded then set maxSources else again addScrollListener                    
                if (sources.length < this.scroller.count) {
                    this.scroller.max = sources.length;
                }
                this.scroller.loading = false;
                // subscribe for source list change events
                if (!this.sourceListCmsEvent) {
                    this.sourceListCmsEvent = CmsEventEmitterService.get(CMS_EVENTS.SourceList)
                        .subscribe((res: {
                            eventType: string, body: any
                        }) => this.handleSourceListEvents(res.eventType, res.body));
                }
            },
            error => {
                this.scroller.loading = false;
            });
    }

    /**
     * Event listener to handle source list related events.
     * @method handleSourceListEvents
     * @param {string} anEventType specifies the type of event.
     * @param {any} aResponseBody specifies the body of the event.
     * @return {void}.
     */
    private handleSourceListEvents(anEventType: string, aResponseBody: any) {
        if (anEventType === "ResourceDeleted") {
            // find the source in the source list and disable it
            let source = this.sources.find(source => source.id === aResponseBody.id);
            if (source) {
                source.disabled = true;
            }
        }
        // send change event to sources panel to show refresh button
        this.changeEmitter.emit();
    }

    /**
     * Returns void, sets all display detail of level 3.
     * @method getDisplayDetails
     * @return {void}
     */
    private getDisplayDetails() {
        let displayObservable = this.cmsServerApi.getSelectedDisplayContent(this.displayId);
        displayObservable.subscribe((displayDetail) => {
            this.selectedDisplay = displayDetail;
            this.cmsSettingsService.selectedSources = this.convertSourcesFromDisplayContent(
                displayDetail.content
            );
        });
        return displayObservable;
    }

    /**
     * This function marks the shared resources on the display wall as selected. 
     * @method markSelectedSourcesSharedOnDisplay
     * @param {Display} display current active Display
     * @param {Source[]} sources current list of resources
     * @return {void}
     */
    private markSelectedSourcesSharedOnDisplay(display: Display, sources: Source[]) {
        if (!display || (sources && !sources.length)) { return; }
        let sharedContent = display.content;
        // if current display has any shared content
        if (sharedContent && sharedContent.length) {
            // looping through all shared content on display
            for (let contentIndex = 0; contentIndex < sharedContent.length; contentIndex++) {
                let resourceId = sharedContent[contentIndex].resourceId;
                let resourceType = sharedContent[contentIndex].type;
                // looping through all available sources
                for (let sourceIndex = 0; sourceIndex < sources.length; sourceIndex++) {
                    if ((sources[sourceIndex].id === resourceId)
                        && (sources[sourceIndex].type.toLowerCase() === resourceType.toLowerCase()
                        )) {
                        //update selection of source
                        sources[sourceIndex].selected = true;
                        break;
                    }
                }
            }
        }
    }

    /**
     * This function converts sources from the content on display.
     * @method convertSourcesFromDisplayContent
     * @param {any} displayContent: content array of display
     * @return {void}
     */
    private convertSourcesFromDisplayContent(displayContent: any) {
        let selectedSources = [];
        if (displayContent && !displayContent.length) {
            return selectedSources;
        }
        for (let sourceIndex = 0; sourceIndex < displayContent.length; sourceIndex++) {
            // fetch display content and map to resource properties  
            selectedSources.push({
                id: displayContent[sourceIndex].resourceId,
                name: displayContent[sourceIndex].name,
                description: "",
                type: displayContent[sourceIndex].type,
                width: displayContent[sourceIndex].width,
                height: displayContent[sourceIndex].height,
                snapshotPath: displayContent[sourceIndex].snapshotPath,
                favorite: false,
                selected: true
            });
        }
        return selectedSources;
    }

}