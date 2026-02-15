<script setup lang="ts">
import { cva } from 'class-variance-authority'
import { format, parseISO } from 'date-fns'
import { Clock, Text, User } from 'lucide-vue-next'
import { useCalendarStore } from '@/stores/calendar'
import { cn } from '@/lib/utils'
import type { IEvent } from '@/calendar/interfaces'

const props = defineProps<{
  event: IEvent
  eventCurrentDay?: number
  eventTotalDays?: number
}>()

const emit = defineEmits<{
  openDetails: [event: IEvent]
}>()

const store = useCalendarStore()

const agendaCardVariants = cva(
  'bc-event-card flex select-none items-center justify-between gap-3 rounded-md border p-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
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
    },
    defaultVariants: {
      color: 'blue-dot',
    },
  },
)

function getColorVariant() {
  if (store.badgeVariant === 'dot') return `${props.event.color}-dot` as const
  return props.event.color
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
    role="button"
    tabindex="0"
    :class="cn(agendaCardVariants({ color: getColorVariant() }))"
    @click="emit('openDetails', event)"
    @keydown="handleKeyDown"
  >
    <div class="flex items-center gap-3 truncate">
      <svg
        v-if="['mixed', 'dot'].includes(store.badgeVariant)"
        width="8"
        height="8"
        viewBox="0 0 8 8"
        class="event-dot shrink-0"
      >
        <circle cx="4" cy="4" r="4" />
      </svg>

      <div class="flex flex-col gap-1 truncate">
        <p class="truncate font-semibold">
          <span v-if="eventCurrentDay && eventTotalDays" class="text-xs">
            Day {{ eventCurrentDay }} of {{ eventTotalDays }} &bull;&nbsp;
          </span>
          {{ event.title }}
        </p>

        <div class="flex flex-wrap items-center gap-3 text-xs opacity-80">
          <span class="flex items-center gap-1">
            <User class="size-3" />
            {{ event.user.name }}
          </span>

          <span class="flex items-center gap-1">
            <Clock class="size-3" />
            {{ format(parseISO(event.startDate), 'h:mm a') }} - {{ format(parseISO(event.endDate), 'h:mm a') }}
          </span>

          <span v-if="event.description" class="flex items-center gap-1">
            <Text class="size-3" />
            <span class="truncate">{{ event.description }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
