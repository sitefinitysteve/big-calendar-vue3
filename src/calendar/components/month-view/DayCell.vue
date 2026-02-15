<script setup lang="ts">
import { computed } from 'vue'
import { isToday, startOfDay } from 'date-fns'
import { useCalendarStore } from '@/stores/calendar'
import EventBullet from '@/calendar/components/month-view/EventBullet.vue'
import MonthEventBadge from '@/calendar/components/month-view/MonthEventBadge.vue'
import { cn } from '@/lib/utils'
import { getMonthCellEvents } from '@/calendar/helpers'
import type { ICalendarCell, IEvent } from '@/calendar/interfaces'
import { useCalendarLabels } from '@/calendar/labels'

const labels = useCalendarLabels()

const props = defineProps<{
  cell: ICalendarCell
  events: IEvent[]
  eventPositions: Record<string, number>
}>()

const emit = defineEmits<{
  openDetails: [event: IEvent]
  selectDay: [date: Date]
}>()

const store = useCalendarStore()

const MAX_VISIBLE_EVENTS = 3

const cellEvents = computed(() =>
  getMonthCellEvents(props.cell.date, props.events, props.eventPositions)
)

const isSunday = computed(() => props.cell.date.getDay() === 0)

function handleClick() {
  store.setSelectedDate(props.cell.date)
  emit('selectDay', props.cell.date)
}
</script>

<template>
  <div :class="cn('flex h-full flex-col gap-1 border-l border-t py-1.5 lg:pb-2 lg:pt-1', isSunday && 'border-l-0')">
    <button
      :class="cn(
        'flex size-6 translate-x-1 items-center justify-center rounded-full text-xs font-semibold hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring lg:px-2',
        !cell.currentMonth && 'opacity-20',
        isToday(cell.date) && 'bg-primary font-bold text-primary-foreground hover:bg-primary',
      )"
      @click="handleClick"
    >
      {{ cell.day }}
    </button>

    <div :class="cn('flex h-6 gap-1 px-2 lg:h-[94px] lg:flex-col lg:gap-2 lg:px-0', !cell.currentMonth && 'opacity-50')">
      <div v-for="position in [0, 1, 2]" :key="position" class="lg:flex-1">
        <template v-if="cellEvents.find(e => e.position === position)">
          <EventBullet
            class="lg:hidden"
            :color="cellEvents.find(e => e.position === position)!.color"
          />
          <MonthEventBadge
            class="hidden lg:flex"
            :event="cellEvents.find(e => e.position === position)!"
            :cell-date="startOfDay(cell.date)"
            @open-details="emit('openDetails', $event)"
          />
        </template>
      </div>
    </div>

    <p
      v-if="cellEvents.length > MAX_VISIBLE_EVENTS"
      :class="cn('h-4.5 px-1.5 text-xs font-semibold text-muted-foreground', !cell.currentMonth && 'opacity-50')"
    >
      <span class="sm:hidden">+{{ cellEvents.length - MAX_VISIBLE_EVENTS }}</span>
      <span class="hidden sm:inline"> {{ labels.moreEvents(cellEvents.length - MAX_VISIBLE_EVENTS) }}</span>
    </p>
  </div>
</template>
