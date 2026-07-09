<script setup lang="ts">
import {
  ContextMenuRoot,
  ContextMenuTrigger,
  ContextMenuPortal,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from 'reka-ui'
import { cn } from '@/lib/utils'
import type { ICalendarCommand } from '@/calendar/interfaces'

// Wraps the calendar in reka-ui's ContextMenu (purpose-built for right-click):
// it opens at the cursor and — crucially — repositions natively on each new
// right-click, so there is no dismiss/reopen flicker. The parent decides *whether*
// a menu should appear (and with which commands) via the `commands` prop; when it
// is empty nothing renders, so a plain right-click keeps the native browser menu.
const props = defineProps<{ commands: ICalendarCommand[] }>()

const emit = defineEmits<{ select: [command: ICalendarCommand] }>()

function onSelect(command: ICalendarCommand) {
  if (command.disabled) return
  emit('select', command)
}
</script>

<template>
  <ContextMenuRoot>
    <ContextMenuTrigger as-child>
      <slot />
    </ContextMenuTrigger>
    <ContextMenuPortal>
      <ContextMenuContent
        v-if="props.commands.length"
        :collision-padding="8"
        class="bc-context-menu z-50 min-w-[9rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
      >
        <template v-for="(command, index) in props.commands" :key="command.id">
          <ContextMenuSeparator
            v-if="command.separatorBefore && index > 0"
            class="-mx-1 my-1 h-px bg-border"
          />
          <ContextMenuItem
            :disabled="command.disabled"
            :data-command-id="command.id"
            :class="cn(
              'bc-context-menu-item relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
              command.destructive && 'text-red-600 focus:bg-red-500/10 focus:text-red-600 dark:text-red-400 dark:focus:bg-red-500/15 dark:focus:text-red-400',
            )"
            @select="onSelect(command)"
          >
            <component :is="command.icon" v-if="command.icon" class="size-4 shrink-0" />
            <span class="truncate">{{ command.label }}</span>
          </ContextMenuItem>
        </template>
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>
