import { DISPLAY_TYPE } from "./display-type.enum";

describe("Display-Type - ", () => {

    it("should expect enums not to be changed", () => {
        expect(DISPLAY_TYPE[DISPLAY_TYPE.DisplayWall]).toBe("DisplayWall");
        expect(DISPLAY_TYPE[DISPLAY_TYPE.NGPWall]).toBe("NGPWall");
        expect(DISPLAY_TYPE[DISPLAY_TYPE.OperatorWorkStation]).toBe("OperatorWorkStation");
    });

});