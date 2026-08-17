import type { ComputedRef, InjectionKey, Slot } from 'vue'
import { computed, inject } from 'vue'
import type { IEvent } from '@/calendar/interfaces'
import type { TBadgeVariant, TLegacyEventColor } from '@/calendar/types'

/** The seven colors that ship with their own Tailwind class maps. */
export const LEGACY_EVENT_COLORS: TLegacyEventColor[] = [
  'blue',
  'green',
  'red',
  'yellow',
  'purple',
  'orange',
  'gray',
]

/**
 * `true` when `color` is one of the seven built-in names (which render through
 * the cva Tailwind maps). Anything else is treated as a raw CSS color and
 * rendered via `.bc-event-custom-color` + the `--bc-event-color` variable.
 */
export function isLegacyColor(color: string | undefined | null): color is TLegacyEventColor {
  return !!color && (LEGACY_EVENT_COLORS as string[]).includes(color)
}

/** Which surface the event is being rendered on. */
export type TEventRenderView = 'week' | 'day' | 'month' | 'agenda'

/**
 * Slot props handed to the `#event` / `#month-event` / `#agenda-event` scoped
 * slots on `<BigCalendar>`.
 *
 * React's renderer API passes a `defaultContent` node so a renderer can opt out
 * per event. Vue has no equivalent value to hand back into the tree, so the
 * fallback content of the scoped slot plays that role instead: whatever markup
 * sits inside `<template #event>` replaces the stock chip, and omitting the
 * slot entirely leaves the stock chip untouched.
 */
export interface IEventSlotProps {
  event: IEvent
  view: TEventRenderView
  selected: boolean
  badgeVariant: TBadgeVariant
}

/** A scoped slot rendering the inside of an event chip. */
export type TEventRenderer = Slot<IEventSlotProps>

/** Extra class names merged onto the library's own structural elements. */
export interface ICalendarClassNames {
  root?: string
  header?: string
  dayCell?: string
  hourRow?: string
  eventBlock?: string
  timeline?: string
}

export interface ICalendarCustomization {
  renderEvent?: TEventRenderer
  renderMonthEvent?: TEventRenderer
  renderAgendaEvent?: TEventRenderer
  selectedEventId?: number | null
  /** Pixel height of one hour row in the week/day grids. */
  hourHeight: number
  /** Height of the week/day scroll area. `undefined` keeps the stock height. */
  height?: number | string
  autoHeight?: boolean
  maxEventsPerDayCell: number
  /** Cap for the week all-day strip; beyond it the strip scrolls internally. */
  allDayMaxRows?: number
  onShowMore?: (date: string) => void
  classNames?: ICalendarClassNames
  dayCellClassName?: (date: Date) => string | undefined
}

/** Defaults reproduce v1.1.0 behavior exactly for standalone-exported views. */
export const DEFAULT_CUSTOMIZATION: ICalendarCustomization = {
  hourHeight: 96,
  maxEventsPerDayCell: 3,
}

export const CALENDAR_CUSTOMIZATION_KEY: InjectionKey<ComputedRef<ICalendarCustomization>> =
  Symbol('calendar-customization')

/**
 * Reactive customization for the nearest `<BigCalendar>`. Views exported
 * standalone (with no container above them) fall back to
 * `DEFAULT_CUSTOMIZATION`, i.e. v1.1.0 behavior.
 */
export function useCalendarCustomization(): ComputedRef<ICalendarCustomization> {
  return inject(CALENDAR_CUSTOMIZATION_KEY) ?? computed(() => DEFAULT_CUSTOMIZATION)
}
