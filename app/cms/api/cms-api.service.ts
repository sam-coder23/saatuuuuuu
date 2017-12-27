import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Http, Response } from "@angular/http";
import { Observable, Subscription, TimeoutError } from "rxjs/Rx";

import "rxjs/add/operator/toPromise";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

import { CMS_EVENTS } from "./cms-events.enum";
import { CmsEventEmitterService } from "./cms-event-emitter.service";
import { Display } from "../models/cms-display";
import { Source } from "../models/cms-source";
import { ICmsEvent } from "../models/cms-event";
import { Tile } from "./../models/cms-tile";
import { User } from "../../launchpad/models/cms-user.model";
import { APIRequest } from "./api-request";
import { IUserProfileSettings } from "../models/cms-user-profile-settings";
import { StorageManager } from "./cms-storagemanager.service";
import { AppConfig } from "../../config";
import { CMS_SESSION_STORAGE_ITEM } from "../models/cms-session-storage-item";
import { ITilePreset } from "../models/cms-tile-preset";
import { Validation } from "../../core/util/Validation";
import { DISPLAY_TYPE } from "./display-type.enum";
import { CMSConstants } from "./../models/cms-constants";

/**
 * This service is used to place CMS Server REST API calls for various functions.
 * Also it creates a connection with CMS Server when user is logged in and maintains it till user logout.
 * @class CmsApiService
 * @property {Subscription} sessionAlive Subscription for CMS events
 * @property {any} reconnection
 * @property {boolean} firstDisconnection Flag for first-disconnection
 * @property {boolean} databaseResetStarted Flag for database reset start
 */
@Injectable()
export class CmsApiService {
    // it will contain the subscription for CMS events initialized on login
    // and unsubscribe on logout
    private sessionAlive: Subscription;
    private reconnection: any;
    private firstDisconnection: boolean;
    private databaseResetStarted: boolean;

    constructor(
        private http: Http,
        private router: Router,
        private apiRequest: APIRequest,
        private storageManager: StorageManager,
        private appConfig: AppConfig) {

        this.firstDisconnection = false;
        this.databaseResetStarted = false;
    }

    /**
     * Performs a user login request to CMS Server
     * @method login
     * @param {User} user It contains user data which is required to login into  server
     * @return Observable<Response>
     */
    public login(user: User): Observable<Response> {
        return this.apiRequest.post("login", user.toJSON());
    }

    /**
     * Performs a user logout request to CMS Server
     * @method logout
     * @return Observable<Response>
     */
    public logout(): Observable<Response> {
        return this.apiRequest.get("logout");
    }

    /**
     * This method performs clean up on logout call and navigates user to login page.
     * @method performOnlogout
     * @return void
     */
    public performOnlogout(): void {
        this.storageManager.removeStorage();
        this.makeSessionExpire();
        this.router.navigate(["/login"]);
    }

    /**
     * This method call the logout api and also performs clean up.
     * @method logoutUser
     * @return void
     */
    public logoutUser(): void {
        this.logout()
            .finally(() => this.performOnlogout())
            .subscribe(
            (response: Response) => { },
            (error: Error) => {
                this.appConfig.log("DisplaysPanelComponent: Logout failed");
            }
            );
    }

    /**
     * This method Fetch display list from CMS Server
     * @method getDisplayList
     * @param {number} start Start index of display list
     * @param {number} count Total number of displays
     * @param {string} search Search text
     * @param {boolean} favorite Flag for favorite
     * @return {Display[]} Observable
     */
    public getDisplayList(
        start: number = 1,
        count: number = 2147483647,
        search: string = "",
        favorite: boolean = false): Observable<Display[]> {
        const params: string = `displays?start=${start}&count=${count}&filter=${encodeURIComponent(search)}&onlyfavorite=${favorite}`;

        return this.apiRequest
            .get(params)
            .map((displays: Display[]) => {
                displays = displays.filter((display: Display) => display.type !== DISPLAY_TYPE[DISPLAY_TYPE.OperatorWorkStation]);

                return displays;
            });
    }

    /**
     * This method fetch source list from CMS Server
     * @method getSourceList
     * @param {number} start Start index of display list
     * @param {number} count Total number of displays
     * @param {number} displayId selected display Id
     * @param {string} search  Search text
     * @param {boolean} favorite Flag for favorite
     * @return {Source[]} Observable
     */
    public getSourceList(
        start: number = 1,
        count: number = 2147483647,
        displayId: number,
        search: string = "",
        favorite: boolean = false): Observable<Source[]> {
        const params: string = `displays/${displayId}/resources?start=${start}&count=${count}&filter=${encodeURIComponent(search)}&onlyfavorite=${favorite}`;

        return this.apiRequest.get(params);
    }

