<script setup lang="ts">
import { computed } from 'vue'
import {
  parseISO,
  startOfDay,
  startOfWeek,
  endOfWeek,
  addDays,
  differenceInDays,
  isBefore,
  isAfter,
} from 'date-fns'
import { cn } from '@/lib/utils'
import MonthEventBadge from '@/calendar/components/month-view/MonthEventBadge.vue'
import type { IEvent } from '@/calendar/interfaces'
import { useCalendarLabels } from '@/calendar/labels'
import { useCalendarCustomization } from '@/calendar/customization'

/** One badge row: `h-6.5` (26px) plus the `gap-1` (4px) that follows it. */
const ALL_DAY_ROW_HEIGHT = 26
const ALL_DAY_ROW_GAP = 4
/** The strip's own `py-1`. */
const ALL_DAY_ROW_PADDING = 8

const props = defineProps<{
  selectedDate: Date
  multiDayEvents: IEvent[]
}>()

const emit = defineEmits<{
  openDetails: [event: IEvent]
}>()

const labels = useCalendarLabels()
const customization = useCalendarCustomization()

const weekStart = computed(() => startOfWeek(props.selectedDate))
const weekEnd = computed(() => endOfWeek(props.selectedDate))
const weekDays = computed(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart.value, i)))

interface ProcessedEvent extends IEvent {
  adjustedStart: Date
  adjustedEnd: Date
  startIndex: number
  endIndex: number
}

const processedEvents = computed<ProcessedEvent[]>(() => {
  return props.multiDayEvents
    .map(event => {
      const start = parseISO(event.startDate)
      const end = parseISO(event.endDate)
      const adjustedStart = isBefore(start, weekStart.value) ? weekStart.value : start
      const adjustedEnd = isAfter(end, weekEnd.value) ? weekEnd.value : end
      const startIndex = differenceInDays(adjustedStart, weekStart.value)
      const endIndex = differenceInDays(adjustedEnd, weekStart.value)

      return {
        ...event,
        adjustedStart,
        adjustedEnd,
        startIndex,
        endIndex,
      }
    })
    .sort((a, b) => {
      const startDiff = a.adjustedStart.getTime() - b.adjustedStart.getTime()
      if (startDiff !== 0) return startDiff
      return (b.endIndex - b.startIndex) - (a.endIndex - a.startIndex)
    })
})

const eventRows = computed(() => {
  const rows: ProcessedEvent[][] = []

  processedEvents.value.forEach(event => {
    let rowIndex = rows.findIndex(row =>
      row.every(e => e.endIndex < event.startIndex || e.startIndex > event.endIndex)
    )

    if (rowIndex === -1) {
      rowIndex = rows.length
      rows.push([])
    }

    rows[rowIndex]!.push(event)
  })

  return rows
})

const hasEventsInWeek = computed(() => {
  return props.multiDayEvents.some(event => {
    const start = parseISO(event.startDate)
    const end = parseISO(event.endDate)

    return (
      (start >= weekStart.value && start <= weekEnd.value) ||
      (end >= weekStart.value && end <= weekEnd.value) ||
      (start <= weekStart.value && end >= weekEnd.value)
    )
  })
})

// When capped, the strip scrolls internally instead of pushing the grid down.
const allDayMaxRows = computed(() => customization.value.allDayMaxRows)
const capped = computed(
  () => allDayMaxRows.value !== undefined && eventRows.value.length > allDayMaxRows.value,
)
const stripClasses = computed(() =>
  cn('grid flex-1 grid-cols-7 divide-x border-b border-l', capped.value && 'overflow-y-auto'),
)
const stripStyle = computed(() => {
  if (!capped.value) return undefined
  const rows = allDayMaxRows.value!
  return {
    maxHeight: `${rows * ALL_DAY_ROW_HEIGHT + (rows - 1) * ALL_DAY_ROW_GAP + ALL_DAY_ROW_PADDING}px`,
  }
})

function getPosition(dayIndex: number, event: ProcessedEvent): 'first' | 'middle' | 'last' | 'none' {
  if (dayIndex === event.startIndex && dayIndex === event.endIndex) return 'none'
  if (dayIndex === event.startIndex) return 'first'
  if (dayIndex === event.endIndex) return 'last'
  return 'middle'
}
</script>

<template>
  <div v-if="hasEventsInWeek" class="hidden sm:flex">
    <div class="flex w-18 shrink-0 items-start justify-end border-b py-1 pr-2 text-xs text-muted-foreground">
      {{ labels.allDay }}
    </div>
    <div data-all-day-strip="" :class="stripClasses" :style="stripStyle">
      <div
        v-for="(day, dayIndex) in weekDays"
        :key="day.toISOString()"
        class="flex h-full flex-col gap-1 py-1"
      >
        <template v-for="(row, rowIndex) in eventRows" :key="`${rowIndex}-${dayIndex}`">
          <div
            v-if="!row.find(e => e.startIndex <= dayIndex && e.endIndex >= dayIndex)"
            class="h-6.5"
          />
          <MonthEventBadge
            v-else
            :event="row.find(e => e.startIndex <= dayIndex && e.endIndex >= dayIndex)!"
            :cell-date="startOfDay(day)"
            :position="getPosition(dayIndex, row.find(e => e.startIndex <= dayIndex && e.endIndex >= dayIndex)!)"
            view="week"
            @open-details="emit('openDetails', $event)"
          />
        </template>
      </div>
    </div>
  </div>
</template>
