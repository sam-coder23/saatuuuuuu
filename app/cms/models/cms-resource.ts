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

    constructor(resource) {
        this.id = resource.id;
        this.name = resource.name;
        this.description = resource.description;
        this.snapshotPath = resource.snapshotPath;
        this.disabled = resource.disabled;
        this.favorite = resource.favorite;
    }
}