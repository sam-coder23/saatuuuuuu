/**
 * Test Specification for CMS Tile Grid component.
 */
import { DebugElement } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Tile } from "../../../../app/cms/models/cms-tile";
import { TileGridComponent } from "../../../../app/shared/tile-grid/tile-grid.component";
import { tilePresets } from "./../../core/mock-stubs/tile-grid.mock";

describe("TileGridComponent", () => {
    let component: TileGridComponent;
    let fixture: ComponentFixture<TileGridComponent>;
    let debugInstance: any;
    let nativeElement: HTMLElement;
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
        const defualtBorderValue: number = 2;
        expect(component).toBeDefined();
        expect(debugInstance.border).toEqual(defualtBorderValue);
    });

    it("display base styles should be correct", () => {
        const displayBaseSelector: string = ".cms-tile-preset";
        let displayBaseElement: DebugElement = fixture.debugElement.query(By.css(displayBaseSelector));

        expect(displayBaseElement).toBeNull();

        component.displayBase = {
            height: 200,
            width: 400
        };

        component.tilePreset = tilePresets[0];
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

        component.tilePreset = tilePresets[1];

        const input: Tile = new Tile(component.tilePreset.tiles[0]);
        const  output: any = { left: "0px", top: "0px", width: "198px", height: "98px" };
        const tileStyle: any = debugInstance.tileStyle(input);

        Object.keys(tileStyle).forEach( (key: any) => {
            expect(tileStyle[key]).toEqual(output[key]);
        });
    });

    it("should render tiles correctly", () => {
        const tileRectSelector: any = ".cms-tile-rectangle";
        const expectedStyles: any = [
            { left: "0px", top: "0px", width: "198px", height: "198px" },
            { left: "200px", top: "0px", width: "198px", height: "198px" },
            { left: "0px", top: "100px", width: "198px", height: "198px" },
            { left: "200px", top: "100px", width: "198px", height: "198px" }
        ];
        component.displayBase = {
            height: 200,
            width: 400
        };

        component.tilePreset = tilePresets[0];

        fixture.detectChanges();
        const tileRects: DebugElement[] = fixture.debugElement.queryAll(By.css(tileRectSelector));
        expect(tileRects.length).toEqual(component.tilePreset.tiles.length);
        tileRects.forEach((tileRect: any, index: number) => {
            expect(tileRect.styles.height).toEqual(expectedStyles[index].height);
            expect(tileRect.styles.width).toEqual(expectedStyles[index].width);
            expect(tileRect.styles.left).toEqual(expectedStyles[index].left);
            expect(tileRect.styles.top).toEqual(expectedStyles[index].top);
        });
    });

});
