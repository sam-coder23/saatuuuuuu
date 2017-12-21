import { CmsResource } from "./cms-resource";
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
export class Source extends CmsResource {
    public type: string;
    public x: number;
    public y: number;
    public zOrder: number;
    public width: number;
    public height: number;
    public selected?: boolean;

    constructor(source: object) {
        let sourceModel: Source;
        if (source) {
            sourceModel = <Source>source;
            super(sourceModel);
            this.type = sourceModel.type;
            this.x = sourceModel.x;
            this.y = sourceModel.y;
            this.zOrder = sourceModel.zOrder;
            this.width = sourceModel.width;
            this.height = sourceModel.height;
            this.selected = sourceModel.selected;
        }
    }
}
