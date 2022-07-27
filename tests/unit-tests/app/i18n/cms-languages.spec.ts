/**
 * Test specification for cms-languages
 */
import { CmsLanguages } from "../../../app/i18n/cms-languages";

describe("Cms Languages: ", () => {
    const ARABIC: string = "ar";
    const GERMAN: string = "de";
    const ENGLISH: string = "en";
    const ESPANOL: string = "es";
    const FRENCH: string = "fr";
    const JAPANESE: string = "ja";
    const POLISH: string = "pl";
    const PORTUGESE: string = "pt";
    const CHINESE: string = "zh";
    const TURKISH: string = "tr";
    const RUSSIAN: string = "ru";

    const expectedLanguages: { key: string, value: string }[] = [
        { key: ARABIC, value: "العربية" },
        { key: GERMAN, value: "German" },
        { key: ENGLISH, value: "English" },
        { key: ESPANOL, value: "Español" },
        { key: FRENCH, value: "Francais" },
        { key: JAPANESE, value: "日本語" },
        { key: POLISH, value: "Polski" },
        { key: PORTUGESE, value: "Portuguěs" },
        { key: CHINESE, value: "中文" },
        { key: TURKISH, value: "Türk" },
        { key: RUSSIAN, value: "русский" }
    ];

    const expectedLanguagesKeys: string[] = [ARABIC, GERMAN, ENGLISH, ESPANOL, FRENCH, JAPANESE, POLISH, PORTUGESE, CHINESE,
        TURKISH, RUSSIAN
    ];

     // tslint:disable-next-line:mocha-no-side-effect-code
    const expectedLanguagesRegExPattern: RegExp = new RegExp(expectedLanguagesKeys.join("|"));

    it("languages should be defined", () => {
        expect(CmsLanguages).toBeDefined();
        expect((new CmsLanguages()).languages).toEqual(expectedLanguages);
    });

    it("language keys should be defined", () => {
        expect((new CmsLanguages()).languageKeys).toEqual(expectedLanguagesKeys);
    });

    it("language regExp pattern should be defined", () => {
        expect((new CmsLanguages()).languagesRegExPattern).toEqual(expectedLanguagesRegExPattern);
    });

});
