<script setup lang="ts">
import { ref } from 'vue'
import { Info } from 'lucide-vue-next'
import { useCalendarStore } from '@/stores/calendar'
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

const from = ref<{ hour: number; minute: number }>({
  hour: store.visibleHours.from,
  minute: 0,
})
const to = ref<{ hour: number; minute: number }>({
  hour: store.visibleHours.to,
  minute: 0,
})

function handleApply() {
  store.visibleHours = {
    from: from.value.hour,
    to: to.value.hour,
  }
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center gap-2">
      <label class="text-sm font-medium">{{ labels.settingsVisibleHours }}</label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Info class="size-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{{ labels.visibleHoursTooltip }}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

    <div class="flex items-center gap-2">
      <div class="flex-1 space-y-1">
        <span class="text-xs text-muted-foreground">{{ labels.from }}</span>
        <TimeInput v-model="from" :hour-cycle="12" />
      </div>
      <div class="flex-1 space-y-1">
        <span class="text-xs text-muted-foreground">{{ labels.to }}</span>
        <TimeInput v-model="to" :hour-cycle="12" />
      </div>
    </div>

    <Button size="sm" class="w-full" @click="handleApply">
      {{ labels.apply }}
    </Button>
  </div>
</template>
