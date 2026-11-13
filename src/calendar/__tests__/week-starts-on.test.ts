import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { SingleDayPicker } from '@/components/ui/single-day-picker'
import { DEFAULT_LABELS } from '@/calendar/labels'
import BigCalendar from '@/calendar/components/CalendarContainer.vue'
import { useCalendarStore } from '@/stores/calendar'
import { getCalendarCells, getEventsCount, leadingDays, rangeText, rotateWeekdays } from '@/calendar/helpers'
import type { IEvent, IUser } from '@/calendar/interfaces'

const USER: IUser = { id: 'u1', name: 'Ada', picturePath: null }

/** Oct 1 2026 is a Thursday. Sunday Oct 11 sits in Oct 11-17 (Sun-first) but Oct 5-11 (Mon-first). */
const OCT_1 = new Date(2026, 9, 1)
const SUN_OCT_11 = new Date(2026, 9, 11)

const SUN_FIRST = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MON_FIRST = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function event(id: number, day: number): IEvent {
  return {
    id,
    title: `E${id}`,
    description: '',
    color: 'blue',
    user: USER,
    startDate: new Date(2026, 9, day, 9).toISOString(),
    endDate: new Date(2026, 9, day, 10).toISOString(),
  }
}

function render(props: Record<string, unknown>, selected: Date, events: IEvent[] = []) {
  const store = useCalendarStore()
  store.initialize([USER], events)
  store.setSelectedDate(selected)
  return mount(BigCalendar, { props, attachTo: document.body })
}

describe('helpers', () => {
  it('counts leading days for Oct 2026 (starts Thursday)', () => {
    expect(leadingDays(OCT_1)).toBe(4)
    expect(leadingDays(OCT_1, 1)).toBe(3)
    // A month starting on Sunday needs no blanks Sunday-first and six Monday-first.
    expect(leadingDays(new Date(2026, 2, 1), 0)).toBe(0)
    expect(leadingDays(new Date(2026, 2, 1), 1)).toBe(6)
  })

  it('rotates weekday labels', () => {
    expect(rotateWeekdays(SUN_FIRST)).toEqual(SUN_FIRST)
    expect(rotateWeekdays(SUN_FIRST, 1)).toEqual(MON_FIRST)
  })

  it('builds month cells whose first column is the week start', () => {
    const sun = getCalendarCells(OCT_1)
    const mon = getCalendarCells(OCT_1, 1)
    expect(sun[0]!.date.getDay()).toBe(0)
    expect(mon[0]!.date.getDay()).toBe(1)
    expect(sun.findIndex(c => c.currentMonth)).toBe(4)
    expect(mon.findIndex(c => c.currentMonth)).toBe(3)
    expect(sun.length % 7).toBe(0)
    expect(mon.length % 7).toBe(0)
  })

  it('computes the week range and week event count per week start', () => {
    expect(rangeText('week', SUN_OCT_11)).toBe('Oct 11, 2026 - Oct 17, 2026')
    expect(rangeText('week', SUN_OCT_11, undefined, 1)).toBe('Oct 5, 2026 - Oct 11, 2026')

    const events = [event(1, 5), event(2, 12)]
    expect(getEventsCount(events, SUN_OCT_11, 'week')).toBe(1) // Oct 12
    expect(getEventsCount(events, SUN_OCT_11, 'week', 1)).toBe(1) // Oct 5
    expect(getEventsCount([event(3, 10)], SUN_OCT_11, 'week')).toBe(0)
    expect(getEventsCount([event(3, 10)], SUN_OCT_11, 'week', 1)).toBe(1)
  })
})

describe('month view', () => {
  function headers(w: ReturnType<typeof render>) {
    const header = w.element.querySelector('.grid.grid-cols-7.divide-x')!
    return Array.from(header.querySelectorAll('span')).map(s => s.textContent?.trim())
  }

  function firstCellDates(w: ReturnType<typeof render>) {
    return Array.from(w.element.querySelectorAll('[data-date]')).slice(0, 5).map(el => el.getAttribute('data-date'))
  }

  it('defaults to Sunday-first with 4 leading days for Oct 2026', () => {
    const w = render({ view: 'month' }, OCT_1)
    expect(headers(w)).toEqual(SUN_FIRST)
    expect(firstCellDates(w)).toEqual(['2026-09-27', '2026-09-28', '2026-09-29', '2026-09-30', '2026-10-01'])
    w.unmount()
  })

  it('renders Monday-first with 3 leading days when weekStartsOn=1', () => {
    const w = render({ view: 'month', weekStartsOn: 1 }, OCT_1)
    expect(headers(w)).toEqual(MON_FIRST)
    expect(firstCellDates(w).slice(0, 4)).toEqual(['2026-09-28', '2026-09-29', '2026-09-30', '2026-10-01'])
    // The first column drops its left border, whichever weekday it is.
    expect(w.element.querySelector('[data-date="2026-09-28"]')!.className).toContain('border-l-0')
    expect(w.element.querySelector('[data-date="2026-09-27"]')).toBeNull()
    w.unmount()
  })
})

