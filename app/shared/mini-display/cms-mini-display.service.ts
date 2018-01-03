/**
 * This service performs various computations for mini display and its child components.
 */
import { Injectable } from "@angular/core";
import { Observer } from "rxjs/Observer";
import { Observable } from "rxjs/Rx";

import { CmsApiService } from "../../cms/api/cms-api.service";
import { Display } from "../../cms/models/cms-display";
import { ISize } from "../../cms/models/cms-size";
import { Tile } from "../../cms/models/cms-tile";
import { AppConfig } from "../../config";
import { Validation } from "../../core/util/Validation";
import { TileContent } from "./../../cms/models/cms-tile-content";

@Injectable()
/**
 * This class contains the service behavior for mini-display and injected into mini-display
 * component contains methods for making API request to get mini-display content and also
 * does restructuring calculations on to the mini-display content then used in component.
 * @class CmsMiniDisplayService
 * @property {Display} display currently selected mini display
 * @property {number} zoomLevel required for zooming, sets and gets zoom level in integer
 * @property {{ Left: number, Top: number }} scrollPosition holds mini display scroll position
 * @property {Observable} windowResizeEndEvent
 * @property {number} fitHeightZoomLevel
 * @property {boolean} panend
 * @property {ISize} displaySize contain actual display size
 * @property {ISize} miniDisplaySize contain mini display size
 * @constructor initializes the services used inside the class.
 */
export class CmsMiniDisplayService {
    public display: Display;
    public zoomLevel: number;
    public scrollPosition: { Left: number, Top: number };
    public windowResizeEndEvent: Observable<{}>;
    public fitHeightZoomLevel: number;
    public panend: boolean;
    private displaySize: ISize;
    private miniDisplaySize: ISize;

    constructor(
        private cmsServerApi: CmsApiService,
        private appConfig: AppConfig
    ) {
        this.init();
    }

    /**
     * initialize mini-display service properties
     * @method init
     * @return {void}.
     */
    public init(): void {
        this.display = undefined;
        this.zoomLevel = 0;
        this.displaySize = undefined;
        this.miniDisplaySize = undefined;
        this.scrollPosition = { Left: 0, Top: 0 };
        const timeValue: number = 500;
        this.windowResizeEndEvent = Observable.fromEvent(window, "resize").debounce(() =>
            Observable.timer(timeValue)
        );
        this.panend = false;
    }

    /**
     * This method calls displays API to fetch tiler and content info for selected display.
     * @method getMiniDisplayTilerInfoWithContent
     * @param {number} aDisplayId display id for display wall
     * @param {HTMLELement} aContainer Container to render the mini-display tile grid.
     * @return {Observable} observable of mini-display object.
     */
    public getMiniDisplayTilerInfoWithContent(aDisplayId: number, aContainer: HTMLElement)
        : Observable<{
            displaySize: ISize,
            miniDisplayTilerList: Tile[],
            miniDisplayContentList: TileContent[],
            displayTilerList: Tile[],
            miniDisplaySize: ISize
        }> {
        return Observable.create((observer: Observer<{}>) => {
            this.cmsServerApi.getSelectedDisplayContent(aDisplayId)
                .subscribe(
                (apiDisplay: Display) => {
                    if (apiDisplay) {
                        const display: Display = new Display(apiDisplay);
                        // initialize display size
                        this.displaySize = {
                            width: display.width,
                            height: display.height
                        };
                        // initialize mini-display size
                        this.miniDisplaySize = this.miniDisplayInitialSize(aContainer);
                        // initialize mini-display tiler list
                        const miniDisplayTiler: Tile[] = this.calculateAdjustedViewTilerRectangles(display.tiles);
                        // initialize mini-display content list
                        const miniDisplayContent: TileContent[] = this.calculateAdjustedViewSourceRectangles(
                            display.content, []);
                        const miniDisplayResponse: object = {
                            displaySize: this.displaySize,
                            miniDisplayTilerList: miniDisplayTiler,
                            miniDisplayContentList: miniDisplayContent,
                            displayTilerList: display.tiles,
                            miniDisplaySize: this.miniDisplaySize
                        };
                        observer.next(miniDisplayResponse);
                        observer.complete();
                    }
                },
                (error: any) => {
                    Observable.throw(`MiniDisplayComponent: Display detail
                    info (with tiler and content) API failed. Message: ${error}`);
                });
        });
    }

