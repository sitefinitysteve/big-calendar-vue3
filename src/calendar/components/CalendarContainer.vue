<script setup lang="ts">
import { computed, getCurrentInstance, provide, ref } from 'vue'
import { format } from 'date-fns'
import type { TCalendarView } from '@/calendar/types'
import type { IEvent } from '@/calendar/interfaces'
import type { Locale } from 'date-fns'
import type { ICalendarLabels } from '@/calendar/labels'
import { DEFAULT_LABELS, CALENDAR_LABELS_KEY, CALENDAR_FLAGS_KEY, CALENDAR_DATE_LOCALE_KEY } from '@/calendar/labels'
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
  availableViews?: TCalendarView[]
  showUserSelect?: boolean
  labels?: Partial<ICalendarLabels>
  showViewTooltips?: boolean
  dateLocale?: Locale
  navigateOnDayClick?: boolean
  openDetailsOnEventClick?: boolean
}>(), {
  canAdd: true,
  canEdit: true,
  canDelete: true,
  availableViews: () => ['day', 'week', 'month', 'year', 'agenda'],
  showUserSelect: true,
  labels: () => ({}),
  showViewTooltips: true,
  navigateOnDayClick: true,
  openDetailsOnEventClick: true,
})

const emit = defineEmits<{
  'update:view': [view: TCalendarView]
  'eventCreated': [event: IEvent]
  'eventUpdated': [event: IEvent]
  'eventDeleted': [event: IEvent]
  // Fired when a day is clicked in month/year views. Payload is the local
  // calendar date as a `yyyy-MM-dd` string (built with date-fns `format`, so it
  // is never shifted by UTC conversion). Consumers handle it however they like.
  'dayClick': [date: string]
  // Fired when an event chip is clicked in any view. Payload is the full event
  // (use `event.id` to open your own editor).
  'eventClick': [event: IEvent]
  // Fired on right-click (contextmenu) of a day in month/year views. `date` is
  // the same UTC-safe `yyyy-MM-dd` string as `dayClick`; `x`/`y` are the cursor
  // position for placing your own menu. The native browser menu is suppressed
  // only when a listener is attached.
  'dayContextMenu': [payload: { date: string; x: number; y: number; originalEvent: MouseEvent }]
  // Fired on right-click (contextmenu) of an event chip in any view.
  'eventContextMenu': [payload: { event: IEvent; x: number; y: number; originalEvent: MouseEvent }]
}>()

const store = useCalendarStore()
const instance = getCurrentInstance()

const mergedLabels = computed(() => ({ ...DEFAULT_LABELS, ...props.labels }))
provide(CALENDAR_LABELS_KEY, mergedLabels)
provide(CALENDAR_FLAGS_KEY, { showViewTooltips: computed(() => props.showViewTooltips) })
provide(CALENDAR_DATE_LOCALE_KEY, computed(() => props.dateLocale))

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
  emit('eventClick', event)
  // Built-in read dialog is opt-out: set `open-details-on-event-click="false"`
  // to handle event clicks entirely in your own app.
  if (props.openDetailsOnEventClick) {
    selectedEvent.value = event
    detailsOpen.value = true
  }
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

// Day click in month/year views: emit the clicked day as a `yyyy-MM-dd` string
// so consumers can handle it (e.g. open their own dialog). By default we also
// navigate to the day view (existing behavior); set `navigate-on-day-click="false"`
// to only emit the event.
function handleDayClick(date: Date) {
  emit('dayClick', format(date, 'yyyy-MM-dd'))
  if (props.navigateOnDayClick) emit('update:view', 'day')
}

// Right-click (contextmenu) handling via delegation on the calendar root. We
// only preventDefault (suppress the native menu) when the consumer actually
// listens for the matching event — otherwise native right-click is untouched.
function hasListener(name: 'onDayContextMenu' | 'onEventContextMenu') {
  return !!instance?.vnode.props?.[name]
}

function handleContextMenu(e: MouseEvent) {
  const targetEl = e.target as HTMLElement | null
  if (!targetEl) return

  const eventEl = targetEl.closest<HTMLElement>('[data-event-id]')
  if (eventEl && hasListener('onEventContextMenu')) {
    const id = Number(eventEl.dataset.eventId)
    const found = filteredEvents.value.find(ev => ev.id === id)
    if (found) {
      e.preventDefault()
      emit('eventContextMenu', { event: found, x: e.clientX, y: e.clientY, originalEvent: e })
      return
    }
  }

  const dayEl = targetEl.closest<HTMLElement>('[data-date]')
  if (dayEl?.dataset.date && hasListener('onDayContextMenu')) {
    e.preventDefault()
    emit('dayContextMenu', { date: dayEl.dataset.date, x: e.clientX, y: e.clientY, originalEvent: e })
  }
}

function handleEventCreated(event: IEvent) {
  emit('eventCreated', event)
}

function handleEventUpdated(event: IEvent) {
  emit('eventUpdated', event)
}
</script>

<template>
  <div class="overflow-hidden rounded-xl border" @contextmenu="handleContextMenu">
    <CalendarHeader :view="view" :events="filteredEvents" :can-add="canAdd" :available-views="availableViews" :show-user-select="showUserSelect" @add-event="handleAddEvent()" @change-view="handleChangeView" />

    <CalendarMonthView
      v-if="view === 'month'"
      :single-day-events="singleDayEvents"
      :multi-day-events="multiDayEvents"
      @open-details="handleOpenDetails"
      @select-day="handleDayClick"
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
      @select-day="handleDayClick"
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
