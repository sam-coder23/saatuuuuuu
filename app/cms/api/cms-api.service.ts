/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Headers, Http, Response, RequestOptionsArgs, URLSearchParams } from "@angular/http";

import { Observable, Subscription, Observer, TimeoutError } from "rxjs/Rx";
import "rxjs/add/operator/toPromise";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

import { CMS_EVENTS } from "./cms-events.enum";
import { CmsEventEmitterService } from "./cms-event-emitter.service";
import { Display } from "../models/cms-display";
import { Source } from "../models/cms-source";
import { ICmsEvent } from "../models/cms-event";
import { Tile } from "./../models/cms-tile";
import { UserConfig, User } from "../../launchpad/models/cms-user.model";
import { APIRequest } from "./api-request";
import { IUserProfileSettings } from "../models/cms-user-profile-settings";
import { StorageManager } from "./cms-storagemanager.service";
import { AppConfig } from "../../config";
import { CMS_SESSION_STORAGE_ITEM } from "../models/cms-session-storage-item";
import { ITilePreset } from "../models/cms-tile-preset";
import { Validation } from "../../core/util/Validation";

/**
 * This service is used to place CMS Server REST API calls for various functions. 
 * Also it creates a connection with CMS Server when user is logged in and maintains it till user logout.
 */
@Injectable()
export class CmsApiService {

    private sessionAlive: Subscription; // it will contain the subscription for CMS events initialized on login and unsubscribe on logout

    private reconnection;
    private firstDisconnection: boolean;
    private databaseResetStarted: boolean;

    /**
     * The constructor initializes various dependencies.
     */
    constructor(private http: Http, private router: Router, private apiRequest: APIRequest, private storageManager: StorageManager, private appConfig: AppConfig) {
        this.firstDisconnection = false;
        this.databaseResetStarted = false;
    }

    /**
     * Performs a user login request to CMS Server
     * @method login
     * @param {User} user It contains user data which is required to login into  server
     * @return Observable<Response>
     */
    login(user: User): Observable<Response> {
        let body = user.toJSON();
        return this.apiRequest.post("login", body);
    }

    /**
     * Performs a user logout request to CMS Server
     * @method logout
     * @return Observable<Response>
     */
    logout(): Observable<Response> {
        return this.apiRequest.get("logout");
    }

    /**
     * This method performs clean up on logout call and navigates user to login page.
     */
    public performOnlogout() {
        this.storageManager.removeStorage();
        this.makeSessionExpire();
        this.router.navigate(["/login"]);
    }

    /**
     * Fetch display list from CMS Server 
     * @method getDisplayList
     * @param {number} start
     * @param {number} count
     * @param {number} detail
     * @param {string} search
     * @param {boolean} favorite
     * @return {Display[]} Observable
     */
    getDisplayList(start: number = 1, count: number = 2147483647, search: string = "", favorite: boolean = false): Observable<Display[]> {
        let params = "displays?start=" + start + "&count=" + count + "&filter=" + encodeURIComponent(search) + "&onlyfavorite=" + favorite;
        return this.apiRequest.get(params);
    }

    /**
     * Fetch source list from CMS Server 
     * @method getSourceList
     * @param {number} start
     * @param {number} count
     * @param {number} aDisplayId
     * @param {string} search
     * @param {boolean} favorite
     * @return {Source[]} Observable
     */
    getSourceList(start: number = 1, count: number = 2147483647, aDisplayId: number, search: string = "", favorite: boolean = false): Observable<Source[]> {
        let params = "displays/" + aDisplayId + "/resources?start=" + start + "&count=" + count + "&filter=" + encodeURIComponent(search) + "&onlyfavorite=" + favorite;
        return this.apiRequest.get(params);
    }

    putContentsOnDisplay(displayId: number, tilerId: number, body: any) {
        let url = `displays/${displayId}/content?tilerId=${tilerId}`;
        return this.apiRequest.put(url, body);
    }

    /**
     * Fetch selected display detail info from CMS Server.
     * Display"s tile array will be returned along with display"s detail information and content array.
     * @method getSelectedDisplayContent
     * @param {number} aDisplayId
     * @return {Display} Observable
     */
    getSelectedDisplayContent(aDisplayId: number): Observable<Display> {
        return this.apiRequest.get(`displays/${aDisplayId}`).map(response => {
            var display = new Display(response);
            return display;
        });
    }

