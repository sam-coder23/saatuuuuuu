import { EventManager } from '../../../app/utils/event-manager.util';

describe("Event Manager", () => {
  let mockValue: boolean;
  let mockHandler = () => {
    mockValue = true;
  };

  beforeEach(() => {
    mockValue = false;
  });

  it("should add event listener to event loop on document", () => {
    EventManager.ADD_EVENT("click", mockHandler);
    window.document.dispatchEvent(new Event("click"));
    expect(mockValue).toBeTruthy();
  });

  it("should remove event listener to event loop on document", () => {
    EventManager.REMOVE_EVENT("click", mockHandler);
    window.document.dispatchEvent(new Event("click"));
    expect(mockValue).toBeFalsy();
  });

  it("should add event listener to event loop on element given as parameter", () => {
    let container = document.createElement("div");
    EventManager.ADD_EVENT_ON_ELEMENT(container, "click", mockHandler);
    container.dispatchEvent(new Event("click"));
    expect(mockValue).toBeTruthy();
  });

  it("should remove event listener to event loop on element given as parameter", () => {
    let container = document.createElement("div");
    EventManager.REMOVE_EVENT_ON_ELEMENT(container, "click", mockHandler);
    container.dispatchEvent(new Event("click"));
    expect(mockValue).toBeFalsy();
  });
});
