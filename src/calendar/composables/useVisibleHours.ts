import { computed, type Ref } from 'vue'
import type { IEvent } from '@/calendar/interfaces'
import type { TVisibleHours } from '@/calendar/types'
import { getVisibleHours } from '@/calendar/helpers'

export function useVisibleHours(visibleHours: Ref<TVisibleHours>, singleDayEvents: Ref<IEvent[]>) {
  const visibleHoursData = computed(() => getVisibleHours(visibleHours.value, singleDayEvents.value))
  return {
    hours: computed(() => visibleHoursData.value.hours),
    earliestEventHour: computed(() => visibleHoursData.value.earliestEventHour),
    latestEventHour: computed(() => visibleHoursData.value.latestEventHour),
  }
}
