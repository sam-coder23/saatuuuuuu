/**
 * This class defines available CMS Languages.
 * @class CmsLanguages
 * @property {any[]} languages key-value pair of languages
 * @property {string[]} languagesKeys keys of languages
 * @property {RegExp} languagesRegExPattern
 */
export class CmsLanguages {
    public languages: { key: string, value: string }[] = [];

    public languageKeys: string[] = [];

    public languagesRegExPattern: RegExp = new RegExp(this.languageKeys.join("|"));

    private ARABIC: string = "ar";
    private GERMAN: string = "de";
    private ENGLISH: string = "en";
    private ESPANOL: string = "es";
    private FRENCH: string = "fr";
    private JAPANESE: string = "ja";
    private POLISH: string = "pl";
    private PORTUGESE: string = "pt";
    private CHINESE: string = "zh";
    private TURKISH: string = "tr";
    private RUSSIAN: string = "ru";

    constructor() {
        this.languageKeys = [
            this.ARABIC,
            this.GERMAN,
            this.ENGLISH,
            this.ESPANOL,
            this.FRENCH,
            this.JAPANESE,
            this.POLISH,
            this.PORTUGESE,
            this.CHINESE,
            this.TURKISH,
            this.RUSSIAN
        ];

        this.languages = [
            { key: this.ARABIC, value: "العربية" },
            { key: this.GERMAN, value: "German" },
            { key: this.ENGLISH, value: "English" },
            { key: this.ESPANOL, value: "Español" },
            { key: this.FRENCH, value: "Francais" },
            { key: this.JAPANESE, value: "日本語" },
            { key: this.POLISH, value: "Polski" },
            { key: this.PORTUGESE, value: "Portuguěs" },
            { key: this.CHINESE, value: "中文" },
            { key: this.TURKISH, value: "Türk" },
            { key: this.RUSSIAN, value: "русский" }
        ];
    }
}
