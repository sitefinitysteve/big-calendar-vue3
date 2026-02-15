<script setup lang="ts">
import { useRouter } from 'vue-router'
import CalendarContainer from '@/calendar/components/CalendarContainer.vue'
import { useCalendarStore } from '@/stores/calendar'
import { useLocale } from '@/composables/useLocale'
import type { TCalendarView } from '@/calendar/types'

const router = useRouter()
const store = useCalendarStore()
const { currentLabels, currentDateLocale } = useLocale()
function onChangeView(view: TCalendarView) { router.push(`/${view}-view`) }
</script>

<template>
  <CalendarContainer view="day" :labels="currentLabels" :date-locale="currentDateLocale" :available-views="store.availableViews" :show-user-select="store.showUserSelect" :can-add="store.canAdd" :can-edit="store.canEdit" :can-delete="store.canDelete" @update:view="onChangeView" />
</template>
