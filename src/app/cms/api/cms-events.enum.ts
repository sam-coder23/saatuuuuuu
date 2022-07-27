/**
 * This enum defines the event name corresponding to components.
 * If mini-display component wanted to receive its respective events,
 * then event should be emitted or subscribed using name CMS_EVENTS.MiniDisplay
 */
export enum CMS_EVENTS {
    MiniDisplay,
    DisplayList,
    SourceList,
    DisplayPanel,
    Application,
    TileList
}
