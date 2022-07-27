/**
 * This class is responsible to handle unit test case of CmsLaunchapadModule
 */
import { APP_BASE_HREF } from "@angular/common";
import { async, ComponentFixture, TestBed  } from "@angular/core/testing";

import { CmsLaunchapadModule } from "../../../app/launchpad/cms-launchpad.module";

describe("Module: App", () => {
    let fixture: ComponentFixture<CmsLaunchapadModule>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [CmsLaunchapadModule],
            providers: [
                { provide: APP_BASE_HREF, useValue: "/" }
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.get(CmsLaunchapadModule);
        });
    }));

    it("should be defined launchpad module", ((): void => {
        expect(fixture).toBeDefined();
    }));
});
