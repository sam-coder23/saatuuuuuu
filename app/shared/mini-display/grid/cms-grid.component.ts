/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { Component, OnInit, Input, Output, HostListener } from "@angular/core";

import { Tile } from "../../../cms/models/cms-tile";
import { Source } from "./../../../cms/models/cms-source";

// Service imports
import { CmsSettingsService } from "./../../../launchpad/settings/cms-settings.service";
import { CmsApiService } from "./../../../cms/api/cms-api.service";
import { AppConfig } from "../../../config";
import { CmsMiniDisplayService } from "./../cms-mini-display.service";
import { TileContent } from "./../../../cms/models/cms-tile-content";
import { RegExManager } from "../../../core/util/RegEx";
import { Url } from "../../../core/util/Url";
import { Validation } from "../../../core/util/Validation";

/**
 * This is a grid component that creates a tiler on mini-display along with the content.
 */
@Component({
    //moduleId: module.id, 
    selector: "cms-grid",
    template: require("to-string!./cms-grid.component.html"),
    styles: [require("to-string!./cms-grid.component.scss")],
    host: {
        "(document:click)": "onFocusLostFromContent($event)"
    }
})
export class CmsGridComponent implements OnInit {

    // the input property will contain the array of tiles applied on the display
    @Input() miniTiles: Tile[] = null;

    // the input property will contain the array of actual tiles of display wall
    @Input() tiles: Tile[] = null;

    // the input property will contain the array of sources in each tile
    @Input() contents: TileContent[] = null;

    // Collect swapping content when clicked
    private selectedContent: TileContent = null;
    private swappingContent: TileContent = null;

    /**
     * The constructor
     */
    constructor(
        private cmsSettingsService: CmsSettingsService,
        private cmsApiService: CmsApiService,
        private appConfig: AppConfig,
        private cmsMiniDisplayService: CmsMiniDisplayService) { }

    /**
     * This method is called on component initialization.
     */
    ngOnInit() {
        // apply source label styles as per user settings
        this.applySourceLabelSettings();
    }

    /**
     *  This method fetch user settings for source labels
     */
    private applySourceLabelSettings(): void {
        //get user settings from cms-settings-service
        let userSettings = this.cmsSettingsService.mUserSettings

        let isSourceLableEnabled = userSettings.sourceLabel.displaySourceNameLabels ? "block" : "none";
        let fontSize = userSettings.sourceLabel.fontSize;
        let fontColor = userSettings.sourceLabel.fontColor;
        let background = userSettings.sourceLabel.backgroundColor;
        let transparency = userSettings.sourceLabel.transparency;

        if (transparency < 100) {
            transparency = (100 - transparency) / 100;
        } else if (transparency == 100) {
            transparency = 0;
        }

        let multiline = userSettings.sourceLabel.useMultipleLines ? "normal" : "nowrap";
        let sourcelabelStyles = `font-size: ${fontSize}px; color: ${fontColor}; white-space: ${multiline}; display: ${isSourceLableEnabled}`;
        let sourceLableBackgroundStyles = `background: ${background}; opacity: ${transparency}`;

        this.createSourceLableStyleRule(sourcelabelStyles, sourceLableBackgroundStyles);
    }

    /**
     *  This method update source label
     */
    private createSourceLableStyleRule(sourceStyle: string, backgroundStyles: string): void {
        // remove old style sheet
        var previousStyle = document.getElementById("sourceLabelStylesheet");
        if (previousStyle) {
            var sheetParent = previousStyle.parentNode;
            sheetParent.removeChild(previousStyle);
        }

        // create a new style sheet 
        var styleTag = document.createElement("style");
        var head = document.getElementsByTagName("head")[0];
        styleTag.setAttribute("id", "sourceLabelStylesheet");
        head.appendChild(styleTag);
        if (styleTag) {
            styleTag.innerHTML = `.source-label-container{ ${sourceStyle} } .source-label-container::before{ ${backgroundStyles} }`;
        }
    }


