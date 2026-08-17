export type TCalendarView = 'day' | 'week' | 'month' | 'year' | 'agenda'
/** The seven built-in color names, each with its own Tailwind class map. */
export type TLegacyEventColor = 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange' | 'gray'
/**
 * Open union: the seven legacy names keep autocomplete, but any CSS color string
 * is accepted and rendered through `--bc-event-color`.
 */
export type TEventColor = TLegacyEventColor | (string & {})
export type TBadgeVariant = 'dot' | 'colored' | 'mixed'
export type TWorkingHours = { [key: number]: { from: number; to: number } }
export type TVisibleHours = { from: number; to: number }
