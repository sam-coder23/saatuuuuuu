/**
 * Mock data for CMS Source List.
 */
import { Display } from "../../../../app/cms/models/cms-display";
import { Source } from "../../../../app/cms/models/cms-source";

export const mockDisplay: Display = {
  type: "NGPWall",
  id: 56,
  name: "ngp_display",
  description: "dadassdas",
  snapshotPath: "",
  resolution: {
    width: 1280,
    height: 1024
  },
  width: 1920,
  height: 1200,
  online: false,
  favorite: false,
  disabled: false,
  tiles: [
    {
      left: 0,
      top: 0,
      width: 960,
      height: 1200,
      x: 0,
      y: 0
    },
    {
      left: 960,
      top: 0,
      width: 960,
      height: 1200,
      x: 0,
      y: 0
    }
  ],
  content: [
    {
      id: 1,
      name: "Auto_edited_src1",
      type: "Perspective",
      description: "",
      lastModified: "",
      resourceId: 548,
      disabled: false,
      x: 0,
      y: 100,
      width: 100,
      height: 200,
      snapshotPath: "",
      zOrder: 1,
      absoluteSize: {
        left: 960,
        top: 0,
        width: 960,
        height: 1200,
        x: 0,
        y: 0
      },
      favorite: false
    },
    {
      id: 2,
      name: "Manual_edited_src11",
      type: "Perspective",
      description: "",
      lastModified: "",
      resourceId: 549,
      disabled: false,
      x: 0,
      y: 200,
      width: 200,
      height: 200,
      snapshotPath: "",
      zOrder: 2,
      absoluteSize: {
        left: 960,
        top: 0,
        width: 960,
        height: 1200,
        x: 0,
        y: 0
      },
      favorite: false
    }
  ]
};

export const sources: Source[] = [
  {
    id: 548,
    name: "Auto_edited_src1",
    type: "Web",
    description: "Auto_edited_desc1",
    snapshotPath: "",
    x: 0,
    y: 0,
    zOrder: -1,
    width: 100,
    height: 200,
    disabled: false,
    favorite: false,
    selected: true
  },
  {
    id: 549,
    name: "Manual_edited_src11",
    type: "Web",
    description: "Manual_edited_desc11",
    snapshotPath: "x/y/z",
    x: 10,
    y: 20,
    zOrder: -1,
    width: 200,
    height: 200,
    disabled: false,
    favorite: true,
    selected: false
  },
  {
    id: 549,
    name: "Manual_edited_src111",
    type: "Web",
    description: "Manual_edited_desc111",
    snapshotPath: "x/y/z",
    x: 10,
    y: 20,
    zOrder: -1,
    width: 200,
    height: 200,
    disabled: true,
    favorite: true,
    selected: false
  }
];
