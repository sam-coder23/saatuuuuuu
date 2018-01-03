import { TestBed, inject, async } from "@angular/core/testing";
import { AppConfig } from "../../app/config";
import { CMSConstants } from "../../app/cms/models/cms-constants";

describe("Service: App Config", () => {

    let appConfig, spyOnConsole;
    let serverURLExpectedValue = "";
    let hostExpectedValue = window.document.location.host;
    let defaultLanguageExpectedValue = CMSConstants.DEFAULTLANGUAGE;
    let copyrightYearExpectedValue = CMSConstants.COPYRIGHTYEAR;

    serverURLExpectedValue = `${window.document.location.protocol}//${window.document.location.host}/cms-rest/v1`;

    beforeEach(async () =>
        TestBed.configureTestingModule({
            providers: [
                AppConfig
            ]
        }));

    beforeEach(() => {
        appConfig = new AppConfig();
        spyOnConsole = spyOn(console, "log").and.returnValue(null);
    });

    it("should be defined", () => {
        expect(appConfig).toBeDefined();
    });

    it("should return Server Url and Host", () => {
        expect(appConfig.ServerURL).toBe(serverURLExpectedValue);
        expect(appConfig.Host).toBe(hostExpectedValue);
        expect(appConfig.DefaultLanguage).toBe(defaultLanguageExpectedValue);
        expect(appConfig.CopyrightYear).toBe(copyrightYearExpectedValue);

    });

    it("should not execute console log for the function log when args are null", () => {
        appConfig.log(...[]);
        expect(spyOnConsole).toHaveBeenCalledTimes(0);
    });

    it("should not execute console log for the function warn when args are null", () => {
        appConfig.warn(...[]);
        expect(spyOnConsole).toHaveBeenCalledTimes(0);
    });

    it("should not execute console log for the function error when args are null", () => {
        appConfig.error(...[]);
        expect(spyOnConsole).toHaveBeenCalledTimes(0);
    });

    it("should execute console log for the function log when args are not null", () => {
        let today = new Date();
        let dateTime = today.toLocaleString();
        let args = ["Some log message."];
        appConfig.log(...args);
        expect(spyOnConsole).toHaveBeenCalledWith(dateTime, " - info ", args);
    });

    it("should execute console log for the function warn when args are not null", () => {
        let today = new Date();
        let dateTime = today.toLocaleString();
        let args = ["Some warning message."];
        appConfig.warn(...args);
        expect(spyOnConsole).toHaveBeenCalledWith(dateTime, " - warn ", args);
    });

    it("should execute console log for the function error when args are not null", () => {
        let today = new Date();
        let dateTime = today.toLocaleString();
        let args = ["Some error message."];
        appConfig.error(...args);
        expect(spyOnConsole).toHaveBeenCalledWith(dateTime, " - error ", args);
    });

});
