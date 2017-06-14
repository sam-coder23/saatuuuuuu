/**
* Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
* ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
* the terms of the license agreement you entered into with Barco.
*/

/**
 * This class defines available CMS Languages.
 * 
 * @author: CHERA
 * @version: CMS 3.0
 */
export class CmsLanguages {
    static languages = [
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

    static languagesKeys = ["ar", "de", "en", "es", "fr", "ja", "pl", "pt", "zh", "tr", "ru"];

    static languagesRegExPattern = /ar|de|en|es|fr|ja|pl|pt|zh|tr|ru/
}