    /**
     * This method creates a new list of adjusted tiler rectangles for mini-display after
     * conversion from actual display.
     * @method calculateAdjustedViewTilerRectangles
     * @param {Tile[]} aDisplayTilerList Tile array to be adjusted according to number of sources.
     * @return {Tile[]} Array of Tiles.
     */
    public calculateAdjustedViewTilerRectangles(aDisplayTilerList: Tile[]): Tile[] {
        let miniDisplayTilerList: Tile[];
        // creating a new list of adjusted tiler rectangles for mini-display after conversion from actual display
        if (!Validation.IS_UNDEFINED(aDisplayTilerList) && aDisplayTilerList.length > 0) {
            miniDisplayTilerList = aDisplayTilerList;
            miniDisplayTilerList = miniDisplayTilerList.map((content: Tile) => {
                return this.getModelToViewBounds(content);
            });
        }

        return miniDisplayTilerList;
    }

    /**
     * This method creates a new list of adjusted source rectangles for
     * mini-display after conversion from actual display.
     * @method calculateAdjustedViewSourceRectangles
     * @param {TileContent[]} displayContentList Tile content to be shown on adjusted tile
     * @param {TileContent[]} previousDisplayContentList Original content list with original size
     * @param {boolean} updateLastModifed
     * @return {TileContent[]} Array of sources as tile content to be dislayed on layout.
     */
    public calculateAdjustedViewSourceRectangles(
        displayContentList: TileContent[],
        previousDisplayContentList: TileContent[],
        updateLastModifed: boolean = true
    ): TileContent[] {
        let miniDisplayContentList: TileContent[];
        if (!Validation.IS_UNDEFINED(displayContentList)) {
            miniDisplayContentList = displayContentList;
            miniDisplayContentList = miniDisplayContentList.map((content: TileContent) => {
                return this.calculateAdjustedViewSourceRectangle(
                    content,
                    previousDisplayContentList,
                    updateLastModifed
                );
            });
        }

        return miniDisplayContentList;
    }

    /**
     * This method creates adjusted source rectangles for mini-display after
     * conversion from actual display.
     * @method calculateAdjustedViewSourceRectangle
     * @param {TileContent} displayContentList Tile content to be shown on adjusted tile
     * @param {TileContent} previousDisplayContentList Original content list with original size
     * @param {boolean} updateLastModifed
     * @return {TileContent} Array of sources as tile content to be dislayed on layout.
     */
    public calculateAdjustedViewSourceRectangle(
        displayContent: TileContent,
        previousDisplayContentList: TileContent[],
        updateLastModifed: boolean = true
    ): TileContent {
        let existingContent: TileContent;
        if (!Validation.IS_NULL_OR_UNDEFINED(displayContent)) {
            const adjustedRect: Tile = this.getModelToViewBounds(displayContent);
            displayContent.absoluteSize = new Tile(displayContent);
            displayContent.x = adjustedRect.x;
            displayContent.y = adjustedRect.y;
            displayContent.width = adjustedRect.width;
            displayContent.height = adjustedRect.height;

            if (previousDisplayContentList.length > 0) {
                existingContent = previousDisplayContentList.find((previousDisplayContent: TileContent) =>
                    previousDisplayContent.id === previousDisplayContent.id
                );
                if (existingContent) {
                    // update last date as content alerady exist
                    displayContent.lastModified = existingContent.lastModified;
                } else {
                    // update new date as content is newly addedd
                    displayContent.lastModified = Date.now().toString();
                }
            } else {
                displayContent.lastModified = Date.now().toString();
            }

            return displayContent;
        }

        return undefined;
    }

