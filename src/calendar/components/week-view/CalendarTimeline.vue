<script setup lang="ts">
import { computed } from 'vue'
import { useCurrentTime } from '@/calendar/composables/useCurrentTime'
import { useDateLocale } from '@/calendar/labels'
import { formatTime } from '@/calendar/date-format'
import { useCalendarCustomization } from '@/calendar/customization'
import { cn } from '@/lib/utils'

const props = defineProps<{
  firstVisibleHour: number
  lastVisibleHour: number
}>()

const { currentTime } = useCurrentTime()
const dateLocale = useDateLocale()
const customization = useCalendarCustomization()

const currentHour = computed(() => currentTime.value.getHours())

const isVisible = computed(() => {
  return currentHour.value >= props.firstVisibleHour && currentHour.value < props.lastVisibleHour
})

const currentTimePosition = computed(() => {
  const minutes = currentTime.value.getHours() * 60 + currentTime.value.getMinutes()
  const visibleStartMinutes = props.firstVisibleHour * 60
  const visibleEndMinutes = props.lastVisibleHour * 60
  const visibleRangeMinutes = visibleEndMinutes - visibleStartMinutes

  return ((minutes - visibleStartMinutes) / visibleRangeMinutes) * 100
})

const timelineClasses = computed(() =>
  cn(
    'pointer-events-none absolute inset-x-0 z-50 border-t border-primary',
    customization.value.classNames?.timeline,
  ),
)

const formattedTime = computed(() => formatTime(currentTime.value, dateLocale.value))
</script>

<template>
  <div
    v-if="isVisible"
    :class="timelineClasses"
    :style="{ top: `${currentTimePosition}%` }"
  >
    <div class="absolute left-0 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
    <div class="absolute -left-18 flex w-16 -translate-y-1/2 justify-end bg-background pr-1 text-xs font-medium text-primary">
      {{ formattedTime }}
    </div>
  </div>
</template>
