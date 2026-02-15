<script setup lang="ts">
import { computed } from 'vue'
import { List, Columns, Grid2x2, Grid3x3, CalendarRange, Plus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import UserSelect from '@/calendar/components/header/UserSelect.vue'
import TodayButton from '@/calendar/components/header/TodayButton.vue'
import DateNavigator from '@/calendar/components/header/DateNavigator.vue'
import type { IEvent } from '@/calendar/interfaces'
import type { TCalendarView } from '@/calendar/types'
import { useCalendarLabels, useCalendarFlags } from '@/calendar/labels'

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

const labels = useCalendarLabels()
const { showViewTooltips } = useCalendarFlags()

const viewButtons = computed(() => [
  { view: 'day' as const, tooltipKey: 'viewDayTooltip' as const, icon: List },
  { view: 'week' as const, tooltipKey: 'viewWeekTooltip' as const, icon: Columns },
  { view: 'month' as const, tooltipKey: 'viewMonthTooltip' as const, icon: Grid2x2 },
  { view: 'year' as const, tooltipKey: 'viewYearTooltip' as const, icon: Grid3x3 },
  { view: 'agenda' as const, tooltipKey: 'viewAgendaTooltip' as const, icon: CalendarRange },
])

const visibleViewButtons = computed(() => {
  const filtered = viewButtons.value.filter(btn => props.availableViews.includes(btn.view))
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
        <TooltipProvider v-if="visibleViewButtons.length > 1">
          <div class="bc-view-buttons inline-flex">
            <template v-for="btn in visibleViewButtons" :key="btn.view">
              <Tooltip v-if="showViewTooltips">
                <TooltipTrigger as-child>
                  <Button
                    :aria-label="labels[btn.tooltipKey]"
                    :data-view="btn.view"
                    size="icon"
                    :variant="view === btn.view ? 'default' : 'outline'"
                    :class="[btn.roundedClass, '[&_svg]:size-5', `bc-view-${btn.view}`]"
                    @click="emit('changeView', btn.view)"
                  >
                    <component :is="btn.icon" :stroke-width="1.8" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {{ labels[btn.tooltipKey] }}
                </TooltipContent>
              </Tooltip>

              <Button
                v-else
                :aria-label="labels[btn.tooltipKey]"
                :data-view="btn.view"
                size="icon"
                :variant="view === btn.view ? 'default' : 'outline'"
                :class="[btn.roundedClass, '[&_svg]:size-5', `bc-view-${btn.view}`]"
                @click="emit('changeView', btn.view)"
              >
                <component :is="btn.icon" :stroke-width="1.8" />
              </Button>
            </template>
          </div>
        </TooltipProvider>

        <UserSelect v-if="showUserSelect" />
      </div>

      <Button v-if="canAdd !== false" class="w-full sm:w-auto" @click="emit('addEvent')">
        <Plus />
        {{ labels.addEvent }}
      </Button>
    </div>
  </div>
</template>
