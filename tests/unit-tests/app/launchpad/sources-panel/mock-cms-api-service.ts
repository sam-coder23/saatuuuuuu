/**
 * MockCmsApiService
 */
import { Observable } from "rxjs/Rx";

import { Display } from "../../../../app/cms/models/cms-display";
import { ITilePreset } from "../../../../app/cms/models/cms-tile-preset";
import { mockDisplay, mockTilersData } from "./../../core/mock-stubs/cms-sources.mock";
import { tilePresets } from "./../../core/mock-stubs/tile-grid.mock";

export class MockCmsApiService {
  public getTilers(): Observable<ITilePreset[]> {
    return Observable.of(tilePresets);
  }

  public putContentsOnDisplay(displayId: number, tilerId: number, body: any): Observable<any> {
    if (displayId === -1) {
      return Observable.throw({
        message: "Error Occured while updating display content"
      });
    } else {
      return Observable.of(undefined);
    }
  }
  public getTilePresets(): Observable<ITilePreset[]> {
    return Observable.of(mockTilersData);
  }
  public getSelectedDisplayContent(displayId: number): Observable<Display> {
    if (displayId === -1) {
      return Observable.throw({
        message: "Error while updating"
      });
    } else {
      return Observable.of(mockDisplay);
    }

  }

  public logoutUser() : void {
    return;
  }
}
