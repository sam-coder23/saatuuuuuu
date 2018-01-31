/**
 * Test specification for cms-languages
 */
import { CmsLanguages } from "../../../app/i18n/cms-languages";

describe("Cms Languages: ", () => {
    const expectedLanguages: { key: string, value: string }[] = [
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

    const expectedLanguagesKeys: string[] = ["ar", "de", "en", "es", "fr", "ja", "pl", "pt", "zh", "tr", "ru"];
     // tslint:disable-next-line:mocha-no-side-effect-code
    const expectedLanguagesRegExPattern: any =
        /ar|de|en|es|fr|ja|pl|pt|zh|tr|ru/;

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
