/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptionsArgs , Response, URLSearchParams } from '@angular/http';
import { AppConfig } from '../../config';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';


//Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export /**
 * This class will hold logic related all kind of api intialization and 
 * it will normalize https request for the entire application
 * @class APIRequest
 * @property { string } serverURL This will base server url
 * @property { Headers } headers
 * @property { RequestOptionsArgs } requestOption
 * @constructor constructor This will inject Http module to request on server
 */
class APIRequest {
    private serverURL: string;
    public headers: Headers;
    public requestOption: RequestOptionsArgs ;
    

    constructor(private http: Http, private router: Router, private appConfig: AppConfig) {
        this.serverURL = this.appConfig.ServerURL;        
        this.headers = new Headers({'Content-Type': 'application/json' });
        this.requestOption = {
            headers: this.headers,
            withCredentials: true            
        };
    }

    /**
     * This will return specific url as per request
     * @method getURL
     * @param { string } url
     */
    public GetURL(url: string) {
        if (url.lastIndexOf('?') !== -1) {
            url = `${url}&_=${Date.now()}`
        }
        else {
            url = `${url}?_=${Date.now()}`
        }

        return this.serverURL + '/' + url;
    } 


    /**
     * This will hold logic which will send the post request
     * to concerned server
     * @medthod post
     * @param { string } url Request url
     * @param {any} body 
     */
    public post(url: string, body: any): Observable<any> {
        return this.http.post(this.GetURL(url), body, this.requestOption)
            .map((response : any) => response.json())
            .catch(this.handleError.bind(this));
    }

    /**
     * This will hold logic whiich will send the get request
     * to concerned server
     * @medthod get
     * @param { string } url Request url
     * @param { URLSearchParams  } params 
     */
    public get(url: string) : Observable<any> {
        // if(params){
        //     this.requestOption.search = params;
        // }
        //@pending - we need to see whether all server responses are of type JSON      
        return this.http.get(this.GetURL(url), this.requestOption)
            .map((response:any) => response.json())
            .catch(this.handleError.bind(this));
    }

    /**
     * This will hold the logic which will send the put request
     * to the server
     * @method put 
     * @param {any} body 
     * @param {string} url
     */
     public put(url: string, body?:any) : Observable<any> {
        // if(params){
        //     this.requestOption.search = params;
        // }
        return this.http.put(this.GetURL(url), body, this.requestOption)
            .map((response : any) => response.json())
            .catch(this.handleError.bind(this));
    }

    /**
     * This will hold the logic which will send the delete request
     * @method delete
     * @param {string} url 
     */
    public delete(url: string) : Observable<any> {
         return this.http.delete(this.GetURL(url), this.requestOption)
            .map((response : any) => response.json())
            .catch(this.handleError.bind(this));
    }

     /**
     * This is used to handle the error
     * @method handleError
     * @param {any} error 
     */
    public handleError(error): Observable<any> {
        if (error.status === 401) {
            this.get('logout')
                .subscribe(()=> {
                    this.appConfig.log("Something wrong with server, Logout users successfully");
                });

            this.router.navigate(['/login']);
       }

        return Observable.throw(error || 'Server error');
    }
}
