
/**
 * This class defines a generic information that all cms resources like source, display etc contain.
 */
export class CmsResource {
    id: number;
    name: string;
    description: string;
    snapshotPath: string;
    disabled: boolean = false;
    favorite: boolean = false;

    constructor(resource) {
        this.id = resource.id;
        this.name = resource.name;
        this.description = resource.description;
        this.snapshotPath = resource.snapshotPath;
        this.disabled = resource.disabled;
        this.favorite = resource.favorite;
    }
}