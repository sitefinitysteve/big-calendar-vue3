<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  modelValue?: { hour: number; minute: number }
  hourCycle?: 12 | 24
  class?: string
  'data-invalid'?: boolean
}>(), {
  hourCycle: 12,
})

const emit = defineEmits<{
  'update:modelValue': [value: { hour: number; minute: number }]
}>()

const hours = computed(() => {
  if (props.hourCycle === 24) {
    return Array.from({ length: 24 }, (_, i) => ({
      value: i,
      label: String(i).padStart(2, '0'),
    }))
  }
  return Array.from({ length: 12 }, (_, i) => ({
    value: i === 0 ? 12 : i,
    label: String(i === 0 ? 12 : i).padStart(2, '0'),
  }))
})

const minutes = Array.from({ length: 60 }, (_, i) => ({
  value: i,
  label: String(i).padStart(2, '0'),
}))

const displayHour = computed(() => {
  if (!props.modelValue) return ''
  if (props.hourCycle === 24) return String(props.modelValue.hour).padStart(2, '0')
  const h = props.modelValue.hour % 12
  return String(h === 0 ? 12 : h).padStart(2, '0')
})

const displayMinute = computed(() => {
  if (!props.modelValue) return ''
  return String(props.modelValue.minute).padStart(2, '0')
})

const period = computed(() => {
  if (!props.modelValue || props.hourCycle === 24) return 'AM'
  return props.modelValue.hour >= 12 ? 'PM' : 'AM'
})

function handleHourChange(e: Event) {
  const value = parseInt((e.target as HTMLSelectElement).value)
  let hour24 = value
  if (props.hourCycle === 12) {
    if (period.value === 'PM' && value !== 12) hour24 = value + 12
    else if (period.value === 'AM' && value === 12) hour24 = 0
    else hour24 = value
  }
  emit('update:modelValue', { hour: hour24, minute: props.modelValue?.minute ?? 0 })
}

function handleMinuteChange(e: Event) {
  const value = parseInt((e.target as HTMLSelectElement).value)
  emit('update:modelValue', { hour: props.modelValue?.hour ?? 0, minute: value })
}

function handlePeriodChange(e: Event) {
  const newPeriod = (e.target as HTMLSelectElement).value
  if (!props.modelValue) return
  let hour = props.modelValue.hour
  if (newPeriod === 'PM' && hour < 12) hour += 12
  else if (newPeriod === 'AM' && hour >= 12) hour -= 12
  emit('update:modelValue', { hour, minute: props.modelValue.minute })
}
</script>

<template>
  <div
    :class="cn(
      'inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-md border bg-background px-3 py-2 text-sm',
      'focus-within:outline-none focus-within:ring-1 focus-within:ring-ring',
      $props.class,
    )"
  >
    <select
      :value="displayHour"
      class="appearance-none bg-transparent p-0.5 text-center outline-none focus:bg-foreground/10 focus:rounded"
      @change="handleHourChange"
    >
      <option v-if="!modelValue" value="" disabled>--</option>
      <option v-for="h in hours" :key="h.value" :value="h.label">{{ h.label }}</option>
    </select>
    <span class="text-muted-foreground">:</span>
    <select
      :value="displayMinute"
      class="appearance-none bg-transparent p-0.5 text-center outline-none focus:bg-foreground/10 focus:rounded"
      @change="handleMinuteChange"
    >
      <option v-if="!modelValue" value="" disabled>--</option>
      <option v-for="m in minutes" :key="m.value" :value="m.label">{{ m.label }}</option>
    </select>
    <select
      v-if="hourCycle === 12"
      :value="period"
      class="ml-1 appearance-none bg-transparent p-0.5 text-center outline-none focus:bg-foreground/10 focus:rounded"
      @change="handlePeriodChange"
    >
      <option value="AM">AM</option>
      <option value="PM">PM</option>
    </select>
  </div>
</template>