    /**
     * This method update display content
     * @method putContentsOnDisplay
     * @param {number} displayId Selected Diplay Id
     * @param {number} body Display content
     */
    public putContentsOnDisplay(displayId: number, tilerId: number, body: any): Observable<any> {
        const url: string = `displays/${displayId}/content?tilerId=${tilerId}`;

        return this.apiRequest.put(url, body);
    }

    /**
     * Fetch selected display detail info from CMS Server.
     * Display"s tile array will be returned along with display"s detail information and content array.
     * @method getSelectedDisplayContent
     * @param {number} displayId Selected Display Id
     * @return {Display} Observable
     */
    public getSelectedDisplayContent(displayId: number): Observable<Display> {
        return this.apiRequest.get(`displays/${displayId}`);
    }

    /**
     * this method mark an object such as Display/Source/Perspective/Application/Layout as favorite
     * with `post` http method.
     * @method markAsFavorite
     * @param {number} objectId Id of an object
     * @param {string} objectType DIS/SRC/PER/APP/LAY to be used as prefix for respective abjects
     */
    public markAsFavorite(objectId: number, objectType: string): Promise<Response> {
        const url: string = "users/current/profile/favorites";
        const body: string = JSON.stringify({ id: `${objectType}_${objectId}` });

        return this.http
            .post(this.apiRequest.GetURL(url), body, this.apiRequest.requestOption)
            .toPromise()
            .then((response: Response) => {
                this.appConfig.log("CmsApiService: markAsFavorite");

                return response.json();
            })
            .catch(this.promiseApiHandleError.bind(this));
    }

    /**
     * This method mark an object such as Display/Source/Perspective/Application/Layout as unfavorites
     * with `delete` http method.
     * @method markAsUnfavorite
     * @param {number} objectId Id of an object
     * @param {string} objectType DIS/SRC/PER/APP/LAY to be used as prefix for respective abjects
     */
    public markAsUnfavorite(objectId: number, objectType: string): Promise<Response> {
        const id: string = `${objectType}_${objectId}`;
        const url: string = `users/current/profile/favorites/${id}`;

        return this.http
            .delete(this.apiRequest.GetURL(url), this.apiRequest.requestOption)
            .toPromise()
            .then((response: Response) => {
                this.appConfig.log("CmsApiService: markAsUnfavorite");

                return response.json();
            })
            .catch(this.promiseApiHandleError.bind(this));
    }

    /**
     * This method get current user profile data with `get` http method.
     * @method getUserProfileSettings
     * @return Promise<any>
     */
    public getUserProfileSettings(): Promise<any> {
        const url: string = "users/current/profile/settings";

        return this.http
            .get(this.apiRequest.GetURL(url), this.apiRequest.requestOption)
            .toPromise()
            .then((response: Response) => {
                if (response) {
                    this.appConfig.log("CmsApiService: getUserProfileSettings");

                    return response.json();
                }
            })
            .catch(this.promiseApiHandleError.bind(this));
    }

    /**
     * This method update current user profile data with `post` http method.
     * @method updateUserProfileSettings
     * @param {IUserProfileSettings} settings
     */
    public updateUserProfileSettings(settings: IUserProfileSettings): Promise<Response> {
        const url: string = "users/current/profile/settings";
        const body: string = JSON.stringify(settings);

        return this.http
            .put(this.apiRequest.GetURL(url), body, this.apiRequest.requestOption)
            .toPromise()
            .then((response: Response) => {
                this.appConfig.log("CmsApiService: updateUserProfileSettings");

                return response;
            })
            .catch(this.promiseApiHandleError.bind(this));
    }

