import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { TestBed, inject } from "@angular/core/testing";
import { CmsCanActivateViaAuthorizationService } from "../../../../app/launchpad/login/cms-can-activate-via-authorization.service";
import { StorageManager } from "../../../../app/cms/api/cms-storagemanager.service";
import { CMS_SESSION_STORAGE_ITEM } from "../../../../app/cms/models/cms-session-storage-item";

describe("CmsCanActivateViaAuthorizationService should", () => {
    let cmsCanActivateViaAuthorizationService: CmsCanActivateViaAuthorizationService;
    let next: ActivatedRouteSnapshot;
    let state: RouterStateSnapshot;
    let storageManager: StorageManager;
    let router = {
        navigate: jasmine.createSpy("login")
    };
    let user = {
        "loggedIn": true
    };

    beforeEach(async () =>
        TestBed.configureTestingModule({
            providers: [
                StorageManager,
                {
                    provide: Router,
                    useValue: router
                }
            ]
        }));

    beforeEach(inject([Router, StorageManager], (router, sm) => {
        storageManager = sm;
        cmsCanActivateViaAuthorizationService = new CmsCanActivateViaAuthorizationService(router, storageManager);
    }));

    it("be defined", () => {
        expect(cmsCanActivateViaAuthorizationService).toBeDefined();
    });

    it("not be be able to hit route when user is not logged in", () => {
        storageManager.set(CMS_SESSION_STORAGE_ITEM.USER, "{}");
        cmsCanActivateViaAuthorizationService.canActivate(next, state);
        expect(router.navigate).toHaveBeenCalledWith(["/login"]);
    });

    it("be able to hit route when user is logged in", () => {
        storageManager.set(CMS_SESSION_STORAGE_ITEM.USER, JSON.stringify(user));
        expect(cmsCanActivateViaAuthorizationService.canActivate(next, state)).toBe(true);
    });
    
});
