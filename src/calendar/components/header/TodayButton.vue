<script setup lang="ts">
import { format } from 'date-fns'
import { useCalendarStore } from '@/stores/calendar'
import { useDateLocale } from '@/calendar/labels'

const store = useCalendarStore()
const dateLocale = useDateLocale()

const today = new Date()

function handleClick() {
  store.setSelectedDate(today)
}
</script>

<template>
  <button
    class="flex size-14 flex-col items-start overflow-hidden rounded-lg border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    @click="handleClick"
  >
    <p class="flex h-6 w-full items-center justify-center bg-primary text-center text-xs font-semibold text-primary-foreground">
      {{ format(today, 'MMM', dateLocale ? { locale: dateLocale } : undefined).toUpperCase() }}
    </p>
    <p class="flex w-full items-center justify-center text-lg font-bold">
      {{ today.getDate() }}
    </p>
  </button>
</template>
