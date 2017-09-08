/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { Injectable } from "@angular/core";

import { CmsApiService } from "../../cms/api/cms-api.service";
import { TileContent } from "./../../cms/models/cms-tile-content";
import { Source } from "./../../cms/models/cms-source";
import { ITile } from "../../cms/models/cms-tile";
import { Display } from "../../cms/models/cms-display";
import { ISize } from "../../cms/models/cms-size";
import { Observable } from "rxjs/Rx";
import { AppConfig } from "../../config";


/**
 * This service performs various computations for mini display and its child components.
 */
@Injectable()
export class CmsMiniDisplayService {

    // currently selected mini display
    display: Display;

    // required for zooming, sets and gets zoom level in integer
    zoomLevel: number;

    // holds mini display scroll position
    public scrollPosition: { Left: number, Top: number };

    public windowResizeEndEvent: Observable<{}>;

    // keep zoomLevel to be set on fit height of mini-display
    public fitHeightZoomLevel: number;

    public panend: boolean;
    
    // it will contain actual display size
    private mDisplaySize: ISize;

    // it will contain mini display size
    private mMiniDisplaySize: ISize;



    /**
     * The constructor initializes various services.
     */
    constructor(private cmsServerApi: CmsApiService, private appConfig: AppConfig) {
        this.init();
    }

    /**
     * initialize mini-display service properties
     */
    public init() {
        this.display = null;
        this.zoomLevel = 0;
        this.mDisplaySize = null;
        this.mMiniDisplaySize = null;
        this.scrollPosition = { Left: 0, Top: 0 };
        this.windowResizeEndEvent = Observable.fromEvent(window, "resize").debounce(() => Observable.timer(500));
        this.panend = false;
    }

    /**
     * This method calls displays API to fetch tiler and content info for selected display.
     * @pending: Boom
     */
    getMiniDisplayTilerInfoWithContent(aDisplayId: number, aContainer: HTMLElement): Observable<{
        displaySize: ISize,
        miniDisplayTilerList: ITile[],
        miniDisplayContentList: TileContent[],
        displayTilerList: ITile[],
        miniDisplaySize: ISize
    }> {
        return Observable.create(observer => {
            this.cmsServerApi.getSelectedDisplayContent(aDisplayId)
                .subscribe((display: Display) => {
                    //this.appConfig.log("MiniDisplayComponent: Display detail info (with tiler and content) API successful.");
                    // initialize display size
                    this.mDisplaySize = {
                        width: display.width,
                        height: display.height
                    }

                    // initialize mini-display size
                    this.mMiniDisplaySize = this.miniDisplayInitialSize(aContainer);

                    // initialize mini-display tiler list
                    let miniDisplayTilerList: ITile[] = this.calculateAdjustedViewTilerRectangles(display.tiles);

                    // initialize mini-display content list
                    let miniDisplayContentList: TileContent[] = this.calculateAdjustedViewSourceRectangles(display.content, []);

                    let miniDisplayResponse = {
                        displaySize: this.mDisplaySize,
                        miniDisplayTilerList: miniDisplayTilerList,
                        miniDisplayContentList: miniDisplayContentList,
                        displayTilerList: display.tiles,
                        miniDisplaySize: this.mMiniDisplaySize
                    }

                    observer.next(miniDisplayResponse);
                    observer.complete();
                }, (error) => {
                    Observable.throw("MiniDisplayComponent: Display detail info (with tiler and content) API failed. Message:" + error)
                });
        });
    }

    /**
     * This method creates a new list of adjusted tiler rectangles for mini-display after conversion from actual display.
     */
    calculateAdjustedViewTilerRectangles(aDisplayTilerList: ITile[]): ITile[] {
        let miniDisplayTilerList: ITile[];
        // creating a new list of adjusted tiler rectangles for mini-display after conversion from actual display

        if (aDisplayTilerList !== undefined && aDisplayTilerList.length > 0) {
            miniDisplayTilerList = aDisplayTilerList;
            miniDisplayTilerList = miniDisplayTilerList.map((content) => {
                return this.getModelToViewBounds(content);
            });
        }

        return miniDisplayTilerList;
    }

    /**
     * This method creates a new list of adjusted source rectangles for mini-display after conversion from actual display.
     */
    calculateAdjustedViewSourceRectangles(
        aDisplayContentList: TileContent[], 
        previousDisplayContentList: TileContent[], 
        updateLastModifed: boolean = true
    ): TileContent[] {

        let miniDisplayContentList: TileContent[];

        if (aDisplayContentList !== undefined) {
            miniDisplayContentList = aDisplayContentList;
            miniDisplayContentList = miniDisplayContentList.map((content) => {
                return this.calculateAdjustedViewSourceRectangle(content, previousDisplayContentList, updateLastModifed);
            });
        }

        return miniDisplayContentList;
    }

