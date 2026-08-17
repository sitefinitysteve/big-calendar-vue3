import type { Component } from 'vue'
import type { TCalendarView, TEventColor } from '@/calendar/types'

export interface IUser {
  id: string
  name: string
  picturePath: string | null
}

export interface IEvent<TMeta = unknown> {
  id: number
  startDate: string
  endDate: string
  title: string
  color: TEventColor
  description: string
  user: IUser
  isAllDay?: boolean
  /** Arbitrary consumer payload, carried through untouched by the library. */
  meta?: TMeta
}

export interface ICalendarCell {
  day: number
  currentMonth: boolean
  date: Date
}

/**
 * A single item in a right-click context menu. Consumers define these and pass
 * them via `<BigCalendar>`'s `event-commands` / `day-commands` props. Selecting
 * an item emits `@command` with the command `id` and the target — the library
 * never performs the action itself.
 */
export interface ICalendarCommand {
  /** Stable id echoed back in the `@command` payload (e.g. `'edit'`, `'delete'`). */
  id: string
  /** Text shown in the menu. */
  label: string
  /** Optional icon component (e.g. a lucide icon). */
  icon?: Component
  /** Render with destructive (red) styling — used by the stock Delete command. */
  destructive?: boolean
  /** Render a separator above this item. */
  separatorBefore?: boolean
  /** Disable (dim, non-selectable) this item. */
  disabled?: boolean
  /**
   * Restrict this command to specific views. Omit to show it on every view.
   * Lets you define one command list and scope each entry inline — no need to
   * repeat definitions per view.
   */
  views?: TCalendarView[]
}

/** Payload emitted by `<BigCalendar>`'s `command` event when a menu item is chosen. */
export interface ICalendarCommandSelect {
  /** The `id` of the selected command. */
  commandId: string
  /** Present when the menu was opened on an event chip. */
  event?: IEvent
  /** Present (`yyyy-MM-dd`) when the menu was opened on a day cell. */
  date?: string
}
