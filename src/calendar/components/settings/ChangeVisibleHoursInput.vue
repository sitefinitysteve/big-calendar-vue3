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

const store = useCalendarStore()

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
      <label class="text-sm font-medium">Visible Hours</label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Info class="size-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Set the visible time range for the day and week views.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

    <div class="flex items-center gap-2">
      <div class="flex-1 space-y-1">
        <span class="text-xs text-muted-foreground">From</span>
        <TimeInput v-model="from" :hour-cycle="12" />
      </div>
      <div class="flex-1 space-y-1">
        <span class="text-xs text-muted-foreground">To</span>
        <TimeInput v-model="to" :hour-cycle="12" />
      </div>
    </div>

    <Button size="sm" class="w-full" @click="handleApply">
      Apply
    </Button>
  </div>
</template>
