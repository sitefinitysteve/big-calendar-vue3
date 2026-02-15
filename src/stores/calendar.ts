import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IEvent, IUser } from '@/calendar/interfaces'
import type { TBadgeVariant, TCalendarView, TVisibleHours, TWorkingHours } from '@/calendar/types'

const DEFAULT_WORKING_HOURS: TWorkingHours = {
  0: { from: 0, to: 0 },
  1: { from: 8, to: 17 },
  2: { from: 8, to: 17 },
  3: { from: 8, to: 17 },
  4: { from: 8, to: 17 },
  5: { from: 8, to: 17 },
  6: { from: 8, to: 12 },
}

const DEFAULT_VISIBLE_HOURS: TVisibleHours = { from: 7, to: 18 }

export const useCalendarStore = defineStore('big-calendar', () => {
  const selectedDate = ref(new Date())
  const selectedUserId = ref<string | 'all'>('all')
  const badgeVariant = ref<TBadgeVariant>('colored')
  const users = ref<IUser[]>([])
  const events = ref<IEvent[]>([])
  const workingHours = ref<TWorkingHours>({ ...DEFAULT_WORKING_HOURS })
  const visibleHours = ref<TVisibleHours>({ ...DEFAULT_VISIBLE_HOURS })
  const availableViews = ref<TCalendarView[]>(['day', 'week', 'month', 'year', 'agenda'])
  const showUserSelect = ref(true)
  const canAdd = ref(true)
  const canEdit = ref(true)
  const canDelete = ref(true)

  function setSelectedDate(date: Date | undefined) {
    if (!date) return
    selectedDate.value = date
  }

  function addEvent(event: IEvent) {
    events.value = [...events.value, {
      ...event,
      startDate: new Date(event.startDate).toISOString(),
      endDate: new Date(event.endDate).toISOString(),
    }]
  }

  function updateEvent(updatedEvent: IEvent) {
    const index = events.value.findIndex(e => e.id === updatedEvent.id)
    if (index === -1) return
    events.value = [
      ...events.value.slice(0, index),
      { ...updatedEvent, startDate: new Date(updatedEvent.startDate).toISOString(), endDate: new Date(updatedEvent.endDate).toISOString() },
      ...events.value.slice(index + 1),
    ]
  }

  function deleteEvent(eventId: number) {
    events.value = events.value.filter(e => e.id !== eventId)
  }

  function initialize(initialUsers: IUser[], initialEvents: IEvent[]) {
    users.value = initialUsers
    events.value = initialEvents
  }

  return {
    selectedDate,
    selectedUserId,
    badgeVariant,
    users,
    events,
    workingHours,
    visibleHours,
    availableViews,
    showUserSelect,
    canAdd,
    canEdit,
    canDelete,
    setSelectedDate,
    addEvent,
    updateEvent,
    deleteEvent,
    initialize,
  }
})
