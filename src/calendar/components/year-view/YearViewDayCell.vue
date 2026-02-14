<script setup lang="ts">
import { computed } from 'vue'
import { isToday } from 'date-fns'
import { useCalendarStore } from '@/stores/calendar'
import { cn } from '@/lib/utils'
import type { IEvent } from '@/calendar/interfaces'
import type { TEventColor } from '@/calendar/types'

const props = defineProps<{
  day: number
  date: Date
  events: IEvent[]
}>()

const emit = defineEmits<{
  selectDay: [date: Date]
}>()

const store = useCalendarStore()

const maxIndicators = 3

const colorMap: Record<TEventColor, string> = {
  blue: 'bg-blue-600',
  green: 'bg-green-600',
  red: 'bg-red-600',
  yellow: 'bg-yellow-600',
  purple: 'bg-purple-600',
  orange: 'bg-orange-600',
  gray: 'bg-neutral-600',
}

const isTodayCell = computed(() => isToday(props.date))

const visibleDots = computed(() => {
  if (props.events.length === 0) return []
  if (props.events.length <= maxIndicators) return props.events
  return props.events.slice(0, 1)
})

const overflowCount = computed(() => {
  if (props.events.length <= maxIndicators) return 0
  return props.events.length - 1
})

function handleClick() {
  store.setSelectedDate(props.date)
  emit('selectDay', props.date)
}
</script>

<template>
  <button
    :class="cn(
      'flex flex-col items-center justify-start gap-0.5 rounded-md p-0.5 text-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
    )"
    @click="handleClick"
  >
    <span
      :class="cn(
        'flex size-6 items-center justify-center rounded-full text-xs font-medium',
        isTodayCell && 'bg-primary font-bold text-primary-foreground',
      )"
    >
      {{ day }}
    </span>

    <div v-if="events.length > 0" class="flex items-center gap-0.5">
      <span
        v-for="(event, index) in visibleDots"
        :key="index"
        :class="cn('size-1.5 rounded-full', colorMap[event.color])"
      />
      <span
        v-if="overflowCount > 0"
        class="text-[9px] leading-none text-muted-foreground"
      >
        +{{ overflowCount }}
      </span>
    </div>
  </button>
</template>
