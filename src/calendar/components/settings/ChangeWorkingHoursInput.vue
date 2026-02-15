<script setup lang="ts">
import { computed, reactive } from 'vue'
import { Info, Moon } from 'lucide-vue-next'
import { useCalendarStore } from '@/stores/calendar'
import type { TWorkingHours } from '@/calendar/types'
import { Switch } from '@/components/ui/switch'
import { TimeInput } from '@/components/ui/time-input'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useCalendarLabels } from '@/calendar/labels'

const store = useCalendarStore()
const labels = useCalendarLabels()

const DAYS_OF_WEEK = computed(() => [
  { index: 0, name: labels.value.sunday },
  { index: 1, name: labels.value.monday },
  { index: 2, name: labels.value.tuesday },
  { index: 3, name: labels.value.wednesday },
  { index: 4, name: labels.value.thursday },
  { index: 5, name: labels.value.friday },
  { index: 6, name: labels.value.saturday },
])

const localHours = reactive<TWorkingHours>(
  Object.fromEntries(
    Object.entries(store.workingHours).map(([key, val]) => [
      key,
      { from: val.from, to: val.to },
    ]),
  ),
)

function isDayActive(dayIndex: number): boolean {
  const day = localHours[dayIndex]!
  return day.from > 0 || day.to > 0
}

function handleToggle(dayIndex: number, checked: boolean) {
  if (checked) {
    localHours[dayIndex] = { from: 9, to: 17 }
  } else {
    localHours[dayIndex] = { from: 0, to: 0 }
  }
}

function handleFromChange(dayIndex: number, value: { hour: number; minute: number }) {
  localHours[dayIndex] = { ...localHours[dayIndex]!, from: value.hour }
}

function handleToChange(dayIndex: number, value: { hour: number; minute: number }) {
  localHours[dayIndex] = { ...localHours[dayIndex]!, to: value.hour }
}

function getHours(dayIndex: number) {
  return localHours[dayIndex] ?? { from: 0, to: 0 }
}

function handleApply() {
  store.workingHours = { ...localHours }
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center gap-2">
      <label class="text-sm font-medium">{{ labels.settingsWorkingHours }}</label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Info class="size-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{{ labels.workingHoursTooltip }}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

    <div class="space-y-3">
      <div
        v-for="day in DAYS_OF_WEEK"
        :key="day.index"
        class="flex items-center gap-3"
      >
        <Switch
          :checked="isDayActive(day.index)"
          @update:checked="handleToggle(day.index, $event)"
        />

        <span class="w-24 text-sm font-medium">{{ day.name }}</span>

        <template v-if="isDayActive(day.index)">
          <div class="flex flex-1 items-center gap-2">
            <TimeInput
              :model-value="{ hour: getHours(day.index).from, minute: 0 }"
              :hour-cycle="12"
              @update:model-value="handleFromChange(day.index, $event)"
            />
            <span class="text-sm text-muted-foreground">{{ labels.to.toLowerCase() }}</span>
            <TimeInput
              :model-value="{ hour: getHours(day.index).to, minute: 0 }"
              :hour-cycle="12"
              @update:model-value="handleToChange(day.index, $event)"
            />
          </div>
        </template>

        <template v-else>
          <div class="flex flex-1 items-center gap-2 text-sm text-muted-foreground">
            <Moon class="size-4" />
            <span>{{ labels.closed }}</span>
          </div>
        </template>
      </div>
    </div>

    <Button size="sm" class="w-full" @click="handleApply">
      {{ labels.apply }}
    </Button>
  </div>
</template>
