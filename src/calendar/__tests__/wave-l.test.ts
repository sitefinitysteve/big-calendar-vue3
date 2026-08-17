import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BigCalendar from '@/calendar/components/CalendarContainer.vue'
import { useCalendarStore } from '@/stores/calendar'
import type { IEvent, IUser } from '@/calendar/interfaces'

const USER: IUser = { id: 'u1', name: 'Ada', picturePath: null }

/** Wednesday. Its week is Jan 12 - Jan 18 2025. */
const DAY = new Date(2025, 0, 15)

function local(year: number, month: number, day: number, hour = 9, minute = 0) {
  return new Date(year, month, day, hour, minute).toISOString()
}

let nextId = 1

function makeEvent(overrides: Partial<IEvent> = {}): IEvent {
  return {
    id: nextId++,
    title: 'Standup',
    description: 'daily',
    color: 'blue',
    user: USER,
    startDate: local(2025, 0, 15, 9),
    endDate: local(2025, 0, 15, 10),
    ...overrides,
  }
}

function seed(events: IEvent[], selected: Date = DAY) {
  const store = useCalendarStore()
  store.initialize([USER], events)
  store.setSelectedDate(selected)
}

function render(props: Record<string, unknown>) {
  return mount(BigCalendar, { props, attachTo: document.body })
}

/** `vi.setSystemTime` needs the fake clock installed. */
function freeze(date: Date) {
  vi.useFakeTimers({ shouldAdvanceTime: true })
  vi.setSystemTime(date)
}

beforeEach(() => {
  nextId = 1
})

afterEach(() => {
  vi.useRealTimers()
})

describe('L1 - agenda day heading date (TZ safe)', () => {
  it('runs in a UTC-negative timezone', () => {
    expect(new Date(2025, 0, 15).getTimezoneOffset()).toBeGreaterThan(0)
  })

  it('labels the group with the local event date, not the UTC-shifted one', () => {
    seed([makeEvent()])
    const w = render({ view: 'agenda' })

    // `new Date('2025-01-15')` renders "January 14" west of Greenwich.
    expect(w.text()).toContain('January 15, 2025')
    expect(w.text()).not.toContain('January 14, 2025')
    w.unmount()
  })

  it('keeps a first-of-month event inside its own month', () => {
    seed([
      makeEvent({
        startDate: local(2025, 0, 1, 9),
        endDate: local(2025, 0, 1, 10),
        title: 'New year sync',
      }),
    ])
    const w = render({ view: 'agenda' })

    expect(w.text()).toContain('January 1, 2025')
    expect(w.text()).not.toContain('December 31, 2024')
    w.unmount()
  })
})

describe('L2 - timeline only when the range contains today', () => {
  it('hides the week timeline for a week that is not the current one', () => {
    freeze(new Date(2025, 5, 10, 12, 0))
    seed([makeEvent()])

    const w = render({ view: 'week', classNames: { timeline: 'tl-probe' } })
    expect(w.element.querySelector('.tl-probe')).toBeNull()
    w.unmount()
  })

  it('shows the week timeline when the shown week contains today', () => {
    freeze(new Date(2025, 0, 15, 12, 0))
    seed([makeEvent()])

    const w = render({ view: 'week', classNames: { timeline: 'tl-probe' } })
    expect(w.element.querySelector('.tl-probe')).not.toBeNull()
    w.unmount()
  })

  it('hides the day timeline for a day that is not today', () => {
    freeze(new Date(2025, 5, 10, 12, 0))
    seed([makeEvent()])

    const w = render({ view: 'day', classNames: { timeline: 'tl-probe' } })
    expect(w.element.querySelector('.tl-probe')).toBeNull()
    w.unmount()
  })

  it('shows the day timeline on today', () => {
    freeze(new Date(2025, 0, 15, 12, 0))
    seed([makeEvent()])

    const w = render({ view: 'day', classNames: { timeline: 'tl-probe' } })
    expect(w.element.querySelector('.tl-probe')).not.toBeNull()
    w.unmount()
  })
})

