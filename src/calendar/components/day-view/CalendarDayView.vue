<script setup lang="ts">
import { computed } from 'vue'
import { format, parseISO, areIntervalsOverlapping } from 'date-fns'
import { CalendarDate } from '@internationalized/date'
import type { DateValue } from 'reka-ui'
import { Calendar as CalendarIcon, Clock, User } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import { useCalendarStore } from '@/stores/calendar'
import { cn } from '@/lib/utils'
import {
  groupEvents,
  getEventBlockStyle,
  isWorkingHour,
  getCurrentEvents,
  getVisibleHours,
} from '@/calendar/helpers'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Calendar } from '@/components/ui/calendar'
import EventBlock from '@/calendar/components/week-view/EventBlock.vue'
import CalendarTimeline from '@/calendar/components/week-view/CalendarTimeline.vue'
import DayViewMultiDayEventsRow from '@/calendar/components/day-view/DayViewMultiDayEventsRow.vue'

import type { IEvent } from '@/calendar/interfaces'

const props = defineProps<{
  singleDayEvents: IEvent[]
  multiDayEvents: IEvent[]
}>()

const emit = defineEmits<{
  openDetails: [event: IEvent]
  addEvent: [startDate: Date, startTime: { hour: number; minute: number }]
}>()

const store = useCalendarStore()
const { selectedDate, users, workingHours, visibleHours } = storeToRefs(store)

const visibleHoursData = computed(() =>
  getVisibleHours(visibleHours.value, props.singleDayEvents),
)

const hours = computed(() => visibleHoursData.value.hours)
const earliestEventHour = computed(() => visibleHoursData.value.earliestEventHour)
const latestEventHour = computed(() => visibleHoursData.value.latestEventHour)

const currentEvents = computed(() => getCurrentEvents(props.singleDayEvents))

const dayEvents = computed(() =>
  props.singleDayEvents.filter(event => {
    const eventDate = parseISO(event.startDate)
    return (
      eventDate.getDate() === selectedDate.value.getDate() &&
      eventDate.getMonth() === selectedDate.value.getMonth() &&
      eventDate.getFullYear() === selectedDate.value.getFullYear()
    )
  }),
)

const groupedEvents = computed(() => groupEvents(dayEvents.value))

const calendarDateValue = computed<DateValue>(() => {
  const d = selectedDate.value
  return new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate())
})

function handleCalendarSelect(value: DateValue | undefined) {
  if (!value) return
  const jsDate = new Date(value.year, value.month - 1, value.day)
  store.setSelectedDate(jsDate)
}

function formatHour(hour: number): string {
  return format(new Date(2000, 0, 1, hour, 0, 0, 0), 'hh a')
}

function getEventStyle(event: IEvent, groupIndex: number) {
  let style = getEventBlockStyle(
    event,
    new Date(selectedDate.value),
    groupIndex,
    groupedEvents.value.length,
    { from: earliestEventHour.value, to: latestEventHour.value },
  )

  const hasOverlap = groupedEvents.value.some(
    (otherGroup, otherIndex) =>
      otherIndex !== groupIndex &&
      otherGroup.some(otherEvent =>
        areIntervalsOverlapping(
          { start: parseISO(event.startDate), end: parseISO(event.endDate) },
          { start: parseISO(otherEvent.startDate), end: parseISO(otherEvent.endDate) },
        ),
      ),
  )

  if (!hasOverlap) {
    style = { ...style, width: '100%', left: '0%' }
  }

  return style
}
</script>

