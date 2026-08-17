<script setup lang="ts">
import { computed } from 'vue'
import { format, isToday, startOfDay } from 'date-fns'
import { useCalendarStore } from '@/stores/calendar'
import EventBullet from '@/calendar/components/month-view/EventBullet.vue'
import MonthEventBadge from '@/calendar/components/month-view/MonthEventBadge.vue'
import { cn } from '@/lib/utils'
import { getMonthCellEvents } from '@/calendar/helpers'
import type { ICalendarCell, IEvent } from '@/calendar/interfaces'
import { useCalendarLabels } from '@/calendar/labels'
import { useCalendarCustomization } from '@/calendar/customization'

const labels = useCalendarLabels()
const customization = useCalendarCustomization()

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

/** Stock list height (`lg:h-[94px]`) is sized for exactly 3 badge slots. */
const DEFAULT_MAX_VISIBLE_EVENTS = 3
const DEFAULT_LIST_HEIGHT = 94

const maxEventsPerDayCell = computed(() => customization.value.maxEventsPerDayCell)
const isDefaultMax = computed(() => maxEventsPerDayCell.value === DEFAULT_MAX_VISIBLE_EVENTS)
const positions = computed(() => Array.from({ length: maxEventsPerDayCell.value }, (_, i) => i))

const cellEvents = computed(() =>
  getMonthCellEvents(props.cell.date, props.events, props.eventPositions)
)

const hiddenCount = computed(() => cellEvents.value.length - maxEventsPerDayCell.value)

const isSunday = computed(() => props.cell.date.getDay() === 0)

const cellClasses = computed(() =>
  cn(
    'flex h-full flex-col gap-1 border-l border-t py-1.5 lg:pb-2 lg:pt-1',
    isSunday.value && 'border-l-0',
    customization.value.classNames?.dayCell,
    customization.value.dayCellClassName?.(props.cell.date),
  ),
)

const listClasses = computed(() =>
  cn(
    'flex h-6 gap-1 px-2 lg:flex-col lg:gap-2 lg:px-0',
    isDefaultMax.value ? 'lg:h-[94px]' : 'bc-day-cell-list',
    !props.cell.currentMonth && 'opacity-50',
  ),
)

// `.bc-day-cell-list` reads this at the lg breakpoint; each slot keeps the stock
// ~31px so the cell grows proportionally with the cap.
const listStyle = computed(() =>
  isDefaultMax.value
    ? undefined
    : {
        '--bc-day-cell-list-height': `${
          (DEFAULT_LIST_HEIGHT / DEFAULT_MAX_VISIBLE_EVENTS) * maxEventsPerDayCell.value
        }px`,
      },
)

const onShowMore = computed(() => customization.value.onShowMore)

function eventAt(position: number) {
  return cellEvents.value.find(e => e.position === position)
}

function handleClick() {
  store.setSelectedDate(props.cell.date)
  emit('selectDay', props.cell.date)
}

function handleShowMore() {
  onShowMore.value?.(format(props.cell.date, 'yyyy-MM-dd'))
}

function handleBulletKeyDown(e: KeyboardEvent, event: IEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    emit('openDetails', event)
  }
}
</script>

<template>
  <div :data-date="format(cell.date, 'yyyy-MM-dd')" :class="cellClasses">
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

    <div :class="listClasses" :style="listStyle">
      <div v-for="position in positions" :key="position" class="lg:flex-1">
        <template v-if="eventAt(position)">
          <!--
            Below `lg` the bullet is the ONLY chip rendered, so it carries the
            same button wiring the badge has or the event is unreachable.
          -->
          <div
            role="button"
            tabindex="0"
            :data-event-id="eventAt(position)!.id"
            data-event-bullet=""
            class="lg:hidden"
            @click="emit('openDetails', eventAt(position)!)"
            @keydown="handleBulletKeyDown($event, eventAt(position)!)"
          >
            <EventBullet :color="eventAt(position)!.color" />
          </div>
          <MonthEventBadge
            class="hidden lg:flex"
            :event="eventAt(position)!"
            :cell-date="startOfDay(cell.date)"
            @open-details="emit('openDetails', $event)"
          />
        </template>
      </div>
    </div>

    <template v-if="hiddenCount > 0">
      <button
        v-if="onShowMore"
        type="button"
        :class="cn(
          'h-4.5 px-1.5 text-left text-xs font-semibold text-muted-foreground hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          !cell.currentMonth && 'opacity-50',
        )"
        @click="handleShowMore"
      >
        <span class="sm:hidden">+{{ hiddenCount }}</span>
        <span class="hidden sm:inline"> {{ labels.moreEvents(hiddenCount) }}</span>
      </button>

      <p
        v-else
        :class="cn('h-4.5 px-1.5 text-xs font-semibold text-muted-foreground', !cell.currentMonth && 'opacity-50')"
      >
        <span class="sm:hidden">+{{ hiddenCount }}</span>
        <span class="hidden sm:inline"> {{ labels.moreEvents(hiddenCount) }}</span>
      </p>
    </template>
  </div>
</template>
