<script setup lang="ts">
import { computed } from 'vue'
import {
  startOfWeek,
  addDays,
  format,
  parseISO,
  isSameDay,
  areIntervalsOverlapping,
} from 'date-fns'
import { useCalendarStore } from '@/stores/calendar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import {
  groupEvents,
  getEventBlockStyle,
  isWorkingHour,
  getVisibleHours,
} from '@/calendar/helpers'
import EventBlock from '@/calendar/components/week-view/EventBlock.vue'
import CalendarTimeline from '@/calendar/components/week-view/CalendarTimeline.vue'
import WeekViewMultiDayEventsRow from '@/calendar/components/week-view/WeekViewMultiDayEventsRow.vue'
import type { IEvent } from '@/calendar/interfaces'
import { useCalendarLabels, useDateLocale } from '@/calendar/labels'

const labels = useCalendarLabels()
const dateLocale = useDateLocale()

const props = defineProps<{
  singleDayEvents: IEvent[]
  multiDayEvents: IEvent[]
  canAdd?: boolean
}>()

const emit = defineEmits<{
  openDetails: [event: IEvent]
  addEvent: [startDate: Date, startTime: { hour: number; minute: number }]
}>()

const store = useCalendarStore()

const visibleHoursData = computed(() =>
  getVisibleHours(store.visibleHours, props.singleDayEvents)
)

const hours = computed(() => visibleHoursData.value.hours)
const earliestEventHour = computed(() => visibleHoursData.value.earliestEventHour)
const latestEventHour = computed(() => visibleHoursData.value.latestEventHour)

const weekStart = computed(() => startOfWeek(store.selectedDate))
const weekDays = computed(() =>
  Array.from({ length: 7 }, (_, i) => addDays(weekStart.value, i))
)

function getDayEvents(day: Date): IEvent[] {
  return props.singleDayEvents.filter(
    event =>
      isSameDay(parseISO(event.startDate), day) ||
      isSameDay(parseISO(event.endDate), day)
  )
}

function getGroupedEvents(day: Date) {
  return groupEvents(getDayEvents(day))
}

function getEventStyle(
  event: IEvent,
  day: Date,
  groupIndex: number,
  groupSize: number,
  groupedEvents: IEvent[][]
) {
  const style = getEventBlockStyle(event, new Date(day), groupIndex, groupSize, {
    from: earliestEventHour.value,
    to: latestEventHour.value,
  })

  const hasOverlap = groupedEvents.some(
    (otherGroup, otherIndex) =>
      otherIndex !== groupIndex &&
      otherGroup.some(otherEvent =>
        areIntervalsOverlapping(
          { start: parseISO(event.startDate), end: parseISO(event.endDate) },
          {
            start: parseISO(otherEvent.startDate),
            end: parseISO(otherEvent.endDate),
          }
        )
      )
  )

  if (!hasOverlap) {
    return { ...style, width: '100%', left: '0%' }
  }

  return style
}

function formatHourLabel(hour: number): string {
  return format(new Date(new Date().setHours(hour, 0, 0, 0)), 'hh a')
}

function handleTimeSlotClick(day: Date, hour: number, minute: number) {
  emit('addEvent', day, { hour, minute })
}
</script>

<template>
  <!-- Mobile message -->
  <div class="flex flex-col items-center justify-center border-b py-4 text-sm text-muted-foreground sm:hidden">
    <p>{{ labels.weekViewNotAvailable }}</p>
    <p>{{ labels.weekViewSwitchView }}</p>
  </div>

  <!-- Desktop week view -->
  <div class="hidden flex-col sm:flex">
    <div>
      <WeekViewMultiDayEventsRow
        :selected-date="store.selectedDate"
        :multi-day-events="multiDayEvents"
        @open-details="emit('openDetails', $event)"
      />

      <!-- Week header -->
      <div class="relative z-20 flex border-b">
        <div class="w-18" />
        <div class="grid flex-1 grid-cols-7 divide-x border-l">
          <span
            v-for="(day, index) in weekDays"
            :key="index"
            class="py-2 text-center text-xs font-medium text-muted-foreground"
          >
            {{ format(day, 'EE', dateLocale ? { locale: dateLocale } : undefined) }}
            <span class="ml-1 font-semibold text-foreground">{{ format(day, 'd') }}</span>
          </span>
        </div>
      </div>
    </div>

    <ScrollArea class="h-[736px]" type="always">
      <div class="flex overflow-hidden">
        <!-- Hours column -->
        <div class="relative w-18">
          <div
            v-for="(hour, index) in hours"
            :key="hour"
            class="relative"
            style="height: 96px"
          >
            <div class="absolute -top-3 right-2 flex h-6 items-center">
              <span v-if="index !== 0" class="text-xs text-muted-foreground">
                {{ formatHourLabel(hour) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Week grid -->
        <div class="relative flex-1 border-l">
          <div class="grid grid-cols-7 divide-x">
            <div
              v-for="(day, dayIndex) in weekDays"
              :key="dayIndex"
              class="relative"
            >
              <!-- Hour rows -->
              <div
                v-for="(hour, hourIndex) in hours"
                :key="hour"
                :class="cn(
                  'relative',
                  !isWorkingHour(day, hour, store.workingHours) && 'bg-calendar-disabled-hour',
                )"
                style="height: 96px"
              >
                <div
                  v-if="hourIndex !== 0"
                  class="pointer-events-none absolute inset-x-0 top-0 border-b"
                />

                <!-- 4 time slots per hour (15-minute intervals) -->
                <template v-if="canAdd !== false">
                  <div
                    class="absolute inset-x-0 top-0 h-[24px] cursor-pointer transition-colors hover:bg-accent"
                    @click="handleTimeSlotClick(day, hour, 0)"
                  />
                  <div
                    class="absolute inset-x-0 top-[24px] h-[24px] cursor-pointer transition-colors hover:bg-accent"
                    @click="handleTimeSlotClick(day, hour, 15)"
                  />
                </template>

                <div class="pointer-events-none absolute inset-x-0 top-1/2 border-b border-dashed" />

                <template v-if="canAdd !== false">
                  <div
                    class="absolute inset-x-0 top-[48px] h-[24px] cursor-pointer transition-colors hover:bg-accent"
                    @click="handleTimeSlotClick(day, hour, 30)"
                  />
                  <div
                    class="absolute inset-x-0 top-[72px] h-[24px] cursor-pointer transition-colors hover:bg-accent"
                    @click="handleTimeSlotClick(day, hour, 45)"
                  />
                </template>
              </div>

              <!-- Positioned event blocks -->
              <template
                v-for="(group, groupIndex) in getGroupedEvents(day)"
                :key="groupIndex"
              >
                <div
                  v-for="event in group"
                  :key="event.id"
                  class="absolute p-1"
                  :style="getEventStyle(event, day, groupIndex, getGroupedEvents(day).length, getGroupedEvents(day))"
                >
                  <EventBlock
                    :event="event"
                    @open-details="emit('openDetails', $event)"
                  />
                </div>
              </template>
            </div>
          </div>

          <CalendarTimeline
            :first-visible-hour="earliestEventHour"
            :last-visible-hour="latestEventHour"
          />
        </div>
      </div>
    </ScrollArea>
  </div>
</template>
