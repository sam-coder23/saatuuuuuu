/**
 * Interface defines the model configuration of TilePreset
 * @interface ITilePreset
 */

export interface ITilePreset {
    "id"?: number;
    "name": string;
    "description"?: string;
    "tags"?: string;
    "base": {
      "rowBound": number, //height
      "colBound": number // width
    };
    "tiles": {
        "x": number,
        "y": number,
        "width": number,
        "height": number
    }[];
    "isDefaultForAllDisplays"?: boolean;
    "noOfTiles"?: number;
    "isGrid"?: boolean;
    "defaultForDisplays"?: any[];
    "isSelected"?: boolean;
}
