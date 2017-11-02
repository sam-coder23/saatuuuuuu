/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */
import { Injectable } from "@angular/core";
import { CMSConstants } from "./cms/models/cms-constants";

@Injectable()
export
/**
 * This class contains application level configuration 
 * @class APIConfig
 * @constructor constructor
 */
class AppConfig {
    private serverURL:string;
    private defaultLanguage: string;
    private copyrightYear: string;
    private host: string;

    /**
     * Initialse api server url, default language and copyright year
     * Api server url being initialized based on window host and location
     * @constructor
     */
    constructor() {
        let location = window.document.location;

        this.host = location.host;
        this.serverURL = `${location.protocol}//${this.host}/cms-rest/v1`;
        this.defaultLanguage = CMSConstants.DefaultLanguage;
        this.copyrightYear = CMSConstants.CopyrightYear;
    }

    /**
     * This method will return the api server url
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
     * This method is responsible for returing default language 
     * @method DefaultLanguage
     * @return {string}
     */
    public get DefaultLanguage(): string {
        return this.defaultLanguage;
    }

    /**
     * This method is responsible for returing the copyright year 
     * @method CopyrightYear
     * @return {string}
     */
    public get CopyrightYear(): string {
        return this.copyrightYear;
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