    /**
     * This method fetches events from CMS Server with `get` http method.
     * @method getEvents
     * @return Observable<Response>
     */
    public getEvents(): Observable<Response> {
        const url: string = this.apiRequest.GetURL("events");

        return this.http.get(url, this.apiRequest.requestOption)
            .map((res: Response) => {
                // on network reconnection
                if (this.firstDisconnection) {
                    this.firstDisconnection = false;
                    // send event on application level to close server disconnection dialog
                    CmsEventEmitterService.get(CMS_EVENTS.Application).emit({
                        eventName: "EventReconnectionSuccess",
                        eventType: "system"
                    });
                }

                //@pending - Blind read. see json() function docummentation
                const response: ICmsEvent[] = res.json();
                const events: any = Observable.from(response);

                events.subscribe(
                    (cmsEvent: ICmsEvent) => {
                        // HANDLE DISPLAYS EVENTS
                        if (cmsEvent && cmsEvent.uri && cmsEvent.uri.match("/displays")) {
                            this.handleDisplaysEvent(cmsEvent);
                        } else if (cmsEvent && cmsEvent.uri && cmsEvent.uri.match("/sources")) {
                            // HANDLE SOURCES EVENTS
                            this.handleSourcesEvent(cmsEvent);
                        } else if (cmsEvent && cmsEvent.uri && cmsEvent.uri.match("/perspectives")) {
                            // HANDLE PERSPECTIVES EVENTS
                            this.handlePerspectivesEvent(cmsEvent);
                        } else if (cmsEvent && cmsEvent.uri && cmsEvent.uri.match("/system")) {
                            // HANDLE SYSTEM EVENTS
                            this.handleSystemEvents(cmsEvent);
                        } else if (cmsEvent && cmsEvent.uri && cmsEvent.uri.match("/users/current")) {
                            // HANDLE USER EVENTS
                            this.handleUserEvents(cmsEvent);
                        } else if (cmsEvent && cmsEvent.uri && cmsEvent.uri.match("/tilers")) {
                            // HANDLE TILE EVENTS
                            this.handleTilersEvent(cmsEvent);
                        }
                    }
                );

                return res;
            })
            .timeout(1500 * 60)
            .catch((error: any) => {
                if (error instanceof TimeoutError) {
                    this.appConfig.error("CMSServerApi: getEvents:: CMS Events API response delay (90sec) exceeded!");
                }

                this.appConfig.error("CMSServerApi: getEvents:: Error while fetching events from server.", error);

                if (error.status === 500 && !this.databaseResetStarted) {
                    this.handleServerOnConnection(error);
                } else {
                    return this.apiRequest.handleError(error);
                }
            });
    }

    /**
     * this method load  content on cms-tile of mini display with `post` http method.
     * @method loadContentOnTile
     * @param {number} displayId To load content on tile of this display Id
     * @param {ITile} tile Contains info on which content is pushed
     * @param {Source} content It is the source info to be pushed on tile
     */
    public loadContentOnTile(displayId: number, tile: Tile, content: Source): Promise<Response> {
        this.appConfig.log("CmsApiService: loadContentOnTile...");
        tile = new Tile(tile);

        try {
            const url: string = `displays/${displayId}/content`;
            const body: object = {
                name: content.name,
                type: content.type,
                resourceId: content.id,
                x: tile.x,
                y: tile.y,
                width: tile.width,
                height: tile.height,
                snapshotPath: content.snapshotPath
            };

            return this.http
                .post(this.apiRequest.GetURL(url), body, this.apiRequest.requestOption)
                .toPromise()
                .then((response: Response) => response)
                .catch(this.promiseApiHandleError.bind(this));
        } catch (error) {
            this.appConfig.error("CmsApiService: API failed for loading content on display tile. Error:", error);

            return this.promiseApiHandleError(error);
        }
    }

    /**
     * This method unload content from display
     * @method unloadContentFromDisplay
     * @param {number} displayId Display ID to which specified content belong to.
     * @param {number} contentId  Content ID which need to be removed
     * @return {Response} Observable
     */
    public unloadContentFromDisplay(displayId: number, contentId: number): Observable<Response> {
        this.appConfig.log("CmsApiService: unloadContentFromDisplay...");

        try {
            return this.apiRequest.delete(`displays/${displayId}/content/${contentId}`);
        } catch (error) {
            this.appConfig.error("CmsApiService: unloadContentFromDisplay", error);

            return this.apiRequest.handleError.bind(error);
        }
    }

    /**
     * This method maintains the session with CMS Server on login until user logout.
     * @method keepSessionAlive
     * @return void
     */
    public keepSessionAlive(): void {
        if (this.sessionAlive) {
            this.sessionAlive.unsubscribe();
        }

        this.appConfig.log("CmsApiService: keepSessionAlive:: Session alive with CMS Server!");

        this.sessionAlive = this.getEvents().subscribe(
            (response: Response) => this.keepSessionAlive(),
            (error: Error) => {
                this.handleServerOnDisconnection(error);
            }
        );
    }

    /**
     * This method expires the session with CMS Server on logout.
     * @method makeSessionExpire
     * @return void
     */
    public makeSessionExpire(): void {
        if (!Validation.IsUndefined(this.sessionAlive)) {
            this.appConfig.log("CmsApiService: makeSessionExpire:: Session with CMS Server now expires!!");
            this.sessionAlive.unsubscribe();
        }

        this.clearReconnectionTimeout();
    }