    /**
     * Mark an object such as Display/Source/Perspective/Application/Layout as favorite
     * with `post` http method.
     * @method markAsFavorite
     * @param: objectId: number :: Id of an object
     * @param: objectType: string :: DIS/SRC/PER/APP/LAY to be used as prefix for respective abjects
     */
    markAsFavorite(objectId: number, objectType: string): Promise<Response> {
        let url = `users/current/profile/favorites`,
            body = JSON.stringify({ id: objectType + "_" + objectId });

        return this.http
            .post(this.apiRequest.GetURL(url), body, this.apiRequest.requestOption)
            .toPromise()
            .then(response => {
                this.appConfig.log("CmsApiService: markAsFavorite");
                return response.json();
            })
            .catch(this.promiseApiHandleError.bind(this));
    }

    /**
     * Mark an object such as Display/Source/Perspective/Application/Layout as unfavorites
     * with `delete` http method.
     * @method markAsUnfavorite
     * @param: objectId: number :: Id of an object
     * @param: objectType: string :: DIS/SRC/PER/APP/LAY to be used as prefix for respective abjects
     */
    markAsUnfavorite(objectId: number, objectType: string): Promise<Response> {
        let id = objectType + "_" + objectId,
            url = `users/current/profile/favorites/${id}`;

        return this.http
            .delete(this.apiRequest.GetURL(url), this.apiRequest.requestOption)
            .toPromise()
            .then(response => {
                this.appConfig.log("CmsApiService: markAsUnfavorite");
                return response.json();
            })
            .catch(this.promiseApiHandleError.bind(this));
    }

    /**
     * Get current user profile data with `get` http method.
     */
    getUserProfileSettings(): Promise<any> {
        let url = `users/current/profile/settings`;

        return this.http
            .get(this.apiRequest.GetURL(url), this.apiRequest.requestOption)
            .toPromise()
            .then((response) => {
                if (response) {
                    this.appConfig.log("CmsApiService: getUserProfileSettings");
                    let resposne = response.json();
                    return resposne;
                }
            })
            .catch(this.promiseApiHandleError.bind(this));
    }

    /**
     * Update current user profile data with `post` http method.
     * @method updateUserProfileSettings
     * @param {IUserProfileSettings} settings
     */
    updateUserProfileSettings(settings: IUserProfileSettings): Promise<Response> {
        let url = `users/current/profile/settings`,
            body = JSON.stringify(settings);

        return this.http
            .put(this.apiRequest.GetURL(url), body, this.apiRequest.requestOption)
            .toPromise()
            .then(response => {
                this.appConfig.log("CmsApiService: updateUserProfileSettings");
                return response;
            })
            .catch(this.promiseApiHandleError.bind(this));
    }

