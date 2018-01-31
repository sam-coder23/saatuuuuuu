/**
 * Mock stubs for mini-display component.
 */
import { ElementRef } from "@angular/core";
import { Observable } from "rxjs/Observable";

import { CmsResource } from "../../../../app/cms/models/cms-resource";
import { ISize } from "../../../../app/cms/models/cms-size";
import { Tile } from "../../../../app/cms/models/cms-tile";
import { TileContent } from "../../../../app/cms/models/cms-tile-content";

const subscribeDelay: number = 500;
class MockDisplay extends CmsResource {
    // tslint:disable-next-line:no-reserved-keywords
    public type: string;
    public online: boolean;
    public resolution: {
        width: number;
        height: number;
    };
    public width: number;
    public height: number;
    public tiles: Tile[];
    public content: TileContent[];
}

class RouterStub {
    public navigateByUrl(url: string): string {
        return url;
    }
    public navigate(str: string): string {
        return str;
    }
}

class CmsMiniDisplayServiceStub {
    public display: MockDisplay = mockDisplay;
    private fitHeightZoomLevel: number = 100;
    private panend: boolean;
    private scrollPosition: { Left: number; Top: number; };
    private windowResizeEndEvent: Observable<{}>;
    private miniDisplaySize: any;
    private displaySize: any;
    private zoomLevel: number;
    public init(): void {
        this.display = undefined;
        this.zoomLevel = 0;
        this.displaySize = undefined;
        this.miniDisplaySize = undefined;
        this.scrollPosition = { Left: 0, Top: 0 };
        this.windowResizeEndEvent = Observable.fromEvent(window, "resize").debounce(() => Observable.timer(subscribeDelay));
        this.panend = false;
    }

    public getMiniDisplayTilerInfoWithContent(displayId: number, container: HTMLElement): Observable<any> {
        if (displayId === -1) {
            return Observable.throw(undefined);
        } else {
            return Observable.of(miniDisplay);
        }
    }

    public calculateAdjustedViewTilerRectangles(aDisplayTilerList: Tile[]): Tile[] {
        return reFactoredTile;
    }

    public calculateAdjustedViewSourceRectangle(): TileContent {
        return reFactoredTileContent;
    }

    public calculateAdjustedViewSourceRectangles(): TileContent[] {
        return reFactoredSource;
    }
}

const reFactoredTile: Tile[] = [
    {
        left: 0.8397480038430362,
        top: 2.687193612297716,
        height: 98.32050,
        width: 98.32050399231392,
        x: 0.8397480038430362,
        y: 2.687193612297716
    }
];

const reFactoredSource: TileContent[] = [{
    id: 35,
    name: "XYZ refactored",
    type: "Perspective",
    resourceId: 75,
    x: 0.5727923293933467,
    y: 1.0861839727755316,
    width: 98.85441534121331,
    height: 97.82763205444894,
    description: "La",
    disabled: false,
    favorite: false,
    snapshotPath: "",
    zOrder: 1,
    absoluteSize: {
        width: 2048,
        height: 1080,
        left: 0,
        top: 0,
        x: 0.8397480038430362,
        y: 2.687193612297716
    },
    lastModified: "1510741729389"
}];

const reFactoredTileContent: TileContent = {
    id: 35,
    name: "XYZ refactored",
    type: "Perspective",
    resourceId: 75,
    x: 57.27923293933467,
    y: 1.0861839727755316,
    width: 98.85441534121331,
    height: 97.82763205444894,
    description: "La",
    disabled: false,
    favorite: false,
    snapshotPath: "",
    zOrder: 1,
    absoluteSize: {
        width: 2048,
        height: 1080,
        left: 0,
        top: 0,
        x: 0.8397480038430362,
        y: 2.687193612297716
    },
    lastModified: "1510741729391"
};

const mockDisplay: MockDisplay = {
    type: "NGPWall",
    id: 56,
    name: "ngp_display",
    description: "dadassdas",
    snapshotPath: "",
    resolution: {
        width: 1280,
        height: 1024
    },
    online: false,
    favorite: false,
    disabled: false,
    width: 1280,
    height: 1024,
    tiles: [],
    content: []
};

const mockDisplayForService: MockDisplay = {
    type: "NGPWall",
    id: 2,
    name: "Demo Room, USA",
    description: "Customer Demo Center\r5th floor, room 5.01,\rPhone +49 123 456-141",
    snapshotPath: "",
    resolution: {
        width: 1600,
        height: 900
    },
    online: false,
    favorite: false,
    disabled: false,
    width: 1280,
    height: 1024,
    tiles: [],
    content: []
};

class MockElementRef extends ElementRef { }

class MiniDisplay {
    public displaySize: ISize;
    public miniDisplayTilerList: Tile[];
    public miniDisplayContentList: TileContent[];
    public displayTilerList: Tile[];
    public miniDisplaySize: ISize;
}

const miniDisplay: MiniDisplay = {
    displaySize: {
        width: 2048,
        height: 1080
    },
    miniDisplayTilerList: [
        {
            width: 98.98348157560356,
            height: 98.07237987670007,
            left: 0.5082592121982211,
            top: 0.96381006164996,
            x: 0,
            y: 0
        }
    ],
    miniDisplayContentList: [
        {
            id: 488,
            name: "aakash s2",
            type: "Perspective",
            resourceId: 129,
            x: 0.5082592121982211,
            y: 0.96381006164996,
            width: 98.98348157560356,
            height: 98.07237987670007,
            snapshotPath: "",
            zOrder: 1,
            absoluteSize: {
                width: 2048,
                height: 1080,
                left: 0,
                top: 0,
                x: 0,
                y: 0
            },
            lastModified: "1510643127925",
            description: "",
            disabled: false,
            favorite: true
        }
    ],
    displayTilerList: [
        {
            left: 0,
            top: 0,
            width: 2048,
            height: 1080,
            x: 0,
            y: 0
        }
    ],
    miniDisplaySize: {
        width: 787,
        height: 415
    }
};

const eventCases: any = {
    DisplayUpdated: {
        type: "NGPWall",
        id: 561,
        name: "ngp_display",
        resolution: {
            width: 1288,
            height: 1029
        }
    },
    DisplayDeleted: {
        type: "NGPWall",
        id: 56,
        name: "ngp_display",
        width: 1000,
        height: 2000
    },
    TilerAndContentUpdated: {
        type: "NGPWall",
        id: 561,
        name: "ngp_display",
        width: 1288,
        height: 1029,
        tiles: [
            {
                left: 0,
                top: 0,
                width: 2048,
                height: 1080,
                x: 0,
                y: 0
            }
        ],
        content: [
            {
                height: 1080,
                id: 58
            }
        ]
    },
    ContentUpdated: {
        content: {
            id: 35,
            name: "XYZ refactored",
            type: "Perspective",
            resourceId: 75,
            x: 0.5727923293933467,
            y: 1.0861839727755316,
            width: 98.85441534121331,
            height: 97.82763205444894,
            description: "La",
            snapshotPath: "",
            zOrder: 1
        }
    },
    ResourceUpdated: {
        id: 75,
        name: "ABC refactored",
        type: "Perspective",
        dimensions: {
            width: 600,
            height: 450
        },
        description: "La",
        snapshotPath: "some path"
    }
};

export {
    MiniDisplay,
    MockDisplay,
    MockElementRef,
    mockDisplay,
    mockDisplayForService,
    miniDisplay,
    CmsMiniDisplayServiceStub,
    RouterStub,
    eventCases,
    reFactoredTile,
    reFactoredSource,
    reFactoredTileContent
};