    /**
     * This method creates a new session with CMS Server on application refresh.
     * @method reconnectSessionWithServer
     * @return void
     */
    public reconnectSessionWithServer(): void {
        this.makeSessionExpire();
        this.keepSessionAlive();
    }

    /**
     * This method sends an event at application level to show dialog in case of exception due to no permission while calling an API.
     * @method noPermissionErrorHandler
     * @param {any} error
     * @param {string} permissionName
     */
    public noPermissionErrorHandler(error: any, permissionName: string): void {
        this.appConfig.log("CmsApiService: noPermissionErrorHandler::", error);
        CmsEventEmitterService.get(CMS_EVENTS.Application).emit({
            eventName: permissionName,
            eventType: "permission"
        });
    }

    /**
     * This method returns launchpad app build version
     * @method getAppVersion
     * @return Promise<string>
     */
    public getAppVersion(): Promise<string> {
        return this.http.get("version.properties")
            .map((res: Response) => {
                try {
                    const responseBody: string = res.text().trim();
                    const result: string[] = responseBody.split("=");

                    if (result && result.length === 2 && result[0] === "launchpad.buildnumber") {

                        return `${CMSConstants.BUILD_VERSION} ${result[1]}`;
                    }
                } catch (error) {
                    this.appConfig.error(error);
                }

                return "";
            })
            .toPromise()
            .catch(this.promiseApiHandleError.bind(this));
    }

    /**
     * This method Will fetch the system info
     * @method getSystemInfo
     * @return Observable<any>
     */
    public getSystemInfo(): Observable<any> {
        return this.apiRequest.get("system/info");
    }

   /**
    * This method returns list of tilePresets filtered by number of tiles
    * @method getTilePresets
    * @param {tilesCount} - filter tilePresets by number of tiles if passed more than zero
    * @returns {Observable<ITilePreset[]>}
    */
    public getTilePresets(tilesCount: number = 0): Observable<ITilePreset[]> {
        const observableTilePresets: Observable<ITilePreset[]> = this.apiRequest.get("tilers");

        if (observableTilePresets) {
            if (tilesCount > 0) {
                return observableTilePresets.map((tilePresets: ITilePreset[]) => {
                    if (tilePresets) {
                        return tilePresets.filter((tilePreset: ITilePreset) => {
                            return tilePreset.noOfTiles === tilesCount;
                        });
                    } else {
                        return [];
                    }
                });
            }

            return observableTilePresets;
        } else {
            return Observable.of([]);
        }
    }

    /**
     * This method updates geometery of the content on specified Display, API is only usefull for Geometery change
     * @method updateContentGeormetryOnDisplay
     * @param displayId
     * @param contentId
     * @param body
     */
    public updateContentGeormetryOnDisplay(displayId: number, contentId: number, body: any): Observable<any> {
        if (displayId > 0 && contentId > 0 && !Validation.IsNullOrUndefined(body)) {
            const url: string = `displays/${displayId}/content/${contentId}`;

            return this.apiRequest.put(url, body);
        } else {
            return Observable.throw("Invalid input for the API call");
        }
    }

    /**
     * This method handles server disconnection.
     * @method handleServerOnDisconnection
     * @param {any} error
     * @param void
     */
    private handleServerOnDisconnection(error: any): void {
        this.appConfig.log("CMSServerApi: Trying to connect to the server...");

        this.reconnection = setTimeout(() => {
            if (error.status === 0 && !this.firstDisconnection) {
                this.firstDisconnection = true;
                this.databaseResetStarted = false;

                // send event on application level to show server disconnection dialog
                CmsEventEmitterService.get(CMS_EVENTS.Application).emit({
                    eventName: "ServerDisconnected",
                    eventType: "system"
                });
            }
            this.reconnectSessionWithServer();
        }, 2000);
    }

    /**
     * This method handles server reconnection.
     * @method handleServerOnConnection
     * @param {any} error
     * @return void
     */
    private handleServerOnConnection(error: any): void {
        this.appConfig.log(`CMSServerApi: The server is now reachable but not in proper state. ErrorStatus: ${error.status}`);

        if (this.firstDisconnection) {
            this.firstDisconnection = false;
        }

        // send event on application level to show server connection dialog
        CmsEventEmitterService.get(CMS_EVENTS.Application).emit({
            eventName: "ServerConnected",
            eventType: "system"
        });
    }

