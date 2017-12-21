/**
 * This service is used to handle favorite information for various objects
 * (Display, Layout, Source, Perspective, Application).
 */
import { Injectable } from "@angular/core";
import { CmsApiService } from "../cms/api/cms-api.service";
import { AppConfig } from "../config";
import { Validation } from "../core/util/Validation";

@Injectable()
/**
 * This class contains the behaviour of the CmsFavoriteService and methods that writes to API
 * whenever object is marked to favorite or not.
 * @class CmsFavoriteService
 * @property {boolean} refreshSnapshot hold refresh state for updating snapshot
 * @constructor initializes the services used inside the class and sets the regreshSnapshot to
 * true.
 */
export class CmsFavoriteService {
    public refreshSnapshot: boolean;
    constructor(
        private cmsServerApi: CmsApiService,
        private appConfig: AppConfig
    ) {
        this.refreshSnapshot = true;
    }

    /**
     * This methods calls CMS Server API for to mark an object as favorite. It also updates
     * the object in its respective array so that ngOnChanges is triggered in CMSCard
     * component and updates the icon for favorite.
     * @method markObjectAsFavorite
     * @param {number} objectId, Id of the object in [Display, Source] etc.
     * @param {string} objectType, Object Type [Source Perspective, DisplayWall] etc.
     * @param {any[]} objectArray
     * @return {void}
     */
    public markObjectAsFavorite(objectId: number, objectType: string, objectArray: any[]): void {
        const objectTypePrefix: string = this.getObjectTypePrefix(objectType);
        if (objectTypePrefix === "") {
            this.appConfig.log("CmsFavoriteService: Unable to find a valid prefix to call favorite API.");

            return;
        }
        this.cmsServerApi.markAsFavorite(objectId, objectTypePrefix)
            .then((response: any) => {
                this.appConfig.log(`CmsFavoriteService:: Object [id:${objectTypePrefix}_${objectId}]
                marked as favorite.`);
                // iterating object array to find object for which API was triggered
                for (let index: number = 0; index < objectArray.length; index++) {
                    // match object id
                    if (objectArray[index].id === objectId) {
                        // match object type
                        if (!Validation.IsUndefined(objectArray[index].type) &&
                            objectArray[index].type !== objectType) {
                            continue;
                        }
                        // create a clone of existing object (this is copy by value not by reference)
                        const newObject: any = Object.assign({}, objectArray[index]);
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
            .catch((error: any) => {
                this.appConfig.log(`CmsFavoriteService:: Favorite API Failed. Unable to mark Object
                [id:${objectTypePrefix}_${objectId}] as favorite. Error: ${error}`);
            });
    }

    /**
     * This methods calls CMS Server API for to mark an object as unfavorite. It also updates the
     * object in its respective array so that ngOnChanges is triggered in CMSCard component and
     * updates the icon for unfavorite.
     * @method markObjectAsUnfavorite
     * @param {number} objectId, Id of the object in [Display, Source] etc.
     * @param {string} objectType, Object Type [Source Perspective, DisplayWall] etc.
     * @param {any[]} objectArray
     * @param {boolean} favorite optional, indicates the favorite flag value.
     * @return {void}
     */
    public markObjectAsUnfavorite(objectId: number, objectType: string, objectArray: any[],
                                  favoriteFilter?: boolean): void {
        const objectTypePrefix: string = this.getObjectTypePrefix(objectType);
        if (objectTypePrefix === "") {
            this.appConfig.log("CmsFavoriteService: Unable to find a valid prefix to call unfavorite API.");

            return;
        }
        this.cmsServerApi.markAsUnfavorite(objectId, objectTypePrefix)
            .then((response: any) => {
                this.appConfig.log(`CmsFavoriteService:: Object [id:${objectTypePrefix}_${objectId}]
                 marked as unfavorite.`);
                // iterating object array to find object for which API was triggered
                for (let index: number = 0; index < objectArray.length; index++) {
                    // match object id
                    if (objectArray[index].id === objectId) {
                        /**
                         * If favorite filter is active then application will remove
                         * that source card from the list
                         */
                        if (favoriteFilter) {
                            const objIndex: number = objectArray.indexOf(objectArray[index]);
                            objectArray.splice(objIndex, 1);
                        } else {
                            // match object type
                            if (!Validation.IsUndefined(objectArray[index].type) &&
                                objectArray[index].type !== objectType) {
                                continue;
                            }
                            // create a clone of existing object (this is copy by value not by reference)
                            const newObject: any = Object.assign({}, objectArray[index]);
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
            .catch((error: any) => {
                this.appConfig.log(`CmsFavoriteService:: Unfavorite API Failed. Unable to mark Object
                [id:${objectTypePrefix}_${objectId}] as unfavorite. Error: ${error}`);
            });
    }

    /**
     * This method returns the object type to be used for marking source/perspective/application/layout/display
     * as favorite/unfavorite.
     * @method getObjectTypePrefix
     * @param {string} objectType: string, [Source, Display, Perspective, Application, Layout, DisplayWall]
     * @return {string} prefix [SRC, PER] etc.
     */
    private getObjectTypePrefix(objectType: string): string {
        let prefix: string = "";

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
