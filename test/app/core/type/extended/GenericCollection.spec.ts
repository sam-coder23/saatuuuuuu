import { GenericCollection } from "../../../../../app/core/type/extended/GenericCollection";

describe("GenericCollection", () => {

    it("add key value(number) pair as defined collection and get the data as passed to collection", () => {
        let collection = new GenericCollection<number>();
        expect(collection).toBeDefined();
        
        collection.Add("limit", 10);
        
        let value = collection.HasKey("limit");
        expect(value).toBe(true);

        let noValue = collection.HasKey("source");
        expect(noValue).toBe(false);

        let data = collection.Item("limit");
        expect(data).toBe(10);
    });

    it("add key value(string) pair as defined collection and get the data as passed to collection", () => {
        let collection = new GenericCollection<string>();
        expect(collection).toBeDefined();
        
        collection.Add("userName", "Kanchan");
        
        let value = collection.HasKey("userName");
        expect(value).toBe(true);

        let data = collection.Item("userName");
        expect(data).toBe("Kanchan");
    });
});