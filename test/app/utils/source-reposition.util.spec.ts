/**
 * Source Reposition utility contains functions to handle functionality for sticky reposition
 * as well as converting the display content to selected sources collection.
 */
import { Source } from "../../../app/cms/models/cms-source";
import { TileContent } from "../../../app/cms/models/cms-tile-content";
import { SourceRepositionUtility } from "./../../../app/utils/source-reposition.util";
import {
  convertedToSources,
  resourceListGroupedByProperityX,
  resourceListOrderedByRowColumn,
  resourceListSwapped,
  resourceListSwapped2,
  resourcesList,
  selectedResources,
  selectedResources2,
  selectedResources3,
  sharedResources,
  sortedResourcesList
} from "./../core/mock-stubs/source-resposition-resources.util.mock";

describe("Source Reposition Utility", () => {
  let sourceRepositionUtil: SourceRepositionUtility;

  beforeEach(() => {
    sourceRepositionUtil = new SourceRepositionUtility();
  });

  it("should be defined", () => {
    expect(sourceRepositionUtil).toBeDefined();
  });

  it("should return sorted array by specific properties mentioned in callback", () => {
    const groupedList: any[] = SourceRepositionUtility.GROUP_BY(sortedResourcesList, (resource: any) => resource.x);
    expect(groupedList).toBeDefined();
    expect(groupedList).toEqual(resourceListGroupedByProperityX);
  });

  it("should returns the sorted and transposed array in increasing order row and then column", () => {
    const orderedList: TileContent[] = SourceRepositionUtility.SORT_SOURCE_ARRAY(resourcesList);
    expect(orderedList).toBeDefined();
    expect(JSON.stringify(orderedList)).toEqual(JSON.stringify(resourceListOrderedByRowColumn));
  });

  it("should return new Array with new sources being swapped on thier supposed positions", () => {
    const swapedList1: Source[] = SourceRepositionUtility.STICKY_SOURCES(sharedResources, selectedResources);
    expect(swapedList1).toBeDefined();
    expect(swapedList1).toEqual(resourceListSwapped);
  });

  it("should not return new Array when sharedResources and selectedResources are not equal", () => {
    const swapedList2: Source[] = SourceRepositionUtility.STICKY_SOURCES(sharedResources, selectedResources2);
    expect(swapedList2).toBeUndefined();
  });

  it("should return new Array with new sources even when selectedResources exist in sharedResources", () => {
    const swapedList3: Source[] = SourceRepositionUtility.STICKY_SOURCES(sharedResources, selectedResources3);
    expect(swapedList3).toBeDefined();
    expect(swapedList3).toEqual(resourceListSwapped2);
  });

  it("should converts the display Content into an array of sources", () => {
    const convertedList: Source[] = SourceRepositionUtility.CONVERT_SOURCES_FROM_DISPLAY_CONTENT(selectedResources2);
    expect(convertedList).toBeDefined();
    expect(JSON.stringify(convertedList)).toEqual(JSON.stringify(convertedToSources));
  });

  it("should return a blank array when content is blank", () => {
    const blankList: Source[] = SourceRepositionUtility.CONVERT_SOURCES_FROM_DISPLAY_CONTENT([]);
    expect(blankList.length).toBe(0);
  });
});
