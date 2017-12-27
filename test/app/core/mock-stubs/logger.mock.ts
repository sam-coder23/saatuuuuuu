/**
 * Defines a mock logger for mocking in unit testing
 */

export class MockLogger {
    constructor() {}

    /**
     * returns logged arguments
     * @param args 
     */
    public log(...args: any[]): any[] {
        return args;
    }


    /**
     * returns logged arguments
     * @param args 
     */
    public error(...args: any[]): any[] {
        return this.log(args);
    }
}