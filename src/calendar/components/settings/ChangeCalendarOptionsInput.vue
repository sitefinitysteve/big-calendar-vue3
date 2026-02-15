<script setup lang="ts">
import { useCalendarStore } from '@/stores/calendar'
import type { TCalendarView } from '@/calendar/types'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

const store = useCalendarStore()

const allViews: { view: TCalendarView; label: string }[] = [
  { view: 'day', label: 'Day' },
  { view: 'week', label: 'Week' },
  { view: 'month', label: 'Month' },
  { view: 'year', label: 'Year' },
  { view: 'agenda', label: 'Agenda' },
]

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
      <label class="text-sm font-medium">Available Views</label>
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
      <label class="text-sm font-medium">Show User Select</label>
    </div>

    <div class="flex items-center gap-3">
      <Switch :model-value="store.canAdd" @update:model-value="store.canAdd = $event" />
      <label class="text-sm font-medium">Can Add Events</label>
    </div>

    <div class="flex items-center gap-3">
      <Switch :model-value="store.canEdit" @update:model-value="store.canEdit = $event" />
      <label class="text-sm font-medium">Can Edit Events</label>
    </div>

    <div class="flex items-center gap-3">
      <Switch :model-value="store.canDelete" @update:model-value="store.canDelete = $event" />
      <label class="text-sm font-medium">Can Delete Events</label>
    </div>
  </div>
</template>
