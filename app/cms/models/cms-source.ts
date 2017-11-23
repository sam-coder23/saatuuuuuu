/**
 * Specifies the model of Source
 * Source type could be source or perspective.
 */
import { CmsResource } from "./cms-resource";

export class Source extends CmsResource {
    type: string;
    x: number;
    y: number;
    zOrder: number;
    width: number;
    height: number;
    selected?: boolean;

    constructor(sourceModel) {
        if (!sourceModel) {
            return null;
        };
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