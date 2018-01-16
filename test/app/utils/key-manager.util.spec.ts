import { TestBed } from '@angular/core/testing';
import { GenericCollection } from "./../../../app/core/type/extended/GenericCollection";
import { KeyManager } from "./../../../app/utils/key-manager.util";

describe("Key-Manager", () => {
  let keyManager: KeyManager;

  beforeEach(() => {
    keyManager = new KeyManager();
  });

  it("should be defined", () => {
    expect(keyManager).toBeDefined();
  });

  it("should check for keyName in the collection", () => {
    expect(keyManager.hasKey("Escape")).toBeTruthy();
  });

  it("should check for keyCode in the collection", () => {
    expect(keyManager.keyCode("Escape")).toEqual(27);
  });

  it("should check for ESC key press by user or not", () => {
    let keyboardEvent: KeyboardEvent = new KeyboardEvent("keypress");
    Object.defineProperty(keyboardEvent, "which", { value: 27 });
    expect(keyManager.isEscapeKey(keyboardEvent)).toBeTruthy();
  });
});
