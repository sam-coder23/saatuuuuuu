import { ComponentFixture, TestBed, async, inject } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { NO_ERRORS_SCHEMA, DebugElement, SimpleChange } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { HttpModule, Http } from "@angular/http";
import { MaterialModule } from "@angular/material";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { CmsCardComponent } from "../../../../app/shared/card/cms-card.component";
import { AppConfig } from "../../../../app/config";
import { CmsFavoriteService } from "../../../../app/shared/cms-favorite.service";
import { CmsResource } from "../../../../app/cms/models/cms-resource";

let MockDisplay = {
    "id": 2,
    "name": "Crisis room wall",
    "type": "DisplayWall",
    "description": "",
    "snapshotPath": "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fdisplays%2F1.jpeg",
    "resolution": {
        "width": 1920,
        "height": 1080
    },
    "online": true,
    "acknowledged": true,
    "computerName": "NOICLT28523",
    "tags": "",
    "startUpAction": "RestoreLastKnownConfiguration",
    "favorite": true,
    "loggedInUserName": "BARCO\\BCD-SE-test",
    "autoloadLayout": 0,
    "windowOption": "NoTitleBarAndNoResizableBorder",
    "vdsDisplay": false,
    "defaultAreaEnabled": false,
    "defaultArea": {
        "left": 0,
        "top": 0,
        "width": 0,
        "height": 0
    },
    "isDecoderDisplay": false,
    "sourceRoutingRequired": false,
    "tilerId": 53,
    "tiles": [],
    "modules": []
};

class MockAppConfig {
    log() { }
};

class MockCmsFavoriteService {
    refreshSnapshot = true;
};

describe("CmsCardComponent", () => {
    let component: CmsCardComponent;
    let fixture: ComponentFixture<CmsCardComponent>;
    let debugInstance, nativeElement, appConfig, favoriteService;

    let component2: CmsCardComponent;
    let fixture2: ComponentFixture<CmsCardComponent>;
    let debugInstance2;
    let regEx = /&_=\d{10,14}/g;
    let localHostRegEx = /localhost:3000/g;
    let card;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CmsCardComponent],
            providers: [
                {
                    provide: AppConfig,
                    useClass: MockAppConfig
                },
                {
                    provide: CmsFavoriteService,
                    useClass: MockCmsFavoriteService
                }
            ],
            imports: [
                FormsModule,
                HttpModule, MaterialModule.forRoot(),
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: (http: Http) => new TranslateHttpLoader(http, "/base/app/i18n/", ".json"),
                        deps: [Http]
                    }
                })
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(CmsCardComponent);
            component = fixture.componentInstance;
            nativeElement = fixture.nativeElement;
            debugInstance = fixture.debugElement.componentInstance;

            appConfig = fixture.debugElement.injector.get(AppConfig);
            favoriteService = fixture.debugElement.injector.get(CmsFavoriteService);
        });
    }));

    beforeEach(() => {
        component.card = new CmsResource(MockDisplay);
        component.multi = false;
    });

    it("should define CMS-Card", () => {
        expect(component).toBeDefined();

        fixture.detectChanges();
        let card: DebugElement = fixture.debugElement.query(By.css(".card"));
        expect(card).toBeDefined();
    });

    it("Should emit event on cms card selection", () => {
        let card = fixture.nativeElement.querySelector(".card");
        spyOn(component.selectedEventEmitter, "emit");
        card.click();

        fixture.detectChanges();
        expect(component.selectedEventEmitter.emit).toHaveBeenCalled();
    });

    it("Should emit event on cms card favorite mark", () => {
        let card = fixture.nativeElement.querySelector("#card-favorite");
        spyOn(component.favoriteEventEmitter, "emit");
        card.click();

        fixture.detectChanges();
        expect(component.favoriteEventEmitter.emit).toHaveBeenCalled();
    });

    it("Should append date in snpashot path if 'refreshSnapshot' is true", () => {
        fixture.detectChanges();
        let isTimeStamped = regEx.test(debugInstance.cardSnapshot);
        expect(isTimeStamped).toBeTruthy();
    });

    it("Should not append date in snpashot path if 'refreshSnapshot' is false", () => {
        // set 'refreshSnapshot' to fovorite service
        favoriteService.refreshSnapshot = false;

        // create card component with updated favoriteService 
        fixture2 = TestBed.createComponent(CmsCardComponent);
        component2 = fixture2.componentInstance;
        debugInstance2 = fixture2.debugElement.componentInstance;

        component2.card = new CmsResource(MockDisplay);
        component2.multi = false;

        fixture2.detectChanges();
        fixture2.whenStable().then(() => {
            let isTimeStamped = regEx.test(debugInstance2.cardSnapshot);
            expect(isTimeStamped).toBeFalsy();
        });
    });

    it("Should not convert IPToHost when snapshot path has not an IP addresss", () => {
        let snapshotPath = "localhost:3000//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fdisplays%2F1.jpeg";

        MockDisplay.snapshotPath = snapshotPath;
        component2.card = new CmsResource(MockDisplay);
        component2.ngOnInit();

        expect(localHostRegEx.test(debugInstance2.cardSnapshot)).toBeTruthy();

    });

    it("Should be set refreshsnapshot and isFavorite on ngOnChanges event", () => {
        component2.card.favorite = true;

        component2.ngOnChanges({
            favorite: new SimpleChange(null, component2.card.favorite)
        });

        expect(debugInstance2.favoriteService.refreshSnapshot).toBeTruthy();
        expect(debugInstance2.isFavorite).toBeTruthy();
    });

    it("Should not emit event for disabled card", () => {
        component2.card.disabled = true;

        let card = fixture2.nativeElement.querySelector(".card");
        spyOn(component2.selectedEventEmitter, "emit");
        debugInstance2.selectCard(component2.card);

        expect(component2.selectedEventEmitter.emit).not.toHaveBeenCalled();
    });
});