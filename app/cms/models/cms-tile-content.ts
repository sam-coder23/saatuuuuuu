import { Tile } from "./cms-tile";
import { Source } from "./cms-source";
/**
 * Specifies the model of TileContent.
 * Inherits source's properties as source is presented as tile content on mini-display.
 * @class TileContent
 * @property {number} resourceId  id of any type of resource shared on display
 * @property {string} lastModified last modified timestamp for snapshot, the reason we marked it
 * as string type is that it holds a number not a real date.
 * @property {Tile} absoulteSize keeps absolute tile info as per display wall
 */
export class TileContent extends Source {
    public resourceId: number;
    public lastModified: string;
    public absoluteSize: Tile;

    constructor(content: object) {
        let contentModel: TileContent;
        if (content) {
            contentModel = <TileContent>content;
            super(contentModel);
            this.resourceId = contentModel.resourceId;
            this.lastModified = contentModel.lastModified;
            if (contentModel.absoluteSize) {
                if (contentModel.absoluteSize instanceof Tile) {
                    this.absoluteSize = contentModel.absoluteSize;
                } else {
                    this.absoluteSize = new Tile(contentModel.absoluteSize);
                }
            }
        }
    }
}
