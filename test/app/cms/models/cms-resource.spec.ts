/**
 * Test specification for resource model.
 */
import { CmsResource } from "../../../../app/cms/models/cms-resource";
import { resource } from "../../core/mock-stubs/tile.mock";
const resourceModel: CmsResource = resource;

describe("Resource Model - ", () => {
    it("should initialise with correct values", () => {
        const resource: CmsResource = new CmsResource(resourceModel);
        expect(resource.id).toBe(resourceModel.id);
        expect(resource.name).toBe(resourceModel.name);
        expect(resource.description).toBe(resourceModel.description);
        expect(resource.snapshotPath).toBe(resourceModel.snapshotPath);
        expect(resource.disabled).toBe(resourceModel.disabled);
        expect(resource.favorite).toBe(resourceModel.favorite);
    });
});
