<script setup lang="ts">
import { ref, onBeforeUnmount, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { Copy, Clock, CalendarPlus } from 'lucide-vue-next'
import CalendarContainer from '@/calendar/components/CalendarContainer.vue'
import { useCalendarStore } from '@/stores/calendar'
import { useLocale } from '@/composables/useLocale'
import type { TCalendarView } from '@/calendar/types'
import type { IEvent, ICalendarCommand, ICalendarCommandSelect } from '@/calendar/interfaces'

// One shared demo host used by every view page. It shows the events-only
// integration (BigCalendar fires events; this host decides what to do) with a
// single command config reused across all views — per-command `views` scopes
// where each entry appears, so nothing is duplicated per view.
const props = defineProps<{ view: TCalendarView }>()

const router = useRouter()
const store = useCalendarStore()
const { currentLabels, currentDateLocale } = useLocale()
function onChangeView(view: TCalendarView) { router.push(`/${view}-view`) }

const lastDayClick = ref<string | null>(null)
const lastEventClick = ref<string | null>(null)
const lastCommand = ref<string | null>(null)

// Defined ONCE, shared by every view. `views` scopes an entry to specific views;
// omit it to show everywhere.
const eventCommands: ICalendarCommand[] = [
  { id: 'duplicate', label: 'Duplicate', icon: Copy },                              // every view
  { id: 'reschedule', label: 'Reschedule', icon: Clock, views: ['week', 'day'] },  // timed views only
]
const dayCommands: ICalendarCommand[] = [
  { id: 'new-log', label: 'New log entry', icon: CalendarPlus },                   // month/year day cells
]

// Show each fired event in its chip, then clear it a few seconds later so the
// panels don't accumulate stale values.
const timers = new Map<Ref<string | null>, ReturnType<typeof setTimeout>>()
function flash(target: Ref<string | null>, value: string) {
  target.value = value
  const existing = timers.get(target)
  if (existing) clearTimeout(existing)
  timers.set(target, setTimeout(() => { target.value = null }, 4000))
}
onBeforeUnmount(() => timers.forEach(clearTimeout))

function onDayClick(date: string) { flash(lastDayClick, date) }
function onEventClick(event: IEvent) { flash(lastEventClick, `${event.title} (#${event.id})`) }
function onCommand(p: ICalendarCommandSelect) {
  flash(lastCommand, p.event
    ? `${p.commandId} → "${p.event.title}" (#${p.event.id})`
    : `${p.commandId} → day ${p.date}`)
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex flex-wrap items-center gap-2 text-sm">
      <span class="rounded-md border border-dashed bg-muted/40 px-3 py-1.5 text-muted-foreground" data-testid="last-day-click">
        <code class="text-foreground">@day-click</code>
        →
        <span class="font-medium text-foreground">{{ lastDayClick ?? '— click a day —' }}</span>
      </span>
      <span class="rounded-md border border-dashed bg-muted/40 px-3 py-1.5 text-muted-foreground" data-testid="last-event-click">
        <code class="text-foreground">@event-click</code>
        →
        <span class="font-medium text-foreground">{{ lastEventClick ?? '— click an event —' }}</span>
      </span>
      <span class="rounded-md border border-dashed bg-muted/40 px-3 py-1.5 text-muted-foreground" data-testid="last-command">
        <code class="text-foreground">@command</code>
        →
        <span class="font-medium text-foreground">{{ lastCommand ?? '— right-click for menu —' }}</span>
      </span>
    </div>

    <CalendarContainer
      :view="props.view"
      :labels="currentLabels"
      :date-locale="currentDateLocale"
      :available-views="store.availableViews"
      :show-user-select="store.showUserSelect"
      :can-add="store.canAdd"
      :can-edit="store.canEdit"
      :can-delete="store.canDelete"
      :navigate-on-day-click="false"
      :open-details-on-event-click="false"
      :event-commands="eventCommands"
      :day-commands="dayCommands"
      show-edit-command
      :show-delete-command="['month', 'week', 'day']"
      @update:view="onChangeView"
      @day-click="onDayClick"
      @event-click="onEventClick"
      @command="onCommand"
    />
  </div>
</template>
