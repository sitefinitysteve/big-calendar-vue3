<script setup lang="ts">
import { useLocale } from '@/composables/useLocale'
import type { TLocale } from '@/composables/useLocale'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const { locale, setLocale, LOCALE_OPTIONS } = useLocale()

function handleChange(value: string | number | bigint | Record<string, any> | null) {
  setLocale(value as TLocale)
}
</script>

<template>
  <Select :model-value="locale" @update:model-value="handleChange">
    <SelectTrigger class="w-[130px] h-9">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem v-for="opt in LOCALE_OPTIONS" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>
