import { useCalendarStore } from '@/stores/calendar'
import type { IEvent } from '@/calendar/interfaces'

export function useUpdateEvent() {
  const store = useCalendarStore()

  const updateEvent = (event: IEvent) => {
    store.updateEvent(event)
  }

  return { updateEvent }
}
