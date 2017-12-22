/**
 * This class defines a generic information that all cms resources like source, display etc contain.
 * @class CmsResource
 * @property {number} id
 * @property {string} name
 * @property {string} description source's description
 * @property {string} snapshotPath image path mapped on the source
 * @property {boolean} disabled default value false shows enabled status of the display
 * @property {boolean} favorite indicates the favorite flag marked for a source
 */
export class CmsResource {
    public id: number;
    public name: string;
    public description: string;
    public snapshotPath: string;
    public disabled: boolean = false;
    public favorite: boolean = false;

    constructor(resource: object) {
        if (resource) {
            const resourceObject: CmsResource = <CmsResource>resource;

            this.id = resourceObject.id;
            this.name = resourceObject.name;
            this.description = resourceObject.description;
            this.snapshotPath = resourceObject.snapshotPath;
            this.disabled = resourceObject.disabled;
            this.favorite = resourceObject.favorite;
        }
    }
}
