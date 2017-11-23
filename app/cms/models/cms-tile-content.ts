/**
 * Specifies the model of TileContent.
 * Inherits source's properties as source is presented as tile content on mini-display. 
 */
import { Tile } from "./cms-tile";
import { Source } from "./cms-source";


export class TileContent extends Source {
    // id of any type of resource shared on display
    resourceId: number;
    
	// last modified timestamp for snapshot
    // the reason we marked it as string type is that it holds a number not a real date
	lastModified: string;

    // keeps absolute tile info as per display wall
    absoluteSize: Tile;


    constructor(contentModel) {
        if (!contentModel) {
            return null;
        };
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