/**
 * MockCmsApiService
 */
import { Observable } from "rxjs/Rx";
import { ITilePreset } from "../../../../app/cms/models/cms-tile-preset";
import { MockDisplay, MockSources, MockTilersData } from "./../../core/mock-stubs/cms-sources.mock";
import { TilePresets } from "./../../core/mock-stubs/tile-grid.mock";

export class MockCmsApiService {
  public getTilers(): Observable<ITilePreset[]> {
    return Observable.of(TilePresets);
  }

  public putContentsOnDisplay(displayId: number, tilerId: number, body: any) {
    return Observable.of(null);
  }
  public getTilePresets(): Observable<ITilePreset[]> {
    return Observable.of(MockTilersData);
  }
  public getSelectedDisplayContent(displayId) {
    return Observable.of(MockDisplay);
  }

  public logoutUser() : void {
    return;
  }
};
