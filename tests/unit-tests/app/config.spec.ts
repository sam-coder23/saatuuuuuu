/**
 * Test specification for AppConfig service.
 */
import { CMSConstants } from "../../app/cms/models/cms-constants";
import { AppConfig } from "../../app/config";

describe("Service: App Config", () => {
    let appConfig: AppConfig;
    let spyOnConsole: jasmine.Spy;
    let serverURLExpectedValue: string = "";
    const hostExpectedValue: string = window.document.location.host;
    const defaultLanguageExpectedValue: string = CMSConstants.DEFAULTLANGUAGE;
    const copyrightYearExpectedValue: string = CMSConstants.COPYRIGHTYEAR;

    serverURLExpectedValue = `${window.document.location.protocol}//${window.document.location.host}/cms-rest/v1`;

    beforeEach(() => {
        appConfig = new AppConfig();
        spyOnConsole = spyOn(console, "log").and.returnValue(undefined);
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
        const today: Date = new Date();
        const dateTime: string = today.toLocaleString();
        const args: string[] = ["Some log message."];
        appConfig.log(...args);
        expect(spyOnConsole).toHaveBeenCalledWith(dateTime, " - info ", args);
    });

    it("should execute console log for the function warn when args are not null", () => {
        const today: Date = new Date();
        const dateTime: string = today.toLocaleString();
        const args: string[] = ["Some warning message."];
        appConfig.warn(...args);
        expect(spyOnConsole).toHaveBeenCalledWith(dateTime, " - warn ", args);
    });

    it("should execute console log for the function error when args are not null", () => {
        const today: Date = new Date();
        const dateTime: string = today.toLocaleString();
        const args: string[] = ["Some error message."];
        appConfig.error(...args);
        expect(spyOnConsole).toHaveBeenCalledWith(dateTime, " - error ", args);
    });

});
