<script setup lang="ts">
import { computed } from 'vue'
import { format, parseISO, differenceInDays, startOfDay } from 'date-fns'
import type { IEvent } from '@/calendar/interfaces'
import { useDateLocale } from '@/calendar/labels'
import AgendaEventCard from '@/calendar/components/agenda-view/AgendaEventCard.vue'

const dateLocale = useDateLocale()

const props = defineProps<{
  date: Date
  events: IEvent[]
  multiDayEvents: IEvent[]
}>()

const emit = defineEmits<{
  openDetails: [event: IEvent]
}>()

const multiDayEventsWithDayInfo = computed(() => {
  return props.multiDayEvents.map((event) => {
    const eventStart = startOfDay(parseISO(event.startDate))
    const eventEnd = startOfDay(parseISO(event.endDate))
    const totalDays = differenceInDays(eventEnd, eventStart) + 1
    const currentDay = differenceInDays(startOfDay(props.date), eventStart) + 1
    return { event, currentDay, totalDays }
  })
})

const sortedSingleDayEvents = computed(() => {
  return [...props.events].sort(
    (a, b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime(),
  )
})
</script>

<template>
  <div class="space-y-2">
    <h3 class="sticky top-0 z-10 capitalize bg-background/95 py-2 text-sm font-semibold backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {{ format(date, 'EEEE, MMMM d, yyyy', dateLocale ? { locale: dateLocale } : undefined) }}
    </h3>

    <div class="space-y-2">
      <AgendaEventCard
        v-for="{ event, currentDay, totalDays } in multiDayEventsWithDayInfo"
        :key="`multi-${event.id}`"
        :event="event"
        :event-current-day="totalDays > 1 ? currentDay : undefined"
        :event-total-days="totalDays > 1 ? totalDays : undefined"
        @open-details="emit('openDetails', $event)"
      />

      <AgendaEventCard
        v-for="event in sortedSingleDayEvents"
        :key="event.id"
        :event="event"
        @open-details="emit('openDetails', $event)"
      />
    </div>
  </div>
</template>
