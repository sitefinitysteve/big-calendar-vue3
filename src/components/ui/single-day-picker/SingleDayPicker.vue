<script setup lang="ts">
import { computed } from 'vue'
import { format } from 'date-fns'
import { CalendarDate } from '@internationalized/date'
import type { DateValue } from 'reka-ui'
import { useDisclosure } from '@/calendar/composables/useDisclosure'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  modelValue?: Date
  placeholder?: string
  labelVariant?: 'P' | 'PP' | 'PPP'
  class?: string
  id?: string
}>(), {
  placeholder: 'Select a date',
  labelVariant: 'PPP',
})

const emit = defineEmits<{
  'update:modelValue': [value: Date | undefined]
}>()

const { isOpen, onClose, onToggle } = useDisclosure()

const calendarValue = computed<DateValue | undefined>(() => {
  if (!props.modelValue) return undefined
  return new CalendarDate(
    props.modelValue.getFullYear(),
    props.modelValue.getMonth() + 1,
    props.modelValue.getDate(),
  )
})

function handleSelect(value: DateValue | undefined) {
  if (!value) {
    emit('update:modelValue', undefined)
  } else {
    const date = new Date(value.year, value.month - 1, value.day)
    emit('update:modelValue', date)
  }
  onClose()
}
</script>

<template>
  <Popover :open="isOpen" @update:open="onToggle">
    <PopoverTrigger as-child>
      <Button
        :id="id"
        variant="outline"
        :class="cn('group relative h-9 w-full justify-start whitespace-nowrap px-3 py-2 font-normal hover:bg-inherit', $props.class)"
      >
        <span v-if="modelValue">{{ format(modelValue, labelVariant) }}</span>
        <span v-else class="text-muted-foreground">{{ placeholder }}</span>
      </Button>
    </PopoverTrigger>

    <PopoverContent align="center" class="w-fit p-0">
      <Calendar
        :model-value="calendarValue"
        @update:model-value="handleSelect"
      />
    </PopoverContent>
  </Popover>
</template>
