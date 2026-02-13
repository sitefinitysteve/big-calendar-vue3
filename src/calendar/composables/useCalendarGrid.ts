import { computed, type Ref } from 'vue'
import { getCalendarCells } from '@/calendar/helpers'

export function useCalendarGrid(selectedDate: Ref<Date>) {
  const cells = computed(() => getCalendarCells(selectedDate.value))
  return { cells }
}
