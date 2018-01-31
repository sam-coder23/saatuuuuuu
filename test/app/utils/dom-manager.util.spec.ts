/**
 * This class is responsible to handle unit test case of CmsAboutPanelComponent component
 */
import { ElementRef } from "@angular/core";
import { DomManager } from "../../../app/utils/dom-manager.util";

describe("DomManager", () => {
  let domManager: DomManager;
  let parentContainer: any;

  const createMockDom: any = (): ElementRef => {
    parentContainer = document.createElement("div");
    parentContainer.setAttribute("id", "parent-id");

    const firstChildContainer: HTMLDivElement = document.createElement("div");
    firstChildContainer.setAttribute("id", "first-child-id");
    firstChildContainer.setAttribute("class", "first-class-name");

    const secondChildContainer: HTMLDivElement = document.createElement("div");
    secondChildContainer.setAttribute("id", "second-child-id");
    secondChildContainer.setAttribute("class", "second-class-name");

    parentContainer.appendChild(firstChildContainer);
    parentContainer.appendChild(secondChildContainer);
    document.body.appendChild(parentContainer);

    return new ElementRef(parentContainer);
  };

  beforeEach(() => {
    domManager = new DomManager(createMockDom());
  });

  it("should return the first child of current DOM element", () => {
    expect(domManager.firstChild()).toEqual(parentContainer.children[0]);
  });

  it("should return the last child of current DOM element", () => {
    expect(domManager.lastChild()).toEqual(parentContainer.children[1]);
  });

  it("should return the nthChild of current DOM element", () => {
    expect(domManager.nthChild(1)).toEqual(parentContainer.children[1]);
  });

  it("should return element with the help of class attribute", () => {
    expect(domManager.getElementsByClassName("first-class-name")[0]).toEqual(parentContainer.children[0]);
  });

  it("should return element with the help of id attribute", () => {
    expect(domManager.getElementById("second-child-id")).toEqual(parentContainer.children[1]);
  });
});
