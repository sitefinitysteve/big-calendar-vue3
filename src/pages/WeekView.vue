<script setup lang="ts">
import { useRouter } from 'vue-router'
import CalendarContainer from '@/calendar/components/CalendarContainer.vue'
import type { TCalendarView } from '@/calendar/types'

const router = useRouter()
function onChangeView(view: TCalendarView) { router.push(`/${view}-view`) }
</script>

<template>
  <CalendarContainer view="week" @update:view="onChangeView" />
</template>
