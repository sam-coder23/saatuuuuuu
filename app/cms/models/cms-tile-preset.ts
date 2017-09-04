export interface ITilePreset {
    "id": number,
    "name": string,
    "description": string,
    "tags": string,
    "tiles": {
        "left": number,
        "top": number,
        "width": number,
        "height": number
    }[],
    "noOfTiles": number,
    "isGrid": boolean
}