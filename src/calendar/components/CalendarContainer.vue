<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TCalendarView } from '@/calendar/types'
import type { IEvent } from '@/calendar/interfaces'
import { useFilteredEvents } from '@/calendar/composables/useFilteredEvents'
import CalendarHeader from '@/calendar/components/header/CalendarHeader.vue'
import CalendarMonthView from '@/calendar/components/month-view/CalendarMonthView.vue'
import EventDetailsDialog from '@/calendar/components/dialogs/EventDetailsDialog.vue'
import EditEventDialog from '@/calendar/components/dialogs/EditEventDialog.vue'
import AddEventDialog from '@/calendar/components/dialogs/AddEventDialog.vue'

const props = defineProps<{ view: TCalendarView }>()

const viewRef = computed(() => props.view)

const { filteredEvents, singleDayEvents, multiDayEvents, eventStartDates } = useFilteredEvents(viewRef)

// Dialog state
const detailsOpen = ref(false)
const editOpen = ref(false)
const addOpen = ref(false)
const selectedEvent = ref<IEvent | null>(null)
const addEventStartDate = ref<Date>()
const addEventStartTime = ref<{ hour: number; minute: number }>()

function handleOpenDetails(event: IEvent) {
  selectedEvent.value = event
  detailsOpen.value = true
}

function handleEdit(event: IEvent) {
  detailsOpen.value = false
  selectedEvent.value = event
  editOpen.value = true
}

function handleAddEvent(startDate?: Date, startTime?: { hour: number; minute: number }) {
  addEventStartDate.value = startDate
  addEventStartTime.value = startTime
  addOpen.value = true
}
</script>

<template>
  <div class="overflow-hidden rounded-xl border">
    <CalendarHeader :view="view" :events="filteredEvents" @add-event="handleAddEvent()" />

    <CalendarMonthView
      v-if="view === 'month'"
      :single-day-events="singleDayEvents"
      :multi-day-events="multiDayEvents"
      @open-details="handleOpenDetails"
    />

    <!-- Week view (Task 10) -->
    <div v-else-if="view === 'week'" class="p-8 text-center text-muted-foreground">
      Week View (coming soon)
    </div>

    <!-- Day view (Task 11) -->
    <div v-else-if="view === 'day'" class="p-8 text-center text-muted-foreground">
      Day View (coming soon)
    </div>

    <!-- Year view (Task 12) -->
    <div v-else-if="view === 'year'" class="p-8 text-center text-muted-foreground">
      Year View (coming soon)
    </div>

    <!-- Agenda view (Task 13) -->
    <div v-else-if="view === 'agenda'" class="p-8 text-center text-muted-foreground">
      Agenda View (coming soon)
    </div>
  </div>

  <!-- Dialogs rendered outside the calendar border -->
  <EventDetailsDialog
    v-if="selectedEvent"
    :event="selectedEvent"
    :open="detailsOpen"
    @update:open="detailsOpen = $event"
    @edit="handleEdit"
  />

  <EditEventDialog
    v-if="selectedEvent"
    :key="selectedEvent.id"
    :event="selectedEvent"
    :open="editOpen"
    @update:open="editOpen = $event"
  />

  <AddEventDialog
    :open="addOpen"
    :start-date="addEventStartDate"
    :start-time="addEventStartTime"
    @update:open="addOpen = $event"
  />
</template>
