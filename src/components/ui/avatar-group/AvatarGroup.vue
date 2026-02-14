<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  class?: HTMLAttributes['class']
  max?: number
  count?: number
  spacing?: number
}>(), {
  max: 1,
  count: 0,
  spacing: 10,
})

const overflow = computed(() => props.count > props.max ? props.count - props.max : 0)
</script>

<template>
  <div
    :class="cn('relative flex [&>*:not(:first-child)]:-ml-[var(--avatar-group-spacing)] [&>*]:border-2 [&>*]:border-background', props.class)"
    :style="{ '--avatar-group-spacing': `${spacing}px` } as any"
  >
    <slot />
    <div
      v-if="overflow > 0"
      class="relative flex size-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xxs"
    >
      +{{ overflow }}
    </div>
  </div>
</template>
