<script setup lang="ts">
import { cva } from 'class-variance-authority'
import { endOfDay, format, isSameDay, parseISO, startOfDay } from 'date-fns'
import { useCalendarStore } from '@/stores/calendar'
import { cn } from '@/lib/utils'
import type { IEvent } from '@/calendar/interfaces'

const props = defineProps<{
  event: IEvent
  cellDate: Date
  eventCurrentDay?: number
  eventTotalDays?: number
  class?: string
  position?: 'first' | 'middle' | 'last' | 'none'
}>()

const emit = defineEmits<{
  openDetails: [event: IEvent]
}>()

const store = useCalendarStore()

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
    :class="cn(
      eventBadgeVariants({
        color: store.badgeVariant === 'dot' ? `${event.color}-dot` : event.color,
        multiDayPosition: getPosition(),
      }),
      $props.class,
    )"
    @keydown="handleKeyDown"
    @click="emit('openDetails', event)"
  >
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
          Day {{ eventCurrentDay }} of {{ eventTotalDays }} &bull;&nbsp;
        </span>
        {{ event.title }}
      </p>
    </div>

    <span v-if="['first', 'none'].includes(getPosition()) && !event.isAllDay">
      {{ format(new Date(event.startDate), 'h:mm a') }}
    </span>
  </div>
</template>
