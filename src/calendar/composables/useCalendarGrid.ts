import { computed, type Ref } from 'vue'
import { getCalendarCells } from '@/calendar/helpers'
import type { TWeekStartsOn } from '@/calendar/types'

export function useCalendarGrid(selectedDate: Ref<Date>, weekStartsOn?: Ref<TWeekStartsOn>) {
  const cells = computed(() => getCalendarCells(selectedDate.value, weekStartsOn?.value ?? 0))
  return { cells }
}
