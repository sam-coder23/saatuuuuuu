/**
 * Copyright (c) 2016 Barco n.v. All Rights Reserved. This software is confidential and proprietary information of Barco n.v.
 * ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with Barco.
 */

/**
 * This enum defines the event name corresponding to components.
 * @example: If mini-display component wanted to receive its respective events, 
 *           then event should be emitted or subscribed using name CMS_EVENTS.MiniDisplay
 */
export enum CMS_EVENTS {
    MiniDisplay,
    DisplayList,
    SourceList,
    Display,
    Application,
    TileList
}