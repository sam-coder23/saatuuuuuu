/**
 * This is a grid component that creates a tiler on mini-display along with the content.
 */
import { Component, OnInit, Input, Output, HostListener, ElementRef, AfterViewInit } from "@angular/core";
import { Tile } from "../../../cms/models/cms-tile";
import { Source } from "./../../../cms/models/cms-source";
import { CmsSettingsService } from "./../../../launchpad/settings/cms-settings.service";
import { CmsApiService } from "./../../../cms/api/cms-api.service";
import { AppConfig } from "../../../config";
import { CmsMiniDisplayService } from "./../cms-mini-display.service";
import { TileContent } from "./../../../cms/models/cms-tile-content";
import { RegExManager } from "../../../core/util/RegEx";
import { Url } from "../../../core/util/URL";
import { Validation } from "../../../core/util/Validation";
import { Observable } from "rxjs/Observable";
import { IUserProfileSettings } from "../../../cms/models/cms-user-profile-settings";

@Component({
    selector: "cms-grid",
    template: require("./cms-grid.component.html"),
    styles: [require("./cms-grid.component.scss")],
    host: {
        "(document:click)": "onFocusLostFromContent($event)"
    }
})
/**
 * This class contains the behaviour for Grid component, contains behaviour for swapping, formatting and
 * reformatting of the Content layed tiles.
 * @class CmsGridComponent
 * @property {Tile[]} miniTiles
 * @property {Tile[]} tiles
 * @property {TileContent[]} contents
 * @property {TileContent} selectedContent
 * @property {TileContent} swappingContent
 * @property {boolean} loading
 * @constructor injects all the nessecary dependencies required by the component
 */
export class CmsGridComponent implements OnInit, AfterViewInit {
    // the input property will contain the array of tiles applied on the display
    @Input() public miniTiles: Tile[] = null;
    // the input property will contain the array of actual tiles of display wall
    @Input() public tiles: Tile[] = null;
    // the input property will contain the array of sources in each tile
    @Input() public contents: TileContent[] = null;
    // Collect swapping content when clicked
    private selectedContent: TileContent = null;
    private swappingContent: TileContent = null;
    // checking api call state
    private loading: boolean = false;
    // hold source-label multiline state
    private isMultiLine: boolean = false;

    constructor(
        private elementRef: ElementRef,
        private cmsSettingsService: CmsSettingsService,
        private cmsApiService: CmsApiService,
        private appConfig: AppConfig,
        private cmsMiniDisplayService: CmsMiniDisplayService) { }

    public ngOnInit(): void {
        // apply source label styles as per user settings
        this.applySourceLabelSettings();

        //set isMultiLine flag
        this.setSourceLabelMultiLine();
    }

    public ngAfterViewInit(): void {
        Observable.fromEvent(this.elementRef.nativeElement, "click")
            .debounceTime(500)
            .subscribe((event: any) => {
                const contentId: string = event.target.getAttribute("data-content-id");
                if (contentId) {
                    const filteredContent: TileContent = this.contents.find((content: TileContent) => {
                        return content.id === parseInt(contentId, 10);
                    });
                    this.contentClick(filteredContent);
                }
            });
    }

    /**
     * fomratted style object is retruned with this function.
     * @method formattedStyle
     * @param {any} rawStyle, Specifies the styling object
     * @returns {object}.
     */
    public formattedStyle(rawStyle: any): object {
        if (!rawStyle) {
            return {};
        }
        let snapshotPath: string;
        if (rawStyle.snapshotPath) {
            snapshotPath = rawStyle.snapshotPath;
            if (Url.HasHostName()
                && !Validation.IsNullOrUndefined(snapshotPath)
                && Url.HasIP(snapshotPath)) {
                snapshotPath = RegExManager.IPToHost(snapshotPath, this.appConfig.Host);
            }
            if (snapshotPath) {
                snapshotPath = `url(${snapshotPath}&_=${rawStyle.lastModified})`;
            }
        }

        return {
            width: `${rawStyle.width}%`,
            height: `${rawStyle.height}%`,
            left: `${rawStyle.x}%`,
            top: `${rawStyle.y}%`,
            "z-index": rawStyle.zOrder,
            "background-image": snapshotPath
        };
    }

    /**
     * This method handle click of the content : handles all possible content swapping cases
     * @method contentClick
     * @param {TileContent} content, Speciefies the source to be mapped on the tile.
     * @return {void}
     */
    public contentClick(content: TileContent): void {
        // return if swap source api call is in progress
        if (this.loading) {
            return;
        }
        if (Validation.IsNullOrUndefined(this.selectedContent)) {
            // When no source selected at this moment and on first source content clicked\ selected for swapping
            this.selectedContent = content;
        } else if (content) {
            // Same source clicked again so no more swapping, deselect selected source
            if (this.selectedContent.id === content.id) {
                this.deselctedSource();
            } else {
                // second source selected which need to be swapped, start swapping
                this.swappingContent = content;
                this.swapSource();
            }
        }
    }

    /**
     * This method checks the selected content and highlight the content
     * @method showSelected
     * @param {number} contentId
     */
    public showSelected(contentId: number): boolean {
        if (!Validation.IsNullOrUndefined(this.selectedContent)) {
            if ((contentId === this.selectedContent.id)
                || (!Validation.IsNullOrUndefined(this.swappingContent) &&
                    (this.swappingContent.id) === contentId)) {
                return true;
            }
        }

        return false;
    }

