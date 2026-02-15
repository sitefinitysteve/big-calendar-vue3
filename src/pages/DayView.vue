<script setup lang="ts">
import { useRouter } from 'vue-router'
import CalendarContainer from '@/calendar/components/CalendarContainer.vue'
import { useCalendarStore } from '@/stores/calendar'
import type { TCalendarView } from '@/calendar/types'

const router = useRouter()
const store = useCalendarStore()
function onChangeView(view: TCalendarView) { router.push(`/${view}-view`) }
</script>

<template>
  <CalendarContainer view="day" :available-views="store.availableViews" :show-user-select="store.showUserSelect" @update:view="onChangeView" />
</template>
