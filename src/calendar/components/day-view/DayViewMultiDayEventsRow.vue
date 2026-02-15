<script setup lang="ts">
import { computed } from 'vue'
import {
  parseISO,
  isWithinInterval,
  differenceInDays,
  startOfDay,
  endOfDay,
} from 'date-fns'
import MonthEventBadge from '@/calendar/components/month-view/MonthEventBadge.vue'
import type { IEvent } from '@/calendar/interfaces'

const props = defineProps<{
  selectedDate: Date
  multiDayEvents: IEvent[]
}>()

const emit = defineEmits<{
  openDetails: [event: IEvent]
}>()

const multiDayEventsInDay = computed(() => {
  const dayStart = startOfDay(props.selectedDate)
  const dayEnd = endOfDay(props.selectedDate)

  return props.multiDayEvents
    .filter(event => {
      const eventStart = parseISO(event.startDate)
      const eventEnd = parseISO(event.endDate)

      const isOverlapping =
        isWithinInterval(dayStart, { start: eventStart, end: eventEnd }) ||
        isWithinInterval(dayEnd, { start: eventStart, end: eventEnd }) ||
        (eventStart <= dayStart && eventEnd >= dayEnd)

      return isOverlapping
    })
    .sort((a, b) => {
      const durationA = differenceInDays(parseISO(a.endDate), parseISO(a.startDate))
      const durationB = differenceInDays(parseISO(b.endDate), parseISO(b.startDate))
      return durationB - durationA
    })
})

function getEventDays(event: IEvent) {
  const eventStart = startOfDay(parseISO(event.startDate))
  const eventEnd = startOfDay(parseISO(event.endDate))
  const currentDate = startOfDay(props.selectedDate)

  const eventTotalDays = differenceInDays(eventEnd, eventStart) + 1
  const eventCurrentDay = differenceInDays(currentDate, eventStart) + 1

  return { eventTotalDays, eventCurrentDay }
}
</script>

<template>
  <div v-if="multiDayEventsInDay.length > 0" class="flex border-b">
    <div class="w-18" />
    <div class="flex flex-1 flex-col gap-1 border-l py-1">
      <MonthEventBadge
        v-for="event in multiDayEventsInDay"
        :key="event.id"
        :event="event"
        :cell-date="selectedDate"
        :event-current-day="getEventDays(event).eventTotalDays > 1 ? getEventDays(event).eventCurrentDay : undefined"
        :event-total-days="getEventDays(event).eventTotalDays > 1 ? getEventDays(event).eventTotalDays : undefined"
        @open-details="emit('openDetails', $event)"
      />
    </div>
  </div>
</template>
