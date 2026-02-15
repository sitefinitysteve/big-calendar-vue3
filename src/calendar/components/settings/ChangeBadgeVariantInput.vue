<script setup lang="ts">
import { useCalendarStore } from '@/stores/calendar'
import type { TBadgeVariant } from '@/calendar/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCalendarLabels } from '@/calendar/labels'

const store = useCalendarStore()
const labels = useCalendarLabels()

function handleChange(value: string | number | bigint | Record<string, any> | null) {
  store.badgeVariant = value as TBadgeVariant
}
</script>

<template>
  <div class="space-y-2">
    <label class="text-sm font-medium">{{ labels.settingsBadgeVariant }}</label>
    <Select :model-value="store.badgeVariant" @update:model-value="handleChange">
      <SelectTrigger>
        <SelectValue :placeholder="labels.selectVariant" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="colored">{{ labels.badgeColored }}</SelectItem>
        <SelectItem value="dot">{{ labels.badgeDot }}</SelectItem>
        <SelectItem value="mixed">{{ labels.badgeMixed }}</SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
