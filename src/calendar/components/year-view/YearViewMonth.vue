<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { isSameDay, parseISO, getDaysInMonth, startOfMonth, format } from 'date-fns'
import { useCalendarStore } from '@/stores/calendar'
import { cn } from '@/lib/utils'
import YearViewDayCell from '@/calendar/components/year-view/YearViewDayCell.vue'
import type { IEvent } from '@/calendar/interfaces'

const props = defineProps<{
  month: Date
  events: IEvent[]
}>()

const router = useRouter()
const store = useCalendarStore()

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const monthName = computed(() => format(props.month, 'MMMM'))

const days = computed(() => {
  const firstDay = startOfMonth(props.month)
  const dayOfWeek = firstDay.getDay()
  const totalDays = getDaysInMonth(props.month)

  const blanks: (null)[] = Array.from({ length: dayOfWeek }, () => null)
  const dayNumbers = Array.from({ length: totalDays }, (_, i) => i + 1)

  return [...blanks, ...dayNumbers]
})

function getDateForDay(day: number): Date {
  return new Date(props.month.getFullYear(), props.month.getMonth(), day)
}

function getEventsForDay(day: number): IEvent[] {
  const date = getDateForDay(day)
  return props.events.filter((event) =>
    isSameDay(parseISO(event.startDate), date)
  )
}

function handleMonthClick() {
  store.setSelectedDate(startOfMonth(props.month))
  router.push('/month-view')
}
</script>

<template>
  <div class="rounded-lg border p-3">
    <button
      :class="cn(
        'mb-2 w-full text-left text-sm font-semibold hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded px-1',
      )"
      @click="handleMonthClick"
    >
      {{ monthName }}
    </button>

    <div class="grid grid-cols-7 gap-0">
      <div
        v-for="weekDay in WEEK_DAYS"
        :key="weekDay"
        class="flex items-center justify-center pb-1"
      >
        <span class="text-[10px] font-medium text-muted-foreground">
          {{ weekDay.charAt(0) }}
        </span>
      </div>

      <template v-for="(day, index) in days" :key="index">
        <div v-if="day === null" />
        <YearViewDayCell
          v-else
          :day="day"
          :date="getDateForDay(day)"
          :events="getEventsForDay(day)"
        />
      </template>
    </div>
  </div>
</template>
