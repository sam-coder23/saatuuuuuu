import { TestBed, async } from "@angular/core/testing";
import { CmsLanguages } from "./cms-languages";

describe("Cms Languages: ", () => {

    let expectedLanguages = [
        { key: "ar", value: "العربية" },
        { key: "de", value: "German" },
        { key: "en", value: "English" },
        { key: "es", value: "Español" },
        { key: "fr", value: "Francais" },
        { key: "ja", value: "日本語" },
        { key: "pl", value: "Polski" },
        { key: "pt", value: "Portuguěs" },
        { key: "zh", value: "中文" },
        { key: "tr", value: "Türk" },
        { key: "ru", value: "русский" }
    ];

    let expectedLanguagesKeys = ["ar", "de", "en", "es", "fr", "ja", "pl", "pt", "zh", "tr", "ru"];

    let expectedLanguagesRegExPattern = /ar|de|en|es|fr|ja|pl|pt|zh|tr|ru/;

    beforeEach(async () =>
        TestBed.configureTestingModule({}));

    it("languages should be defined", () => {
        expect(CmsLanguages).toBeDefined();
        expect(CmsLanguages.languages).toEqual(expectedLanguages);
    });

    it("language keys should be defined", () => {
        expect(CmsLanguages.languagesKeys).toEqual(expectedLanguagesKeys);
    });

    it("language regExp pattern should be defined", () => {
        expect(CmsLanguages.languagesRegExPattern).toEqual(expectedLanguagesRegExPattern);
    });

});
