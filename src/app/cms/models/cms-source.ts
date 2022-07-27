/**
 * Specifies the model of Source
 * Source type could be source or perspective.
 * @class Source
 * @property {string} type type of source [perspective, source, web]
 * @property {number} x horizontal cordinates
 * @property {number} y vertical cordinates
 * @property {number} zOrder depth of the source, overlapp
 * @property {number} width
 * @property {number} height
 * @property {boolean} selected optional, flag indicates selected status of the source
 */

import { CmsResource } from "./cms-resource";

export class Source extends CmsResource {
    // tslint:disable-next-line:no-reserved-keywords
    type: string = "";
    x: number = 0;
    y: number = 0;
    zOrder: number = 0;

    public override set width(value) {
        this.width = value;
    }

    public override set height(value) {
        this.height = value;
    }

    constructor(source: object) {
        super(source);
        let sourceModel: Source;
        if (source) {
            sourceModel = <Source>source;
            this.type = sourceModel.type;
            this.x = sourceModel.x;
            this.y = sourceModel.y;
            this.zOrder = sourceModel.zOrder;
            this.selected = sourceModel.selected;
        }
    }
}
