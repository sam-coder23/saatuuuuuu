import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { EventManager } from "../../../utils/event-manager.util";
import { KeyManager } from "../../../utils/key-manager.util";
import { CmsApiService } from "../../../cms/api/cms-api.service";
import { StorageManager } from "../../../cms/api/cms-storagemanager.service";
import { CMS_SESSION_STORAGE_ITEM } from "../../../cms/models/cms-session-storage-item";
import { AppConfig } from "../../../config";
import { User } from "../../models/cms-user.model";

@Component({
    //moduleId: module.id,
    selector: "cms-options",
    template: require("./cms-options.component.html"),
    styles: [require("./cms-options.component.scss")]
})

/**
 * This class handle sidenav for mini-display view. It provides various menu options to the user for application.
 * @class CmsOptionsComponent
 * @property {number} displayId
 * @property {object} keyManager
 * @property {number} zoomLevel
 * @property {EventEmitter} closeEmitter
 * @property {EventEmitter} fitHeightEmitter
 * @property {boolean} disableOptionOnDisplayUnavailable
 * @property {boolean} isHideOption
 */
export class CmsOptionsComponent implements OnInit {
    // zoom level of mini-Display
    @Input("zoom") public zoomLevel: number;

    @ViewChild("sidenav") public sidenav: any;
    // Create a "close" event
    @Output("close") public closeEmitter: EventEmitter<{}> = new EventEmitter();

    // create "fit-height" event mini-display
    @Output("fitHeight") public fitHeightEmitter: EventEmitter<{}> = new EventEmitter();
    private displayId: number;
    private keyManager: KeyManager = new KeyManager();

    //This flag will disable certain options if display is not available
    private disableOptionOnDisplayUnavailable: boolean;

    //This flag will hide certain options
    private isHideOption: boolean;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private cmsApiService: CmsApiService,
        private storageManager: StorageManager,
        private appConfig: AppConfig) {

        this.disableOptionOnDisplayUnavailable = false;
        this.isHideOption = true;
    }

    public ngOnInit(): void {
        EventManager.addEvent("keyup", this.onKeyUP.bind(this));

        // Open sidenav with animation
        // @attend - This seems to be tricky. Might need attention.
        // window.setImmediate(() => this.sidenav.open());
        window.setTimeout(() => {
            this.sidenav.open();
        }, 0);

        // fetch selected display id from url parameter
        this.route.params.forEach((params: Params) => {
            this.displayId = parseInt(params["id"], 10);
        });
    }

    /**
     * This will return the logged in user name. Being used by template
     * @property UserName {String}
     * @return {String}
     */
    private get UserName(): string {
        const user: User = JSON.parse(this.storageManager.get(CMS_SESSION_STORAGE_ITEM.USER));

        return user.username;
    }

    /**
     * This method closes options sidenav and removes keyup event listener from document.
     * Also emit close event to its host component.
     * @method close
     * @return void
     */
    private close(): void {
        EventManager.removeEvent("keyup", this.onKeyUP);
        this.closeEmitter.emit();
    }

    /**
     * This method performs browser refresh.
     * @method refresh
     * @return void
     */
    private refresh(): void {
        window.location.reload(true);
    }

    /**
     * This emits fit height event to its host component and closes the sidenav
     * @method onFitHeightClick
     * @return void
     */
    private onFitHeightClick(): void {
        this.fitHeightEmitter.emit();
        this.sidenav.close();
    }

    /**
     * This event handler will be invoked when user will press escape key.
     * @method onKeyUP
     * @param e - Native event object provided by the browser when key is pressed
     * @return void
     */
    private onKeyUP(e: any): void {
        if (this.keyManager.IsEscapeKey(e)) {
            this.sidenav.close();
        }
    }

}
