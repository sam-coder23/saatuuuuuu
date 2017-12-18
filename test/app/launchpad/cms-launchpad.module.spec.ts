import { TestBed, async } from "@angular/core/testing";
import { CmsLaunchapadModule } from "../../../app/launchpad/cms-launchpad.module";
import { APP_BASE_HREF } from "@angular/common";

describe("Module: App", () => {
    let fixture;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [CmsLaunchapadModule],
            providers: [
                { provide: APP_BASE_HREF, useValue: "/" },
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.get(CmsLaunchapadModule);
        });
    }));

    it("should be defined launchpad module", (() => {
        expect(fixture).toBeDefined();
    }));
});