import { ParsingManager } from '../../../app/utils/parsing-manager-util';

describe("Parsing Manager", () => {
  it("should parses a string argument and returns an integer of radix 10", () => {
    expect(ParsingManager.TO_INTEGER("56")).toEqual(56);
  });
});
