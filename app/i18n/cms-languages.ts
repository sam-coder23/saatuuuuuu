/**
 * This class defines available CMS Languages.
 * @class CmsLanguages
 * @property {any[]} languages key-value pair of languages
 * @property {string[]} languagesKeys keys of languages
 * @property {RegExp} languagesRegExPattern
 */
export class CmsLanguages {
    public static languages: any = [
        { key: "ar", value: "العربية" },
        { key: "de", value: "German" },
        { key: "en", value: "English" },
        { key: "es", value: "Español" },
        { key: "fr", value: "Francais" },
        { key: "ja", value: "日本語" },
        { key: "pl", value: "Polski" },
        { key: "pt", value: "Portuguěs" },
        { key: "zh", value: "中文" },
        { key: "tr", value: "Türk"},
        { key: "ru", value: "русский"}
    ];

    public static languagesKeys: string[] = ["ar", "de", "en", "es", "fr", "ja", "pl", "pt", "zh", "tr", "ru"];

    public static languagesRegExPattern: RegExp = /ar|de|en|es|fr|ja|pl|pt|zh|tr|ru/;
}
