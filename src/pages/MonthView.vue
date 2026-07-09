<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CalendarContainer from '@/calendar/components/CalendarContainer.vue'
import { useCalendarStore } from '@/stores/calendar'
import { useLocale } from '@/composables/useLocale'
import type { TCalendarView } from '@/calendar/types'
import type { IEvent } from '@/calendar/interfaces'

const router = useRouter()
const store = useCalendarStore()
const { currentLabels, currentDateLocale } = useLocale()
function onChangeView(view: TCalendarView) { router.push(`/${view}-view`) }

// Events-only integration demo: BigCalendar just FIRES events; the host app
// decides what to do (open its own dialog, route, call an API, ...). We disable
// the built-in navigation + details dialog so nothing happens except the emit.
const lastDayClick = ref<string | null>(null)
const lastEventClick = ref<string | null>(null)
const lastContextMenu = ref<string | null>(null)

function onDayClick(date: string) {
  // `date` is a UTC-safe `yyyy-MM-dd` string. A real app would do e.g.
  //   openLogDialog({ initialDate: date })
  lastDayClick.value = date
}

function onEventClick(event: IEvent) {
  // A real app would do e.g. openEditDialog(event.id)
  lastEventClick.value = `${event.title} (#${event.id})`
}

function onDayContextMenu(payload: { date: string; x: number; y: number }) {
  // The native browser menu is already suppressed; a real app would open its
  // own menu at (payload.x, payload.y).
  lastContextMenu.value = `day ${payload.date} @ ${payload.x},${payload.y}`
}

function onEventContextMenu(payload: { event: IEvent; x: number; y: number }) {
  lastContextMenu.value = `event "${payload.event.title}" (#${payload.event.id}) @ ${payload.x},${payload.y}`
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex flex-wrap items-center gap-2 text-sm">
      <span
        class="rounded-md border border-dashed bg-muted/40 px-3 py-1.5 text-muted-foreground"
        data-testid="last-day-click"
      >
        <code class="text-foreground">@day-click</code>
        →
        <span class="font-medium text-foreground">{{ lastDayClick ?? '— click a day —' }}</span>
      </span>
      <span
        class="rounded-md border border-dashed bg-muted/40 px-3 py-1.5 text-muted-foreground"
        data-testid="last-event-click"
      >
        <code class="text-foreground">@event-click</code>
        →
        <span class="font-medium text-foreground">{{ lastEventClick ?? '— click an event —' }}</span>
      </span>
      <span
        class="rounded-md border border-dashed bg-muted/40 px-3 py-1.5 text-muted-foreground"
        data-testid="last-context-menu"
      >
        <code class="text-foreground">context-menu</code>
        →
        <span class="font-medium text-foreground">{{ lastContextMenu ?? '— right-click —' }}</span>
      </span>
    </div>

    <CalendarContainer
      view="month"
      :labels="currentLabels"
      :date-locale="currentDateLocale"
      :available-views="store.availableViews"
      :show-user-select="store.showUserSelect"
      :can-add="store.canAdd"
      :can-edit="store.canEdit"
      :can-delete="store.canDelete"
      :navigate-on-day-click="false"
      :open-details-on-event-click="false"
      @update:view="onChangeView"
      @day-click="onDayClick"
      @event-click="onEventClick"
      @day-context-menu="onDayContextMenu"
      @event-context-menu="onEventContextMenu"
    />
  </div>
</template>
