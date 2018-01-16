/**
 * This class is a static class and contains the utility functions that intend to seperate concerns of
 * new approach for repositioning of the sources without disturbing the existing shared sources
 * @class SourceRepositionUtility
 */

import { Source } from "../cms/models/cms-source";
import { TileContent } from "../cms/models/cms-tile-content";
import { Validation } from "../core/util/Validation";

export class SourceRepositionUtility {
    /**
     * Iterates over the entire array and group like properties specified as a callback param.
     * @method GROUP_BY
     * @param sortedList
     * @param keyFunction
     */
    public static GROUP_BY (sortedList: any[], keyFunction: any): any[] {
        const groups: any = {};
        sortedList.forEach(
            (el: any) => {
                const key: string = keyFunction(el);
                if (key in groups === false) {
                    groups[key] = [];
                }
                groups[key].push(el);
            });

        return Object.keys(groups).map(
            (key: string) => {
                return {
                    values: groups[key]
                };
            }
        );
    }

    /**
     * @method SORT_SOURCE_ARRAY
     * @param { any[] } selectedArray
     * @return { Source[] }
     * This method returns the sorted and transposed array in increasing order row and then column.
     */
    public static SORT_SOURCE_ARRAY (selectedArray: any[]): TileContent[] {
        let sortedSources: any[] = [];
        let newArr: any[] = [];
        const arrFromObject: any[] = [];
        let reArranged: any[] = [];
        sortedSources = selectedArray.sort((curr: any, next: any) => {
            return curr.x - next.x;
        });

        reArranged = this.GROUP_BY(sortedSources,
            (resource: any) => resource.x);
        sortedSources = reArranged.map(
            (element: any, index: number) => {
                return element.values.sort(
                    (curr: any, next: any) => {
                        return curr.y - next.y;
                    });
            });

        for (const source of sortedSources) {
            newArr = newArr.concat(source);
        }

        return newArr;
    }

    /**
     * @method STICKY_SOURCES
     * @param { Source[] } shared
     * @param { Sorce[] } selected
     * @return { Source[] } Returns the corrected array of sources wrt increasing x,y swapped with new sources
     * This function returns the new Array with new sources being swapped on thier supposed positions.
     */
    public static STICKY_SOURCES (shared: Source[], selected: Source[]): Source[] {
        if (shared.length !== selected.length) {
            return;
        }
        const removedIndexes: number[] = [];
        shared.forEach(
            (sharedValue: Source, sharedIndex: number) => {
                const selectedIndex: number = selected.findIndex(
                    (selectedValue: Source) =>
                        !Validation.IS_NULL(selectedValue) && selectedValue.id === sharedValue.id);
                if (selectedIndex >= 0) {
                    selected[selectedIndex] = undefined;
                } else {
                    shared[sharedIndex] = undefined;
                    removedIndexes.push(sharedIndex);
                }
            });
        const addedSources: Source[] = selected.filter(
            (selectedSource: Source) => !Validation.IS_NULL_OR_UNDEFINED(selectedSource)
        );
        addedSources.forEach(
            (addedSource: Source, addedIndex: number) => {
                shared[removedIndexes[addedIndex]] = addedSource;
            });

        return shared;
    }

    /**
     * This function converts sources from the content on display.
     * @method CONVERT_SOURCES_FROM_DISPLAY_CONTENT
     * @param {any} displayContent: content array of display
     * @return {Source[]}
     * This function converts the display Content into an array of sources.
     */
    public static CONVERT_SOURCES_FROM_DISPLAY_CONTENT (displayContent: any): Source[] {
        const selectedSources: any[] = [];
        if (displayContent && !displayContent.length) {
            return selectedSources;
        }
        for (const content of displayContent) {
            // fetch display content and map to resource properties
            selectedSources.push({
                id: content.resourceId,
                name: content.name,
                description: "",
                type: content.type,
                width: content.width,
                height: content.height,
                snapshotPath: content.snapshotPath,
                favorite: false,
                selected: true
            });
        }

        return selectedSources;
    }
}
