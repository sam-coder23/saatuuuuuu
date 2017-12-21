/**
 * Role of this class is handle to user related stuff
 * @class APIResponse
 * @constructor
 * @property {boolean} status To contain API status
 * @property {string} errorMessage To contain error
 * @property {any} response For API Response
 */
export class APIResponse {
    private status: boolean;
    private errorMessage: string;
    private response: any;

    constructor(status: boolean, errorMessage: string, response?: any) {
        this.status = status;
        this.errorMessage = errorMessage;
        this.response = response;
    }

    /**
     * This method will keep the status of API status
     * @method Status
     * @return boolean
     */
    public get Status(): boolean {
        return this.status;
    }

    /**
     * This method is reponsible to get the ErrorMessage
     * @method ErrorMessage
     * @return strin
     */
    public get ErrorMessage(): string {
        return this.errorMessage;
    }

    /**
     * @method Response
     * This method is reponsible to get the Response
     * @return any
     */
    public get Response(): any{
        return this.response;
    }

    /**
     * @method getSerializable
     * @return object
     */
    public asSerializable(): {} {
        return {};
    }

    /**
     * @method toJSON
     * @return object
     */
     public toJSON() : any {
        return {};
    }
}
