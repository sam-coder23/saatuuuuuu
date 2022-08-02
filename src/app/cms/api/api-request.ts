import { catchError, map, Observable, throwError, finalize } from "rxjs";
/**
 * This class will hold logic related all kind of api intialization and
 * it will normalize https request for the entire application
 * @class APIRequest
 * @property {string} serverURL This will base server url
 * @property {Headers} headers
 * @property {RequestOptionsArgs} requestOption
 * @constructor constructor This will inject Http module to request on server
 */

import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

import { AppConfig } from "../../config";
import { StorageManager } from "./cms-storagemanager.service";
import { CMSConstants } from "../models/cms-constants";

@Injectable()
export class APIRequest {
    public headers: HttpHeaders;
    public requestOption: any;
    private serverURL: string;

    constructor(
        private http: HttpClient,
        private router: Router,
        private appConfig: AppConfig,
        private storageManager: StorageManager) {
        this.serverURL = this.appConfig.ServerURL;
        this.headers = new HttpHeaders({ "Content-Type": "application/json" });
        this.requestOption = {
            headers: this.headers,
            withCredentials: true
        };
    }

    /**
     * This will return specific url as per request
     * @method getURL
     * @param {string} url
     */
    public getUrl(url: string): string {
        if (url.lastIndexOf("?") !== -1) {
            url = `${url}&_=${Date.now()}`;
        } else {
            url = `${url}?_=${Date.now()}`;
        }

        return `${this.serverURL}/${url}`;
    }

    /**
     * This will hold logic which will send the post request to concerned server
     * @method post
     * @param {string} url Request url
     * @param {any} body
     */
    public postRequest(url: string, body: any): Observable<any> {
        return this.http
            .post(this.getUrl(url), JSON.stringify(body), this.requestOption)
            .pipe(
                map((response: any) => {
                    return response;
                }),
                catchError(this.handleError.bind(this))
            );
    }

    /**
     * This will hold logic whiich will send the get request to concerned server
     * @method get
     * @param {string} url Request url
     * @param {URLSearchParams} params
     */
    public getRequest(url: string): Observable<any> {
        //@pending - we need to see whether all server responses are of type JSON
        return this.http.get(this.getUrl(url), this.requestOption).pipe(
            map((response: any) => {
                return response;
            }),
            catchError(this.handleError.bind(this))
        );
    }

    /**
     * This will hold the logic which will send the put request
     * to the server
     * @method put
     * @param {any} body
     * @param {string} url
     */
    public putRequest(url: string, body?: any): Observable<any> {
        return this.http.put(this.getUrl(url), body, this.requestOption).pipe(
            map((response: any) => response),
            catchError(this.handleError.bind(this))
        );
    }

    /**
     * This will hold the logic which will send the delete request
     * @method delete
     * @param {string} url
     */
    public deleteRequest(url: string): Observable<any> {
        return this.http.delete(this.getUrl(url), this.requestOption).pipe(
            map((response: any) => response),
            catchError(this.handleError.bind(this))
        );
    }

    /**
     * This is used to handle the error
     * @method handleError
     * @param {any} error
     */
    public handleError(error: any): Observable<any> {
        if (error.status === CMSConstants.HTTP_STATUS_CODES['UNAUTHORIZED']) {
            this.getRequest("logout")
                // finalize(() => this.storageManager.removeStorage()))
                .subscribe(() => {
                    this.appConfig.log("Something wrong with server, Logout users successfully");
                });

            this.router.navigate(["/login"]);
        }

        return throwError(() => error || new Error("Server error"));
    }
}