    /**
     * This method clears timeout for reconnection.
     * @method clearReconnectionTimeout
     * @return void
     */
    private clearReconnectionTimeout(): void {
        if (!Validation.IsUndefined(this.reconnection)) {
            clearTimeout(this.reconnection);
        }
    }

    /**
     * This method emits the event related to displays.
     * The components need to subscribe for the events they want to listen.
     * Whenever any event is received from CMS, it is emitted using CmsEventEmitterService.
     * @syntax: CmsEventEmitterService.get(CMS_EVENTS.<event-name>).emit(aResponse)
     * Check CMS_EVENTS for details on events.
     * @method handleDisplaysEvent
     * @param {ICmsEvent} eventObject
     * @return void
     */
    private handleDisplaysEvent(eventObject: ICmsEvent): void {
        const verb: string = eventObject.verb ? eventObject.verb.toLowerCase() : "";
        const uri: string = eventObject.uri;

        // match the uri as "/displays"
        if (uri.match(/(\/displays)$/g)) {
            if (verb === "posted") {
                this.appConfig.log("CmsApiService: handleDisplaysEvent:: add a display to the list");
                // send event to display list
                CmsEventEmitterService.get(CMS_EVENTS.DisplayList).emit(eventObject);
                // send event to display panel
                CmsEventEmitterService.get(CMS_EVENTS.Display).emit(eventObject);
            } else if (verb === "deleted") {
                this.appConfig.log("CmsApiService: handleDisplaysEvent:: delete a display from the list");
                // send event to display list
                CmsEventEmitterService.get(CMS_EVENTS.DisplayList).emit(eventObject);
            }
        } else if (uri.match(/(\/displays\/)(\d+)$/g)) {
            // match the uri as "/displays/{id}"
            this.updateSingleDisplay(verb, uri, eventObject);
        } else if (uri.match(/(\/displays\/)(\d+)(\/content)$/g)) {
            // match the uri as "/displays/{id}/content"
            this.updateDisplayContent(verb, uri, eventObject);
        } else if (uri.match(/(\/displays\/)(\d+)(\/content\/)(\d+)$/g)) {
            // match the uri as "/displays/{id}/content/{id}"
            this.updateDisplayContentElement(verb, uri, eventObject);
        } else if (uri.match(/(\/displays\/)(\d+)(\/applications)$/g)) {
            // match the uri as "/displays/{id}/applications"
            if (verb === "posted") {
                this.appConfig.log("CmsApiService: handleDisplaysEvent:: add a single application");
                const appResponse: any = {
                    eventType: "ResourceAdded",
                    body: eventObject.body
                };
                // send event to source list
                CmsEventEmitterService.get(CMS_EVENTS.SourceList).emit(appResponse);
            } else if (verb === "deleted") {
                this.appConfig.log("CmsApiService: updateDisplaySingleApplication:: delete a single application");
                const appResponse: any = {
                    eventType: "ResourceDeleted",
                    body: eventObject.body
                };
                // send event to source list
                CmsEventEmitterService.get(CMS_EVENTS.SourceList).emit(appResponse);
            }
        } else if (uri.match(/(\/displays\/)(\d+)(\/applications\/)(\d+)$/g)) {
            // match the uri as "/displays/{id}/applications/{id}"
            this.updateDisplaySingleApplication(verb, uri, eventObject);
        }
    }

    /**
     * This method responsible to emit the event if matches the uri as "/displays/{id}/content".
     * This method is called from "handleDisplaysEvent" method
     * @method updateDisplayContent
     * @param {string} verb
     * @param {string} uri
     * @param {ICmsEvent} eventObject
     * @return void
     */
    private updateDisplayContent(verb: string, uri: string, eventObject: ICmsEvent): void {
        const id: number = parseInt(uri.match(/(\d+)/g)[0], 10);

        switch (verb) {
            case "put":
                this.appConfig.log("CmsApiService: updateDisplayContent :: Update the list of tiler and/or content.");
                const response: any = {
                    eventType: "TilerAndContentUpdated",
                    body: eventObject.body,
                    displayId: id
                };

                // send event to mini-display
                CmsEventEmitterService.get(CMS_EVENTS.MiniDisplay).emit(response);
                break;
            default:
        }
    }

