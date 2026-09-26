<script setup lang="ts">
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { endOfDay, isSameDay, parseISO, startOfDay } from 'date-fns'
import { useCalendarStore } from '@/stores/calendar'
import { cn } from '@/lib/utils'
import type { IEvent } from '@/calendar/interfaces'
import type { TLegacyEventColor } from '@/calendar/types'
import { useCalendarLabels, useDateLocale } from '@/calendar/labels'
import { formatTime } from '@/calendar/date-format'
import { isLegacyColor, useCalendarCustomization, type TEventRenderView } from '@/calendar/customization'

const labels = useCalendarLabels()
const dateLocale = useDateLocale()

const props = withDefaults(defineProps<{
  event: IEvent
  cellDate: Date
  eventCurrentDay?: number
  eventTotalDays?: number
  class?: string
  position?: 'first' | 'middle' | 'last' | 'none'
  /** The view rendering this badge; week/day all-day strips reuse it. */
  view?: TEventRenderView
}>(), {
  view: 'month',
})

const emit = defineEmits<{
  openDetails: [event: IEvent]
}>()

const store = useCalendarStore()
const customization = useCalendarCustomization()
const renderer = computed(() => customization.value.renderMonthEvent ?? customization.value.renderEvent)

const eventBadgeVariants = cva(
  'bc-event-badge mx-1 flex size-auto h-6.5 select-none items-center justify-between gap-1.5 truncate whitespace-nowrap rounded-md border px-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
  {
    variants: {
      color: {
        blue: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300 [&_.event-dot]:fill-blue-600',
        green: 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300 [&_.event-dot]:fill-green-600',
        red: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300 [&_.event-dot]:fill-red-600',
        yellow: 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300 [&_.event-dot]:fill-yellow-600',
        purple: 'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300 [&_.event-dot]:fill-purple-600',
        orange: 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300 [&_.event-dot]:fill-orange-600',
        gray: 'border-neutral-200 bg-neutral-50 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 [&_.event-dot]:fill-neutral-600',
        'blue-dot': 'bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-blue-600',
        'green-dot': 'bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-green-600',
        'red-dot': 'bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-red-600',
        'yellow-dot': 'bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-yellow-600',
        'purple-dot': 'bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-purple-600',
        'orange-dot': 'bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-orange-600',
        'gray-dot': 'bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-neutral-600',
      },
      multiDayPosition: {
        first: 'relative z-10 mr-0 w-[calc(100%_-_3px)] rounded-r-none border-r-0 [&>span]:mr-2.5',
        middle: 'relative z-10 mx-0 w-[calc(100%_+_1px)] rounded-none border-x-0',
        last: 'ml-0 rounded-l-none border-l-0',
        none: '',
      },
    },
    defaultVariants: {
      color: 'blue-dot',
    },
  }
)

function getPosition(): 'first' | 'middle' | 'last' | 'none' {
  if (props.position) return props.position

  const itemStart = startOfDay(parseISO(props.event.startDate))
  const itemEnd = endOfDay(parseISO(props.event.endDate))

  if (props.eventCurrentDay && props.eventTotalDays) return 'none'
  if (isSameDay(itemStart, itemEnd)) return 'none'
  if (isSameDay(props.cellDate, itemStart)) return 'first'
  if (isSameDay(props.cellDate, itemEnd)) return 'last'
  return 'middle'
}

function isVisible(): boolean {
  const itemStart = startOfDay(parseISO(props.event.startDate))
  const itemEnd = endOfDay(parseISO(props.event.endDate))
  return !(props.cellDate < itemStart || props.cellDate > itemEnd)
}

const legacy = computed(() => isLegacyColor(props.event.color))
const selected = computed(
  () => customization.value.selectedEventId != null && customization.value.selectedEventId === props.event.id,
)
const legacyColor = computed(() => {
  if (!legacy.value) return undefined
  const base = props.event.color as TLegacyEventColor
  return store.badgeVariant === 'dot' ? (`${base}-dot` as const) : base
})

const badgeClasses = computed(() =>
  cn(
    eventBadgeVariants({
      color: legacyColor.value,
      multiDayPosition: getPosition(),
    }),
    !legacy.value && 'bc-event-custom-color',
    customization.value.classNames?.eventBlock,
    props.class,
  ),
)

const badgeStyle = computed(() =>
  legacy.value ? undefined : ({ '--bc-event-color': props.event.color } as Record<string, string>),
)

const slotProps = computed(() => ({
  event: props.event,
  view: props.view,
  selected: selected.value,
  badgeVariant: store.badgeVariant,
}))

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    emit('openDetails', props.event)
  }
}
</script>

<template>
  <div
    v-if="isVisible()"
    role="button"
    tabindex="0"
    :data-event-id="event.id"
    :data-selected="selected ? '' : undefined"
    :class="badgeClasses"
    :style="badgeStyle"
    @keydown="handleKeyDown"
    @click="emit('openDetails', event)"
  >
    <component :is="renderer" v-if="renderer" v-bind="slotProps" />

    <template v-else>
    <div class="flex items-center gap-1.5 truncate">
      <svg
        v-if="!['middle', 'last'].includes(getPosition()) && ['mixed', 'dot'].includes(store.badgeVariant)"
        width="8"
        height="8"
        viewBox="0 0 8 8"
        class="event-dot shrink-0"
      >
        <circle cx="4" cy="4" r="4" />
      </svg>

      <p v-if="['first', 'none'].includes(getPosition())" class="flex-1 truncate font-semibold">
        <span v-if="eventCurrentDay" class="text-xs">
          {{ labels.dayOfTotal(eventCurrentDay, eventTotalDays!) }} &bull;&nbsp;
        </span>
        {{ event.title }}
      </p>
    </div>

      <span v-if="['first', 'none'].includes(getPosition()) && !event.isAllDay">
        {{ formatTime(new Date(event.startDate), dateLocale) }}
      </span>
    </template>
  </div>
</template>