    /**
     * This method converts display tile size to mini display tile size. Also adds the specified margin around the tile by
     * adjusting tile position and size.
     * @method getModelToViewBounds
     * @param {Tile} aOriginalTileGeometry, original dimesions of the tile.
     * @return {Tile} Tile, with new geometry.
     */
    private getModelToViewBounds(aOriginalTileGeometry: Tile): Tile {
        if (!(aOriginalTileGeometry instanceof Tile)) {
            aOriginalTileGeometry = new Tile(aOriginalTileGeometry);
        }
        let leftPosition: number = aOriginalTileGeometry.left * this.miniDisplaySize.width / this.displaySize.width;
        let topPosition: number = aOriginalTileGeometry.top * this.miniDisplaySize.height / this.displaySize.height;
        let widthValue: number = aOriginalTileGeometry.width * this.miniDisplaySize.width / this.displaySize.width;
        let heightValue: number = aOriginalTileGeometry.height * this.miniDisplaySize.height / this.displaySize.height;
        const margin: number = 4;
        const percentValue: number = 100;
        const marginDivisor: number = 2;
        let tile: Tile;
        // adds the specified margin around the tile by adjusting tile position and size.
        leftPosition = (leftPosition + margin);
        leftPosition /= this.miniDisplaySize.width / percentValue;
        topPosition = topPosition + margin;
        topPosition /= this.miniDisplaySize.height / percentValue;
        widthValue = widthValue - (margin * marginDivisor);
        widthValue /= this.miniDisplaySize.width / percentValue;
        heightValue = heightValue - (margin * marginDivisor);
        heightValue /= this.miniDisplaySize.height / percentValue;
        tile = new Tile({
            x: leftPosition,
            y: topPosition,
            width: widthValue,
            height: heightValue
        });

        return tile;
    }

    /**
     * Calculate mini-display size as per actual display size and available screen size fit
     * @method miniDisplayInitialSize
     * @param {HTMLElement} aContainer: Container inside which the min-display renders.
     * @returns {ISize} object of ISize viz. dimensions of the Tile { width , height }
     */
    private miniDisplayInitialSize(aContainer: HTMLElement): ISize {
        /**
         * Why scrollWidth = 23?
         * Because for any browser default width of a scrollbar is 17 pixel. And for
         * some un-detectable reason 6 pixel was a gap.
         * That"s why 23px is set as a fix for height calculation.
         * Reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
         */
        const miniDisplayContainerSize: ISize = aContainer.getBoundingClientRect();
        const miniDisplayContainerRatio: number = miniDisplayContainerSize.width / miniDisplayContainerSize.height;
        const displayRatio: number = this.displaySize.width / this.displaySize.height;
        const margin: number = 20;
        const scrollWidth: number = 23;
        const deltaZoom: number = 10;
        const percentValue: number = 100;
        const marginDivisor: number = 2;
        let diff: number;
        let diffPercent: number;
        // if width is more than height then fit by width otherwise fit by height
        if (displayRatio > miniDisplayContainerRatio) {
            const widthValue: number = miniDisplayContainerSize.width - scrollWidth - margin * marginDivisor;
            const mdSize: any = {
                width: widthValue,
                height: widthValue / displayRatio
            };
            diff = ((miniDisplayContainerSize.height - scrollWidth - margin * marginDivisor) - mdSize.height);
            diffPercent = diff * percentValue / mdSize.height;
            this.fitHeightZoomLevel = diffPercent - (diffPercent % deltaZoom);

            return mdSize;
        } else {
            const heightValue: number = miniDisplayContainerSize.height - scrollWidth - margin * marginDivisor;
            this.fitHeightZoomLevel = 0;

            return {
                width: heightValue * displayRatio,
                height: heightValue
            };
        }
    }
}
