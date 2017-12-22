/**
    * This class is a static class and contains the utility functions that intend to seperate concerns of
    * new approach for repositioning of the sources without disturbing the existing sahred sources.
    * @class SourceRepositionUtility
    * @static
*/

import { Source } from "../cms/models/cms-source";
import { Validation } from "../core/util/Validation";
import { TileContent } from "../cms/models/cms-tile-content";
export class SourceRepositionUtility {

    /**
     * Iterates over the entire array and group like properties specified as a callback param.
     * @method groupBy
     * @param sortedList
     * @param keyFunction
     */
    public static groupBy(sortedList: any[], keyFunction: any): any[] {
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
     * @method sortSourceArray
     * @param { any[] } selectedArray
     * @return { Source[] }
     * This method returns the sorted and transposed array in increasing order row and then column.
     */
    public static sortSourceArray(selectedArray: any[]): TileContent[] {
        let sortedSources: any[] = [];
        let newArr: any[] = [];
        const arrFromObject: any[] = [];
        let reArranged: any[] = [];
        sortedSources = selectedArray.sort((curr: any, next: any) => {
            return curr.x - next.x;
        });
        reArranged = this.groupBy(sortedSources,
            (resource: any) => resource.x);
        sortedSources = reArranged.map(
            (element: any, index: number) => {
                return element["values"].sort(
                    (curr: any, next: any) => {
                        return curr.y - next.y;
                    });
            });

        for (let index: number = 0; index < sortedSources.length; index++) {
            newArr = newArr.concat(sortedSources[index]);
        }

        return newArr;
    }

    /**
     * @method stickySources
     * @param { Source[] } shared
     * @param { Sorce[] } selected
     * @return { Source[] } Returns the corrected array of sources wrt increasing x,y swapped with new sources
     * This function returns the new Array with new sources being swapped on thier supposed positions.
     */
    public static stickySources(shared: Source[], selected: Source[]): Source[] {
        if (shared.length !== selected.length) {
            return;
        }
        const removedIndexes: any[] = [];
        shared.forEach(
            (sharedValue: Source, sharedIndex: number) => {
                const selectedIndex: number = selected.findIndex(
                    (selectedValue: Source) =>
                        !Validation.IsNull(selectedValue) && selectedValue.id === sharedValue.id);
                if (selectedIndex >= 0) {
                    selected[selectedIndex] = null;
                } else {
                    shared[sharedIndex] = null;
                    removedIndexes.push(sharedIndex);
                }
            });
        const addedSources: Source[] = selected.filter(
            (selectedSource: Source) => !Validation.IsNull(selectedSource)
        );
        addedSources.forEach(
            (addedSource: Source, addedIndex: number) => {
                shared[removedIndexes[addedIndex]] = addedSource;
            });

        return shared;
    }

    /**
    * This function converts sources from the content on display.
    * @method convertSourcesFromDisplayContent
    * @param {any} displayContent: content array of display
    * @return {Source[]}
    * This function converts the display Content into an array of sources.
    */
    public static convertSourcesFromDisplayContent(displayContent: any): Source[] {
        const selectedSources: any[] = [];
        if (displayContent && !displayContent.length) {
            return selectedSources;
        }
        for (let sourceIndex: number = 0; sourceIndex < displayContent.length; sourceIndex++) {
            // fetch display content and map to resource properties
            selectedSources.push({
                id: displayContent[sourceIndex].resourceId,
                name: displayContent[sourceIndex].name,
                description: "",
                type: displayContent[sourceIndex].type,
                width: displayContent[sourceIndex].width,
                height: displayContent[sourceIndex].height,
                snapshotPath: displayContent[sourceIndex].snapshotPath,
                favorite: false,
                selected: true
            });
        }

        return selectedSources;
    }
}
