<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TCalendarView } from '@/calendar/types'
import type { IEvent } from '@/calendar/interfaces'
import { useCalendarStore } from '@/stores/calendar'
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

const props = withDefaults(defineProps<{
  view: TCalendarView
  canAdd?: boolean
  canEdit?: boolean
  canDelete?: boolean
}>(), {
  canAdd: true,
  canEdit: true,
  canDelete: true,
})

const emit = defineEmits<{
  'update:view': [view: TCalendarView]
  'eventCreated': [event: IEvent]
  'eventUpdated': [event: IEvent]
  'eventDeleted': [event: IEvent]
}>()

const store = useCalendarStore()
const viewRef = computed(() => props.view)

function handleChangeView(view: TCalendarView) {
  emit('update:view', view)
}

const { filteredEvents, singleDayEvents, multiDayEvents } = useFilteredEvents(viewRef)

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

function handleDelete(event: IEvent) {
  store.deleteEvent(event.id)
  detailsOpen.value = false
  selectedEvent.value = null
  emit('eventDeleted', event)
}

function handleAddEvent(startDate?: Date, startTime?: { hour: number; minute: number }) {
  addEventStartDate.value = startDate
  addEventStartTime.value = startTime
  addOpen.value = true
}

function handleEventCreated(event: IEvent) {
  emit('eventCreated', event)
}

function handleEventUpdated(event: IEvent) {
  emit('eventUpdated', event)
}
</script>

<template>
  <div class="overflow-hidden rounded-xl border">
    <CalendarHeader :view="view" :events="filteredEvents" :can-add="canAdd" @add-event="handleAddEvent()" @change-view="handleChangeView" />

    <CalendarMonthView
      v-if="view === 'month'"
      :single-day-events="singleDayEvents"
      :multi-day-events="multiDayEvents"
      @open-details="handleOpenDetails"
      @select-day="emit('update:view', 'day')"
    />

    <CalendarWeekView
      v-else-if="view === 'week'"
      :single-day-events="singleDayEvents"
      :multi-day-events="multiDayEvents"
      :can-add="canAdd"
      @open-details="handleOpenDetails"
      @add-event="handleAddEvent"
    />

    <CalendarDayView
      v-else-if="view === 'day'"
      :single-day-events="singleDayEvents"
      :multi-day-events="multiDayEvents"
      :can-add="canAdd"
      @open-details="handleOpenDetails"
      @add-event="handleAddEvent"
    />

    <CalendarYearView
      v-else-if="view === 'year'"
      :all-events="filteredEvents"
      @select-day="emit('update:view', 'day')"
      @select-month="emit('update:view', 'month')"
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
    :can-edit="canEdit"
    :can-delete="canDelete"
    @update:open="detailsOpen = $event"
    @edit="handleEdit"
    @delete="handleDelete"
  />

  <EditEventDialog
    v-if="selectedEvent && canEdit"
    :key="selectedEvent.id"
    :event="selectedEvent"
    :open="editOpen"
    @update:open="editOpen = $event"
    @event-updated="handleEventUpdated"
  />

  <AddEventDialog
    v-if="canAdd"
    :open="addOpen"
    :start-date="addEventStartDate"
    :start-time="addEventStartTime"
    @update:open="addOpen = $event"
    @event-created="handleEventCreated"
  />
</template>
