import { CmsResource } from "../../../../app/cms/models/cms-resource";

let resourceModel = {
    "id": 8,
    "name": "NGPWall",
    "description": "Some description.",
    "snapshotPath": "",
    "disabled": false,
    "favorite": false
};

describe("Resource Model - ", () => {

    it("should initialise with correct values", () => {
        let resource = new CmsResource(resourceModel);
        expect(resource.id).toBe(resourceModel.id);
        expect(resource.name).toBe(resourceModel.name);
        expect(resource.description).toBe(resourceModel.description);
        expect(resource.snapshotPath).toBe(resourceModel.snapshotPath);
        expect(resource.disabled).toBe(resourceModel.disabled);
        expect(resource.favorite).toBe(resourceModel.favorite);
    });

});
