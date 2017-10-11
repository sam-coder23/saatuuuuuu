/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ElementRef, OnDestroy } from "@angular/core";

import { Tile } from "../../../cms/models/cms-tile";
import { Source } from "./../../../cms/models/cms-source";

// Service imports
import { CmsSettingsService } from "./../../../launchpad/settings/cms-settings.service";
import { CmsApiService } from "./../../../cms/api/cms-api.service";
import { AppConfig } from "../../../config";
import { Router } from "@angular/router";
import { CmsClipboardService } from "./../../clipboard/cms-clipboard.service";
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
    styles: [require("to-string!./cms-grid.component.scss")]
})
export class CmsGridComponent implements OnInit, OnChanges, OnDestroy {

    // the input property will contain the array of tiles applied on the display
    @Input() miniTiles: Tile[] = null;

    // the input property will contain the array of actual tiles of display wall
    @Input() tiles: Tile[] = null;

    // the input property will contain the array of sources in each tile
    @Input() contents: TileContent[] = null;

    // "isLongPress" passed to cms-tile-component as input
    private isLongPressed: boolean = false;

    // hold property for disable click event on cms-grid-component
    // Prevent click event trigger after longPress
    private isClickDisabled: boolean = false;

    // prevent highlight of tiles on grid when longpress is enable or source changing is not allowed
    private isTileHighlightDisabled: boolean = false;

    // hold subscription for isLongPressed
    private longPressSubcription;

    /**
     * Public Methods
     */

    /**
     * The constructor
     */
    constructor(
        private cmsClipboardService: CmsClipboardService,
        private cmsSettingsService: CmsSettingsService,
        private element: ElementRef,
        private cmsApiService: CmsApiService,
        private appConfig: AppConfig,
        private router: Router,
        private cmsMiniDisplayService: CmsMiniDisplayService) { }

    /**
     * This method is called on component initialization.
     */
    ngOnInit() {
        // apply source label styles as per user settings
        this.applySourceLabelSettings();

        // disable tile highlight on grid when source changing is not allowed
        this.disableTileHighlight();

        // configure longPress (On Tablets and Browsers)
        this.configureLongPressGestures();

        // subscribe to observable and update local "isLongPressed" property
        //this.cmsSettingsService.longPressObservable.unsubscribe();
        this.longPressSubcription = this.cmsSettingsService.longPressedSubject.subscribe(() => {
            this.isLongPressed = this.cmsSettingsService.isLongPressed;

            // disable tile highlight on grid when longpress is enable
            this.disableTileHighlight();
        });
    }

    /**
     * Angular"s lifecycle hook ngOnDestroy
     */
    ngOnDestroy() {
        if(this.longPressSubcription) {
            this.longPressSubcription.unsubscribe();
        }
        this.removeContextMenuListener();
    }

    /**
     * This method is called when input property changes.
     */
    ngOnChanges(changes: SimpleChanges) {
        // When in multi content remove mode, if last content is also removed, then leave multi content remove mode.
        if (this.isLongPressed && this.contents.length === 0) {
            this.cmsSettingsService.updateIsLongPress(false);
        }
    }

