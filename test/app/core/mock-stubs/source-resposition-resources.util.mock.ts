/**
 * Mock data for source list and respositioned list
 */
import { Source } from "../../../../app/cms/models/cms-source";

export const sortedResourcesList: any[] = [
  {
    id: 47,
    name: "1",
    type: "Perspective",
    resourceId: 24,
    x: 0,
    y: 0,
    width: 800,
    height: 450,
    snapshotPath: "display_snapshot.jpg",
    zOrder: 1
  },
  {
    id: 38,
    name: "2",
    type: "Perspective",
    resourceId: 26,
    x: 0,
    y: 450,
    width: 800,
    height: 450,
    snapshotPath: "display_snapshot.jpg",
    zOrder: 5
  },
  {
    id: 21,
    name: "3",
    type: "Perspective",
    resourceId: 23,
    x: 800,
    y: 0,
    width: 800,
    height: 450,
    snapshotPath: "display_snapshot.jpg",
    zOrder: 2
  },
  {
    id: 90,
    name: "4",
    type: "Perspective",
    resourceId: 52,
    x: 800,
    y: 450,
    width: 800,
    height: 450,
    snapshotPath: "display_snapshot.jpg",
    zOrder: 6
  }
];

export const  resourceListGroupedByProperityX: any[] = [
  {
    values: [
      {
        id: 47,
        name: "1",
        type: "Perspective",
        resourceId: 24,
        x: 0,
        y: 0,
        width: 800,
        height: 450,
        snapshotPath: "display_snapshot.jpg",
        zOrder: 1
      },
      {
        id: 38,
        name: "2",
        type: "Perspective",
        resourceId: 26,
        x: 0,
        y: 450,
        width: 800,
        height: 450,
        snapshotPath: "display_snapshot.jpg",
        zOrder: 5
      }
    ]
  },
  {
    values: [
      {
        id: 21,
        name: "3",
        type: "Perspective",
        resourceId: 23,
        x: 800,
        y: 0,
        width: 800,
        height: 450,
        snapshotPath: "display_snapshot.jpg",
        zOrder: 2
      },
      {
        id: 90,
        name: "4",
        type: "Perspective",
        resourceId: 52,
        x: 800,
        y: 450,
        width: 800,
        height: 450,
        snapshotPath: "display_snapshot.jpg",
        zOrder: 6
      }
    ]
  }
];

export const  resourcesList: any[] = [
  {
    id: 47,
    name: "1",
    type: "Perspective",
    resourceId: 24,
    x: 0,
    y: 0,
    width: 800,
    height: 450,
    snapshotPath: "display_snapshot.jpg",
    zOrder: 1
  },
  {
    id: 21,
    name: "2",
    type: "Perspective",
    resourceId: 23,
    x: 800,
    y: 0,
    width: 800,
    height: 450,
    snapshotPath: "display_snapshot.jpg",
    zOrder: 2
  },
  {
    id: 40,
    name: "3",
    type: "Perspective",
    resourceId: 2,
    x: 1600,
    y: 0,
    width: 800,
    height: 450,
    snapshotPath: "display_snapshot.jpg",
    zOrder: 3
  },
  {
    id: 42,
    name: "4",
    type: "Perspective",
    resourceId: 27,
    x: 2400,
    y: 0,
    width: 800,
    height: 450,
    snapshotPath: "display_snapshot.jpg",
    zOrder: 4
  },
  {
    id: 90,
    name: "5",
    type: "Perspective",
    resourceId: 52,
    x: 800,
    y: 450,
    width: 800,
    height: 450,
    snapshotPath: "display_snapshot.jpg",
    zOrder: 6
  }
];

export const resourceListOrderedByRowColumn: any[] = [
  {
    id: 47,
    name: "1",
    type: "Perspective",
    resourceId: 24,
    x: 0,
    y: 0,
    width: 800,
    height: 450,
    snapshotPath: "display_snapshot.jpg",
    zOrder: 1
  },
  {
    id: 21,
    name: "2",
    type: "Perspective",
    resourceId: 23,
    x: 800,
    y: 0,
    width: 800,
    height: 450,
    snapshotPath: "display_snapshot.jpg",
    zOrder: 2
  },
  {
    id: 90,
    name: "5",
    type: "Perspective",
    resourceId: 52,
    x: 800,
    y: 450,
    width: 800,
    height: 450,
    snapshotPath: "display_snapshot.jpg",
    zOrder: 6
  },
  {
    id: 40,
    name: "3",
    type: "Perspective",
    resourceId: 2,
    x: 1600,
    y: 0,
    width: 800,
    height: 450,
    snapshotPath: "display_snapshot.jpg",
    zOrder: 3
  },
  {
    id: 42,
    name: "4",
    type: "Perspective",
    resourceId: 27,
    x: 2400,
    y: 0,
    width: 800,
    height: 450,
    snapshotPath: "display_snapshot.jpg",
    zOrder: 4
  }
];

