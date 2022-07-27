/**
 * Mock data for CMS grid component
 */
import { TileContent } from "../../../../app/cms/models/cms-tile-content";
import { IUserProfileSettings } from "../../../../app/cms/models/cms-user-profile-settings";

export const contents: TileContent[] = [
  {
    absoluteSize: {
      height: 2280,
      left: 0,
      top: 0,
      width: 3840,
      x: 0,
      y: 600
    },
    height: 49.01234567901235,
    id: 160,
    lastModified: "1507553259660",
    name: "DefaultProSource[NOICLT28523]",
    resourceId: 21,
    snapshotPath: "/display_snapshot.jpg",
    type: "Perspective",
    width: 49.382716049382715,
    x: 0.30864197530864196,
    y: 50.49382716049383,
    zOrder: 3,
    description: "",
    disabled: false,
    favorite: false
  },
  {
    absoluteSize: {
      height: 2280,
      left: 3840,
      top: 0,
      width: 3840,
      x: 3840,
      y: 0
    },
    height: 49.01234567901235,
    id: 170,
    lastModified: "1507553259660",
    name: "DefaultProSource[NOICLT28523]",
    resourceId: 21,
    snapshotPath: "wdisplay_snapshot.jpg",
    type: "Perspective",
    width: 49.382716049382715,
    x: 0.30864197530864196,
    y: 50.49382716049383,
    zOrder: 4,
    description: "",
    disabled: false,
    favorite: false
  }
];

export const miniTiles: any[] = [
  {
    height: 49.01234567901235,
    left: 0.30864197530864196,
    top: 50.49382716049383,
    width: 49.382716049382715,
    x: 0.30864197530864196,
    y: 50.49382716049383,
    snapshotPath: "display_snapshot.jpg",
    lastModified: "1507553259660"
  }
];

export const swappedGeometeryContent: any[] = [{
  id: 160,
  name: "DefaultProSource[NOICLT28523]",
  type: "Perspective",
  resourceId: 21,
  snapshotPath: "/display_snapshot.jpg",
  zOrder: 3,
  height: 2280,
  width: 3840,
  x: 3840,
  y: 0,
  lastModified: "1507553259660"
},
{
  id: 170,
  name: "DefaultProSource[NOICLT28523]",
  type: "Perspective",
  resourceId: 21,
  snapshotPath: "/display_snapshot.jpg",
  zOrder: 4,
  height: 2280,
  width: 3840,
  x: 0,
  y: 0,
  lastModified: "1507553259660"
}];

export const userSettings: IUserProfileSettings = {
  language: "en",
  wallConnection: {
    startUpAction: "show-available-walls-list",
    specificDisplay: "Board Meeting Room",
    recentDisplay: "Board Meeting Room"
  },
  sourceLabel: {
    displaySourceNameLabels: true,
    useMultipleLines: false,
    fontColor: "#FFFFFF",
    fontSize: 14,
    backgroundColor: "#BDBDBD",
    transparency: 50
  },
  logOffTime: 0,
  pageSize: 50
};
