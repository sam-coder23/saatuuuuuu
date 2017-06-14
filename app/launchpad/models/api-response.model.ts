export 
/**
 * Role of this class is handle to user related stuff
 * @class APIResponse
 * @constructor
 * @property {boolean} status To contain API status
 * @property {string} errorMessage To contain error
 * @property {any} response For API Response
 */
class APIResponse {
    private status: boolean;
    private errorMessage: string;
    private response: any;
    
    constructor(status: boolean, errorMessage: string, response?: any) {
        this.status = status;
        this.errorMessage = errorMessage;
        this.response = response;
    }

    /**
     * @method getter method Status: This method will keep the status of 
     * API status 
     */
    public get Status() {
        return this.status;
    }
    
    /**
     * @method ErrorMessage
     * This method is reponsible to get the ErrorMessage 
     */
    public get ErrorMessage() {
        return this.errorMessage;
    }

    /**
     * @method Response
     * This method is reponsible to get the Response
     */
    public get Response() {
        return this.response;
    }

    /**
     * @method getSerializable
     */
    public asSerializable() {
        return {
        }
    }

    /**
     * @method toJSON
     * */    
     public toJSON() : any {
        return {
        }
    }
}