    /**
     *  This method fetch user settings for source labels
     */
    private applySourceLabelSettings(): void {
        //get user settings from cms-settings-service
        let userSettings = this.cmsSettingsService.mUserSettings

        let isSourceLableEnabled = userSettings.sourceLabels.displaySourceNameLabels ? "block" : "none";
        let fontSize = userSettings.sourceLabels.fontSize;
        let fontColor = userSettings.sourceLabels.fontColor;
        let background = userSettings.sourceLabels.background;
        let transparency = userSettings.sourceLabels.transparency;

        if (transparency < 100) {
            transparency = (100 - transparency) / 100;
        } else if (transparency == 100) {
            transparency = 0;
        }

        let multiline = userSettings.sourceLabels.useMultipleLines ? "normal" : "nowrap";
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

    /**
       *  This method configure longPress (On Tablets and Browsers)
       */
    private configureLongPressGestures() {
        // get reference to root element
        let tileContainer: HTMLElement = this.element.nativeElement.children[0];

        // create a manager for that element
        let manager = new Hammer.Manager(tileContainer);

        // create recognizers
        let longPress = new Hammer.Press({ time: 400 });

        manager.add(longPress);

        // subscribe to press touch event
        this.longPressOnTile(manager, tileContainer);

        // Context menu (right click) on browser
        this.addContextMenuListener();
    }

    /**
     * This method handles PRESS and PRESSUP gesture on cms-grid
     */
    private longPressOnTile(manager, miniDisplayContainer) {
        manager.on("press", () => this.onLongPress());
        manager.on("pressup", () => this.onLongPressUp());
    }

    /**
     * This method handle right click on browser for long press behaviour
     */
    private addContextMenuListener() {
        let element = this.element.nativeElement.children[0];
        element.addEventListener("contextmenu", (event) => {
            event.preventDefault();

            if (!this.isClickDisabled) {
                this.toggleRemoveSourceIcon(event);
            }

        }, false);
    }

    /**
     * This method remove right click eventListener
     */
    private removeContextMenuListener() {
        let element = this.element.nativeElement.children[0];
        element.removeEventListener("contextmenu", () => {
            this.toggleRemoveSourceIcon(event);
        }, false);
    }

    /**
     *  This method update "isLongPress" and "isClickDisabled" property 
     */
    private onLongPress() {
        //get user settings from cms-settings-service
        let userSettings = this.cmsSettingsService.mUserSettings;
        let isAllowChangingSources = userSettings.manageWallContent.allowChangingSources;
        let isClipboardEnabled = userSettings.manageWallContent.clipboard.isEnabled;
        let tileContent = this.contents.length;

        // enable longPress if isAllowChangingSources: true, isClipboardEnabled: false and tileConetnt is available
        if (isAllowChangingSources && !isClipboardEnabled && tileContent) {

            // activate click disable class
            this.isClickDisabled = true;

            this.cmsSettingsService.updateIsLongPress(!this.isLongPressed);
        }
    }

    /**
     *  This method de-activate click disable class on longPressUp after specific millisecond
     */
    private onLongPressUp() {
        var timer = window.setTimeout(() => {
            // de-activate click disable class
            this.isClickDisabled = false;
            window.clearTimeout(timer);
        }, 100);
    }

    /**
     *  This method remove source when user click on remove source button 
     */
    private unShareSource(displayId: number, contentId: number) {

        // unshare content
        this.cmsApiService.unloadContentFromDisplay(displayId, contentId)
            .subscribe(() => { }, error => {
                this.appConfig.log("CmsGridComponent: unShareSource:: API failed. Error: ");

                // handle no permission
                if (error.status === 403) {
                    this.cmsApiService.noPermissionErrorHandler(error, "noPermission.unshareContent");
                }
            });
    }

    /**
     * This method show-hide remove source icon from tile
     */
    private toggleRemoveSourceIcon(event) {
        this.onLongPress();
        this.onLongPressUp();
        return false;
    }

    /**
     * This method disable tile highlight on tile as per user setting of allow chnaging sources or longpress
     */
    private disableTileHighlight(): void {
        //get user settings from cms-settings-service
        let userSettings = this.cmsSettingsService.mUserSettings;
        let isAllowChangingSources = userSettings.manageWallContent.allowChangingSources;
        let isClipboardEnabled = userSettings.manageWallContent.clipboard.isEnabled;

        if (!isAllowChangingSources || this.isLongPressed) {
            this.isTileHighlightDisabled = true;
        } else if (!this.isLongPressed) {
            this.isTileHighlightDisabled = false;
        }

    }


    formattedStyle(rawStyle) {
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
     * This method is a wrapper for contentClickHandler method. This method protects stream of UI events for contentClickHandler.
     */
    public contentClickWrapper(event: MouseEvent, content: TileContent) {
        // prevent further click event if longPress is true
        if (this.isLongPressed || this.cmsMiniDisplayService.panend) {
            return;
        };

        if (this.cmsClipboardService.timer > 0) {
            window.clearTimeout(this.cmsClipboardService.timer);
            this.cmsClipboardService.timer = 0;
        };

        this.cmsClipboardService.timer = window.setTimeout(() => {
            this.contentClickHandler(content);
        }, 300);
    }

    /**
     * This method is used for adding a source to empty tile from clipboard
     */
    tileClickHandler(tile: Tile): Promise<void> {
        // prevent further click event if longPress is true
        if (this.isLongPressed || this.cmsMiniDisplayService.panend) {
            return;
        }

        // return if not allowed to change any sources
        if (!this.cmsClipboardService.CanShareUnshare()) return;

        // return if no tile exists; if no tiling is available, no content can be shared
        if (!this.tiles || this.tiles.length === 0) return;

        this.setClipboardTile(tile);

        if (!Validation.IsNull(this.cmsClipboardService.Clipboard)) {
            return this.cmsClipboardService.shareContent(this.cmsMiniDisplayService.display.id);
        }
    }

    /**
     * This method is used to swap content of clipboard with the existing data
     */
    private contentClickHandler(content: TileContent) {
        // return if not allowed to change any sources
        if (!this.cmsClipboardService.CanShareUnshare()) return;

        // unshare content
        this.cmsApiService.unloadContentFromDisplay(this.cmsMiniDisplayService.display.id, content.id)
            .subscribe(() => {

                // if clipboard is enabled
                if (this.cmsClipboardService.isClipboardEnabled()) {
                    // if clipboard source exists
                    if (this.cmsClipboardService.Clipboard && this.tiles && this.tiles.length > 0) {
                        // load clipboard into tile and then load source into clipboard
                        var promise = this.tileClickHandler(content.absoluteSize);
                        if (promise) {
                            promise.then(() => {
                                this.setTileDataIntoClipboard(content);
                            });
                        }
                    } else {
                        // load source into clipboard
                        this.setTileDataIntoClipboard(content);
                    }
                }
            }, error => {
                this.appConfig.log("Error: contentClickHandler method failed in the cms-tile.component!");

                // handle no permission
                if (error.status === 403) {
                    this.cmsApiService.noPermissionErrorHandler(error, "noPermission.unshareContent");
                }
            });
    }

    /**
     * set tile info in the clipboard service to be able to share content on tile with this geometry
     */
    private setClipboardTile(contentAbsoluteSize: Tile) {
        if (contentAbsoluteSize) {
            // save content geometry with clipboard service
            this.cmsClipboardService.tile = new Tile(contentAbsoluteSize);
        }
    }

    /**
     * set clipboard data with a source of the tile content
     */
    private setTileDataIntoClipboard(content: TileContent) {
        if (content.resourceId === -1) {
            this.appConfig.log("Unshared Geometry only window will not be moved to Clipboard.");
            return;
        }

        let clipboardSource: Source = {
            id: content.resourceId,
            name: content.name,
            type: content.type,
            description: content.description,
            snapshotPath: `${content.snapshotPath}`,
            x: content.x,
            y: content.y,
            width: content.width,
            height: content.height,
            zOrder: content.zOrder,
            disabled: false,
            favorite: false
        };

        this.cmsClipboardService.Clipboard = clipboardSource;
    }
    
    /**
     * This method trigger by click on remove source button and emit "unShareSource" event as output
     */
    private unLoadContent(content: TileContent) {
        let displayId = this.cmsMiniDisplayService.display.id;

        if (!displayId || !content || !content.id) { return };

        //emit event with displayId and contentId as argument
        this.unShareSource(displayId, content.id);
    }
}