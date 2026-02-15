<script setup lang="ts">
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { format, differenceInMinutes, parseISO } from 'date-fns'
import { useCalendarStore } from '@/stores/calendar'
import { cn } from '@/lib/utils'
import type { IEvent } from '@/calendar/interfaces'

const props = defineProps<{
  event: IEvent
  class?: string
}>()

const emit = defineEmits<{
  openDetails: [event: IEvent]
}>()

const store = useCalendarStore()

const calendarWeekEventCardVariants = cva(
  'bc-event-block flex select-none flex-col gap-0.5 truncate whitespace-nowrap rounded-md border px-2 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
  {
    variants: {
      color: {
        blue: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300 [&_.event-dot]:fill-blue-600',
        green: 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300 [&_.event-dot]:fill-green-600',
        red: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300 [&_.event-dot]:fill-red-600',
        yellow: 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300 [&_.event-dot]:fill-yellow-600',
        purple: 'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300 [&_.event-dot]:fill-purple-600',
        orange: 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300 [&_.event-dot]:fill-orange-600',
        gray: 'border-neutral-200 bg-neutral-50 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 [&_.event-dot]:fill-neutral-600',
        'blue-dot': 'bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-blue-600',
        'green-dot': 'bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-green-600',
        'red-dot': 'bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-red-600',
        'yellow-dot': 'bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-yellow-600',
        'purple-dot': 'bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-purple-600',
        'orange-dot': 'bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-orange-600',
        'gray-dot': 'bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-neutral-600',
      },
    },
    defaultVariants: {
      color: 'blue-dot',
    },
  }
)

const start = computed(() => parseISO(props.event.startDate))
const end = computed(() => parseISO(props.event.endDate))
const durationInMinutes = computed(() => differenceInMinutes(end.value, start.value))
const heightInPixels = computed(() => (durationInMinutes.value / 60) * 96 - 8)

const color = computed(() => {
  return store.badgeVariant === 'dot'
    ? (`${props.event.color}-dot` as const)
    : props.event.color
})

const cardClasses = computed(() =>
  cn(
    calendarWeekEventCardVariants({ color: color.value }),
    durationInMinutes.value < 35 && 'py-0 justify-center',
    props.class,
  )
)

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    emit('openDetails', props.event)
  }
}
</script>

<template>
  <div
    role="button"
    tabindex="0"
    :class="cardClasses"
    :style="{ height: `${heightInPixels}px` }"
    @keydown="handleKeyDown"
    @click="emit('openDetails', event)"
  >
    <div class="flex items-center gap-1.5 truncate">
      <svg
        v-if="['mixed', 'dot'].includes(store.badgeVariant)"
        width="8"
        height="8"
        viewBox="0 0 8 8"
        class="event-dot shrink-0"
      >
        <circle cx="4" cy="4" r="4" />
      </svg>

      <p class="truncate font-semibold">{{ event.title }}</p>
    </div>

    <p v-if="durationInMinutes > 25">
      {{ format(start, 'h:mm a') }} - {{ format(end, 'h:mm a') }}
    </p>
  </div>
</template>
