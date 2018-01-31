/**
 * parsing-manager.util is responsible for parsing Integers for preventing radix issues.
 */
import { ParsingManager } from "../../../app/utils/parsing-manager-util";

describe("Parsing Manager", () => {
  const parseValue: number = 56;
  it("should parses a string argument and returns an integer of radix 10", () => {
    expect(ParsingManager.TO_INTEGER("56")).toEqual(parseValue);
  });
});
