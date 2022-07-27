/**
 * Test specification for Storage Manager service
 */
import { StorageManager } from "../../../../app/cms/api/cms-storagemanager.service";
import { sessionStorageMock } from "../../core/mock-stubs/tile.mock";

describe("Service: StorageManager", () => {
    let storageManager: StorageManager;
    const storageValues: any = sessionStorageMock;
    beforeEach(() => {
        storageManager = new StorageManager();
    });

    it("Service should be defined", () => {
        expect(storageManager).toBeDefined();
    });

    it("Service should be able to set key-value data", () => {
        storageManager.setItem(storageValues.userKey, JSON.stringify(storageValues.userValue));
        storageManager.setItem(storageValues.settingKey, JSON.stringify(storageValues.settingValue));
        storageManager.setItem(storageValues.displayKey, JSON.stringify(storageValues.displayValue));
        storageManager.setItem(storageValues.userLastActionTimeKey, JSON.stringify(storageValues.userLastActionTimeValue));
        storageManager.setItem(storageValues.sourcesSearchFilterKey, storageValues.sourcesSearchFilterValue);
        storageManager.setItem(storageValues.sourcesFavoriteFilterKey, JSON.stringify(storageValues.sourcesFavoriteFilterValue));

        const userValue: string = window.sessionStorage.getItem(storageValues.userKey);
        const settingValue: string = window.sessionStorage.getItem(storageValues.settingKey);
        const displayValue: string = window.sessionStorage.getItem(storageValues.displayKey);
        const userLastActionTimeValue: string = window.sessionStorage.getItem(storageValues.userLastActionTimeKey);
        const sourcesSearchFilterValue: string = window.sessionStorage.getItem(storageValues.sourcesSearchFilterKey);
        const sourcesFavoriteFilterValue: string = window.sessionStorage.getItem(storageValues.sourcesFavoriteFilterKey);

        expect(userValue).toBe(JSON.stringify(storageValues.userValue));
        expect(settingValue).toBe(JSON.stringify(storageValues.settingValue));
        expect(displayValue).toBe(JSON.stringify(storageValues.displayValue));
        expect(userLastActionTimeValue).toBe(JSON.stringify(storageValues.userLastActionTimeValue));
        expect(sourcesSearchFilterValue).toBe(storageValues.sourcesSearchFilterValue);
        expect(sourcesFavoriteFilterValue).toBe(JSON.stringify(storageValues.sourcesFavoriteFilterValue));
    });

    it("Service should be able to get stored value", () => {
        const userValue: string = storageManager.getItem(storageValues.userKey);
        const settingValue: string = storageManager.getItem(storageValues.settingKey);
        const displayValue: string = storageManager.getItem(storageValues.displayKey);
        const userLastActionTimeValue: string = storageManager.getItem(storageValues.userLastActionTimeKey);
        const sourcesSearchFilterValue: string = storageManager.getItem(storageValues.sourcesSearchFilterKey);
        const sourcesFavoriteFilterValue: string = storageManager.getItem(storageValues.sourcesFavoriteFilterKey);

        expect(userValue).toBe(JSON.stringify(storageValues.userValue));
        expect(settingValue).toBe(JSON.stringify(storageValues.settingValue));
        expect(displayValue).toBe(JSON.stringify(storageValues.displayValue));
        expect(userLastActionTimeValue).toBe(JSON.stringify(storageValues.userLastActionTimeValue));
        expect(sourcesSearchFilterValue).toBe(storageValues.sourcesSearchFilterValue);
        expect(settingValue).toBe(JSON.stringify(storageValues.settingValue));
    });

    it("Service should be able to remove stored value", () => {
        storageManager.removeItem(storageValues.userKey);
        storageManager.removeItem(storageValues.settingKey);
        storageManager.removeItem(storageValues.displayKey);
        storageManager.removeItem(storageValues.userLastActionTimeKey);
        storageManager.removeItem(storageValues.sourcesSearchFilterKey);
        storageManager.removeItem(storageValues.sourcesFavoriteFilterKey);

        const userValue: string = storageManager.getItem(storageValues.userKey);
        const settingValue: string = storageManager.getItem(storageValues.settingKey);
        const displayValue: string = storageManager.getItem(storageValues.displayKey);
        const userLastActionTimeValue: string = storageManager.getItem(storageValues.userLastActionTimeKey);
        const sourcesSearchFilterValue: string = storageManager.getItem(storageValues.sourcesSearchFilterKey);
        const sourcesFavoriteFilterValue: string = storageManager.getItem(storageValues.sourcesFavoriteFilterKey);

        expect(userValue).toBeNull();
        expect(settingValue).toBeNull();
        expect(displayValue).toBeNull();
        expect(userLastActionTimeValue).toBeNull();
        expect(sourcesSearchFilterValue).toBeNull();
        expect(sourcesFavoriteFilterValue).toBeNull();
    });

    it("Service should be able to clear storage data", () => {
        // storing data in storage
        storageManager.setItem(storageValues.userKey, JSON.stringify(storageValues.userValue));
        storageManager.removeStorage();
        const storageLength: number = window.sessionStorage.length;
        expect(storageLength).toBe(0);
    });
});