    /**
     * This method responsible to emit the event if matches the uri as "/displays/{id}".
     * This method is called from "handleDisplaysEvent" method.
     *
     * @method updateSingleDisplay
     * @param {string} verb
     * @param {string} uri
     * @param {ICmsEvent} eventObject
     * @return void
     */
    private updateSingleDisplay(verb: string, uri: string, eventObject: ICmsEvent): void {
        const id: number = parseInt(uri.match(/(\d+)/g)[0], 10);
        let response: any;

        switch (verb) {
            case "put":
                this.appConfig.log("CmsApiService: updateSingleDisplay:: update a single display.");
                response = {
                    eventType: "DisplayUpdated",
                    body: eventObject.body,
                    displayId: id
                };

                // send event to mini-display for refreshing display
                CmsEventEmitterService.get(CMS_EVENTS.MiniDisplay).emit(response);

                // send event to display list
                CmsEventEmitterService.get(CMS_EVENTS.DisplayList).emit(eventObject);
                break;

            case "deleted":
                this.appConfig.log("CmsApiService: updateSingleDisplay:: delete a single display");
                response = {
                    eventType: "DisplayDeleted",
                    body: eventObject.body,
                    displayId: id
                };

                // send event to mini-display
                CmsEventEmitterService.get(CMS_EVENTS.MiniDisplay).emit(response);

                // send event to display list
                CmsEventEmitterService.get(CMS_EVENTS.DisplayList).emit(eventObject);
                break;

            default:
        }
    }

    /**
     * This method responsible to emit the event if matches the uri as "/displays/{id}/content/{id}".
     * This method is called from "handleDisplaysEvent" method
     *
     * @method updateDisplayContentElement
     * @param {string} verb
     * @param {string} uri
     * @param {ICmsEvent} eventObject
     * @return void
     */
    private updateDisplayContentElement(verb: string, uri: string, eventObject: ICmsEvent): void {
        const id: number = parseInt(uri.match(/(\d+)/g)[0], 10);

        switch (verb) {
            case "put":
                this.appConfig.log("CmsApiService: updateDisplayContentElement:: update the content element");
                const response: any = {
                    eventType: "ContentUpdated",
                    body: eventObject.body,
                    displayId: id
                };

                // send event to mini-display
                CmsEventEmitterService.get(CMS_EVENTS.MiniDisplay).emit(response);
                break;
            default:
        }
    }

    /**
     * This method responsible to emit the event if matches the uri as "/displays/{id}/applications/{id}".
     * This method is called from "handleDisplaysEvent" method
     *
     * @method updateDisplaySingleApplication
     * @param {string} verb
     * @param {string} uri
     * @param {ICmsEvent} eventObject
     * @return void
     */
    private updateDisplaySingleApplication(verb: string, uri: string, eventObject: ICmsEvent): void {
        const id: number = parseInt(uri.match(/(\d+)/g)[0], 10);

        switch (verb) {
            case "put":
                this.appConfig.log("CmsApiService: updateDisplaySingleApplication:: update a single application");

                //adding "type" property
                eventObject.body.type = "Application";

                const appResponse: any = {
                    eventType: "ResourceUpdated",
                    body: eventObject.body
                };

                // send event to source list
                CmsEventEmitterService.get(CMS_EVENTS.SourceList).emit(appResponse);

                // send event to mini-display
                CmsEventEmitterService.get(CMS_EVENTS.MiniDisplay).emit(appResponse);
                break;

            default:
        }
    }

    /**
     * This method emits the event related to sources.
     * The components need to subscribe for the events they want to listen.
     * Whenever any event is received from CMS, it is emitted using CmsEventEmitterService.
     * @syntax: CmsEventEmitterService.get(CMS_EVENTS.<event-name>).emit(aResponse)
     * Check CMS_EVENTS for details on events.
     * @method handleSourcesEvent
     * @param {ICmsEvent} eventObject
     * @return void
     */
    private handleSourcesEvent(eventObject: ICmsEvent): void {
        const verb: string = eventObject.verb ? eventObject.verb.toLowerCase() : "";
        const uri: string = eventObject.uri;

        this.appConfig.log("CmsApiService: handleSourcesEvent...");

        // match the uri as "/sources"
        if (uri.match(/(\/sources)$/g)) {
            if (verb === "posted") {
                this.appConfig.log("CmsApiService: handleSourcesEvent:: add a source to the list");
                const response: any = {
                    eventType: "ResourceAdded",
                    body: eventObject.body
                };

                // send event to source list
                CmsEventEmitterService.get(CMS_EVENTS.SourceList).emit(response);
            } else if (verb === "deleted") {
                this.appConfig.log("CmsApiService: updateSingleSource:: delete a single source");
                const response: any = {
                    eventType: "ResourceDeleted",
                    body: eventObject.body
                };

                // send event to source list
                CmsEventEmitterService.get(CMS_EVENTS.SourceList).emit(response);
            }
        } else if (uri.match(/(\/sources\/)(\d+)$/g)) {
            // match the uri as "/sources/{id}"
            this.updateSingleSource(verb, uri, eventObject);
        }
    }

