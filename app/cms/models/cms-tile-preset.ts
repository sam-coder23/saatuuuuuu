export interface ITilePreset {
    "id": number,
    "name": string,
    "description": string,
    "tags": string,
    "base": {
      "rowBound": number, //height
      "colBound": number // width
    },
    "tiles": {
        "left": number,
        "top": number,
        "width": number,
        "height": number
    }[],
    "isDefault": boolean,
    "noOfTiles": number,
    "isGrid": boolean
}