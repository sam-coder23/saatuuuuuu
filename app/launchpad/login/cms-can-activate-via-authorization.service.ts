
/**
 * This service is used to restrict user to load a route that requires authentication.
 * If not authenticated, the router will navigate to /login route.
 */
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { CmsSessionStorageItem } from "../../cms/models/cms-session-storage-item";
import { User } from "../../cms/models/cms-user.model";

@Injectable()
export class CmsCanActivateViaAuthorizationService implements CanActivate {
    constructor(private router: Router, private storageManager: StorageManager) { }

    /**
     * This method authenticated user, if not the router will navigate to /login route
     * @method canActivate
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     */
    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const user: User = JSON.parse(this.storageManager.getItem(CmsSessionStorageItem.USER));
        if (user && user.loggedIn) {
            return true;
        }
        // route to login page
        this.router.navigate(["/login"]);
    }
}