    /**
     * This method fetch user settings for source labels
     * @method applySourceLabelSettings
     * @return {void}
     */
    private applySourceLabelSettings(): void {
        //get user settings from cms-settings-service
        const userSettings: IUserProfileSettings = this.cmsSettingsService.userSettings;
        const isSourceLableEnabled: string = userSettings.sourceLabel.displaySourceNameLabels ? "block" : "none";
        const fontSize: number = userSettings.sourceLabel.fontSize;
        const fontColor: string = userSettings.sourceLabel.fontColor;
        const background: string = userSettings.sourceLabel.backgroundColor;
        let transparency: number = userSettings.sourceLabel.transparency;

        if (transparency < 100) {
            transparency = (100 - transparency) / 100;
        } else if (transparency === 100) {
            transparency = 0;
        }
        const sourcelabelStyles: string = `font-size: ${fontSize}px; color: ${fontColor}; display: ${isSourceLableEnabled}`;
        const sourceLableBackgroundStyles: string = `background: ${background}; opacity: ${transparency}`;
        this.createSourceLableStyleRule(sourcelabelStyles, sourceLableBackgroundStyles);
    }

    /**
     * This method update source label
     * @method createSourceLableStyleRule
     * @param {string} sourceStyle
     * @param {string} backgroungStyles
     * @return {void}
     */
    private createSourceLableStyleRule(sourceStyle: string, backgroundStyles: string): void {
        // remove old style sheet
        const previousStyle: HTMLElement = document.getElementById("sourceLabelStylesheet");
        if (previousStyle) {
            previousStyle.parentNode.removeChild(previousStyle);
        }
        // create a new style sheet
        const styleTag: HTMLStyleElement = document.createElement("style");
        const head: HTMLHeadElement = document.getElementsByTagName("head")[0];
        styleTag.setAttribute("id", "sourceLabelStylesheet");
        head.appendChild(styleTag);
        if (styleTag) {
            styleTag.innerHTML = `.source-label-container{ ${sourceStyle} } .source-label-container::before{ ${backgroundStyles} }`;
        }
    }

    /**
     * Swapping source geometery and calling server API to update geometery of the content
     * for selected display
     * @method swapSource
     * @return {void}
     */
    private swapSource(): void {
        this.loading = true;
        let swappedSource: any[] = this.swapContentGeometeryandCreateContent();
        const observableRequests: Observable<Response>[] = [];

        //first source geometery change call placed
        observableRequests.push(this.cmsApiService.updateContentGeormetryOnDisplay(
            this.cmsMiniDisplayService.display.id,
            swappedSource[0].id,
            swappedSource[0])
        );
        //for second source geometery change call placed
        observableRequests.push(this.cmsApiService.updateContentGeormetryOnDisplay(
            this.cmsMiniDisplayService.display.id,
            swappedSource[1].id,
            swappedSource[1])
        );

        Observable.forkJoin(observableRequests).finally(() => {
            this.loading = false;
            this.deselctedSource();
            swappedSource = [];
        }).subscribe(
            () => {
                // do nothing while success
            },
            (error: any) => {
                this.appConfig.error("There is issue in source swapping : ", error);
            }
            );
    }

    /**
     * Preparing content to swap
     * @method swapContentGeometeryandCreateContent
     * @returns {any[]}
     */
    private swapContentGeometeryandCreateContent(): any[] {
        return [
            this.updateContentGeometery(this.selectedContent, this.swappingContent),
            this.updateContentGeometery(this.swappingContent, this.selectedContent)
        ];
    }

    /**
     * Swapping content geometery of selected 2 contents
     * @method updateContentGeometery
     * @param {TileContent} content original tile content
     * @param {TileContent} swapContent swap target tile content(Source mapped on tile)
     */
    private updateContentGeometery(content: TileContent, swapContent: TileContent): any {
        return {
            id: content.id,
            name: content.name,
            type: content.type,
            resourceId: content.resourceId,
            snapshotPath: content.snapshotPath,
            zOrder: content.zOrder,
            // swapping dimension of selected sources
            x: swapContent.absoluteSize.left,
            y: swapContent.absoluteSize.top,
            width: swapContent.absoluteSize.width,
            height: swapContent.absoluteSize.height
        };
    }

    /**
     * On click : outside source content, if there is selected source content for swap then deselect source
     * content and remove selected source selected for swaping
     * @method onFocusLostFromContent
     * @param {any} event
     * @return {void}
     */
    private onFocusLostFromContent(event: any): void {
        if (event.srcElement.className.indexOf("content box-shadow") === -1 && !event.srcElement.getAttribute("data-content-id")) {
            this.deselctedSource();
        }
    }

    /**
     * Remove selection as same content selected again and
     * empty selected source list as no source selected for swapping
     * @method deselctedSource
     * @returns {void}.
     */
    private deselctedSource(): void {
        this.selectedContent = null;
        this.swappingContent = null;
    }

    /**
     * This method user settings for source Lable Multiline state
     * @method setSourceLabelMultiLine
     * @return {void}
     */
    private setSourceLabelMultiLine(): void {
        let multiLine: boolean = false;

        if (this.cmsSettingsService && this.cmsSettingsService.userSettings && this.cmsSettingsService.userSettings.sourceLabel) {
            multiLine = this.cmsSettingsService.userSettings.sourceLabel.useMultipleLines;
        }

        this.isMultiLine = multiLine;
    }
}
