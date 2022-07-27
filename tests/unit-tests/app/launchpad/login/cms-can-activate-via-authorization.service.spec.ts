/**
 * This class is responsible to handle unit test case of CmsCanActivateViaAuthorizationService
 */
import { inject, TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot  } from "@angular/router";
import { CmsCanActivateViaAuthorizationService } from "../../../../app/launchpad/login/cms-can-activate-via-authorization.service";

import { StorageManager } from "../../../../app/cms/api/cms-storagemanager.service";
import { CmsSessionStorageItem } from "../../../../app/cms/models/cms-session-storage-item";

describe("CmsCanActivateViaAuthorizationService should", () => {
    let cmsCanActivateViaAuthorizationService: CmsCanActivateViaAuthorizationService;
    // tslint:disable-next-line:prefer-const
    let next: ActivatedRouteSnapshot;
    // tslint:disable-next-line:prefer-const
    let state: RouterStateSnapshot;
    let storageManager: StorageManager;
    let router: any;
    const user : any = {
        loggedIn: true
    };

    beforeEach(async () => {
        router = {
            navigate: jasmine.createSpy("login")
        };
        TestBed.configureTestingModule({
            providers: [
                StorageManager,
                {
                    provide: Router,
                    useValue: router
                }
            ]
        });
    });

    beforeEach(inject([Router, StorageManager], (routerService: Router, sm: StorageManager) => {
        storageManager = sm;
        cmsCanActivateViaAuthorizationService = new CmsCanActivateViaAuthorizationService(routerService, storageManager);
    }));

    it("be defined", () => {
        expect(cmsCanActivateViaAuthorizationService).toBeDefined();
    });

    it("not be be able to hit route when user is not logged in", () => {
        storageManager.setItem(CmsSessionStorageItem.USER, "{}");
        cmsCanActivateViaAuthorizationService.canActivate(next, state);
        expect(router.navigate).toHaveBeenCalledWith(["/login"]);
    });

    it("be able to hit route when user is logged in", () => {
        storageManager.setItem(CmsSessionStorageItem.USER, JSON.stringify(user));
        expect(cmsCanActivateViaAuthorizationService.canActivate(next, state)).toBe(true);
    });

});
