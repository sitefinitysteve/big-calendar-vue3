import { computed, type Ref } from 'vue'
import { parseISO, isSameDay } from 'date-fns'
import { useCalendarStore } from '@/stores/calendar'
import type { TCalendarView } from '@/calendar/types'

export function useFilteredEvents(view: Ref<TCalendarView>) {
  const store = useCalendarStore()

  const filteredEvents = computed(() => {
    const selectedDate = store.selectedDate
    const selectedUserId = store.selectedUserId
    const events = store.events

    return events.filter(event => {
      const eventStartDate = parseISO(event.startDate)
      const eventEndDate = parseISO(event.endDate)

      const isUserMatch = selectedUserId === 'all' || event.user.id === selectedUserId

      if (view.value === 'year') {
        const yearStart = new Date(selectedDate.getFullYear(), 0, 1)
        const yearEnd = new Date(selectedDate.getFullYear(), 11, 31, 23, 59, 59, 999)
        return eventStartDate <= yearEnd && eventEndDate >= yearStart && isUserMatch
      }

      if (view.value === 'month' || view.value === 'agenda') {
        const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
        const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999)
        return eventStartDate <= monthEnd && eventEndDate >= monthStart && isUserMatch
      }

      if (view.value === 'week') {
        const dayOfWeek = selectedDate.getDay()
        const weekStart = new Date(selectedDate)
        weekStart.setDate(selectedDate.getDate() - dayOfWeek)
        weekStart.setHours(0, 0, 0, 0)
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        weekEnd.setHours(23, 59, 59, 999)
        return eventStartDate <= weekEnd && eventEndDate >= weekStart && isUserMatch
      }

      if (view.value === 'day') {
        const dayStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0, 0)
        const dayEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59)
        return eventStartDate <= dayEnd && eventEndDate >= dayStart && isUserMatch
      }

      return false
    })
  })

  const singleDayEvents = computed(() =>
    filteredEvents.value.filter(event =>
      isSameDay(parseISO(event.startDate), parseISO(event.endDate)) && !event.isAllDay
    )
  )

  const multiDayEvents = computed(() =>
    filteredEvents.value.filter(event =>
      !isSameDay(parseISO(event.startDate), parseISO(event.endDate)) || !!event.isAllDay
    )
  )

  // For year view: only use start dates as indicators
  const eventStartDates = computed(() =>
    filteredEvents.value.map(event => ({ ...event, endDate: event.startDate }))
  )

  return { filteredEvents, singleDayEvents, multiDayEvents, eventStartDates }
}