<template>
  <div class="flex">
    <!-- Left side: timeline and day grid -->
    <div class="flex flex-1 flex-col">
      <div>
        <DayViewMultiDayEventsRow
          :selected-date="selectedDate"
          :multi-day-events="multiDayEvents"
          @open-details="emit('openDetails', $event)"
        />

        <!-- Day header -->
        <div class="relative z-20 flex border-b">
          <div class="w-18" />
          <span class="flex-1 border-l py-2 text-center text-xs font-medium text-muted-foreground">
            {{ format(selectedDate, 'EE') }}
            <span class="font-semibold text-foreground">{{ format(selectedDate, 'd') }}</span>
          </span>
        </div>
      </div>

      <ScrollArea class="h-[800px]">
        <div class="flex">
          <!-- Hours column -->
          <div class="relative w-18">
            <div
              v-for="(hour, index) in hours"
              :key="hour"
              class="relative"
              :style="{ height: '96px' }"
            >
              <div class="absolute -top-3 right-2 flex h-6 items-center">
                <span v-if="index !== 0" class="text-xs text-muted-foreground">
                  {{ formatHour(hour) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Day grid -->
          <div class="relative flex-1 border-l">
            <div class="relative">
              <div
                v-for="(hour, index) in hours"
                :key="hour"
                :class="cn(
                  'relative',
                  !isWorkingHour(selectedDate, hour, workingHours) && 'bg-calendar-disabled-hour',
                )"
                :style="{ height: '96px' }"
              >
                <div
                  v-if="index !== 0"
                  class="pointer-events-none absolute inset-x-0 top-0 border-b"
                />

                <!-- 4 clickable time slots per hour -->
                <div
                  class="absolute inset-x-0 top-0 h-[24px] cursor-pointer transition-colors hover:bg-accent"
                  @click="emit('addEvent', selectedDate, { hour, minute: 0 })"
                />
                <div
                  class="absolute inset-x-0 top-[24px] h-[24px] cursor-pointer transition-colors hover:bg-accent"
                  @click="emit('addEvent', selectedDate, { hour, minute: 15 })"
                />

                <div class="pointer-events-none absolute inset-x-0 top-1/2 border-b border-dashed" />

                <div
                  class="absolute inset-x-0 top-[48px] h-[24px] cursor-pointer transition-colors hover:bg-accent"
                  @click="emit('addEvent', selectedDate, { hour, minute: 30 })"
                />
                <div
                  class="absolute inset-x-0 top-[72px] h-[24px] cursor-pointer transition-colors hover:bg-accent"
                  @click="emit('addEvent', selectedDate, { hour, minute: 45 })"
                />
              </div>

              <!-- Positioned event blocks -->
              <template
                v-for="(group, groupIndex) in groupedEvents"
                :key="`group-${groupIndex}`"
              >
                <div
                  v-for="event in group"
                  :key="event.id"
                  class="absolute p-1"
                  :style="getEventStyle(event, groupIndex)"
                >
                  <EventBlock
                    :event="event"
                    @open-details="emit('openDetails', $event)"
                  />
                </div>
              </template>
            </div>

            <CalendarTimeline
              :first-visible-hour="earliestEventHour"
              :last-visible-hour="latestEventHour"
            />
          </div>
        </div>
      </ScrollArea>
    </div>

    <!-- Right sidebar -->
    <div class="hidden w-64 divide-y border-l md:block">
      <!-- Mini calendar -->
      <Calendar
        class="mx-auto w-fit"
        :model-value="calendarDateValue"
        @update:model-value="handleCalendarSelect"
      />

      <!-- Happening now section -->
      <div class="flex-1 space-y-3">
        <template v-if="currentEvents.length > 0">
          <div class="flex items-start gap-2 px-4 pt-4">
            <span class="relative mt-[5px] flex size-2.5">
              <span class="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span class="relative inline-flex size-2.5 rounded-full bg-green-600" />
            </span>

            <p class="text-sm font-semibold text-foreground">Happening now</p>
          </div>

          <ScrollArea class="h-[422px] px-4">
            <div class="space-y-6 pb-4">
              <div
                v-for="event in currentEvents"
                :key="event.id"
                class="space-y-1.5"
              >
                <p class="line-clamp-2 text-sm font-semibold">{{ event.title }}</p>

                <div
                  v-if="users.find(u => u.id === event.user.id)"
                  class="flex items-center gap-1.5 text-muted-foreground"
                >
                  <User class="size-3.5" />
                  <span class="text-sm">{{ users.find(u => u.id === event.user.id)!.name }}</span>
                </div>

                <div class="flex items-center gap-1.5 text-muted-foreground">
                  <CalendarIcon class="size-3.5" />
                  <span class="text-sm">{{ format(new Date(), 'MMM d, yyyy') }}</span>
                </div>

                <div class="flex items-center gap-1.5 text-muted-foreground">
                  <Clock class="size-3.5" />
                  <span class="text-sm">
                    {{ format(parseISO(event.startDate), 'h:mm a') }} - {{ format(parseISO(event.endDate), 'h:mm a') }}
                  </span>
                </div>
              </div>
            </div>
          </ScrollArea>
        </template>

        <p
          v-else
          class="p-4 text-center text-sm italic text-muted-foreground"
        >
          No appointments or consultations at the moment
        </p>
      </div>
    </div>
  </div>
</template>
