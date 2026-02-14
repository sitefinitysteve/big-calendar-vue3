<script setup lang="ts">
import { computed } from 'vue'
import {
  addDays,
  differenceInDays,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfDay,
} from 'date-fns'
import { CalendarX2 } from 'lucide-vue-next'
import { useCalendarStore } from '@/stores/calendar'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { IEvent } from '@/calendar/interfaces'
import AgendaDayGroup from '@/calendar/components/agenda-view/AgendaDayGroup.vue'

const props = defineProps<{
  singleDayEvents: IEvent[]
  multiDayEvents: IEvent[]
}>()

const emit = defineEmits<{
  openDetails: [event: IEvent]
}>()

const store = useCalendarStore()

interface DayEntry {
  date: Date
  singleDayEvents: IEvent[]
  multiDayEvents: IEvent[]
}

const eventsByDay = computed<DayEntry[]>(() => {
  const dayMap = new Map<string, { singleDayEvents: IEvent[]; multiDayEvents: IEvent[] }>()

  // Group single-day events by their start date
  for (const event of props.singleDayEvents) {
    const eventDate = startOfDay(parseISO(event.startDate))
    if (!isSameMonth(eventDate, store.selectedDate)) continue

    const key = format(eventDate, 'yyyy-MM-dd')
    if (!dayMap.has(key)) {
      dayMap.set(key, { singleDayEvents: [], multiDayEvents: [] })
    }
    dayMap.get(key)!.singleDayEvents.push(event)
  }

  // Spread multi-day events across their date range
  for (const event of props.multiDayEvents) {
    const eventStart = startOfDay(parseISO(event.startDate))
    const eventEnd = startOfDay(parseISO(event.endDate))
    const totalDays = differenceInDays(eventEnd, eventStart) + 1

    for (let i = 0; i < totalDays; i++) {
      const currentDate = addDays(eventStart, i)
      if (!isSameMonth(currentDate, store.selectedDate)) continue

      const key = format(currentDate, 'yyyy-MM-dd')
      if (!dayMap.has(key)) {
        dayMap.set(key, { singleDayEvents: [], multiDayEvents: [] })
      }
      dayMap.get(key)!.multiDayEvents.push(event)
    }
  }

  // Sort by date and return as array
  return Array.from(dayMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => ({
      date: new Date(key),
      singleDayEvents: value.singleDayEvents,
      multiDayEvents: value.multiDayEvents,
    }))
})

const hasEvents = computed(() => eventsByDay.value.length > 0)
</script>

<template>
  <ScrollArea class="h-[800px]">
    <div v-if="hasEvents" class="space-y-6 p-4">
      <AgendaDayGroup
        v-for="day in eventsByDay"
        :key="format(day.date, 'yyyy-MM-dd')"
        :date="day.date"
        :events="day.singleDayEvents"
        :multi-day-events="day.multiDayEvents"
        @open-details="emit('openDetails', $event)"
      />
    </div>

    <div v-else class="flex h-[800px] flex-col items-center justify-center gap-4 text-muted-foreground">
      <CalendarX2 class="size-16 stroke-1" />
      <p class="text-lg">No events scheduled for the selected month</p>
    </div>
  </ScrollArea>
</template>
