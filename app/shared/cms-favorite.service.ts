/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { Injectable } from "@angular/core";

import { CmsApiService } from "../cms/api/cms-api.service";
import { AppConfig } from "../config";

/**
 * This service is used to handle favorite information for various objects (Display, Layout, Source, Perspective, Application).
 *   
 * @author: MOVI
 * @version: CMS 3.0
 */
@Injectable()
export class CmsFavoriteService {    
	
	public refreshSnapshot : boolean;	// hold refresh state for updating snapshot 

    constructor(private cmsServerApi: CmsApiService, private appConfig: AppConfig) { 
        this.refreshSnapshot = true;
    }

    /**
     * This methods calls CMS Server API for to mark an object as favorite. It also updates the object in its
     * respective array so that ngOnChanges is triggered in CMSCard component and updates the icon for favorite.
     */
    markObjectAsFavorite(objectId: number, objectType: string, objectArray) {
        let objectTypePrefix = this.getObjectTypePrefix(objectType);
        if (objectTypePrefix === "") {
            this.appConfig.log("CmsFavoriteService: Unable to find a valid prefix to call favorite API.");
            return;
        }

        this.cmsServerApi.markAsFavorite(objectId, objectTypePrefix)
            .then((response) => {
                this.appConfig.log(`CmsFavoriteService:: Object [id:${objectTypePrefix + "_" + objectId}] marked as favorite.`);

                // iterating object array to find object for which API was triggered
                for (let index = 0; index < objectArray.length; index++) {
                    // match object id
                    if (objectArray[index].id === objectId) {
                        // match object type
                        if (objectArray[index].type !== undefined && objectArray[index].type !== objectType) {
                            continue;
                        }

                        // create a clone of existing object (this is copy by value not by reference)
                        let newObject = Object.assign({}, objectArray[index]);

                        // update the favorite value in this new object
                        newObject.favorite = true;

                        this.refreshSnapshot = false;

                        // replacing the existing object with new object will trigger ngOnChange event
                        // to component which binds to this object as input (for example: cms-card in our case)
                        objectArray[index] = newObject;
                        break;
                    }
                }
            })
            .catch((error) => {
                this.appConfig.log(`CmsFavoriteService:: Favorite API Failed. Unable to mark Object [id:${objectTypePrefix + "_" + objectId}] as favorite. Error: ${error}`);
            });
    }

    /**
     * This methods calls CMS Server API for to mark an object as unfavorite. It also updates the object in its
     * respective array so that ngOnChanges is triggered in CMSCard component and updates the icon for unfavorite.
     */
    markObjectAsUnfavorite(objectId: number, objectType: string, objectArray, favoriteFilter?: boolean) {
        let objectTypePrefix = this.getObjectTypePrefix(objectType);
        if (objectTypePrefix === "") {
            this.appConfig.log("CmsFavoriteService: Unable to find a valid prefix to call unfavorite API.");
            return;
        }

        this.cmsServerApi.markAsUnfavorite(objectId, objectTypePrefix)
            .then((response) => {
                this.appConfig.log(`CmsFavoriteService:: Object [id:${objectTypePrefix + "_" + objectId}] marked as unfavorite.`);

                // iterating object array to find object for which API was triggered
                for (let index = 0; index < objectArray.length; index++) {
                    // match object id
                    if (objectArray[index].id === objectId) {
                        /**
                         * If favorite filter is active then application will remove
                         * that source card from the list
                         */
                        if (favoriteFilter) {
                            let objIndex = objectArray.indexOf(objectArray[index]);
                            objectArray.splice(objIndex, 1);
                        }
                        else {
                            // match object type
                            if (objectArray[index].type !== undefined && objectArray[index].type !== objectType) {
                                continue;
                            }

                            // create a clone of existing object (this is copy by value not by reference)
                            let newObject = Object.assign({}, objectArray[index]);
							
							this.refreshSnapshot = false;

                            // update the favorite value in this new object
                            newObject.favorite = false;
                            // replacing the existing object with new object will trigger ngOnChange event
                            // to component which binds to this object as input (for example: cms-card in our case)
                            objectArray[index] = newObject;
                        }
                        break;
                    }
                }
            })
            .catch((error) => {
                this.appConfig.log(`CmsFavoriteService:: Unfavorite API Failed. Unable to mark Object [id:${objectTypePrefix + "_" + objectId}] as unfavorite. Error: ${error}`);
            });
    }

    /**
     * This method returns the object type to be used for marking source/perspective/application/layout/display as favorite/unfavorite.
     * TBD: forced by REST API but we should get rid of in future
     */
    private getObjectTypePrefix(objectType: string): string {
        let prefix = "";

        switch (objectType) {
            case "source":
                prefix = "SRC";
                break;

            case "perspective":
                prefix = "PER";
                break;

            case "application":
                prefix = "APP";
                break;

            case "layout":
                prefix = "LAY";
                break;

            case "DisplayWall":
                prefix = "DIS";
                break;

            case "NGPWall":
                prefix = "DIS";
                break;

            default:
        }

        return prefix;
    }
}