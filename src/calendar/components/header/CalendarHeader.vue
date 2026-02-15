<script setup lang="ts">
import { computed } from 'vue'
import { List, Columns, Grid2x2, Grid3x3, CalendarRange, Plus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import UserSelect from '@/calendar/components/header/UserSelect.vue'
import TodayButton from '@/calendar/components/header/TodayButton.vue'
import DateNavigator from '@/calendar/components/header/DateNavigator.vue'
import type { IEvent } from '@/calendar/interfaces'
import type { TCalendarView } from '@/calendar/types'

const props = withDefaults(defineProps<{
  view: TCalendarView
  events: IEvent[]
  canAdd?: boolean
  availableViews?: TCalendarView[]
  showUserSelect?: boolean
}>(), {
  availableViews: () => ['day', 'week', 'month', 'year', 'agenda'],
  showUserSelect: true,
})

const emit = defineEmits<{
  addEvent: []
  changeView: [view: TCalendarView]
}>()

const viewButtons = [
  { view: 'day' as const, label: 'View by day', icon: List, roundedClass: 'rounded-r-none' },
  { view: 'week' as const, label: 'View by week', icon: Columns, roundedClass: '-ml-px rounded-none' },
  { view: 'month' as const, label: 'View by month', icon: Grid2x2, roundedClass: '-ml-px rounded-none' },
  { view: 'year' as const, label: 'View by year', icon: Grid3x3, roundedClass: '-ml-px rounded-none' },
  { view: 'agenda' as const, label: 'View by agenda', icon: CalendarRange, roundedClass: '-ml-px rounded-l-none' },
] as const

const visibleViewButtons = computed(() => {
  const filtered = viewButtons.filter(btn => props.availableViews.includes(btn.view))
  return filtered.map((btn, index) => {
    let roundedClass: string
    if (filtered.length === 1) roundedClass = ''
    else if (index === 0) roundedClass = 'rounded-r-none'
    else if (index === filtered.length - 1) roundedClass = '-ml-px rounded-l-none'
    else roundedClass = '-ml-px rounded-none'
    return { ...btn, roundedClass }
  })
})
</script>

<template>
  <div class="bc-header flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
    <div class="flex items-center gap-3">
      <TodayButton />
      <DateNavigator :view="view" :events="events" />
    </div>

    <div class="flex flex-col items-center gap-1.5 sm:flex-row sm:justify-between">
      <div class="flex w-full items-center gap-1.5">
        <div v-if="visibleViewButtons.length > 1" class="bc-view-buttons inline-flex">
          <Button
            v-for="btn in visibleViewButtons"
            :key="btn.view"
            :aria-label="btn.label"
            size="icon"
            :variant="view === btn.view ? 'default' : 'outline'"
            :class="[btn.roundedClass, '[&_svg]:size-5']"
            @click="emit('changeView', btn.view)"
          >
            <component :is="btn.icon" :stroke-width="1.8" />
          </Button>
        </div>

        <UserSelect v-if="showUserSelect" />
      </div>

      <Button v-if="canAdd !== false" class="w-full sm:w-auto" @click="emit('addEvent')">
        <Plus />
        Add Event
      </Button>
    </div>
  </div>
</template>
