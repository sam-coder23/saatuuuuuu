/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

/**
 * The interface defines the model for User Profile Setiings.
 * 
 * @author: CHERA, AKAAR
 * @version: CMS 3.0
 */
export interface IWallConnection {
    "atStartup": {
        "status": string,
        "selectedDisplayId": any,
        "recentDisplayId": any
    }
}

export interface ISourceLabels {
    "displaySourceNameLabels": boolean,
    "useMultipleLines": boolean,
    "fontColor": string,
    "fontSize": number,
    "background": string,
    "transparency": number
}

export interface IManageWallContent {
    "requireConfirmationforLoadingLayouts": boolean,
    "allowChangingSources": boolean,
    "clipboard": {
        "isEnabled": boolean,
        "status": string
    }
}

export interface IUserProfileSettings {
    "language": string,
    "wallConnection": IWallConnection,
    "sourceLabels": ISourceLabels,
    "manageWallContent": IManageWallContent,
    "logOffTime": number,
    "defaultPageSize": number
}