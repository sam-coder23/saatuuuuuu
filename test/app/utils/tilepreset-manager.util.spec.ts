/**
 * Tile Preset Manager is a generic utility file for getting tileId from the list of Tilers
 */
import { ITilePreset } from "./../../../app/cms/models/cms-tile-preset";
import { TilePresetManager } from "./../../../app/utils/tilepreset-manager.util";
import { tilePresets } from "./../core/mock-stubs/tile-grid.mock";

describe("TilePresetManager", () => {
  let tilePresetManager: TilePresetManager;
  const specConstants: any = {
    baseTileId: 2,
    midTileId: 4,
    lastTileId: 5
  };

  beforeEach(() => {
    tilePresetManager = new TilePresetManager();
  });

  it("should be defined", () => {
    expect(tilePresetManager).toBeDefined();
  });

  it("should return tileId 0 if sourceCount = 0 or tilePresets = undefined or tilePresets = []", () => {
    let tileId: number;
    tileId = TilePresetManager.GET_TILE_ID(tilePresets, 0, 1);
    expect(tileId).toBe(0);

    tileId = TilePresetManager.GET_TILE_ID(undefined, 1, 1);
    expect(tileId).toBe(0);

    tileId = TilePresetManager.GET_TILE_ID([], 1, 1);
    expect(tileId).toBe(0);
  });

  it("should return tileId, if selected display is associated with specific tilepreset and no. of selected sources are equal to no. of tiles", () => {
    let tileId: number;
    tileId = TilePresetManager.GET_TILE_ID(tilePresets, specConstants.baseTileId, 1);
    expect(tileId).toBe(specConstants.lastTileId);
  });

  it("should return tileId = 4, if all displays are set as default (generic) and no. of selected sources are equal to no. of tiles", () => {
    let tileId: number;
    tileId = TilePresetManager.GET_TILE_ID(tilePresets, specConstants.baseTileId, specConstants.baseTileId);
    expect(tileId).toBe(specConstants.midTileId);
  });

  it("should return tileId = 0, if all displays are set as default (generic) and no. of selected sources are not equal to no. of tiles", () => {
    let tileId: number;
    tileId = TilePresetManager.GET_TILE_ID(tilePresets, specConstants.lastTileId, specConstants.baseTileId);
    expect(tileId).toBe(0);
  });
});
