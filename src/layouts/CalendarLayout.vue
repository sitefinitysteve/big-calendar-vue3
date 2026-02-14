<script setup lang="ts">
import { onMounted } from 'vue'
import { useCalendarStore } from '@/stores/calendar'
import { USERS_MOCK, CALENDAR_ITEMS_MOCK } from '@/calendar/mocks'

const store = useCalendarStore()

onMounted(() => {
  store.initialize(USERS_MOCK, CALENDAR_ITEMS_MOCK)
})
</script>

<template>
  <div class="mx-auto flex max-w-screen-2xl flex-col gap-4 px-8 py-4">
    <router-view />
    <!-- Settings accordion will be added in Task 14 -->
  </div>
</template>
