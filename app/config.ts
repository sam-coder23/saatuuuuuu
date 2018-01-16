/**
 * This class contains application level configuration
 * @class APIConfig
 * @constructor constructor
 */

import { Injectable } from "@angular/core";
import { CMSConstants } from "./cms/models/cms-constants";

@Injectable()
export class AppConfig {
    private serverURL: string;
    private defaultLanguage: string;
    private copyrightYear: string;
    private host: string;

    /**
     * Initialse api server url, default language and copyright year
     * Api server url being initialized based on window host and location
     * @constructor
     */
    constructor () {
        const location: Location = window.document.location;
        this.host = location.host;
        this.serverURL = `${location.protocol}//${this.host}/cms-rest/v1`;
        this.defaultLanguage = CMSConstants.DEFAULTLANGUAGE;
        this.copyrightYear = CMSConstants.COPYRIGHTYEAR;
    }

    /**
     * This method will return the api server url
     * @method ServerURL
     * @return This will return string type data
     */
    public get ServerURL(): string {
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
    public log (...args: any[]): void {
        const today: Date = new Date();
        const dateTime: string = today.toLocaleString();
        if (args && args.length > 0) {
            const infoLog: Function = console.log;
            infoLog(dateTime, " - info ", args);
        }
    }

    /**
     * This is just a wrapper arroud the console log for warning logs
     * @method warn
     * @param {any[]} args
     * @return void
     */
    public warn (...args: any[]): void {
        const today: Date = new Date();
        const dateTime: string = today.toLocaleString();
        if (args && args.length > 0) {
            const warnLog: Function = console.log;
            warnLog(dateTime, " - warn ", args);
        }
    }

    /**
     * This is just a wrapper arroud the console log for error logs
     * @method error
     * @param {any[]} args
     * @return void
     */
    public error (...args: any[]): void {
        const today: Date = new Date();
        const dateTime: string = today.toLocaleString();
        if (args && args.length > 0) {
            const errorLog: Function = console.log;
            errorLog(dateTime, " - error ", args);
        }
    }
}
