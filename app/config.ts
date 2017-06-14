/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */
import { Injectable } from '@angular/core';

@Injectable()
export /**
 * This class contains configuration regarding 
 * API stuf
 * @class APIConfig
 * @constructor constructor
 */
class AppConfig {
    public serverURL:string;
    public defaultLanguage: string;
    public copyRightYear: string;
    private apiURL = '/cms-rest/v1';
    private host: string;

    constructor() {
        let location = window.document.location,
            protocol = location.protocol;
        this.host = location.host;

        this.serverURL = "https://10.98.1.110" + this.apiURL;

        this.log('Application is using services available on the following url - ', this.serverURL);
        this.defaultLanguage = 'en';
        this.copyRightYear = "2016";
    }

    /**
     * This method will return the server url
     * @method ServerURL
     * @return This will return string type data
     */
    public get ServerURL() : string {
        return this.serverURL;
    }

    /**
     * This method is responsible for returing the current host name 
     * @method Host
     * @return {string}
     */
    public get Host(): string {
        return this.host;
    }

    /**
     * This is just a wrapper arroud the console info log
     * @method log
     * @param {any[]} args
     * @return void
     */
    public log(...args: any[]): void {
        let today = new Date();
        let dateTime = today.toLocaleString();
        if(args && args.length > 0) {
            console.log(dateTime , " - info " , args);
        }
    }    

    /**
     * This is just a wrapper arroud the console log for warning logs
     * @method warn
     * @param {any[]} args
     * @return void
     */
    public warn(...args: any[]): void {
        let today = new Date();
        let dateTime = today.toLocaleString();
        if(args && args.length > 0) {
            console.log(dateTime , " - warn " , args);
        }
    }

    /**
     * This is just a wrapper arroud the console log for error logs
     * @method error
     * @param {any[]} args
     * @return void
     */
    public error(...args: any[]): void {
        let today = new Date();
        let dateTime = today.toLocaleString();
        if(args && args.length > 0) {
            console.log(dateTime , " - error " , args);
        }
    }
}