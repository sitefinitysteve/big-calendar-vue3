<script setup lang="ts">
import { computed } from 'vue'
import { format } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useCalendarStore } from '@/stores/calendar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getEventsCount, navigateDate, rangeText } from '@/calendar/helpers'
import type { IEvent } from '@/calendar/interfaces'
import type { TCalendarView } from '@/calendar/types'

const props = defineProps<{
  view: TCalendarView
  events: IEvent[]
}>()

const store = useCalendarStore()

const month = computed(() => format(store.selectedDate, 'MMMM'))
const year = computed(() => store.selectedDate.getFullYear())
const eventCount = computed(() => getEventsCount(props.events, store.selectedDate, props.view))

function handlePrevious() {
  store.setSelectedDate(navigateDate(store.selectedDate, props.view, 'previous'))
}

function handleNext() {
  store.setSelectedDate(navigateDate(store.selectedDate, props.view, 'next'))
}
</script>

<template>
  <div class="space-y-0.5">
    <div class="flex items-center gap-2">
      <span class="text-lg font-semibold">{{ month }} {{ year }}</span>
      <Badge variant="outline" class="px-1.5">
        {{ eventCount }} events
      </Badge>
    </div>

    <div class="flex items-center gap-2">
      <Button
        variant="outline"
        class="size-6.5 px-0 [&_svg]:size-4.5"
        @click="handlePrevious"
      >
        <ChevronLeft />
      </Button>

      <p class="text-sm text-muted-foreground">
        {{ rangeText(view, store.selectedDate) }}
      </p>

      <Button
        variant="outline"
        class="size-6.5 px-0 [&_svg]:size-4.5"
        @click="handleNext"
      >
        <ChevronRight />
      </Button>
    </div>
  </div>
</template>
