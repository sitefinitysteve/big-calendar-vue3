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

const store = useCalendarStore()

function handleChange(value: string | number | bigint | Record<string, any> | null) {
  store.badgeVariant = value as TBadgeVariant
}
</script>

<template>
  <div class="space-y-2">
    <label class="text-sm font-medium">Badge Variant</label>
    <Select :model-value="store.badgeVariant" @update:model-value="handleChange">
      <SelectTrigger>
        <SelectValue placeholder="Select variant" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="colored">Colored</SelectItem>
        <SelectItem value="dot">Dot</SelectItem>
        <SelectItem value="mixed">Mixed</SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
