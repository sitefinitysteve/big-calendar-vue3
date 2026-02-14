<script setup lang="ts">
import { List, Columns, Grid2x2, Grid3x3, CalendarRange, Plus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import UserSelect from '@/calendar/components/header/UserSelect.vue'
import TodayButton from '@/calendar/components/header/TodayButton.vue'
import DateNavigator from '@/calendar/components/header/DateNavigator.vue'
import type { IEvent } from '@/calendar/interfaces'
import type { TCalendarView } from '@/calendar/types'

defineProps<{
  view: TCalendarView
  events: IEvent[]
}>()

const viewButtons = [
  { view: 'day' as const, to: '/day-view', label: 'View by day', icon: List, roundedClass: 'rounded-r-none' },
  { view: 'week' as const, to: '/week-view', label: 'View by week', icon: Columns, roundedClass: '-ml-px rounded-none' },
  { view: 'month' as const, to: '/month-view', label: 'View by month', icon: Grid2x2, roundedClass: '-ml-px rounded-none' },
  { view: 'year' as const, to: '/year-view', label: 'View by year', icon: Grid3x3, roundedClass: '-ml-px rounded-none' },
  { view: 'agenda' as const, to: '/agenda-view', label: 'View by agenda', icon: CalendarRange, roundedClass: '-ml-px rounded-l-none' },
] as const
</script>

<template>
  <div class="flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
    <div class="flex items-center gap-3">
      <TodayButton />
      <DateNavigator :view="view" :events="events" />
    </div>

    <div class="flex flex-col items-center gap-1.5 sm:flex-row sm:justify-between">
      <div class="flex w-full items-center gap-1.5">
        <div class="inline-flex">
          <RouterLink
            v-for="btn in viewButtons"
            :key="btn.view"
            :to="btn.to"
          >
            <Button
              :aria-label="btn.label"
              size="icon"
              :variant="view === btn.view ? 'default' : 'outline'"
              :class="[btn.roundedClass, '[&_svg]:size-5']"
            >
              <component :is="btn.icon" :stroke-width="1.8" />
            </Button>
          </RouterLink>
        </div>

        <UserSelect />
      </div>

      <!-- AddEventDialog will be added in Task 9 -->
      <Button class="w-full sm:w-auto">
        <Plus />
        Add Event
      </Button>
    </div>
  </div>
</template>
