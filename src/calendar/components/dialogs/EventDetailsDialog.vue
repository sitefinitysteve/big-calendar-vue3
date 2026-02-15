<script setup lang="ts">
import { format, parseISO, isSameDay } from 'date-fns'
import { Calendar, Clock, Text, User } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { IEvent } from '@/calendar/interfaces'
import { useCalendarLabels, useDateLocale } from '@/calendar/labels'

const props = defineProps<{
  event: IEvent
  open: boolean
  canEdit?: boolean
  canDelete?: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  edit: [event: IEvent]
  delete: [event: IEvent]
}>()

const labels = useCalendarLabels()
const dateLocale = useDateLocale()

const fmtOpts = () => dateLocale.value ? { locale: dateLocale.value } : undefined

const startDate = parseISO(props.event.startDate)
const endDate = parseISO(props.event.endDate)
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ event.title }}</DialogTitle>
        <DialogDescription class="sr-only">{{ labels.fieldDescription }}</DialogDescription>
      </DialogHeader>

      <div class="space-y-4">
        <div class="flex items-start gap-2">
          <User class="mt-1 size-4 shrink-0" />
          <div>
            <p class="text-sm font-medium">{{ labels.fieldResponsible }}</p>
            <p class="text-sm text-muted-foreground">{{ event.user.name }}</p>
          </div>
        </div>

        <template v-if="event.isAllDay && isSameDay(startDate, endDate)">
          <div class="flex items-start gap-2">
            <Calendar class="mt-1 size-4 shrink-0" />
            <div>
              <p class="text-sm font-medium">{{ labels.fieldDate }}</p>
              <p class="text-sm text-muted-foreground">{{ format(startDate, 'MMM d, yyyy', fmtOpts()) }} ({{ labels.allDay }})</p>
            </div>
          </div>
        </template>

        <template v-else-if="event.isAllDay">
          <div class="flex items-start gap-2">
            <Calendar class="mt-1 size-4 shrink-0" />
            <div>
              <p class="text-sm font-medium">{{ labels.fieldStartDate }}</p>
              <p class="text-sm text-muted-foreground">{{ format(startDate, 'MMM d, yyyy', fmtOpts()) }}</p>
            </div>
          </div>

          <div class="flex items-start gap-2">
            <Clock class="mt-1 size-4 shrink-0" />
            <div>
              <p class="text-sm font-medium">{{ labels.fieldEndDate }}</p>
              <p class="text-sm text-muted-foreground">{{ format(endDate, 'MMM d, yyyy', fmtOpts()) }}</p>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="flex items-start gap-2">
            <Calendar class="mt-1 size-4 shrink-0" />
            <div>
              <p class="text-sm font-medium">{{ labels.fieldStartDate }}</p>
              <p class="text-sm text-muted-foreground">{{ format(startDate, 'MMM d, yyyy h:mm a', fmtOpts()) }}</p>
            </div>
          </div>

          <div class="flex items-start gap-2">
            <Clock class="mt-1 size-4 shrink-0" />
            <div>
              <p class="text-sm font-medium">{{ labels.fieldEndDate }}</p>
              <p class="text-sm text-muted-foreground">{{ format(endDate, 'MMM d, yyyy h:mm a', fmtOpts()) }}</p>
            </div>
          </div>
        </template>

        <div class="flex items-start gap-2">
          <Text class="mt-1 size-4 shrink-0" />
          <div>
            <p class="text-sm font-medium">{{ labels.fieldDescription }}</p>
            <p class="text-sm text-muted-foreground">{{ event.description }}</p>
          </div>
        </div>
      </div>

      <DialogFooter v-if="canDelete !== false || canEdit !== false" class="flex-row gap-2 sm:justify-between">
        <Button v-if="canDelete !== false" type="button" variant="destructive" @click="emit('delete', event)">
          {{ labels.buttonDelete }}
        </Button>
        <Button v-if="canEdit !== false" type="button" variant="outline" @click="emit('edit', event)">
          {{ labels.buttonEdit }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
