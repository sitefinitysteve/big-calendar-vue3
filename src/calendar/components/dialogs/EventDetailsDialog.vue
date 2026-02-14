<script setup lang="ts">
import { format, parseISO } from 'date-fns'
import { Calendar, Clock, Text, User } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { IEvent } from '@/calendar/interfaces'

const props = defineProps<{
  event: IEvent
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  edit: [event: IEvent]
  delete: [event: IEvent]
}>()

const startDate = parseISO(props.event.startDate)
const endDate = parseISO(props.event.endDate)
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ event.title }}</DialogTitle>
      </DialogHeader>

      <div class="space-y-4">
        <div class="flex items-start gap-2">
          <User class="mt-1 size-4 shrink-0" />
          <div>
            <p class="text-sm font-medium">Responsible</p>
            <p class="text-sm text-muted-foreground">{{ event.user.name }}</p>
          </div>
        </div>

        <div class="flex items-start gap-2">
          <Calendar class="mt-1 size-4 shrink-0" />
          <div>
            <p class="text-sm font-medium">Start Date</p>
            <p class="text-sm text-muted-foreground">{{ format(startDate, 'MMM d, yyyy h:mm a') }}</p>
          </div>
        </div>

        <div class="flex items-start gap-2">
          <Clock class="mt-1 size-4 shrink-0" />
          <div>
            <p class="text-sm font-medium">End Date</p>
            <p class="text-sm text-muted-foreground">{{ format(endDate, 'MMM d, yyyy h:mm a') }}</p>
          </div>
        </div>

        <div class="flex items-start gap-2">
          <Text class="mt-1 size-4 shrink-0" />
          <div>
            <p class="text-sm font-medium">Description</p>
            <p class="text-sm text-muted-foreground">{{ event.description }}</p>
          </div>
        </div>
      </div>

      <DialogFooter class="flex-row gap-2 sm:justify-between">
        <Button type="button" variant="destructive" @click="emit('delete', event)">
          Delete
        </Button>
        <Button type="button" variant="outline" @click="emit('edit', event)">
          Edit
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
