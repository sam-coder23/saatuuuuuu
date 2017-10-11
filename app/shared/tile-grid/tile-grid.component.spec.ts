
import { TileGridComponent } from "./tile-grid.component";
import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";
import { TilePresets } from "./tile-grid.mock";
import { Tile } from "../../cms/models/cms-tile";

describe("TileGridComponent", () => {

    let component: TileGridComponent;
    let fixture: ComponentFixture<TileGridComponent>;
    let debugInstance, nativeElement;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TileGridComponent]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(TileGridComponent);
            component = fixture.componentInstance;
            nativeElement = fixture.nativeElement;
            debugInstance = fixture.debugElement.componentInstance;
        });
    }));

    it("component should be a defined", () => {
        expect(component).toBeDefined();
        expect(component.border).toEqual(2);
    });


    it("display base styles should be correct", () => {
        let displayBaseSelector = ".cms-tile-preset";
        let displayBaseElement: DebugElement = fixture.debugElement.query(By.css(displayBaseSelector));

        expect(displayBaseElement).toBeNull();

        component.displayBase = {
            height: 200,
            width: 400
        };

        component.tilePreset = TilePresets[0];

        fixture.detectChanges();

        displayBaseElement = fixture.debugElement.query(By.css(displayBaseSelector));

        expect(displayBaseElement).not.toBeNull();

        expect(displayBaseElement.styles.height).toEqual(`${component.displayBase.height}px`);
        expect(displayBaseElement.styles.width).toEqual(`${component.displayBase.width}px`);
    });


    it("expect tileStyles to return correct values in px", () => {
        component.displayBase = {
            height: 200,
            width: 400
        };

        component.tilePreset = TilePresets[1];

        let input = new Tile(component.tilePreset.tiles[0]);
        let output = { left: "0px", top: "0px", width: "198px", height: "98px" };
        let tileStyle = component.tileStyle(input);

        Object.keys(tileStyle).forEach(key => {
            expect(tileStyle[key]).toEqual(output[key]);
        });
    });


    it("should render tiles correctly", () => {
        let tileRectSelector = ".cms-tile-rectangle";

        let expectedStyles = [
            { left: "0px", top: "0px", width: "198px", height: "198px" },
            { left: "200px", top: "0px", width: "198px", height: "198px" },
            { left: "0px", top: "100px", width: "198px", height: "198px" },
            { left: "200px", top: "100px", width: "198px", height: "198px" }
        ]
        component.displayBase = {
            height: 200,
            width: 400
        };

        component.tilePreset = TilePresets[0];

        fixture.detectChanges();

        let tileRects = fixture.debugElement.queryAll(By.css(tileRectSelector));

        expect(tileRects.length).toEqual(component.tilePreset.tiles.length);

        tileRects.forEach((tileRect, index) => {
            expect(tileRect.styles.height).toEqual(expectedStyles[index].height);
            expect(tileRect.styles.width).toEqual(expectedStyles[index].width);
            expect(tileRect.styles.left).toEqual(expectedStyles[index].left);
            expect(tileRect.styles.top).toEqual(expectedStyles[index].top);
        });
    });

});