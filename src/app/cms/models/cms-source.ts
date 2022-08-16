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
    public type: string = "";
    public x: number = 0;
    public y: number = 0;
    public zOrder: number = 0;

    public override get width(): number {
        return this.width;
    }

    public override get height(): number {
        return this.height;
    }

    public override set width(value) {
        this.width = value;
    }

    public override set height(value) {
        this.height = value;
    }
}
