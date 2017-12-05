import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { CMS_SESSION_STORAGE_ITEM } from "../../cms/models/cms-session-storage-item";

/** 
 * This service is used to restrict user to load a route that requires authentication.
 * If not authenticated, the router will navigate to /login route.
 */
@Injectable()
export class CmsCanActivateViaAuthorizationService implements CanActivate {
    constructor(private router: Router, private storageManager: StorageManager) { }

    /**
     * This method authenticated user, if not the router will navigate to /login route
     * @method canActivate
     * @param {ActivatedRouteSnapshot} route 
     * @param {RouterStateSnapshot} state 
     */
    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let user = JSON.parse(this.storageManager.get(CMS_SESSION_STORAGE_ITEM.USER));
        if (user && user.loggedIn) {
            return true;
        }
        // route to login page
        this.router.navigate(["/login"]);
    }
}