    /**
     * Fetches events from CMS Server with `get` http method.
     * @method getEvents
     */
    getEvents(): Observable<Response> {
        let url = this.apiRequest.GetURL("events");

        return this.http.get(url, this.apiRequest.requestOption)
            .map((res: Response) => {
                // on network reconnection
                if (this.firstDisconnection) {
                    this.firstDisconnection = false;
                    // send event on application level to close server disconnection dialog
                    CmsEventEmitterService.get(CMS_EVENTS.Application).emit({ eventName: "EventReconnectionSuccess", eventType: "system" });
                }

                //@pending - Blind read. see json() function docummentation
                let response: ICmsEvent[] = res.json(),
                    events = Observable.from(response);

                events.subscribe(
                    cmsEvent => {
                        // HANDLE DISPLAYS EVENTS
                        if (cmsEvent && cmsEvent.uri && cmsEvent.uri.match("/displays")) {
                            this.handleDisplaysEvent(cmsEvent);
                        }
                        // HANDLE SOURCES EVENTS
                        else if (cmsEvent && cmsEvent.uri && cmsEvent.uri.match("/sources")) {
                            this.handleSourcesEvent(cmsEvent);
                        }
                        // HANDLE PERSPECTIVES EVENTS
                        else if (cmsEvent && cmsEvent.uri && cmsEvent.uri.match("/perspectives")) {
                            this.handlePerspectivesEvent(cmsEvent);
                        }
                        // HANDLE SYSTEM EVENTS
                        else if (cmsEvent && cmsEvent.uri && cmsEvent.uri.match("/system")) {
                            this.handleSystemEvents(cmsEvent);
                        }
                        // HANDLE USER EVENTS
                        else if (cmsEvent && cmsEvent.uri && cmsEvent.uri.match("/users/current")) {
                            this.handleUserEvents(cmsEvent);
                        }
                        // HANDLE TILE EVENTS
                        else if (cmsEvent && cmsEvent.uri && cmsEvent.uri.match("/tilers")) {
                            this.handleTilersEvent(cmsEvent);
                        }
                    }
                )
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
                }
                else {
                    return this.apiRequest.handleError(error);
                }
            });
    }

    /**
     * Get current content of a display wall
     * @method getDisplayContent
     * @param {number} aDisplayId It hold the display id
      */
    getDisplayContent(aDisplayId: number) {
        return this.apiRequest.get(`displays/${aDisplayId}/content`);
    }

    /**
     * Load  content on cms-tile of mini display with `post` http method.
     * @method loadContentOnTile
     * @param: displayId: number :: To load content on tile of this display id
     * @param: tile: ITile :: Contains info on which content is pushed
     * @param: content: Source :: It is the source info to be pushed on tile
     */
    public loadContentOnTile(displayId: number, tile: Tile, content: Source): Promise<Response> {
        this.appConfig.log("CmsApiService: loadContentOnTile...");
        tile = new Tile(tile);

        try {
            let url = `displays/${displayId}/content`,
                body = {
                    "name": content.name,
                    "type": content.type,
                    "resourceId": content.id,
                    "x": tile.x,
                    "y": tile.y,
                    "width": tile.width,
                    "height": tile.height,
                    "snapshotPath": content.snapshotPath
                };

            return this.http
                .post(this.apiRequest.GetURL(url), body, this.apiRequest.requestOption)
                .toPromise()
                .then(response => response)
                .catch(this.promiseApiHandleError.bind(this));
        }
        catch (error) {
            this.appConfig.error("CmsApiService: API failed for loading content on display tile. Error:", error);
            return this.promiseApiHandleError(error);
        }
    }

    /**
     * Unload content from display
     * @method unloadContentFromDisplay
     * @param {number} displayId Display ID to which specified content belong to.
     * @param {number} contentId  Content ID which need to be removed
     * @return {Response} Observable
     */
    unloadContentFromDisplay(displayId: number, contentId: number): Observable<Response> {
        this.appConfig.log("CmsApiService: unloadContentFromDisplay...");

        try {
            let url = `displays/${displayId}/content/${contentId}`;
            return this.apiRequest.delete(url);
        }
        catch (error) {
            this.appConfig.error("CmsApiService: unloadContentFromDisplay", error);
            return this.apiRequest.handleError.bind(error);
        }
    }

    /**
     * This method maintains the session with CMS Server on login until user logout.
     */
    public keepSessionAlive() {
        if (this.sessionAlive) {
            // this.appConfig.log("Cleaning up session alive.", this.sessionAlive);
            this.sessionAlive.unsubscribe();
        }

        this.appConfig.log("CmsApiService: keepSessionAlive:: Session alive with CMS Server!");

        this.sessionAlive = this.getEvents().subscribe(
            response => this.keepSessionAlive(),
            error => {
                this.handleServerOnDisconnection(error);
            }
        );
    }

    /**
     * This method expires the session with CMS Server on logout.
     */
    public makeSessionExpire() {
        if (typeof this.sessionAlive !== "undefined") {
            this.appConfig.log("CmsApiService: makeSessionExpire:: Session with CMS Server now expires!!");
            this.sessionAlive.unsubscribe();
        }

        this.clearReconnectionTimeout();
    }

    /**
     * This method creates a new session with CMS Server on application refresh.
     */
    public reconnectSessionWithServer() {
        this.makeSessionExpire();
        this.keepSessionAlive();
    }

    /**
     * This method sends an event at application level to show dialog in case of exception due to no permission while calling an API.
     */
    public noPermissionErrorHandler(error: any, permissionName: string) {
        this.appConfig.log("CmsApiService: noPermissionErrorHandler::", error);

        CmsEventEmitterService.get(CMS_EVENTS.Application).emit({ eventName: permissionName, eventType: "permission" });
    }


    /**
     * getAppVersion: returns launchpad app build version
     */
    public getAppVersion(): Promise<string> {
        return this.http.get("version.properties")
            .map((res) => {
                try {
                    let responseBody = res.text().trim(),
                        result = responseBody.split("=");

                    if (result && result.length === 2 && result[0] === "launchpad.buildnumber")
                        return `1.1 Build ${result[1]}`;
                } catch (error) {
                    this.appConfig.error(error);
                }
                return "";
            })
            .toPromise()
            .catch(this.promiseApiHandleError.bind(this));
    }


    /**
     * This method handles server disconnection.
     */
    private handleServerOnDisconnection(error) {
        this.appConfig.log("CMSServerApi: Trying to connect to the server...");

        this.reconnection = setTimeout(() => {
            if (error.status === 0 && !this.firstDisconnection) {
                this.firstDisconnection = true;
                this.databaseResetStarted = false;

                // send event on application level to show server disconnection dialog
                CmsEventEmitterService.get(CMS_EVENTS.Application).emit({ eventName: "ServerDisconnected", eventType: "system" });
            }
            this.reconnectSessionWithServer();
        }, 2000);
    }

    /**
     * This method handles server reconnection.
     */
    private handleServerOnConnection(error) {
        this.appConfig.log("CMSServerApi: The server is now reachable but not in proper state. ErrorStatus: " + error.status);

        if (this.firstDisconnection) {
            this.firstDisconnection = false;
        }

        // send event on application level to show server connection dialog
        CmsEventEmitterService.get(CMS_EVENTS.Application).emit({ eventName: "ServerConnected", eventType: "system" });
    }

    /**
     * This method clears timeout for reconnection. 
     */
    private clearReconnectionTimeout() {
        if (typeof this.reconnection !== "undefined") {
            clearTimeout(this.reconnection);
        }
    }

    /**
     * This method emits the event related to displays. 
     * The components need to subscribe for the events they want to listen.
     * 
     * Whenever any event is received from CMS, it is emitted using CmsEventEmitterService.
     * @syntax: CmsEventEmitterService.get(CMS_EVENTS.<event-name>).emit(aResponse)
     * Check CMS_EVENTS for details on events.
     */
    private handleDisplaysEvent(eventObject: ICmsEvent) {
        let verb: string = eventObject.verb ? eventObject.verb.toLowerCase() : "",
            uri = eventObject.uri;

        // match the uri as "/displays"
        if (uri.match(/(\/displays)$/g)) {
            if (verb === "posted") {
                this.appConfig.log("CmsApiService: handleDisplaysEvent:: add a display to the list");
                // send event to display list
                CmsEventEmitterService.get(CMS_EVENTS.DisplayList).emit(eventObject);
                // send event to display panel
                CmsEventEmitterService.get(CMS_EVENTS.Display).emit(eventObject);
            }
        }

        // match the uri as "/displays/{id}"
        else if (uri.match(/(\/displays\/)(\d+)$/g)) {
            this.updateSingleDisplay(verb, uri, eventObject);
        }

        // match the uri as "/displays/{id}/content"
        else if (uri.match(/(\/displays\/)(\d+)(\/content)$/g)) {
            this.updateDisplayContent(verb, uri, eventObject);
        }

        // match the uri as "/displays/{id}/content/{id}"
        else if (uri.match(/(\/displays\/)(\d+)(\/content\/)(\d+)$/g)) {
            this.updateDisplayContentElement(verb, uri, eventObject);
        }

        // match the uri as "/displays/{id}/applications"
        else if (uri.match(/(\/displays\/)(\d+)(\/applications)$/g)) {
            if (verb === "posted") {
                this.appConfig.log("CmsApiService: handleDisplaysEvent:: add a single application");
                let appResponse = {
                    eventType: "ResourceAdded",
                    body: eventObject.body
                }
                // send event to source list
                CmsEventEmitterService.get(CMS_EVENTS.SourceList).emit(appResponse);
            }
        }

        // match the uri as "/displays/{id}/applications/{id}"
        else if (uri.match(/(\/displays\/)(\d+)(\/applications\/)(\d+)$/g)) {
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
     */
    private updateDisplayContent(verb: string, uri: string, eventObject: ICmsEvent) {
        let id = parseInt(uri.match(/(\d+)/g)[0]);

        switch (verb) {
            // case "posted":
            //     this.appConfig.log("CmsApiService:updateDisplayContent :: add a content element");
            //     var response = {
            //         eventType: "NewContentAdded",
            //         body: eventObject.body,
            //         displayId: id
            //     }

            //     // send event to mini-display
            //     CmsEventEmitterService.get(CMS_EVENTS.MiniDisplay).emit(response);
            //     break;

            case "put":
                this.appConfig.log("CmsApiService: updateDisplayContent :: Update the list of tiler and/or content.");
                var response = {
                    eventType: "TilerAndContentUpdated",
                    body: eventObject.body,
                    displayId: id
                }

                // send event to mini-display
                CmsEventEmitterService.get(CMS_EVENTS.MiniDisplay).emit(response);
                break;

            // case "deleted":
            //     this.appConfig.log("CmsApiService:updateDisplayContent :: delete a content");
            //     var response = {
            //         eventType: "ContentDeleted",
            //         body: eventObject.body,
            //         displayId: id
            //     }

            //     // send event to mini-display
            //     CmsEventEmitterService.get(CMS_EVENTS.MiniDisplay).emit(response);
            //     break;

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
     */
    private updateSingleDisplay(verb: string, uri: string, eventObject: ICmsEvent) {
        let id = parseInt(uri.match(/(\d+)/g)[0]);

        switch (verb) {
            case "put":
                this.appConfig.log("CmsApiService: updateSingleDisplay:: update a single display.");
                var response = {
                    eventType: "DisplayUpdated",
                    body: eventObject.body,
                    displayId: id
                }

                // send event to mini-display for refreshing display
                CmsEventEmitterService.get(CMS_EVENTS.MiniDisplay).emit(response);

                // send event to display list
                CmsEventEmitterService.get(CMS_EVENTS.DisplayList).emit(eventObject);
                break;

            case "deleted":
                this.appConfig.log("CmsApiService: updateSingleDisplay:: delete a single display");
                var response = {
                    eventType: "DisplayDeleted",
                    body: eventObject.body,
                    displayId: id
                }

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
     */
    private updateDisplayContentElement(verb: string, uri: string, eventObject: ICmsEvent) {
        let id = parseInt(uri.match(/(\d+)/g)[0]);

        switch (verb) {
            case "put":
                this.appConfig.log("CmsApiService: updateDisplayContentElement:: update the content element");
                var response = {
                    eventType: "ContentUpdated",
                    body: eventObject.body,
                    displayId: id
                }

                // send event to mini-display
                CmsEventEmitterService.get(CMS_EVENTS.MiniDisplay).emit(response);
                break;

            // case "deleted":
            //     this.appConfig.log("EVENT: DISPLAYS :: delete the content element");
            //     var response = {
            //         eventType: "ContentDeleted",
            //         body: eventObject.body,
            //         displayId: id
            //     }

            //     // send event to mini-display
            //     CmsEventEmitterService.get(CMS_EVENTS.MiniDisplay).emit(response);
            //     break;

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
     */
    private updateDisplaySingleApplication(verb: string, uri: string, eventObject: ICmsEvent) {
        let id = parseInt(uri.match(/(\d+)/g)[0]);

        switch (verb) {
            case "put":
                this.appConfig.log("CmsApiService: updateDisplaySingleApplication:: update a single application");

                //adding "type" property
                eventObject.body.type = "Application";

                var appResponse = {
                    eventType: "ResourceUpdated",
                    body: eventObject.body
                }

                // send event to source list
                CmsEventEmitterService.get(CMS_EVENTS.SourceList).emit(appResponse);

                // send event to mini-display
                CmsEventEmitterService.get(CMS_EVENTS.MiniDisplay).emit(appResponse);
                break;

            case "deleted":
                this.appConfig.log("CmsApiService: updateDisplaySingleApplication:: delete a single application");
                var appResponse = {
                    eventType: "ResourceDeleted",
                    body: eventObject.body
                }

                // send event to source list
                CmsEventEmitterService.get(CMS_EVENTS.SourceList).emit(appResponse);
                break;

            default:
        }
    }

    /**
     * This method emits the event related to sources. 
     * The components need to subscribe for the events they want to listen.
     * 
     * Whenever any event is received from CMS, it is emitted using CmsEventEmitterService.
     * @syntax: CmsEventEmitterService.get(CMS_EVENTS.<event-name>).emit(aResponse)
     * Check CMS_EVENTS for details on events.
     */
    private handleSourcesEvent(eventObject: ICmsEvent) {
        let verb: string = eventObject.verb ? eventObject.verb.toLowerCase() : "",
            uri = eventObject.uri;

        this.appConfig.log("CmsApiService: handleSourcesEvent...");

        // match the uri as "/sources"
        if (uri.match(/(\/sources)$/g)) {
            if (verb === "posted") {
                this.appConfig.log("CmsApiService: handleSourcesEvent:: add a source to the list");
                var response = {
                    eventType: "ResourceAdded",
                    body: eventObject.body
                }

                // send event to source list
                CmsEventEmitterService.get(CMS_EVENTS.SourceList).emit(response);
            }
        }
        // match the uri as "/sources/{id}"
        else if (uri.match(/(\/sources\/)(\d+)$/g)) {
            this.updateSingleSource(verb, uri, eventObject);
        }
    }

    /**
     * This method emits the event related to tilers. 
     * The components need to subscribe for the events they want to listen.
     * 
     * Whenever any event is received from CMS, it is emitted using CmsEventEmitterService.
     * @syntax: CmsEventEmitterService.get(CMS_EVENTS.<event-name>).emit(aResponse)
     * Check CMS_EVENTS for details on events.
     */
    private handleTilersEvent(eventObject: ICmsEvent) {
        let verb: string = eventObject.verb ? (eventObject.verb).toLowerCase() : "",
            uri = eventObject.uri;
        let response: any;

        this.appConfig.log("CmsApiService: handleTilersEvent...");
        // match the uri as "/tilers"
        if (uri.match(/(\/tilers)$/g)) {
            if (verb === "posted") {
                this.appConfig.log("CmsApiService: handleTilersEvent:: add a tile to the list");
                //TODO:TBD = "TilerResourceAdded" not used further need to check
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
        }
        // match the uri as "/tilers/{id}"
        else if (uri.match(/(\/tilers\/)(\d+)$/g)) {
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
     *
     * @method updateSingleSource
     * @param {string} verb  
     * @param {string} uri 
     * @param {ICmsEvent} eventObject
     */
    private updateSingleSource(verb: string, uri: string, eventObject: ICmsEvent) {
        switch (verb) {
            case "put":
                this.appConfig.log("CmsApiService: updateSingleSource:: update a single source");
                var response = {
                    eventType: "ResourceUpdated",
                    body: eventObject.body
                }

                // send event to source list
                CmsEventEmitterService.get(CMS_EVENTS.SourceList).emit(response);
                break;

            case "deleted":
                this.appConfig.log("CmsApiService: updateSingleSource:: delete a single source");
                var response = {
                    eventType: "ResourceDeleted",
                    body: eventObject.body
                }

                // send event to source list
                CmsEventEmitterService.get(CMS_EVENTS.SourceList).emit(response);
                break;

            default:
        }
    }

    /**
     * This method emits the event related to perspectives. 
     * The components need to subscribe for the events they want to listen.
     * 
     * Whenever any event is received from CMS, it is emitted using CmsEventEmitterService.
     * @syntax: CmsEventEmitterService.get(CMS_EVENTS.<event-name>).emit(aResponse)
     * Check CMS_EVENTS for details on events.
     */
    private handlePerspectivesEvent(eventObject: ICmsEvent) {
        let verb: string = eventObject.verb ? eventObject.verb.toLowerCase() : "",
            uri = eventObject.uri;

        this.appConfig.log("CmsApiService: handlePerspectivesEvent...");

        // match the uri as "/perspectives"
        if (uri.match(/(\/perspectives)$/g)) {
            if (verb === "posted") {
                this.appConfig.log("CmsApiService: handlePerspectivesEvent:: add a perspective to the list");
                var response = {
                    eventType: "ResourceAdded",
                    body: eventObject.body
                }

                // send event to source list
                CmsEventEmitterService.get(CMS_EVENTS.SourceList).emit(response);
            }
        }

        // match the uri as "/perspectives/{id}"
        else if (uri.match(/(\/perspectives\/)(\d+)$/g)) {
            this.updateSinglePerspective(verb, uri, eventObject);
        }
    }

    /**
     * This method responsible to emit the event if matches the uri as "/perspectives/{id}".
     * This method is called from "handlePerspectivesEvent" method
     *
     * @method updateSinglePerspective
     * @param {string} verb  
     * @param {string} uri 
     * @param {ICmsEvent} eventObject
     */
    private updateSinglePerspective(verb: string, uri: string, eventObject: ICmsEvent) {
        switch (verb) {
            case "put":
                this.appConfig.log("CmsApiService: updateSinglePerspective:: update a single perspective");

                //adding "type" property
                eventObject.body.type = "Perspective"

                var response = {
                    eventType: "ResourceUpdated",
                    body: eventObject.body
                }

                // send event to source list
                CmsEventEmitterService.get(CMS_EVENTS.SourceList).emit(response);

                // send event to mini display
                CmsEventEmitterService.get(CMS_EVENTS.MiniDisplay).emit(response);

                break;

            case "deleted":
                this.appConfig.log("CmsApiService: updateSinglePerspective:: delete a single perspective");
                var response = {
                    eventType: "ResourceDeleted",
                    body: eventObject.body
                }

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
     * 
     * Whenever any event is received from CMS, it is emitted using CmsEventEmitterService.
     * @syntax: CmsEventEmitterService.get(CMS_EVENTS.<event-name>).emit(aResponse)
     * Check CMS_EVENTS for details on events.
     */
    private handleSystemEvents(eventObject: ICmsEvent) {
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
     * 
     * Whenever any event is received from CMS, it is emitted using CmsEventEmitterService.
     * @syntax: CmsEventEmitterService.get(CMS_EVENTS.<event-name>).emit(aResponse)
     * Check CMS_EVENTS for details on events.
     */
    private handleUserEvents(eventObject: ICmsEvent) {
        this.appConfig.log("CMSServerAPi: handleUserEvents:: Handle user events...");

        if (eventObject.body) {
            let verb: string = eventObject.verb ? eventObject.verb.toLowerCase() : "";
            let user = JSON.parse(this.storageManager.get(CMS_SESSION_STORAGE_ITEM.User));

            if (!user && !user.username) {
                return;
            }

            if (verb === "deleted" && eventObject.body.name) {
                if (user.username.toLowerCase() === eventObject.body.name.toLowerCase()) {
                    this.appConfig.log("CMSServerAPi: handleUserEvents:: Handle user deleted event for user = ", eventObject.body.name);

                    // this is a system event since user has to finally logout
                    CmsEventEmitterService.get(CMS_EVENTS.Application).emit({ eventName: "UserDeleted", eventType: "system" });
                }
            }
            else if (verb === "put" && eventObject.body.length > 0) {
                for (let i = 0; i < eventObject.body.length; i++) {
                    if (user.username.toLowerCase() === eventObject.body[i].name.toLowerCase()) {
                        this.appConfig.log("CMSServerAPi: handleUserEvents:: Handle user modified event for user = ", eventObject.body[i].name);

                        // this is a user event since user has to just refresh the application
                        CmsEventEmitterService.get(CMS_EVENTS.Application).emit({ eventName: "UserModified", eventType: "user" });
                        break;
                    }
                }
            }
        }
    }

    /**
     * This method Will fetch the system info
     * @method getSystemInfo
     * return {any} Observable
     */
    public getSystemInfo(): Observable<any> {
        return this.apiRequest.get("system/info");
    }

    /**
     * This method handles error on API call failure.
     */
    private promiseApiHandleError(error): Promise<any> {
        this.appConfig.log("CmsApiService: promiseApiHandleError::", error);

        if (error.status === 401) {
            // unauthorized
            this.logout();
            this.router.navigate(["/login"]);
        }

        return Promise.reject(error);
    }



    /**
     * APIs for /tilers
     */


    /**
     * getTilers
     */
    public getTilers(): Observable<ITilePreset[]> {
        return this.apiRequest.get("tilers");
    }

    /**
     * This method updates geometery of the content on specified Display, API is only usefull for Geometery change
     * @param displayId 
     * @param contentId 
     * @param body 
     */
    updateContentGeormetryOnDisplay(displayId: number, contentId: number, body: any) {
        if (displayId > 0 && contentId > 0 && !Validation.IsNullOrUndefined(body)) {
            let url = `displays/${displayId}/content/${contentId}`;
            return this.apiRequest.put(url, body);
        } else {
            return Observable.throw("Invalid input for the API call");
        }
    }
}