    /**
     * This method emits the event related to tilers.
     * The components need to subscribe for the events they want to listen.
     * Whenever any event is received from CMS, it is emitted using CmsEventEmitterService.
     * @syntax: CmsEventEmitterService.get(CMS_EVENTS.<event-name>).emit(aResponse)
     * Check CMS_EVENTS for details on events.
     * @method handleTilersEvent
     * @param {ICmsEvent} eventObject
     * @return void
     */
    private handleTilersEvent(eventObject: ICmsEvent): void {
        const verb: string = eventObject.verb ? (eventObject.verb).toLowerCase() : "";
        const uri: string = eventObject.uri;
        let response: any;

        this.appConfig.log("CmsApiService: handleTilersEvent...");
        // match the uri as "/tilers"
        if (uri.match(/(\/tilers)$/g)) {
            if (verb === "posted") {
                this.appConfig.log("CmsApiService: handleTilersEvent:: add a tile to the list");
                //@pending "TilerResourceAdded" not used further need to check
                response = {
                    eventType: "TilerResourceAdded",
                    body: eventObject.body
                };
            } else if (verb === "deleted") {
                this.appConfig.log("CmsApiService: handleTilersEvent:: remove a tile from the list");
                response = {
                    eventType: "TilerResourceDeleted",
                    body: eventObject.body
                };
            }

            // send event to tilers list
            CmsEventEmitterService.get(CMS_EVENTS.TileList).emit(response);
        } else if (uri.match(/(\/tilers\/)(\d+)$/g)) {

            // match the uri as "/tilers/{id}"
            if (verb === "put") {
                this.appConfig.log("CmsApiService: handleTilersEvent:: update a tile from the list");
                response = {
                    eventType: "TilerResourceUpdated",
                    body: eventObject.body
                };
            }

            // send event to tilers list
            CmsEventEmitterService.get(CMS_EVENTS.TileList).emit(response);
        }
    }

    /**
     * This method responsible to emit the event if matches the uri as "/sources/{id}".
     * This method is called from "handleSourcesEvent" method
     * @method updateSingleSource
     * @param {string} verb
     * @param {string} uri
     * @param {ICmsEvent} eventObject
     * @return void
     */
    private updateSingleSource(verb: string, uri: string, eventObject: ICmsEvent): void {
        switch (verb) {
            case "put":
                this.appConfig.log("CmsApiService: updateSingleSource:: update a single source");
                const response: any = {
                    eventType: "ResourceUpdated",
                    body: eventObject.body
                };

                // send event to source list
                CmsEventEmitterService.get(CMS_EVENTS.SourceList).emit(response);
                break;
            default:
        }
    }

    /**
     * This method emits the event related to perspectives.
     * The components need to subscribe for the events they want to listen.
     * Whenever any event is received from CMS, it is emitted using CmsEventEmitterService.
     * @syntax: CmsEventEmitterService.get(CMS_EVENTS.<event-name>).emit(aResponse)
     * Check CMS_EVENTS for details on events.
     * @method handlePerspectivesEvent
     * @param {ICmsEvent} eventObject
     * @return void
     */
    private handlePerspectivesEvent(eventObject: ICmsEvent): void {
        const verb: string = eventObject.verb ? eventObject.verb.toLowerCase() : "";
        const uri: string = eventObject.uri;

        this.appConfig.log("CmsApiService: handlePerspectivesEvent...");

        // match the uri as "/perspectives"
        if (uri.match(/(\/perspectives)$/g)) {
            if (verb === "posted") {
                this.appConfig.log("CmsApiService: handlePerspectivesEvent:: add a perspective to the list");
                const response: any = {
                    eventType: "ResourceAdded",
                    body: eventObject.body
                };

                // send event to source list
                CmsEventEmitterService.get(CMS_EVENTS.SourceList).emit(response);
            } else if (verb === "deleted") {
                this.appConfig.log("CmsApiService: updateSinglePerspective:: delete a single perspective");
                const response: any = {
                    eventType: "ResourceDeleted",
                    body: eventObject.body
                };

                // send event to source list
                CmsEventEmitterService.get(CMS_EVENTS.SourceList).emit(response);

                // send event to mini display
                CmsEventEmitterService.get(CMS_EVENTS.MiniDisplay).emit(response);
            }
        } else if (uri.match(/(\/perspectives\/)(\d+)$/g)) {
            // match the uri as "/perspectives/{id}"
            this.updateSinglePerspective(verb, uri, eventObject);
        }
    }

