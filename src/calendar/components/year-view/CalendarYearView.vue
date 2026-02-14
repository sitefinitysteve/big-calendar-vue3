<script setup lang="ts">
import { computed } from 'vue'
import { addMonths, startOfYear } from 'date-fns'
import { useCalendarStore } from '@/stores/calendar'
import YearViewMonth from '@/calendar/components/year-view/YearViewMonth.vue'
import type { IEvent } from '@/calendar/interfaces'

const props = defineProps<{
  allEvents: IEvent[]
}>()

const store = useCalendarStore()

const months = computed(() => {
  const yearStart = startOfYear(store.selectedDate)
  return Array.from({ length: 12 }, (_, i) => addMonths(yearStart, i))
})
</script>

<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <YearViewMonth
      v-for="month in months"
      :key="month.toISOString()"
      :month="month"
      :events="allEvents"
    />
  </div>
</template>
