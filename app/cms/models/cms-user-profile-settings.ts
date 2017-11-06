/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

/**
 * The interface defines the model for User Profile Setiings.
 */
export interface IWallConnection {
    "startUpAction": string,
    "specificDisplay": string,
    "recentDisplay": string
}

export interface ISourceLabel {
    "displaySourceNameLabels": boolean,
    "useMultipleLines": boolean,
    "fontColor": string,
    "fontSize": number,
    "backgroundColor": string,
    "transparency": number
}

export interface IWallContent {
    "requireConfirmationForLoadingLayouts": boolean,
    "allowChangingSources": boolean,
    "clipboardEnabled": boolean,
    "clipboardSize": string
}

export interface IUserProfileSettings {
    "language": string,
    "wallConnection": IWallConnection,
    "sourceLabel": ISourceLabel,
    "wallContent": IWallContent,
    "logOffTime": number,
    "pageSize": number
}