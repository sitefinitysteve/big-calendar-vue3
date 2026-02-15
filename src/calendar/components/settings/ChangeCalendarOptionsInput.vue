<script setup lang="ts">
import { computed } from 'vue'
import { useCalendarStore } from '@/stores/calendar'
import type { TCalendarView } from '@/calendar/types'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useCalendarLabels } from '@/calendar/labels'

const store = useCalendarStore()
const labels = useCalendarLabels()

const allViews = computed<{ view: TCalendarView; label: string }[]>(() => [
  { view: 'day', label: labels.value.viewDay },
  { view: 'week', label: labels.value.viewWeek },
  { view: 'month', label: labels.value.viewMonth },
  { view: 'year', label: labels.value.viewYear },
  { view: 'agenda', label: labels.value.viewAgenda },
])

function toggleView(view: TCalendarView) {
  const current = store.availableViews
  if (current.includes(view)) {
    if (current.length > 1) {
      store.availableViews = current.filter(v => v !== view)
    }
  } else {
    store.availableViews = [...current, view]
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <label class="text-sm font-medium">{{ labels.settingsAvailableViews }}</label>
      <div class="flex flex-wrap gap-1.5">
        <Button
          v-for="v in allViews"
          :key="v.view"
          size="sm"
          :variant="store.availableViews.includes(v.view) ? 'default' : 'outline'"
          @click="toggleView(v.view)"
        >
          {{ v.label }}
        </Button>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <Switch :model-value="store.showUserSelect" @update:model-value="store.showUserSelect = $event" />
      <label class="text-sm font-medium">{{ labels.settingsShowUserSelect }}</label>
    </div>

    <div class="flex items-center gap-3">
      <Switch :model-value="store.canAdd" @update:model-value="store.canAdd = $event" />
      <label class="text-sm font-medium">{{ labels.settingsCanAdd }}</label>
    </div>

    <div class="flex items-center gap-3">
      <Switch :model-value="store.canEdit" @update:model-value="store.canEdit = $event" />
      <label class="text-sm font-medium">{{ labels.settingsCanEdit }}</label>
    </div>

    <div class="flex items-center gap-3">
      <Switch :model-value="store.canDelete" @update:model-value="store.canDelete = $event" />
      <label class="text-sm font-medium">{{ labels.settingsCanDelete }}</label>
    </div>
  </div>
</template>
