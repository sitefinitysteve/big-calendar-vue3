// CSS (extracted to dist/style.css by Vite)
import './calendar-lib.css'

// Components
export { default as BigCalendar } from '@/calendar/components/CalendarContainer.vue'
export { default as CalendarHeader } from '@/calendar/components/header/CalendarHeader.vue'
export { default as CalendarMonthView } from '@/calendar/components/month-view/CalendarMonthView.vue'
export { default as CalendarWeekView } from '@/calendar/components/week-view/CalendarWeekView.vue'
export { default as CalendarDayView } from '@/calendar/components/day-view/CalendarDayView.vue'
export { default as CalendarYearView } from '@/calendar/components/year-view/CalendarYearView.vue'
export { default as CalendarAgendaView } from '@/calendar/components/agenda-view/CalendarAgendaView.vue'

// Store
export { useCalendarStore } from '@/stores/calendar'

// Composables
export { useCalendarGrid } from '@/calendar/composables/useCalendarGrid'
export { useFilteredEvents } from '@/calendar/composables/useFilteredEvents'
export { useEventPositioning } from '@/calendar/composables/useEventPositioning'
export { useVisibleHours } from '@/calendar/composables/useVisibleHours'
export { useCurrentTime } from '@/calendar/composables/useCurrentTime'
export { useDisclosure } from '@/calendar/composables/useDisclosure'
export { useUpdateEvent } from '@/calendar/composables/useUpdateEvent'

// Helpers
export {
  rangeText,
  navigateDate,
  getEventsCount,
  getCurrentEvents,
  groupEvents,
  getEventBlockStyle,
  isWorkingHour,
  getVisibleHours,
  getCalendarCells,
  calculateMonthEventPositions,
  getMonthCellEvents,
} from '@/calendar/helpers'

// Types & Interfaces
export type {
  TCalendarView,
  TEventColor,
  TLegacyEventColor,
  TBadgeVariant,
  TWorkingHours,
  TVisibleHours,
} from '@/calendar/types'
export type { IEvent, IUser, ICalendarCell, ICalendarCommand, ICalendarCommandSelect } from '@/calendar/interfaces'

// Customization (v1.2.0)
export {
  CALENDAR_CUSTOMIZATION_KEY,
  useCalendarCustomization,
  isLegacyColor,
  LEGACY_EVENT_COLORS,
  DEFAULT_CUSTOMIZATION,
} from '@/calendar/customization'
export type {
  TEventRenderer,
  TEventRenderView,
  IEventSlotProps,
  ICalendarClassNames,
  ICalendarCustomization,
} from '@/calendar/customization'

// Date formatting (v1.2.0)
export {
  datePattern,
  longDatePattern,
  timePattern,
  hourPattern,
  dateTimePattern,
  is24HourLocale,
  formatDate,
  formatLongDate,
  formatTime,
  formatHour,
  formatDateTime,
} from '@/calendar/date-format'

// Labels
export type { ICalendarLabels } from '@/calendar/labels'
export { DEFAULT_LABELS, useCalendarLabels, useDateLocale } from '@/calendar/labels'

// Schemas
export { eventSchema, createEventSchema, type TEventFormData } from '@/calendar/schemas'

// Mock data (for demos)
export { USERS_MOCK, CALENDAR_ITEMS_MOCK } from '@/calendar/mocks'