    public formattedStyle(rawStyle) {
        if (!rawStyle) return {};

        let snapshotPath: string;

        if (rawStyle.snapshotPath) {
            snapshotPath = rawStyle.snapshotPath;
            if (Url.HasHostName() && !Validation.IsNullOrUndefined(snapshotPath) && Url.HasIP(snapshotPath)) {
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
     */
    public contentClick(content: TileContent) {
        if (Validation.IsNullOrUndefined(this.selectedContent)) {
            // When no source selected at this moment and on first source content clicked\ selected for swapping
            this.selectedContent = content;
        }
        else if (!Validation.IsNullOrUndefined(this.selectedContent) && content) {
            // Same source clicked again so no more swapping, deselect selected source
            if (this.selectedContent.id === content.id) {
                this.deselctedSource();
            }
            // second source selected which need to be swapped, start swapping
            else {
                this.swappingContent = content
                this.swapSource();
            }
        }
    }

    /**
    * Swapping source geometery and calling server API to update geometery of the content for selected display
    */
    private swapSource() {
        let swappedSource: any[] = this.swapContentGeometeryandCreateContent();
        //first source geometery change call placed
        this.cmsApiService.updateContentGeormetryOnDisplay(this.cmsMiniDisplayService.display.id, swappedSource[0].id, swappedSource[0]).subscribe(response => {
            console.log(response);

        }, error => {
            console.error("There is issue in source swapping : ", error);

            this.deselctedSource();
            swappedSource = [];
        });

        //for second source geometery change call placed
        this.cmsApiService.updateContentGeormetryOnDisplay(this.cmsMiniDisplayService.display.id, swappedSource[1].id, swappedSource[1]).subscribe(response => {
            console.log(response);

            this.deselctedSource();
            swappedSource = [];

            console.log("[SuccessFull] : swapping sources ");
        }, error => {
            console.error("There is issue in source swapping : ", error);

            this.deselctedSource();
            swappedSource = [];
        });
    }

    /**
    * Preparing content and swapping source geometery
    */
    private swapContentGeometeryandCreateContent(): any[] {
        let swapContentForGeometery: any[2] = [];

        let copyContent: TileContent;
        let swapGeometery: TileContent;

        for (let sourceIndex = 0; sourceIndex < 2; sourceIndex++) {
            if (sourceIndex === 0) {
                copyContent = this.selectedContent;
                swapGeometery = this.swappingContent;
            }
            else if (sourceIndex === 1) {
                copyContent = this.swappingContent;
                swapGeometery = this.selectedContent;
            }

            swapContentForGeometery[sourceIndex] = {
                "id": copyContent.id,
                "name": copyContent.name,
                "type": copyContent.type,
                "resourceId": copyContent.resourceId,
                "snapshotPath": copyContent.snapshotPath,
                "zOrder": copyContent.zOrder,
                // swapping dimension of selected sources
                "x": swapGeometery.absoluteSize.left,
                "y": swapGeometery.absoluteSize.top,
                "width": swapGeometery.absoluteSize.width,
                "height": swapGeometery.absoluteSize.height
            };
        }
        return swapContentForGeometery;
    }
    /**
     *  On click : outside source content, if there is selected source content for swap then deselect source content and remove selected source selected for swaping
     * @param event 
     */
    private onFocusLostFromContent(event: any) {
        if (event.srcElement.className.indexOf("content box-shadow") === -1) {
            this.deselctedSource();
        }
    }

    // remove selection as same content selected again and empty selected source list as no source selected for swapping
    private deselctedSource() {
        this.selectedContent = null;
        this.swappingContent = null;
    }

    /**
     * This method checks the selected content and highlight the content
     * @param contentId 
     */
    public showSelected(contentId: number): boolean {
        if (!Validation.IsNullOrUndefined(this.selectedContent)) {
            if ((contentId === this.selectedContent.id) || (!Validation.IsNullOrUndefined(this.swappingContent) && (this.swappingContent.id) === contentId)) {
                return true;
            }
        }
        return false;
    }
}