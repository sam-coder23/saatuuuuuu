/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";

import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { CMS_SESSION_STORAGE_ITEM } from "../../cms/models/cms-session-storage-item";


/** 
 * This service is used to restrict user to load a route that requires authentication.
 * If not authenticated, the router will navigate to /login route.
 * 
 * @Usage:
 * 
 * routes: Routes = [
 * ...
 * { path: "dashboard", component: DashboardComponent, canActivate: [CanActivateViaAuthGuard] },
 * ...
 * ];
 */
@Injectable()
export class CmsCanActivateViaAuthorizationService implements CanActivate {
    /**
     * The constructor initializes various dependencies.
     */
    constructor(private router: Router, private storageManager: StorageManager) { }

    /**
     * This method checks if user is logged in or not. If not logged in, the user is redirected to login page. 
     */
    canActivate(aRoute: ActivatedRouteSnapshot, aState: RouterStateSnapshot) {
        let user = JSON.parse(this.storageManager.get(CMS_SESSION_STORAGE_ITEM.USER));
        if (user && user.loggedIn) {
            return true;
        }
        // route to login page
        this.router.navigate(["/login"]);
    }
}