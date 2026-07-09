<script setup lang="ts">
import { computed, getCurrentInstance, provide, ref } from 'vue'
import { format } from 'date-fns'
import { Pencil, Trash2 } from 'lucide-vue-next'
import type { TCalendarView } from '@/calendar/types'
import type { IEvent, ICalendarCommand, ICalendarCommandSelect } from '@/calendar/interfaces'
import type { Locale } from 'date-fns'
import type { ICalendarLabels } from '@/calendar/labels'
import { DEFAULT_LABELS, CALENDAR_LABELS_KEY, CALENDAR_FLAGS_KEY, CALENDAR_DATE_LOCALE_KEY } from '@/calendar/labels'
import { useCalendarStore } from '@/stores/calendar'
import { useFilteredEvents } from '@/calendar/composables/useFilteredEvents'
import CalendarContextMenu from '@/calendar/components/CalendarContextMenu.vue'
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
  // Right-click command menu (opt-in): when provided, right-clicking an event /
  // day opens a built-in reka-ui menu of these commands and emits `@command`.
  // Each command may set `views` to scope itself; the stock Edit/Delete toggles
  // accept `true` (all views) or an array of views to scope them too.
  eventCommands?: ICalendarCommand[]
  dayCommands?: ICalendarCommand[]
  showEditCommand?: boolean | TCalendarView[]
  showDeleteCommand?: boolean | TCalendarView[]
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
  eventCommands: () => [],
  dayCommands: () => [],
  showEditCommand: false,
  showDeleteCommand: false,
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
  // Fired when a right-click menu command is selected. The library performs no
  // action itself — the consumer handles the command (e.g. open its own editor).
  'command': [payload: ICalendarCommandSelect]
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

// Per-view scoping helpers: a command with no `views` shows everywhere; the
// stock toggles accept `true` (all views) or a list of views.
function commandInView(command: ICalendarCommand) {
  return !command.views || command.views.includes(props.view)
}
function stockInView(setting: boolean | TCalendarView[] | undefined) {
  return Array.isArray(setting) ? setting.includes(props.view) : !!setting
}

// The event menu = consumer's custom commands + opt-in stock Edit/Delete (which
// only emit `@command`; the library never edits/deletes), all filtered to the
// current view. The day menu is fully consumer-defined.
const eventMenuCommands = computed<ICalendarCommand[]>(() => {
  const custom = (props.eventCommands ?? []).filter(commandInView)
  const stock: ICalendarCommand[] = []
  const showEdit = stockInView(props.showEditCommand)
  const showDelete = stockInView(props.showDeleteCommand)
  // Separate the stock group from any custom commands above it.
  const separate = custom.length > 0
  if (showEdit) {
    stock.push({ id: 'edit', label: mergedLabels.value.buttonEdit, icon: Pencil, separatorBefore: separate })
  }
  if (showDelete) {
    stock.push({ id: 'delete', label: mergedLabels.value.buttonDelete, icon: Trash2, destructive: true, separatorBefore: separate && !showEdit })
  }
  return [...custom, ...stock]
})
const dayMenuCommands = computed<ICalendarCommand[]>(() => (props.dayCommands ?? []).filter(commandInView))

// Which commands + which target the (reka-ui) context menu should use. reka-ui
// owns the open state and positioning; we only stage the content on right-click.
type MenuTarget = { type: 'event'; event: IEvent } | { type: 'day'; date: string }
const menuCommands = ref<ICalendarCommand[]>([])
const menuTarget = ref<MenuTarget | null>(null)

function handleCommandSelect(command: ICalendarCommand) {
  const target = menuTarget.value
  if (!target) return
  const payload: ICalendarCommandSelect = { commandId: command.id }
  if (target.type === 'event') payload.event = target.event
  else payload.date = target.date
  emit('command', payload)
}

// Runs in the CAPTURE phase, before reka-ui's ContextMenu trigger (a bubble-phase
// listener on the same element). This lets us decide whether a menu should open:
//  - target has commands  -> stage them and let reka-ui open + position the menu
//  - no commands but a raw @day/eventContextMenu listener -> emit that instead
//  - otherwise            -> block reka-ui and leave the native browser menu alone
function hasListener(name: 'onDayContextMenu' | 'onEventContextMenu') {
  return !!instance?.vnode.props?.[name]
}

// Stop reka-ui's ContextMenu from opening (no blank menu) without touching the
// native menu — we deliberately do NOT preventDefault here.
function blockMenu(e: MouseEvent) {
  menuCommands.value = []
  menuTarget.value = null
  e.stopImmediatePropagation()
}

function handleContextMenu(e: MouseEvent) {
  const targetEl = e.target as HTMLElement | null
  if (!targetEl) { blockMenu(e); return }

  const eventEl = targetEl.closest<HTMLElement>('[data-event-id]')
  if (eventEl) {
    const found = filteredEvents.value.find(ev => ev.id === Number(eventEl.dataset.eventId))
    if (found) {
      if (eventMenuCommands.value.length) {
        menuCommands.value = eventMenuCommands.value
        menuTarget.value = { type: 'event', event: found }
        return // let reka-ui open + position the menu
      }
      if (hasListener('onEventContextMenu')) {
        e.preventDefault()
        emit('eventContextMenu', { event: found, x: e.clientX, y: e.clientY, originalEvent: e })
      }
      blockMenu(e)
      return
    }
  }

  const dayEl = targetEl.closest<HTMLElement>('[data-date]')
  if (dayEl?.dataset.date) {
    const date = dayEl.dataset.date
    if (dayMenuCommands.value.length) {
      menuCommands.value = dayMenuCommands.value
      menuTarget.value = { type: 'day', date }
      return
    }
    if (hasListener('onDayContextMenu')) {
      e.preventDefault()
      emit('dayContextMenu', { date, x: e.clientX, y: e.clientY, originalEvent: e })
    }
    blockMenu(e)
    return
  }

  // Right-clicked neither an event nor a day (e.g. the header) — no built-in menu.
  blockMenu(e)
}

function handleEventCreated(event: IEvent) {
  emit('eventCreated', event)
}

function handleEventUpdated(event: IEvent) {
  emit('eventUpdated', event)
}
</script>

<template>
  <CalendarContextMenu :commands="menuCommands" @select="handleCommandSelect">
    <div class="overflow-hidden rounded-xl border" @contextmenu.capture="handleContextMenu">
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
  </CalendarContextMenu>

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
