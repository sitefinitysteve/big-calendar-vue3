<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useCalendarStore } from '@/stores/calendar'
import { useCalendarGrid } from '@/calendar/composables/useCalendarGrid'
import { useEventPositioning } from '@/calendar/composables/useEventPositioning'
import DayCell from '@/calendar/components/month-view/DayCell.vue'
import type { IEvent } from '@/calendar/interfaces'

const props = defineProps<{
  singleDayEvents: IEvent[]
  multiDayEvents: IEvent[]
}>()

const emit = defineEmits<{
  openDetails: [event: IEvent]
  selectDay: [date: Date]
}>()

const store = useCalendarStore()

const selectedDate = toRef(() => store.selectedDate)
const multiDayEvents = toRef(() => props.multiDayEvents)
const singleDayEvents = toRef(() => props.singleDayEvents)

const { cells } = useCalendarGrid(selectedDate)
const { eventPositions } = useEventPositioning(multiDayEvents, singleDayEvents, selectedDate)

const allEvents = computed(() => [...props.multiDayEvents, ...props.singleDayEvents])

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
</script>

<template>
  <div>
    <div class="grid grid-cols-7 divide-x">
      <div v-for="day in WEEK_DAYS" :key="day" class="flex items-center justify-center py-2">
        <span class="text-xs font-medium text-muted-foreground">{{ day }}</span>
      </div>
    </div>

    <div class="grid grid-cols-7 overflow-hidden">
      <DayCell
        v-for="cell in cells"
        :key="cell.date.toISOString()"
        :cell="cell"
        :events="allEvents"
        :event-positions="eventPositions"
        @open-details="emit('openDetails', $event)"
        @select-day="emit('selectDay', $event)"
      />
    </div>
  </div>
</template>
