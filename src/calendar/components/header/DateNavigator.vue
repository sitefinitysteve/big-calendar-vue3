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
import { useCalendarLabels, useDateLocale } from '@/calendar/labels'

const props = defineProps<{
  view: TCalendarView
  events: IEvent[]
}>()

const store = useCalendarStore()
const labels = useCalendarLabels()
const dateLocale = useDateLocale()

const month = computed(() => {
  const name = format(store.selectedDate, 'MMMM', dateLocale.value ? { locale: dateLocale.value } : undefined)
  return name.charAt(0).toUpperCase() + name.slice(1)
})
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
        {{ labels.eventsCount(eventCount) }}
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

      <p class="text-sm capitalize text-muted-foreground">
        {{ rangeText(view, store.selectedDate, dateLocale) }}
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
