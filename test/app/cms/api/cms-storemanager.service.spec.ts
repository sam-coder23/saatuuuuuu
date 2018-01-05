import { TestBed } from "@angular/core/testing";
import { StorageManager } from "../../../../app/cms/api/cms-storagemanager.service";

describe("Service: StorageManager", () => {
    let storageManager;
    let storageValues: any = {
        userKey: "_User",
        userValue: { "username": "bcd-se-test", "loggedIn": true },
        settingKey: "_Settings",
        settingValue: {
            "language": "en",
            "wallConnection": {
                "atStartup": {
                    "status": "show-available-walls-list",
                    "selectedDisplayId": 31,
                    "recentDisplayId": 34
                }
            },
            "sourceLabels": {
                "displaySourceNameLabels": true,
                "useMultipleLines": false,
                "fontColor": "#FFFFFF",
                "fontSize": 14,
                "background": "#BDBDBD",
                "transparency": 50
            },
            "logOffTime": 0,
            "defaultPageSize": 50
        },
        displayKey: "_Display",
        displayValue: {
            "id": 34,
            "name": "NGP_Display1513",
            "type": "OperatorWorkStation",
            "description": "operator computer1513",
            "snapshotPath": "https://10.98.0.231//mediaconfiguration?action=get&path=images%2Fsnapshots%2Fdisplays%2Fdisplay-defaultimage.jpg&_=1507287494621",
            "resolution": {
                "width": 1600,
                "height": 1440
            },
            "online": false,
            "acknowledged": true,
            "computerName": "workstation1513",
            "tags": "",
            "startUpAction": "DefaultBehaviourAction",
            "favorite": false,
            "loggedInUserName": "",
            "squidModeConfiguration": {
                "id": 0,
                "enabled": false,
                "hoverDelay": 500,
                "borderWidth": 2,
                "leftSource": null,
                "rightSource": null,
                "topSource": null,
                "bottomSource": null
            },
            "autoloadPerspective": 0,
            "modules": [
                {
                    "id": 38,
                    "geometry": {
                        "left": 0,
                        "top": 0,
                        "width": 1600,
                        "height": 1200
                    }
                },
                {
                    "id": 39,
                    "geometry": {
                        "left": 0,
                        "top": 240,
                        "width": 1600,
                        "height": 1200
                    }
                },
                {
                    "id": 40,
                    "geometry": {
                        "left": 0,
                        "top": 120,
                        "width": 1600,
                        "height": 1200
                    }
                }
            ]
        },
        userLastActionTimeKey: "_UserLastActionTime",
        userLastActionTimeValue: 1507289580624,
        sourcesSearchFilterKey: "_SourcesSearchFilter",
        sourcesSearchFilterValue: "Noida Demo Room",
        sourcesFavoriteFilterKey: "_SourcesFavoriteFilter",
        sourcesFavoriteFilterValue: true
    }

    beforeEach(async () =>
        TestBed.configureTestingModule({
            providers: [
                StorageManager
            ]
        }));

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

        let userValue = window.sessionStorage.getItem(storageValues.userKey);
        let settingValue = window.sessionStorage.getItem(storageValues.settingKey);
        let displayValue = window.sessionStorage.getItem(storageValues.displayKey);
        let userLastActionTimeValue = window.sessionStorage.getItem(storageValues.userLastActionTimeKey);
        let sourcesSearchFilterValue = window.sessionStorage.getItem(storageValues.sourcesSearchFilterKey);
        let sourcesFavoriteFilterValue = window.sessionStorage.getItem(storageValues.sourcesFavoriteFilterKey);

        expect(userValue).toBe(JSON.stringify(storageValues.userValue));
        expect(settingValue).toBe(JSON.stringify(storageValues.settingValue));
        expect(displayValue).toBe(JSON.stringify(storageValues.displayValue));
        expect(userLastActionTimeValue).toBe(JSON.stringify(storageValues.userLastActionTimeValue));
        expect(sourcesSearchFilterValue).toBe(storageValues.sourcesSearchFilterValue);
        expect(sourcesFavoriteFilterValue).toBe(JSON.stringify(storageValues.sourcesFavoriteFilterValue));
    });

    it("Service should be able to get stored value", () => {
        let userValue = storageManager.getItem(storageValues.userKey);
        let settingValue = storageManager.getItem(storageValues.settingKey);
        let displayValue = storageManager.getItem(storageValues.displayKey);
        let userLastActionTimeValue = storageManager.getItem(storageValues.userLastActionTimeKey);
        let sourcesSearchFilterValue = storageManager.getItem(storageValues.sourcesSearchFilterKey);
        let sourcesFavoriteFilterValue = storageManager.getItem(storageValues.sourcesFavoriteFilterKey);

        expect(userValue).toBe(JSON.stringify(storageValues.userValue));
        expect(settingValue).toBe(JSON.stringify(storageValues.settingValue));
        expect(displayValue).toBe(JSON.stringify(storageValues.displayValue));
        expect(userLastActionTimeValue).toBe(JSON.stringify(storageValues.userLastActionTimeValue))
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

        let userValue = storageManager.getItem(storageValues.userKey);
        let settingValue = storageManager.getItem(storageValues.settingKey);
        let displayValue = storageManager.getItem(storageValues.displayKey);
        let userLastActionTimeValue = storageManager.getItem(storageValues.userLastActionTimeKey);
        let sourcesSearchFilterValue = storageManager.getItem(storageValues.sourcesSearchFilterKey);
        let sourcesFavoriteFilterValue = storageManager.getItem(storageValues.sourcesFavoriteFilterKey);

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
        let storageLength = window.sessionStorage.length;

        expect(storageLength).toBe(0);
    });
});