    /**
     * This method responsible to emit the event if matches the uri as "/perspectives/{id}".
     * This method is called from "handlePerspectivesEvent" method
     * @method updateSinglePerspective
     * @param {string} verb
     * @param {string} uri
     * @param {ICmsEvent} eventObject
     * @return void
     */
    private updateSinglePerspective(verb: string, uri: string, eventObject: ICmsEvent): void {
        switch (verb) {
            case "put":
                this.appConfig.log("CmsApiService: updateSinglePerspective:: update a single perspective");

                //adding "type" property
                eventObject.body.type = "Perspective";

                const response: any = {
                    eventType: "ResourceUpdated",
                    body: eventObject.body
                };

                // send event to source list
                CmsEventEmitterService.get(CMS_EVENTS.SourceList).emit(response);

                // send event to mini display
                CmsEventEmitterService.get(CMS_EVENTS.MiniDisplay).emit(response);

                break;
            default:
        }
    }

    /**
     * This method emits the event related to system.
     * The launchpad component need to subscribe for the system events.
     * Whenever any event is received from CMS, it is emitted using CmsEventEmitterService.
     * @syntax: CmsEventEmitterService.get(CMS_EVENTS.<event-name>).emit(aResponse)
     * Check CMS_EVENTS for details on events.
     * @method handleSystemEvents
     * @param {ICmsEvent} eventObject
     * @return void
     */
    private handleSystemEvents(eventObject: ICmsEvent): void {
        this.appConfig.log("CMSServerAPi: handle system events...");

        // send event on application level
        if (eventObject && eventObject.body.eventName) {
            if (eventObject.body.eventName === "DatabaseResetStarted") {
                this.databaseResetStarted = true;
            }
            CmsEventEmitterService.get(CMS_EVENTS.Application).emit({ eventName: eventObject.body.eventName, eventType: "system" });
        }
    }

    /**
     * This method emits the event related to user deleted.
     * The launchpad component need to subscribe for the system events.
     * Whenever any event is received from CMS, it is emitted using CmsEventEmitterService.
     * @syntax: CmsEventEmitterService.get(CMS_EVENTS.<event-name>).emit(aResponse)
     * Check CMS_EVENTS for details on events.
     * @method handleUserEvents
     * @param {ICmsEvent} eventObject
     * @return void
     */
    private handleUserEvents(eventObject: ICmsEvent): void {
        this.appConfig.log("CMSServerAPi: handleUserEvents:: Handle user events...");

        if (eventObject.body) {
            const verb: string = eventObject.verb ? eventObject.verb.toLowerCase() : "";
            const user: any = JSON.parse(this.storageManager.get(CMS_SESSION_STORAGE_ITEM.USER));

            if (!user && !user.username) {
                return;
            }

            if (verb === "deleted" && eventObject.body.name) {
                if (user.username.toLowerCase() === eventObject.body.name.toLowerCase()) {
                    this.appConfig.log("CMSServerAPi: handleUserEvents:: Handle user deleted event for user = ", eventObject.body.name);

                    // this is a system event since user has to finally logout
                    CmsEventEmitterService.get(CMS_EVENTS.Application).emit(
                        {
                            eventName: "UserDeleted",
                            eventType: "system"
                        });
                }
            } else if (verb === "put" && eventObject.body.length > 0) {
                for (let index: number = 0; index < eventObject.body.length; index++) {
                    if (user.username.toLowerCase() === eventObject.body[index].name.toLowerCase()) {
                        this.appConfig.log(
                            "CMSServerAPi: handleUserEvents:: Handle user modified event for user = ",
                            eventObject.body[index].name);

                        // this is a user event since user has to just refresh the application
                        CmsEventEmitterService.get(CMS_EVENTS.Application).emit({ eventName: "UserModified", eventType: "user" });
                        break;
                    }
                }
            }
        }
    }

    /**
     * This method handles error on API call failure.
     * @method promiseApiHandleError
     * @param {any} error
     * @return Promise<any>
     */
    private promiseApiHandleError(error: any): Promise<any> {
        this.appConfig.log("CmsApiService: promiseApiHandleError::", error);

        // unauthorized
        if (error.status === 401) {
            this.logoutUser();
        }

        return Promise.reject(error);
    }
}
