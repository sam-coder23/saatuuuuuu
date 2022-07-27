/**
 * Test specification for Generic collections utility.
 */
import { GenericCollection } from "../../../../../app/core/type/extended/GenericCollection";

const dataLimit: number = 10;
describe("GenericCollection", () => {
    it("add key value(number) pair as defined collection and get the data as passed to collection", () => {
        const collection: GenericCollection<number> = new GenericCollection<number>();
        expect(collection).toBeDefined();

        collection.add("limit", dataLimit);
        const value: boolean = collection.hasKey("limit");
        expect(value).toBe(true);

        const noValue: boolean = collection.hasKey("source");
        expect(noValue).toBe(false);

        const data: number = collection.item("limit");
        expect(data).toBe(dataLimit);
    });

    it("add key value(string) pair as defined collection and get the data as passed to collection", () => {
        const collection: GenericCollection<string> = new GenericCollection<string>();
        expect(collection).toBeDefined();

        collection.add("userName", "Kanchan");

        const value: boolean = collection.hasKey("userName");
        expect(value).toBe(true);

        const data: string = collection.item("userName");
        expect(data).toBe("Kanchan");
    });
});
