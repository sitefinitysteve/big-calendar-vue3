<script setup lang="ts">
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { differenceInMinutes, parseISO } from 'date-fns'
import { useCalendarStore } from '@/stores/calendar'
import { cn } from '@/lib/utils'
import type { IEvent } from '@/calendar/interfaces'
import type { TLegacyEventColor } from '@/calendar/types'
import { useDateLocale } from '@/calendar/labels'
import { formatTime } from '@/calendar/date-format'
import { isLegacyColor, useCalendarCustomization } from '@/calendar/customization'
import type { TEventRenderView } from '@/calendar/customization'

const props = withDefaults(defineProps<{
  event: IEvent
  class?: string
  /** Which grid this block sits in — only affects the slot props. */
  view?: TEventRenderView
}>(), {
  view: 'week',
})

const emit = defineEmits<{
  openDetails: [event: IEvent]
}>()

const store = useCalendarStore()
const dateLocale = useDateLocale()
const customization = useCalendarCustomization()

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
const heightInPixels = computed(
  () => (durationInMinutes.value / 60) * customization.value.hourHeight - 8,
)

const legacy = computed(() => isLegacyColor(props.event.color))
const selected = computed(
  () => customization.value.selectedEventId != null && customization.value.selectedEventId === props.event.id,
)
const renderer = computed(() => customization.value.renderEvent)
const custom = computed(() => !!renderer.value)

const color = computed(() => {
  if (!legacy.value) return undefined
  const base = props.event.color as TLegacyEventColor
  return store.badgeVariant === 'dot' ? (`${base}-dot` as const) : base
})

// A custom renderer owns its own layout, so the single-line clamp is dropped
// (tailwind-merge cannot cancel `truncate`, hence the token filter).
const variantClasses = computed(() => {
  const classes = calendarWeekEventCardVariants({ color: color.value })
  if (!custom.value) return classes
  return classes
    .split(' ')
    .filter((token) => token !== 'truncate' && token !== 'whitespace-nowrap')
    .join(' ')
})

const cardClasses = computed(() =>
  cn(
    variantClasses.value,
    durationInMinutes.value < 35 && 'py-0 justify-center',
    !legacy.value && 'bc-event-custom-color',
    custom.value && selected.value && 'z-10',
    customization.value.classNames?.eventBlock,
    props.class,
  )
)

// Selected custom cards use min-height so they can expand in place.
const cardStyle = computed(() => {
  const size = custom.value && selected.value
    ? { minHeight: `${heightInPixels.value}px` }
    : { height: `${heightInPixels.value}px` }
  return legacy.value ? size : { ...size, '--bc-event-color': props.event.color }
})

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
    role="button"
    tabindex="0"
    :data-event-id="event.id"
    :data-selected="selected ? '' : undefined"
    :class="cardClasses"
    :style="cardStyle"
    @keydown="handleKeyDown"
    @click="emit('openDetails', event)"
  >
    <component :is="renderer" v-if="renderer" v-bind="slotProps" />

    <template v-else>
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

    <p v-if="durationInMinutes > 25 && !event.isAllDay">
      {{ formatTime(start, dateLocale) }} - {{ formatTime(end, dateLocale) }}
    </p>
    </template>
  </div>
</template>
