import { ITilePreset } from "../cms/models/cms-tile-preset";

/**
 * The responsibility of this class is to get tilepreset
 * based on selected source   
 * @class TilePresetManager
 */

export class TilePresetManager {
    /**
     * @method GetTileId
     * Accepts list of tilepreset, selected source count and displayId, and returns the tile Id.
     * incase there is no match then returns 0
     * @return {number} return tile Id
     */
    public static GetTileId(tilePresets: ITilePreset[], sourceCount: number, displayId: number): number {
        // if source count is 0 or there is empty tilepreset list
        if (sourceCount < 1 || !tilePresets || !tilePresets.length) {
            return 0;
        }

        // if selected display is associated with specific tilepreset and no. of selected sources are equal to no. of tiles
        let tileIdIndex = tilePresets.findIndex(tilePreset => tilePreset.noOfTiles === sourceCount && 
                                            tilePreset.defaultForDisplays && 
                                            (tilePreset.defaultForDisplays.indexOf(displayId) != -1));

        if (tileIdIndex === -1) {
            // if all displays are set as default (generic) and no. of selected sources are equal to no. of tiles
            tileIdIndex = tilePresets.findIndex(tilePreset => tilePreset.noOfTiles === sourceCount && 
                                                tilePreset.isDefaultForAllDisplays);
            
            if (tileIdIndex === -1) {
                // if no. of selected sources are equal to no. of tiles
                tileIdIndex = tilePresets.findIndex(tilePreset => tilePreset.noOfTiles === sourceCount);
            }
        }

        // if no. of selected sources are exists into tilepreset list
        if (tileIdIndex !== -1) {
            return tilePresets[tileIdIndex].id;
        } else {
            return 0;
        }
    }
}