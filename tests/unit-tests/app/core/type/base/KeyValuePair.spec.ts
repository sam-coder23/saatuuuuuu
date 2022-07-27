/**
 * This is the test specification for KeyValue Pair class.
 */
import { KeyValuePair } from "../../../../../app/core/type/base/KeyValuePair";

describe("KeyValuePair", () => {
  // tslint:disable-next-line:mocha-no-side-effect-code
  it("should expect that key value pair is defined", () => {
    const keyValuePair: KeyValuePair = new KeyValuePair();
    expect(keyValuePair).toBeDefined();
    expect(keyValuePair.key).toBeUndefined();
    expect(keyValuePair.value).toBeUndefined();
  });

  it("should assign key and value on a defined key value pair", () => {
    const keyValuePair: KeyValuePair = new KeyValuePair();
    keyValuePair.key = "Hello";
    keyValuePair.value = "World";
    expect(keyValuePair).toBeDefined();
    expect(keyValuePair.key).toEqual("Hello");
    expect(keyValuePair.value).toEqual("World");
  });
});
