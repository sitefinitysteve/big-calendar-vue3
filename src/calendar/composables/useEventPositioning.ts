import { computed, type Ref } from 'vue'
import type { IEvent } from '@/calendar/interfaces'
import { calculateMonthEventPositions } from '@/calendar/helpers'

export function useEventPositioning(
  multiDayEvents: Ref<IEvent[]>,
  singleDayEvents: Ref<IEvent[]>,
  selectedDate: Ref<Date>
) {
  const eventPositions = computed(() =>
    calculateMonthEventPositions(multiDayEvents.value, singleDayEvents.value, selectedDate.value)
  )
  return { eventPositions }
}
