import { Source } from "./../../../app/cms/models/cms-source";
import { TileContent } from "./../../../app/cms/models/cms-tile-content";
import { Validation } from "./../../../app/core/util/Validation";
import { SourceRepositionUtility } from "./../../../app/utils/source-reposition.util";
import {
  SortedResourcesList,
  ResourceListGroupedByProperityX,
  ResourcesList,
  ResourceListOrderedByRowColumn,
  SharedResources,
  SelectedResources,
  ResourceListSwapped,
  ResourceListSwapped2,
  SelectedResources2,
  SelectedResources3,
  ConvertedToSources
} from './../core/mock-stubs/source-resposition-resources.util.mock';

describe("Source Reposition Utility", () => {
  let sourceRepositionUtil: SourceRepositionUtility;

  beforeEach(() => {
    sourceRepositionUtil = new SourceRepositionUtility();
  });

  it("should be defined", () => {
    expect(sourceRepositionUtil).toBeDefined();
  });

  it("should return sorted array by specific properties mentioned in callback", () => {
    let groupedList = SourceRepositionUtility.GROUP_BY(SortedResourcesList, (resource: any) => resource.x);
    expect(groupedList).toBeDefined();
    expect(groupedList).toEqual(ResourceListGroupedByProperityX);
  });

  it("should returns the sorted and transposed array in increasing order row and then column", () => {
    let orderedList = SourceRepositionUtility.SORT_SOURCE_ARRAY(ResourcesList);
    expect(orderedList).toBeDefined();
    expect(JSON.stringify(orderedList)).toEqual(JSON.stringify(ResourceListOrderedByRowColumn));
  });

  it("should return new Array with new sources being swapped on thier supposed positions", () => {
    let swapedList1 = SourceRepositionUtility.STICKY_SOURCES(SharedResources, SelectedResources);
    expect(swapedList1).toBeDefined();
    expect(swapedList1).toEqual(ResourceListSwapped);
  });

  it("should not return new Array when sharedResources and selectedResources are not equal", () => {
    let swapedList2 = SourceRepositionUtility.STICKY_SOURCES(SharedResources, SelectedResources2);
    expect(swapedList2).toBeUndefined();
  });

  it("should return new Array with new sources even when selectedResources exist in sharedResources", () => {
    let swapedList3 = SourceRepositionUtility.STICKY_SOURCES(SharedResources, SelectedResources3);
    expect(swapedList3).toBeDefined();
    expect(swapedList3).toEqual(ResourceListSwapped2);
  });

  it("should converts the display Content into an array of sources", () => {
    let convertedList = SourceRepositionUtility.CONVERT_SOURCES_FROM_DISPLAY_CONTENT(SelectedResources2);
    expect(convertedList).toBeDefined();
    expect(JSON.stringify(convertedList)).toEqual(JSON.stringify(ConvertedToSources));
  });

  it("should return a blank array when content is blank", () => {
    let blankList = SourceRepositionUtility.CONVERT_SOURCES_FROM_DISPLAY_CONTENT([]);
    expect(blankList.length).toBe(0);
  });
});
