<script setup lang="ts">
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { TEventColor, TLegacyEventColor } from '@/calendar/types'
import { isLegacyColor } from '@/calendar/customization'

const props = defineProps<{
  color: TEventColor
  class?: string
}>()

const eventBulletVariants = cva('bc-event-bullet size-2 rounded-full', {
  variants: {
    color: {
      blue: 'bg-blue-600 dark:bg-blue-500',
      green: 'bg-green-600 dark:bg-green-500',
      red: 'bg-red-600 dark:bg-red-500',
      yellow: 'bg-yellow-600 dark:bg-yellow-500',
      purple: 'bg-purple-600 dark:bg-purple-500',
      gray: 'bg-neutral-600 dark:bg-neutral-500',
      orange: 'bg-orange-600 dark:bg-orange-500',
    },
  },
  defaultVariants: {
    color: 'blue',
  },
})

const legacy = computed(() => isLegacyColor(props.color))

const bulletClasses = computed(() =>
  cn(
    eventBulletVariants({ color: legacy.value ? (props.color as TLegacyEventColor) : undefined }),
    !legacy.value && 'bc-event-custom-color',
    props.class,
  ),
)

const bulletStyle = computed(() =>
  legacy.value ? undefined : ({ '--bc-event-color': props.color } as Record<string, string>),
)
</script>

<template>
  <div :class="bulletClasses" :style="bulletStyle" />
</template>