describe('L3 - week all-day strip', () => {
  function seedTwoRows() {
    seed([
      makeEvent({
        title: 'Conference',
        startDate: local(2025, 0, 13, 9),
        endDate: local(2025, 0, 16, 17),
      }),
      makeEvent({
        title: 'Offsite',
        startDate: local(2025, 0, 14, 9),
        endDate: local(2025, 0, 17, 17),
      }),
    ])
  }

  it('renders the strip below the day-name header row', () => {
    seedTwoRows()
    const w = render({ view: 'week' })

    const strip = w.element.querySelector('[data-all-day-strip]')
    const header = w.element.querySelector('.sticky.top-0')
    expect(strip).not.toBeNull()
    expect(header).not.toBeNull()
    // DOCUMENT_POSITION_FOLLOWING === the strip comes after the header.
    expect(header!.compareDocumentPosition(strip!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    w.unmount()
  })

  it('renders the all-day gutter label', () => {
    seedTwoRows()
    const w = render({ view: 'week' })
    expect(w.text()).toContain('All day')
    w.unmount()
  })

  it('uses a custom allDay label when supplied', () => {
    seedTwoRows()
    const w = render({ view: 'week', labels: { allDay: 'Toute la journee' } })
    expect(w.text()).toContain('Toute la journee')
    w.unmount()
  })

  it('caps and scrolls the strip when allDayMaxRows is exceeded', () => {
    seedTwoRows()
    const w = render({ view: 'week', allDayMaxRows: 1 })

    const strip = w.element.querySelector('[data-all-day-strip]') as HTMLElement
    expect(strip.className).toContain('overflow-y-auto')
    expect(strip.style.maxHeight).toBe('34px')
    w.unmount()
  })

  it('leaves the strip uncapped by default', () => {
    seedTwoRows()
    const w = render({ view: 'week' })

    const strip = w.element.querySelector('[data-all-day-strip]') as HTMLElement
    expect(strip.className).not.toContain('overflow-y-auto')
    expect(strip.style.maxHeight).toBe('')
    w.unmount()
  })

  it('does not cap when the row count fits', () => {
    seedTwoRows()
    const w = render({ view: 'week', allDayMaxRows: 6 })

    const strip = w.element.querySelector('[data-all-day-strip]') as HTMLElement
    expect(strip.className).not.toContain('overflow-y-auto')
    w.unmount()
  })
})

describe('L4 - month bullets are interactive', () => {
  it('opens details from the mobile bullet', async () => {
    seed([makeEvent()])
    const w = render({ view: 'month', openDetailsOnEventClick: false })

    const bullet = w.element.querySelector('[data-event-id="1"].lg\\:hidden') as HTMLElement
    expect(bullet).not.toBeNull()
    expect(bullet.getAttribute('role')).toBe('button')
    expect(bullet.querySelector('.bc-event-bullet')).not.toBeNull()

    bullet.click()
    await w.vm.$nextTick()
    expect(w.emitted('eventClick')).toHaveLength(1)
    expect((w.emitted('eventClick')![0]![0] as IEvent).id).toBe(1)
    w.unmount()
  })

  it('opens details from the bullet via the keyboard', async () => {
    seed([makeEvent()])
    const w = render({ view: 'month', openDetailsOnEventClick: false })

    const bullet = w.find('[data-event-id="1"].lg\\:hidden')
    await bullet.trigger('keydown', { key: 'Enter' })
    expect(w.emitted('eventClick')).toHaveLength(1)
    w.unmount()
  })
})

describe('L5 - agenda heading casing', () => {
  it('uppercases only the first letter of the heading', () => {
    seed([makeEvent()])
    const w = render({ view: 'agenda' })

    const heading = w.element.querySelector('h3') as HTMLElement
    expect(heading.className).toContain('first-letter:uppercase')
    expect(heading.className).not.toContain('capitalize')
    w.unmount()
  })
})

describe('L6 - agenda range is the calendar month', () => {
  it('lists only days of the selected month, never the padded grid days', () => {
    seed([
      makeEvent({ title: 'Dec', startDate: local(2024, 11, 31, 9), endDate: local(2024, 11, 31, 10) }),
      makeEvent({ title: 'Jan first', startDate: local(2025, 0, 1, 9), endDate: local(2025, 0, 1, 10) }),
      makeEvent({ title: 'Jan last', startDate: local(2025, 0, 31, 9), endDate: local(2025, 0, 31, 10) }),
      makeEvent({ title: 'Feb', startDate: local(2025, 1, 1, 9), endDate: local(2025, 1, 1, 10) }),
    ])

    const w = render({ view: 'agenda' })
    const headings = Array.from(w.element.querySelectorAll('h3')).map((h) => h.textContent ?? '')

    expect(headings).toHaveLength(2)
    expect(headings[0]).toMatch(/January 1, 2025/)
    expect(headings[1]).toMatch(/January 31, 2025/)
    expect(w.text()).not.toContain('Dec')
    expect(w.text()).not.toContain('Feb')
    w.unmount()
  })
})
