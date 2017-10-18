import { CmsClipboardComponent } from "./cms-clipboard.component";
import { ComponentFixture, TestBed, async, inject } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { HttpModule, Http } from "@angular/http";
import { AppConfig } from "../../config";
import { CmsClipboardService } from "../../shared/clipboard/cms-clipboard.service";
import { CmsMiniDisplayService } from "../../shared/mini-display/cms-mini-display.service";
import { MaterialModule } from "@angular/material";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { CmsSettingsService } from "../../launchpad/settings/cms-settings.service";
import { StorageManager } from "../../cms/api/cms-storagemanager.service";
import { CmsApiService } from "../../cms/api/cms-api.service";
import { TranslateService, TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { APIRequest } from "../../cms/api/api-request";
import { IUserProfileSettings } from "../../cms/models/cms-user-profile-settings";
import { MockUserProfileSettings, MoclLicenseinfo } from "../../launchpad/login/login.mock";
import { CmsGridComponent } from "../mini-display/grid/cms-grid.component";
import { MockMiniDisplayTiler, MockDisplayTiler, MockMiniDisplayContents, MockDisplay } from "./clipboard.mock";

let router = {
  navigate: jasmine.createSpy("displays")
}

/**
 * Fake CmsApiService Service
 */
class MockCmsApiService {

    getUserProfileSettings(): Promise<IUserProfileSettings> {
        MockUserProfileSettings.manageWallContent.clipboard.isEnabled = true;
        return Promise.resolve(MockUserProfileSettings);
    }

    updateUserProfileSettings(): Promise<IUserProfileSettings> {
        return Promise.resolve(MockUserProfileSettings);
    }

    getSystemInfo(): Observable<any> {
        return Observable.of(MoclLicenseinfo);
    }

    unloadContentFromDisplay(displayId, contentId): Observable<any> {
        return Observable.of(null);
    }

    loadContentOnTile(displayId, tile, Clipboard): Promise<any> {
        return Promise.resolve(true);
    }
}

describe("CmsClipboardComponent", () => {

    let component: CmsClipboardComponent, componentGrid: CmsGridComponent;
    let fixture: ComponentFixture<CmsClipboardComponent>, fixtureGrid: ComponentFixture<CmsGridComponent>;
    let debugInstance, nativeElement, debugInstanceGrid, nativeElementGrid, 
        cmsClipboardService, cmsSettingsService, cmsMiniDisplayService, spyLoadContentOnTile;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CmsClipboardComponent, CmsGridComponent],
            providers: [
                {
                    provide: Router,
                    useValue: router,
                },
                CmsSettingsService,
                {
                    provide: CmsApiService,
                    useClass: MockCmsApiService
                },
                // CmsApiService,
                APIRequest,
                CmsClipboardService,
                CmsMiniDisplayService,
                TranslateService,
                StorageManager,
                AppConfig
            ],
            imports: [
                FormsModule,
                HttpModule, MaterialModule.forRoot(),
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: (http: Http) => new TranslateHttpLoader(http, "base/app/i18n/", ".json"),
                        deps: [Http]
                    }
                })
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(CmsClipboardComponent);
            component = fixture.componentInstance;
            nativeElement = fixture.nativeElement;
            debugInstance = fixture.debugElement.componentInstance;

            fixtureGrid = TestBed.createComponent(CmsGridComponent);
            componentGrid = fixtureGrid.componentInstance;
            nativeElementGrid = fixtureGrid.nativeElement;
            debugInstanceGrid = fixtureGrid.debugElement.componentInstance;
            cmsSettingsService = fixture.debugElement.injector.get(CmsSettingsService);
            cmsClipboardService = fixture.debugElement.injector.get(CmsClipboardService);
            cmsMiniDisplayService = fixture.debugElement.injector.get(CmsMiniDisplayService);
            let cmsApiService = fixture.debugElement.injector.get(CmsApiService);
            spyLoadContentOnTile = spyOn(cmsApiService, "loadContentOnTile").and.returnValue(Promise.resolve(true));
        });
    }));

    it("clipboard component should be a defined", () => {
        expect(component).toBeDefined();
        expect(debugInstance.reposition).toBeFalsy();
        expect(debugInstance.mouseOldX).toBe(0);
        expect(debugInstance.clipboardStatus).toBeNull();
        expect(debugInstance.source).toBeNull();
        expect(debugInstance.clipboardSnapshot).toBeNull();
    });

    it("grid component should be a defined", () => {
        expect(componentGrid).toBeDefined();
        expect(debugInstanceGrid.miniTiles).toBeNull();
        expect(debugInstanceGrid.tiles).toBeNull();
        expect(debugInstanceGrid.contents).toBeNull();
        expect(debugInstanceGrid.isLongPressed).toBeFalsy();
        expect(debugInstanceGrid.isClickDisabled).toBeFalsy();
        expect(debugInstanceGrid.isTileHighlightDisabled).toBeFalsy();
    });

    it("Check clipboard is enabled and clipboard display status", (done) => {
        cmsSettingsService.setUserProfileSettings();
        fixture.whenStable().then(() => {
            expect(cmsClipboardService.isClipboardEnabled()).toBeTruthy();
            expect(cmsClipboardService.clipboardDisplayStatus()).toBe("large");
            done();
        })
    });

    it("Init clipboard and grid component and load clipboard with large status", (done) => {
        componentGrid.miniTiles = MockMiniDisplayTiler;
        componentGrid.tiles = MockDisplayTiler;
        componentGrid.contents = MockMiniDisplayContents;
        cmsSettingsService.setUserProfileSettings();
        cmsMiniDisplayService.display = MockDisplay[0];
        fixture.whenStable().then(() => {
            fixtureGrid.detectChanges();
            expect(fixtureGrid.nativeElement.querySelectorAll(".contents .content").length).toBe(MockMiniDisplayContents.length);
            expect(fixtureGrid.nativeElement.querySelectorAll(".tiles .tile").length).toBe(MockMiniDisplayTiler.length);
            fixtureGrid.nativeElement.querySelector(".contents .content").click();
            fixture.whenStable().then(() => {
                component.loadClipboard();
                expect(component.source).toBeDefined();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    let clipboardPreview = fixture.nativeElement.querySelector("#clipboard-preview");
                    expect(clipboardPreview).toBeDefined();
                    let clipboardPreviewIcon = fixture.nativeElement.querySelector("#clipboard-clear-icon");
                    expect(clipboardPreviewIcon).toBeNull();
                    fixtureGrid.nativeElement.querySelector(".tiles .tile").click();
                    fixture.whenStable().then(() => {
                        let args = spyLoadContentOnTile.calls.mostRecent().args;
                        expect(args[0]).toEqual(cmsMiniDisplayService.display.id);
                        done();
                    });
                });
            });
        });
    });

    it("Check mouse event functionality", (done) => {
        componentGrid.miniTiles = MockMiniDisplayTiler;
        componentGrid.tiles = MockDisplayTiler;
        componentGrid.contents = MockMiniDisplayContents;
        cmsSettingsService.setUserProfileSettings();
        cmsMiniDisplayService.display = MockDisplay[0];
        fixture.whenStable().then(() => {
            fixtureGrid.detectChanges();
            fixtureGrid.nativeElement.querySelectorAll(".contents .content")[0].click();
            fixture.whenStable().then(() => {
                component.loadClipboard();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    let clipboardPreview = fixture.nativeElement.querySelector("#clipboard-preview");
                    clipboardPreview.dispatchEvent(new Event("mousedown"));
                    fixture.whenStable().then(() => {
                        expect(debugInstance.reposition).toBeTruthy();
                        clipboardPreview.dispatchEvent(new Event("mousemove"));
                        fixture.whenStable().then(() => {
                            clipboardPreview.dispatchEvent(new Event("mouseup"));
                            fixture.whenStable().then(() => {
                                expect(debugInstance.reposition).toBeFalsy();
                                clipboardPreview.dispatchEvent(new Event("mouseleave"));
                                fixture.whenStable().then(() => {
                                    expect(debugInstance.reposition).toBeFalsy();
                                    debugInstance.repositionClipboard(clipboardPreview, 0);
                                    fixture.whenStable().then(() => {
                                        done();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    it("Check reposition clipboard functionality", (done) => {
        componentGrid.miniTiles = MockMiniDisplayTiler;
        componentGrid.tiles = MockDisplayTiler;
        componentGrid.contents = MockMiniDisplayContents;
        cmsSettingsService.setUserProfileSettings();
        cmsMiniDisplayService.display = MockDisplay[0];
        fixture.whenStable().then(() => {
            fixtureGrid.detectChanges();
            fixtureGrid.nativeElement.querySelectorAll(".contents .content")[0].click();
            fixture.whenStable().then(() => {
                component.loadClipboard();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    let clipboardPreview = fixture.nativeElement.querySelector("#clipboard-preview");
                    cmsSettingsService.mUserSettings.language = "ar";
                    clipboardPreview.dispatchEvent(new Event("mousemove"));
                    fixture.whenStable().then(() => {
                        expect(clipboardPreview.style.left).toBe(fixture.nativeElement.querySelector("#clipboard-preview").style.left);
                        done();
                    });
                });
            });
        });
    });

    it("Load clipboard with icon status", (done) => {
        componentGrid.miniTiles = MockMiniDisplayTiler;
        componentGrid.tiles = MockDisplayTiler;
        componentGrid.contents = MockMiniDisplayContents;
        cmsSettingsService.setUserProfileSettings();
        cmsMiniDisplayService.display = MockDisplay[0];
        fixture.whenStable().then(() => {
            cmsSettingsService.mUserSettings.manageWallContent.clipboard.status = "icon";
            fixtureGrid.detectChanges();
            fixtureGrid.nativeElement.querySelectorAll(".contents .content")[0].click();
            fixture.whenStable().then(() => {
                component.loadClipboard();
                expect(component.source).toBeDefined();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    let clipboardPreviewIcon = fixture.nativeElement.querySelector("#clipboard-clear-icon");
                    expect(clipboardPreviewIcon).toBeDefined();
                    let clipboardPreview = fixture.nativeElement.querySelector("#clipboard-preview");
                    expect(clipboardPreview).toBeNull();
                    clipboardPreviewIcon.click();
                    expect(cmsClipboardService.Clipboard).toBeNull();
                    expect(cmsClipboardService.tile).toBeNull();
                    done();
                });
            });
        });
    });

    it("Init clipboard and grid component without mini tiles", (done) => {
        componentGrid.miniTiles = null;
        componentGrid.tiles = MockDisplayTiler;
        componentGrid.contents = MockMiniDisplayContents;
        cmsSettingsService.setUserProfileSettings();
        cmsMiniDisplayService.display = MockDisplay[0];
        fixture.whenStable().then(() => {
            fixtureGrid.detectChanges();
            expect(fixtureGrid.nativeElement.querySelectorAll(".contents .content").length).toBe(MockMiniDisplayContents.length);
            expect(fixtureGrid.nativeElement.querySelector(".tiles .tile")).toBeNull();
            done();
        });
    });

    it("Init clipboard and grid component without mini display contents", (done) => {
        componentGrid.miniTiles = MockMiniDisplayTiler;
        componentGrid.tiles = MockDisplayTiler;
        componentGrid.contents = null;
        cmsSettingsService.setUserProfileSettings();
        cmsMiniDisplayService.display = MockDisplay[0];
        fixture.whenStable().then(() => {
            fixtureGrid.detectChanges();
            expect(fixtureGrid.nativeElement.querySelector(".contents .content")).toBeNull();
            expect(fixtureGrid.nativeElement.querySelectorAll(".tiles .tile").length).toBe(MockMiniDisplayTiler.length);
            done();
        });
    });
});