describe('week view', () => {
  function weekHeaderDays(w: ReturnType<typeof render>) {
    const header = w.element.querySelector('.sticky .grid-cols-7')!
    return Array.from(header.children).map(el => el.textContent?.replace(/\s+/g, ' ').trim())
  }

  it('shows Sun Oct 11 - Sat Oct 17 by default', () => {
    const w = render({ view: 'week' }, SUN_OCT_11, [event(1, 5), event(2, 12)])
    expect(weekHeaderDays(w)[0]).toBe('Sun 11')
    expect(weekHeaderDays(w)[6]).toBe('Sat 17')
    expect(w.text()).toContain('Oct 11, 2026 - Oct 17, 2026')
    expect(w.text()).toContain('E2')
    expect(w.text()).not.toContain('E1')
    w.unmount()
  })

  it('shows Mon Oct 5 - Sun Oct 11 when weekStartsOn=1', () => {
    const w = render({ view: 'week', weekStartsOn: 1 }, SUN_OCT_11, [event(1, 5), event(2, 12)])
    expect(weekHeaderDays(w)[0]).toBe('Mon 5')
    expect(weekHeaderDays(w)[6]).toBe('Sun 11')
    expect(w.text()).toContain('Oct 5, 2026 - Oct 11, 2026')
    expect(w.text()).toContain('E1')
    expect(w.text()).not.toContain('E2')
    w.unmount()
  })
})

describe('year view', () => {
  function october(w: ReturnType<typeof render>) {
    const months = w.element.querySelectorAll('.rounded-lg.border.p-3')
    const grid = months[9]!.querySelector('.grid-cols-7')!
    const children = Array.from(grid.children)
    const heads = children.slice(0, 7).map(el => el.textContent?.trim())
    const rest = children.slice(7)
    const blanks = rest.findIndex(el => el.hasAttribute('data-date'))
    return { heads, blanks }
  }

  it('uses Sunday-first initials and 4 blanks for Oct 2026 by default', () => {
    const w = render({ view: 'year' }, OCT_1)
    expect(october(w)).toEqual({ heads: ['S', 'M', 'T', 'W', 'T', 'F', 'S'], blanks: 4 })
    w.unmount()
  })

  it('uses Monday-first initials and 3 blanks when weekStartsOn=1', () => {
    const w = render({ view: 'year', weekStartsOn: 1 }, OCT_1)
    expect(october(w)).toEqual({ heads: ['M', 'T', 'W', 'T', 'F', 'S', 'S'], blanks: 3 })
    w.unmount()
  })
})

describe('day view mini picker', () => {
  function headRow(w: ReturnType<typeof render>) {
    return Array.from(w.element.querySelectorAll('[data-slot="calendar-head-cell"]'))
      .slice(0, 7)
      .map(el => el.textContent?.trim())
      .join('')
  }

  it('starts on Sunday by default', () => {
    const w = render({ view: 'day' }, OCT_1)
    expect(headRow(w)).toBe('SMTWTFS')
    w.unmount()
  })

  it('starts on Monday when weekStartsOn=1', () => {
    const w = render({ view: 'day', weekStartsOn: 1 }, OCT_1)
    expect(headRow(w)).toBe('MTWTFSS')
    w.unmount()
  })
})

describe('add/edit dialog date picker', () => {
  function headRow(root: ParentNode) {
    return Array.from(root.querySelectorAll('[data-slot="calendar-head-cell"]'))
      .slice(0, 7)
      .map(el => el.textContent?.trim())
      .join('')
  }

  async function openPicker(weekStartsOn?: 0 | 1) {
    const w = mount(SingleDayPicker, {
      props: { modelValue: OCT_1, ...(weekStartsOn === undefined ? {} : { weekStartsOn }) },
      attachTo: document.body,
    })
    await w.find('button').trigger('click')
    await flushPromises()
    return w
  }

  it('SingleDayPicker defaults to a Sunday-first popover', async () => {
    const w = await openPicker()
    expect(headRow(document.body)).toBe('SMTWTFS')
    w.unmount()
  })

  it('SingleDayPicker renders Monday first when weekStartsOn=1', async () => {
    const w = await openPicker(1)
    expect(headRow(document.body)).toBe('MTWTFSS')
    w.unmount()
  })

  it('the Add Event dialog passes the calendar weekStartsOn to its date pickers', async () => {
    for (const weekStartsOn of [0, 1] as const) {
      const w = render({ view: 'month', weekStartsOn }, OCT_1)
      const add = w.findAll('button').find(b => b.text() === DEFAULT_LABELS.addEvent)!
      await add.trigger('click')
      await flushPromises()
      const pickers = w.findAllComponents(SingleDayPicker)
      expect(pickers.length).toBeGreaterThanOrEqual(2)
      for (const picker of pickers) {
        expect(picker.props('weekStartsOn')).toBe(weekStartsOn)
      }
      w.unmount()
    }
  })
})
