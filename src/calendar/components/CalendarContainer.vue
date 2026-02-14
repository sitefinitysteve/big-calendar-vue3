<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TCalendarView } from '@/calendar/types'
import type { IEvent } from '@/calendar/interfaces'
import { useFilteredEvents } from '@/calendar/composables/useFilteredEvents'
import CalendarHeader from '@/calendar/components/header/CalendarHeader.vue'
import CalendarMonthView from '@/calendar/components/month-view/CalendarMonthView.vue'
import CalendarWeekView from '@/calendar/components/week-view/CalendarWeekView.vue'
import CalendarDayView from '@/calendar/components/day-view/CalendarDayView.vue'
import CalendarYearView from '@/calendar/components/year-view/CalendarYearView.vue'
import CalendarAgendaView from '@/calendar/components/agenda-view/CalendarAgendaView.vue'
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

    <CalendarWeekView
      v-else-if="view === 'week'"
      :single-day-events="singleDayEvents"
      :multi-day-events="multiDayEvents"
      @open-details="handleOpenDetails"
      @add-event="handleAddEvent"
    />

    <CalendarDayView
      v-else-if="view === 'day'"
      :single-day-events="singleDayEvents"
      :multi-day-events="multiDayEvents"
      @open-details="handleOpenDetails"
      @add-event="handleAddEvent"
    />

    <CalendarYearView
      v-else-if="view === 'year'"
      :all-events="filteredEvents"
    />

    <CalendarAgendaView
      v-else-if="view === 'agenda'"
      :single-day-events="singleDayEvents"
      :multi-day-events="multiDayEvents"
      @open-details="handleOpenDetails"
    />
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
