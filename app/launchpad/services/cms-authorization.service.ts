// /**
//  * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
//  * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
//  * the terms of the license agreement you entered into with Barco.
//  */

// import { Injectable } from "@angular/core";
// import { Observable } from "rxjs/Observable";

// import { CmsApiService } from "../../cms/api/cms-api.service";
// import { CMS_SESSION_STORAGE_ITEM } from "../../cms/models/cms-session-storage-item";
// import { StorageManager } from "../../cms/api/cms-storagemanager.service";
// import { UserConfig, User } from "../models/cms-user.model";
// import { APIResponse } from "../models/api-response.model"

// /**
//  * This service is used to authenticate user login and stores/removes user token on login/logout respectively.
//  * @class CmsAuthorizationService
//  * @constructor constructor This will inject CmsApiService and StorageManager
//  */
// @Injectable()
// export class CmsAuthorizationService {

//     // Holds the instance of current loggedin user
//     private loggedInUser: User;

//     constructor(private cmsServerApi: CmsApiService, private storageManager: StorageManager) { }

//     /**
//      * This service method is responsible for using CmsServerApi to send user authentication information.
//      * On success, the user will be stored in Session Storage.
//      * @method login
//      * @param {User}
//      * @return {Promise<APIResponse>}
//      */
//     login(user:User): Promise<APIResponse> {
//         let apiResponse: APIResponse;

//         return this.cmsServerApi.login(user)
//             .then((response) => {
//                 this.loggedInUser = user; 
//                 console.log("Login API Response", response);
//                 user.LoggedIn = true;
//                 this.storageManager.set(CMS_SESSION_STORAGE_ITEM.User, JSON.stringify(user.asSerializable()));
//                 apiResponse = new APIResponse(true, "", response);
//                 return apiResponse;

//             }).catch((error: { Message: string }) => {
//                 this.loggedInUser = null;
//                 console.log("AuthService: Login API failed. Message: " + error);
//                 apiResponse = new APIResponse(false, error.Message, {});
//                 return Promise.reject(apiResponse);
//             });
//     }

//     /**
//      * This method calls CMS Server API to perform user logout operation.
//      * On success, the user info stored in session storage is cleaned up.
//      * @method logout
//      * @return {Promise<APIResponse>} 
//      */
//     logout(): Promise<APIResponse> {
//         let apiResponse: APIResponse;
//         return this.cmsServerApi.logout()
//             .then((response) => {
//                 this.storageManager.remove(CMS_SESSION_STORAGE_ITEM.User);
//                  apiResponse = new APIResponse(true, "", response);
//                  //window.sessionStorage.removeItem(CMS_SESSION_STORAGE_ITEM.User);
//                 return apiResponse;

//             }).catch((error: { Message: string }) => {
//                 console.log("AuthService: Logout API failed. Message: " + error.Message);
//                 apiResponse = new APIResponse(false, error.Message, {});
//                 return Promise.reject(apiResponse);
//             });
//     }

//     /**
//      * This method checks if the current user is logged in from the user info stored in session storage.
//      * @method isUserLoggedIn
//      * @return {Boolean} 
//      */
//     isUserLoggedIn(): boolean {
//         return this.LoggedInUser && this.LoggedInUser.LoggedIn;
//     }

//     /**
//      * This method returns the logged in user info.
//      * @property currentUser
//      * @return  {String}
//      */
//     public get LoggedInUserName() : string {
//         return this.loggedInUser.Username;
//     }

//     /**
//      * This method returns the logged in user info.
//      * @property LoggedInUser
//      * @return  {User}
//      */
//     public get LoggedInUser() : User {
//         return this.loggedInUser;
//     }    
// }