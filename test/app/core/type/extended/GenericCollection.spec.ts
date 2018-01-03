import { GenericCollection } from "../../../../../app/core/type/extended/GenericCollection";

describe("GenericCollection", () => {

    it("add key value(number) pair as defined collection and get the data as passed to collection", () => {
        let collection = new GenericCollection<number>();
        expect(collection).toBeDefined();

        collection.add("limit", 10);

        let value = collection.hasKey("limit");
        expect(value).toBe(true);

        let noValue = collection.hasKey("source");
        expect(noValue).toBe(false);

        let data = collection.item("limit");
        expect(data).toBe(10);
    });

    it("add key value(string) pair as defined collection and get the data as passed to collection", () => {
        let collection = new GenericCollection<string>();
        expect(collection).toBeDefined();

        collection.add("userName", "Kanchan");

        let value = collection.hasKey("userName");
        expect(value).toBe(true);

        let data = collection.item("userName");
        expect(data).toBe("Kanchan");
    });
});
