/**
 * The interface defines the model for User Profile Setiings.
 * @interface IWallConnection
 */
export interface IWallConnection {
    "startUpAction": string;
    "specificDisplay": string;
    "recentDisplay": string;
}

export interface ISourceLabel {
    "displaySourceNameLabels": boolean;
    "useMultipleLines": boolean;
    "fontColor": string;
    "fontSize": number;
    "backgroundColor": string;
    "transparency": number;
}

export interface IUserProfileSettings {
    "language": string;
    "wallConnection": IWallConnection;
    "sourceLabel": ISourceLabel;
    "logOffTime": number;
    "pageSize": number;
}