    /**
     * This method creates adjusted source rectangles for mini-display after conversion from actual display.
     */
    calculateAdjustedViewSourceRectangle(
        aDisplayContent: TileContent,
        previousDisplayContentList: TileContent[], 
        updateLastModifed: boolean = true
    ): TileContent {
        
        let existingContent: TileContent;

        if (aDisplayContent !== null || aDisplayContent !== undefined) {
            var adjustedRect = this.getModelToViewBounds(aDisplayContent);

            aDisplayContent.absoluteSize = {
                x: aDisplayContent.x,
                y: aDisplayContent.y,
                width: aDisplayContent.width,
                height: aDisplayContent.height
            };

            aDisplayContent.x = adjustedRect.x;
            aDisplayContent.y = adjustedRect.y;
            aDisplayContent.width = adjustedRect.width;
            aDisplayContent.height = adjustedRect.height;
            
            if(previousDisplayContentList.length > 0) {
                existingContent = previousDisplayContentList.find(displayContent => displayContent.id === aDisplayContent.id);
                
                if(existingContent) {
					// update last date as content alerady exist
                    aDisplayContent.lastModified = existingContent.lastModified;              
                }
                else {
					// update new date as content is newly addedd
                    aDisplayContent.lastModified = Date.now().toString();                                       
                }
            }
            else {
                aDisplayContent.lastModified = Date.now().toString();
            }
            
            return aDisplayContent;
        }

        return null;
    }

    /**
     * This method converts display tile size to mini display tile size. Also adds the specified margin around the tile by
     * adjusting tile position and size. 
     * @pending - arrays are reference type. we must know that.
     * Finally the conversion is done to calculate everything in %age
     */
    private getModelToViewBounds(aOriginalTileGeometry: ITile): ITile {
        let leftPosition = aOriginalTileGeometry.x * this.mMiniDisplaySize.width / this.mDisplaySize.width,
            topPosition = aOriginalTileGeometry.y * this.mMiniDisplaySize.height / this.mDisplaySize.height,
            width = aOriginalTileGeometry.width * this.mMiniDisplaySize.width / this.mDisplaySize.width,
            height = aOriginalTileGeometry.height * this.mMiniDisplaySize.height / this.mDisplaySize.height,
            margin = 4,
            newRect: ITile;

        // adds the specified margin around the tile by adjusting tile position and size. 
        leftPosition = (leftPosition + margin);
        leftPosition /= this.mMiniDisplaySize.width / 100;

        topPosition = topPosition + margin;
        topPosition /= this.mMiniDisplaySize.height / 100;

        width = width - (margin * 2);
        width /= this.mMiniDisplaySize.width / 100;

        height = height - (margin * 2);
        height /= this.mMiniDisplaySize.height / 100;

        newRect = {
            x: leftPosition,
            y: topPosition,
            width: width,
            height: height
        }

        return newRect;
    }

	/**
     * Calculate mini-display size as per actual display size and available screen size fit
     * @pending unused var
     */
    private miniDisplayInitialSize(aContainer: HTMLElement): ISize {
        // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect

        /**
         * Why scrollWidth = 23? 
         * 
         * Because for any browser default width of a scrollbar is 17 pixel. And for some un-detectable reason 6 pixel was a gap.
         * That"s why 23px is set as a fix for height calculation.
         */
        let miniDisplayContainerSize: ISize = aContainer.getBoundingClientRect(),
            miniDisplayContainerRatio: number = miniDisplayContainerSize.width / miniDisplayContainerSize.height,
            displayRatio = this.mDisplaySize.width / this.mDisplaySize.height,
            margin = 20,
            scrollWidth = 23,
            deltaZoom = 10,
            diff: number,
            diffPercent: number;

        // if width is more than height then fit by width otherwise fit by height
        if (displayRatio > miniDisplayContainerRatio) {
            let width = miniDisplayContainerSize.width - scrollWidth - margin * 2,
                mdSize = {
                    width: width,
                    height: width / displayRatio,
                };

            diff = ((miniDisplayContainerSize.height - scrollWidth - margin * 2) - mdSize.height);
            diffPercent = diff * 100 / mdSize.height;
            this.fitHeightZoomLevel = diffPercent - (diffPercent % deltaZoom);

            return mdSize;
        } else {
            let height = miniDisplayContainerSize.height - scrollWidth - margin * 2;

            this.fitHeightZoomLevel = 0;

            return {
                width: height * displayRatio,
                height: height,
            };
        }
    }


    /**
     * This method converts mini-display tile size to display tile size. Also removes the specified margin which was introduced before around the tile by
     * adjusting tile position and size. 
     * 
     * Finally the conversion is done to calculate everything in pixel
     
    getViewToModelBounds(miniDisplayTileGeometry: ITile): ITile {
        let leftPosition = miniDisplayTileGeometry.x * this.mDisplaySize.width / 100,
            topPosition = miniDisplayTileGeometry.y * this.mDisplaySize.height / 100,
            width = miniDisplayTileGeometry.width * this.mDisplaySize.width / 100,
            height = miniDisplayTileGeometry.height * this.mDisplaySize.height / 100,
            margin = parseInt((window.getComputedStyle(document.body)).fontSize) / 3,
            newRect: ITile;

        margin += 5;

        // adjusts the specified margin around the tile by adjusting tile position and size. 
        leftPosition -= margin;
        topPosition -= margin;
        width += (margin * 2);
        height += (margin * 2);

        leftPosition = Math.round(leftPosition);
        topPosition = Math.round(topPosition);
        width = Math.round(width);
        height = Math.round(height);

        newRect = {
            x: leftPosition,
            y: topPosition,
            width: width,
            height: height
        };

        return newRect;
    }

    */
}