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
export type { TCalendarView, TEventColor, TBadgeVariant, TWorkingHours, TVisibleHours } from '@/calendar/types'
export type { IEvent, IUser, ICalendarCell } from '@/calendar/interfaces'

// Schemas
export { eventSchema, type TEventFormData } from '@/calendar/schemas'

// Mock data (for demos)
export { USERS_MOCK, CALENDAR_ITEMS_MOCK } from '@/calendar/mocks'
