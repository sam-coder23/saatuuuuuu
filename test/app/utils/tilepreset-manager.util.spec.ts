import { ITilePreset } from "./../../../app/cms/models/cms-tile-preset";
import { TilePresetManager } from "./../../../app/utils/tilepreset-manager.util";
import { TilePresets } from "./../core/mock-stubs/tile-grid.mock"

describe("TilePresetManager", () => {
  let tilePresetManager: TilePresetManager;

  beforeEach(() => {
    tilePresetManager = new TilePresetManager();
  });

  it("should be defined", () => {
    expect(tilePresetManager).toBeDefined();
  });

  it("should return tileId 0 if sourceCount = 0 or tilePresets = undefined or tilePresets = []", () => {
    let tileId;
    tileId = TilePresetManager.GET_TILE_ID(TilePresets, 0, 1);
    expect(tileId).toBe(0);

    tileId = TilePresetManager.GET_TILE_ID(undefined, 1, 1);
    expect(tileId).toBe(0);

    tileId = TilePresetManager.GET_TILE_ID([], 1, 1);
    expect(tileId).toBe(0);
  });

  it("should return tileId, if selected display is associated with specific tilepreset and no. of selected sources are equal to no. of tiles", () => {
    let tileId;
    tileId = TilePresetManager.GET_TILE_ID(TilePresets, 2, 1);
    expect(tileId).toBe(5);
  });

  it("should return tileId = 4, if all displays are set as default (generic) and no. of selected sources are equal to no. of tiles", () => {
    let tileId;
    tileId = TilePresetManager.GET_TILE_ID(TilePresets, 2, 2);
    expect(tileId).toBe(4);
  });

  it("should return tileId = 0, if all displays are set as default (generic) and no. of selected sources are not equal to no. of tiles", () => {
    let tileId;
    tileId = TilePresetManager.GET_TILE_ID(TilePresets, 5, 2);
    expect(tileId).toBe(0);
  });

});
