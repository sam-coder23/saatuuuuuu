/**
 * Test Specification for CMS Card component.
 */
import { DebugElement, NO_ERRORS_SCHEMA, SimpleChange } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { Http, HttpModule } from "@angular/http";
import { MaterialModule } from "@angular/material";
import { By } from "@angular/platform-browser";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { Display } from "../../../../app/cms/models/cms-display";
import { CmsResource } from "../../../../app/cms/models/cms-resource";
import { AppConfig } from "../../../../app/config";
import { CmsCardComponent } from "../../../../app/shared/card/cms-card.component";
import { CmsFavoriteService } from "../../../../app/shared/cms-favorite.service";

// tslint:disable:max-classes-per-file
const mockDisplay: Display = {
    id: 2,
    name: "Crisis room wall",
    type: "DisplayWall",
    description: "",
    snapshotPath: "display_snapshot.jpg?t=1",
    resolution: {
        width: 1920,
        height: 1080
    },
    online: true,
    content: [],
    width: 1920,
    height: 1080,
    disabled: false,
    favorite: true,
    tilerId: 53,
    tiles: []
};

class MockAppConfig {
    public log(): any {
        return undefined;
     }
}

class MockCmsFavoriteService {
    public refreshSnapshot: boolean = true;
}

describe("CmsCardComponent", () => {
    let component: CmsCardComponent;
    let fixture: ComponentFixture<CmsCardComponent>;
    let debugInstance: any;
    let nativeElement: HTMLElement;
    let appConfig: AppConfig;
    let favoriteService: CmsFavoriteService;
    let component2: CmsCardComponent;
    let fixture2: ComponentFixture<CmsCardComponent>;
    let debugInstance2: any;
    let regEx: any;
    let localHostRegEx: any;
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
                        useFactory: (http: Http): TranslateHttpLoader => new TranslateHttpLoader(http, "/base/app/i18n/", ".json"),
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
            regEx = /&_=\d{10,14}/g;
            localHostRegEx = /localhost:3000/g;
        });
    }));

    beforeEach(() => {
        component.card = new CmsResource(mockDisplay);
        component.multi = false;
    });

    it("should define CMS-Card", () => {
        expect(component).toBeDefined();

        fixture.detectChanges();
        const cmsCard: DebugElement = fixture.debugElement.query(By.css(".card"));
        expect(cmsCard).toBeDefined();
    });

    it("Should emit event on cms card selection", () => {
        const card1: any = fixture.nativeElement.querySelector(".card");
        spyOn(component.selectedEventEmitter, "emit");
        card1.click();

        fixture.detectChanges();
        expect(component.selectedEventEmitter.emit).toHaveBeenCalled();
    });

    it("Should emit event on cms card favorite mark", () => {
        const card1: any = fixture.nativeElement.querySelector("#card-favorite");
        spyOn(component.favoriteEventEmitter, "emit");
        card1.click();

        fixture.detectChanges();
        expect(component.favoriteEventEmitter.emit).toHaveBeenCalled();
    });

    it("Should append date in snpashot path if refreshSnapshot is true", () => {
        fixture.detectChanges();
        const isTimeStamped: any = regEx.test(debugInstance.cardSnapshot);
        expect(isTimeStamped).toBeTruthy();
    });

    it("Should not append date in snpashot path if refreshSnapshot is false", () => {
        // set "refreshSnapshot" to fovorite service
        favoriteService.refreshSnapshot = false;
        // create card component with updated favoriteService
        fixture2 = TestBed.createComponent(CmsCardComponent);
        component2 = fixture2.componentInstance;
        debugInstance2 = fixture2.debugElement.componentInstance;
        component2.card = new CmsResource(mockDisplay);
        component2.multi = false;
        fixture2.detectChanges();
        fixture2.whenStable().then(() => {
            const isTimeStamped: any = regEx.test(debugInstance2.cardSnapshot);
            expect(isTimeStamped).toBeFalsy();
        });
    });

    it("Should not convert IPToHost when snapshot path has not an IP addresss", () => {
        const snapshotPath: string = "localhost:3000/display_snapshot.jpg";
        mockDisplay.snapshotPath = snapshotPath;
        component2.card = new CmsResource(mockDisplay);
        component2.ngOnInit();

        expect(localHostRegEx.test(debugInstance2.cardSnapshot)).toBeTruthy();

    });

    it("Should be set refreshsnapshot and isFavorite on ngOnChanges event", () => {
        component2.card.favorite = true;
        component2.ngOnChanges({
            favorite: new SimpleChange(undefined, component2.card.favorite)
        });
        expect(debugInstance2.favoriteService.refreshSnapshot).toBeTruthy();
        expect(debugInstance2.isFavorite).toBeTruthy();
    });

    it("Should not emit event for disabled card", () => {
        component2.card.disabled = true;
        const card2: any = fixture2.nativeElement.querySelector(".card");
        spyOn(component2.selectedEventEmitter, "emit");
        debugInstance2.selectCard(component2.card);
        expect(component2.selectedEventEmitter.emit).not.toHaveBeenCalled();
    });
});