export const  sharedResources: Source[] = [
  {
    id: 33,
    name: "source_1",
    description: "",
    type: "Perspective",
    width: 1600,
    height: 900,
    snapshotPath: "",
    favorite: false,
    selected: true,
    x: 0,
    y: 0,
    zOrder: 1,
    disabled: false
  },
  {
    id: 39,
    name: "source_2",
    description: "",
    type: "Perspective",
    width: 1600,
    height: 900,
    snapshotPath: "",
    favorite: false,
    selected: true,
    x: 0,
    y: 0,
    zOrder: 2,
    disabled: false
  }
];

export const selectedResources: Source[] = [
  {
    id: 26,
    name: "source_4",
    description: "",
    type: "perspective",
    width: 600,
    height: 450,
    snapshotPath: "",
    favorite: true,
    selected: true,
    x: 0,
    y: 0,
    zOrder: 4,
    disabled: false
  },
  {
    id: 25,
    name: "source_3",
    description: "",
    type: "perspective",
    width: 600,
    height: 450,
    snapshotPath: "",
    favorite: false,
    selected: true,
    x: 0,
    y: 0,
    zOrder: 3,
    disabled: false
  }
];

export const selectedResources2: Source[] = [
  {
    id: 26,
    name: "source_4",
    description: "",
    type: "perspective",
    width: 600,
    height: 450,
    snapshotPath: "",
    favorite: true,
    selected: true,
    x: 0,
    y: 0,
    zOrder: 4,
    disabled: false
  },
  {
    id: 25,
    name: "source_3",
    description: "",
    type: "perspective",
    width: 600,
    height: 450,
    snapshotPath: "",
    favorite: false,
    selected: true,
    x: 0,
    y: 0,
    zOrder: 3,
    disabled: false
  },
  {
    id: 35,
    name: "source_6",
    description: "",
    type: "perspective",
    width: 600,
    height: 450,
    snapshotPath: "",
    favorite: false,
    selected: true,
    x: 0,
    y: 0,
    zOrder: 5,
    disabled: false
  }
];

export const selectedResources3: Source[] = [
  {
    id: 33,
    name: "source_1",
    description: "",
    type: "Perspective",
    width: 1600,
    height: 900,
    snapshotPath: "",
    favorite: false,
    selected: true,
    x: 0,
    y: 0,
    zOrder: 1,
    disabled: false
  },
  {
    id: 25,
    name: "source_3",
    description: "",
    type: "perspective",
    width: 600,
    height: 450,
    snapshotPath: "",
    favorite: false,
    selected: true,
    x: 0,
    y: 0,
    zOrder: 3,
    disabled: false
  }
];

export const  resourceListSwapped: Source[] = [
  {
    id: 26,
    name: "source_4",
    description: "",
    type: "perspective",
    width: 600,
    height: 450,
    snapshotPath: "",
    favorite: true,
    selected: true,
    x: 0,
    y: 0,
    zOrder: 4,
    disabled: false
  },
  {
    id: 25,
    name: "source_3",
    description: "",
    type: "perspective",
    width: 600,
    height: 450,
    snapshotPath: "",
    favorite: false,
    selected: true,
    x: 0,
    y: 0,
    zOrder: 3,
    disabled: false
  }
];

export const resourceListSwapped2: Source[] = [
  {
    id: 33,
    name: "source_1",
    description: "",
    type: "Perspective",
    width: 1600,
    height: 900,
    snapshotPath: "",
    favorite: false,
    selected: true,
    x: 0,
    y: 0,
    zOrder: 1,
    disabled: false
  },
  {
    id: 25,
    name: "source_3",
    description: "",
    type: "perspective",
    width: 600,
    height: 450,
    snapshotPath: "",
    favorite: false,
    selected: true,
    x: 0,
    y: 0,
    zOrder: 3,
    disabled: false
  }
];

export const convertedToSources: any[] = [
  {
    name: "source_4",
    description: "",
    type: "perspective",
    width: 600,
    height: 450,
    snapshotPath: "",
    favorite: false,
    selected: true
  },
  {
    name: "source_3",
    description: "",
    type: "perspective",
    width: 600,
    height: 450,
    snapshotPath: "",
    favorite: false,
    selected: true
  },
  {
    name: "source_6",
    description: "",
    type: "perspective",
    width: 600,
    height: 450,
    snapshotPath: "",
    favorite: false,
    selected: true
  }
];
