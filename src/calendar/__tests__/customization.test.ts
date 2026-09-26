import { beforeEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import BigCalendar from '@/calendar/components/CalendarContainer.vue'
import { useCalendarStore } from '@/stores/calendar'
import { isLegacyColor } from '@/calendar/customization'
import type { IEvent, IUser } from '@/calendar/interfaces'

const USER: IUser = { id: 'u1', name: 'Ada', picturePath: null }

// Fixed date so the month/week grids are deterministic.
const DAY = new Date(2025, 0, 15)

function iso(hour: number, minute = 0, day = 15) {
  return new Date(2025, 0, day, hour, minute).toISOString()
}

function makeEvent(overrides: Partial<IEvent> = {}): IEvent {
  return {
    id: 1,
    title: 'Standup',
    description: 'daily',
    color: 'blue',
    user: USER,
    startDate: iso(9),
    endDate: iso(10),
    ...overrides,
  }
}

function seed(events: IEvent[]) {
  const store = useCalendarStore()
  store.initialize([USER], events)
  store.setSelectedDate(DAY)
}

function render(props: Record<string, unknown>, slots: Record<string, unknown> = {}) {
  return mount(BigCalendar, { props, slots, attachTo: document.body })
}

beforeEach(() => {
  seed([makeEvent()])
})

describe('isLegacyColor', () => {
  it('recognises the seven built-ins and rejects anything else', () => {
    expect(isLegacyColor('blue')).toBe(true)
    expect(isLegacyColor('gray')).toBe(true)
    expect(isLegacyColor('#ff0000')).toBe(false)
    expect(isLegacyColor(undefined)).toBe(false)
  })
})

describe('zero new props', () => {
  it('renders the built-in header and stock event markup', () => {
    const w = render({ view: 'week' })

    expect(w.element.querySelector('.bc-header')).not.toBeNull()
    const block = w.element.querySelector('[data-event-id="1"]') as HTMLElement
    expect(block).not.toBeNull()
    expect(block.getAttribute('data-selected')).toBeNull()
    expect(block.className).toContain('truncate')
    expect(block.className).not.toContain('bc-event-custom-color')
    expect(block.style.height).toBe('88px')
    expect(w.text()).toContain('Standup')
    w.unmount()
  })

  it('keeps the stock week scroll-area height', () => {
    const w = render({ view: 'week' })
    expect(w.html()).toContain('h-[736px]')
    w.unmount()
  })
})

describe('scoped slots', () => {
  it('replaces week event content and receives the slot props', () => {
    const w = render(
      { view: 'week' },
      { event: (p: { view: string; event: IEvent }) => h('span', { 'data-testid': 'custom' }, `${p.view}:${p.event.title}`) },
    )

    expect(w.find('[data-testid="custom"]').text()).toBe('week:Standup')
    const block = w.element.querySelector('[data-event-id="1"]') as HTMLElement
    expect(block.className).not.toContain('truncate')
    w.unmount()
  })

  it('#month-event wins over #event in the month view', () => {
    const w = render(
      { view: 'month' },
      {
        event: () => h('span', { 'data-testid': 'generic' }, 'generic'),
        'month-event': () => h('span', { 'data-testid': 'month' }, 'month'),
      },
    )

    expect(w.find('[data-testid="month"]').exists()).toBe(true)
    expect(w.find('[data-testid="generic"]').exists()).toBe(false)
    w.unmount()
  })

  it('#agenda-event wins over #event in the agenda view', () => {
    const w = render(
      { view: 'agenda' },
      {
        event: () => h('span', { 'data-testid': 'generic' }, 'generic'),
        'agenda-event': () => h('span', { 'data-testid': 'agenda' }, 'agenda'),
      },
    )

    expect(w.find('[data-testid="agenda"]').exists()).toBe(true)
    expect(w.find('[data-testid="generic"]').exists()).toBe(false)
    w.unmount()
  })
})

describe('selection', () => {
  it('marks only the matching event', () => {
    seed([makeEvent(), makeEvent({ id: 2, title: 'Retro', startDate: iso(11), endDate: iso(12) })])

    const w = render({ view: 'week', selectedEventId: 2 })

    expect(w.element.querySelector('[data-event-id="1"]')!.hasAttribute('data-selected')).toBe(false)
    expect(w.element.querySelector('[data-event-id="2"]')!.hasAttribute('data-selected')).toBe(true)
    w.unmount()
  })

  it('emits update:selectedEventId on click', async () => {
    const w = render({ view: 'week', openDetailsOnEventClick: false })

    await w.find('[data-event-id="1"]').trigger('click')
    expect(w.emitted('update:selectedEventId')).toEqual([[1]])
    w.unmount()
  })

  it('uses min-height (not height) for a selected custom-rendered block', () => {
    const w = render(
      { view: 'week', selectedEventId: 1 },
      { event: (p: { event: IEvent }) => h('span', p.event.title) },
    )

    const block = w.element.querySelector('[data-event-id="1"]') as HTMLElement
    expect(block.style.minHeight).toBe('88px')
    expect(block.style.height).toBe('')
    expect(block.className).toContain('z-10')
    // z-index is inert on a static box.
    expect(block.className).toContain('relative')
    w.unmount()
  })

  it('emits null when the already-selected event is clicked again', async () => {
    const w = render({ view: 'week', selectedEventId: 1, openDetailsOnEventClick: false })

    await w.find('[data-event-id="1"]').trigger('click')
    expect(w.emitted('update:selectedEventId')).toEqual([[null]])
    w.unmount()
  })

  it('tells a slot in the week all-day strip that it is in the week view', () => {
    seed([makeEvent({ id: 5, startDate: iso(9, 0, 13), endDate: iso(10, 0, 16) })])
    const views: string[] = []
    const w = render(
      { view: 'week' },
      {
        event: (p: { view: string; event: IEvent }) => {
          views.push(p.view)
          return h('span', p.event.title)
        },
      },
    )

    expect(views.length).toBeGreaterThan(0)
    expect(views).not.toContain('month')
    expect(views).toContain('week')
    w.unmount()
  })

  it('keeps the root a non-scrolling clip so the week header can stick', () => {
    const w = render({ view: 'week' })
    const root = w.element.querySelector('.rounded-xl.border') as HTMLElement

    expect(root.className).toContain('overflow-clip')
    expect(root.className).not.toContain('overflow-hidden')
    // The header's own wrapper must not be its containing block, or it un-sticks early.
    const header = w.element.querySelector('.sticky.top-0') as HTMLElement
    expect(header.parentElement!.className).toContain('contents')
    w.unmount()
  })
})

describe('header control', () => {
  it('hideHeader removes the built-in header', () => {
    const w = render({ view: 'week', hideHeader: true })
    expect(w.element.querySelector('.bc-header')).toBeNull()
    w.unmount()
  })

  it('#header replaces the built-in header', () => {
    const w = render(
      { view: 'week' },
      { header: () => h('div', { 'data-testid': 'slot' }, 'toolbar') },
    )
    expect(w.find('[data-testid="slot"]').exists()).toBe(true)
    expect(w.element.querySelector('.bc-header')).toBeNull()
    w.unmount()
  })
})

describe('hourHeight', () => {
  it('scales the block height and the hour rows', () => {
    const w = render({ view: 'week', hourHeight: 48 })

    const block = w.element.querySelector('[data-event-id="1"]') as HTMLElement
    // (60 / 60) * 48 - 8
    expect(block.style.height).toBe('40px')
    expect(w.html()).toContain('height: 48px')
    w.unmount()
  })
})

describe('month day cell', () => {
  const many = [1, 2, 3, 4, 5].map((id) =>
    makeEvent({ id, title: `E${id}`, startDate: iso(8 + id), endDate: iso(9 + id) })
  )

  it('caps at three events by default and renders a static "+N more"', () => {
    seed(many)
    const w = render({ view: 'month' })

    const cell = w.element.querySelector('[data-date="2025-01-15"]')!
    expect(cell.querySelectorAll('[data-event-id]:not([data-event-bullet])')).toHaveLength(3)
    expect(cell.querySelector('button[type="button"]')).toBeNull()
    expect(cell.textContent).toContain('2')
    w.unmount()
  })

  it('honours maxEventsPerDayCell', () => {
    seed(many)
    const w = render({ view: 'month', maxEventsPerDayCell: 5 })

    const cell = w.element.querySelector('[data-date="2025-01-15"]')!
    expect(cell.querySelectorAll('[data-event-id]:not([data-event-bullet])')).toHaveLength(5)
    w.unmount()
  })

  it('makes "+N more" a button when a @show-more listener is attached', async () => {
    seed(many)
    const onShowMore = vi.fn()
    const w = mount(BigCalendar, {
      props: { view: 'month', onShowMore },
      attachTo: document.body,
    })

    const cell = w.element.querySelector('[data-date="2025-01-15"]')!
    const button = cell.querySelector('button[type="button"]') as HTMLElement
    expect(button).not.toBeNull()
    button.click()
    expect(onShowMore).toHaveBeenCalledWith('2025-01-15')
    w.unmount()
  })

  it('applies dayCellClassName and classNames.dayCell', () => {
    const w = render({
      view: 'month',
      classNames: { dayCell: 'all-cells' },
      dayCellClassName: (date: Date) => (date.getDate() === 15 ? 'the-15th' : undefined),
    })

    const cell = w.element.querySelector('[data-date="2025-01-15"]')!
    expect(cell.className).toContain('all-cells')
    expect(cell.className).toContain('the-15th')
    w.unmount()
  })
})

describe('open color system', () => {
  it('legacy colors keep their Tailwind classes and get no inline variable', () => {
    const w = render({ view: 'week' })
    const block = w.element.querySelector('[data-event-id="1"]') as HTMLElement

    expect(block.className).toContain('bg-blue-50')
    expect(block.className).not.toContain('bc-event-custom-color')
    expect(block.style.getPropertyValue('--bc-event-color')).toBe('')
    w.unmount()
  })

  it('custom colors get the class + inline variable', () => {
    seed([makeEvent({ color: '#ff7a00' })])
    const w = render({ view: 'week' })
    const block = w.element.querySelector('[data-event-id="1"]') as HTMLElement

    expect(block.className).toContain('bc-event-custom-color')
    expect(block.style.getPropertyValue('--bc-event-color')).toBe('#ff7a00')
    w.unmount()
  })
})

describe('height and autoHeight', () => {
  it('applies an inline height to the week scroll area', () => {
    const w = render({ view: 'week', height: 400 })

    expect(w.element.querySelector('[style*="height: 400px"]')).not.toBeNull()
    expect(w.html()).not.toContain('h-[736px]')
    w.unmount()
  })

  it('applies an inline height to the day scroll area', () => {
    const w = render({ view: 'day', height: '50vh' })

    expect(w.html()).toContain('height: 50vh')
    expect(w.html()).not.toContain('h-[800px]')
    w.unmount()
  })

  it('autoHeight leaves the week grid with no fixed height at all', () => {
    const w = render({ view: 'week', autoHeight: true })

    expect(w.html()).not.toContain('h-[736px]')
    expect(w.html()).not.toContain('height: 736px')
    w.unmount()
  })

  it('autoHeight leaves the day grid with no fixed height at all', () => {
    const w = render({ view: 'day', autoHeight: true })

    expect(w.html()).not.toContain('h-[800px]')
    expect(w.html()).not.toContain('height: 800px')
    w.unmount()
  })

  it('autoHeight wins over an explicit height', () => {
    const w = render({ view: 'week', autoHeight: true, height: 400 })
    expect(w.html()).not.toContain('height: 400px')
    w.unmount()
  })
})

describe('classNames', () => {
  it('root and header land on their elements', () => {
    const w = render({ view: 'week', classNames: { root: 'my-root', header: 'my-header' } })

    expect(w.element.querySelector('.my-root')).not.toBeNull()
    expect(w.element.querySelector('.bc-header')!.className).toContain('my-header')
    w.unmount()
  })

  it('eventBlock lands on the week block, month badge and agenda card', () => {
    const week = render({ view: 'week', classNames: { eventBlock: 'chip' } })
    expect(week.element.querySelector('[data-event-id="1"]')!.className).toContain('chip')
    week.unmount()

    const month = render({ view: 'month', classNames: { eventBlock: 'chip' } })
    expect(
      month.element.querySelector('[data-event-id="1"]:not([data-event-bullet])')!.className,
    ).toContain('chip')
    month.unmount()

    const agenda = render({ view: 'agenda', classNames: { eventBlock: 'chip' } })
    expect(agenda.element.querySelector('[data-event-id="1"]')!.className).toContain('chip')
    agenda.unmount()
  })

  it('hourRow lands on the week and day hour rows', () => {
    const week = render({ view: 'week', classNames: { hourRow: 'my-hour' } })
    expect(week.element.querySelectorAll('.my-hour').length).toBeGreaterThan(0)
    week.unmount()

    const day = render({ view: 'day', classNames: { hourRow: 'my-hour' } })
    expect(day.element.querySelectorAll('.my-hour').length).toBeGreaterThan(0)
    day.unmount()
  })

  it('timeline lands on the current-time line', () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    // Inside the default visible hours (7 to 18) on the seeded day.
    vi.setSystemTime(new Date(2025, 0, 15, 10, 30))

    try {
      const w = render({ view: 'week', classNames: { timeline: 'my-line' } })
      const line = w.element.querySelector('.my-line')

      expect(line).not.toBeNull()
      expect(line!.className).toContain('border-primary')
      w.unmount()
    } finally {
      vi.useRealTimers()
    }
  })
})

describe('hideHeader precedence', () => {
  it('wins over the #header slot when both are provided', () => {
    const w = render(
      { view: 'week', hideHeader: true },
      { header: () => h('div', { 'data-testid': 'slot' }, 'toolbar') },
    )

    expect(w.find('[data-testid="slot"]').exists()).toBe(false)
    expect(w.element.querySelector('.bc-header')).toBeNull()
    w.unmount()
  })
})

describe('hourHeight in the day view', () => {
  it('scales the block height and the hour rows', () => {
    const w = render({ view: 'day', hourHeight: 120 })

    const block = w.element.querySelector('[data-event-id="1"]') as HTMLElement
    // (60 / 60) * 120 - 8
    expect(block.style.height).toBe('112px')
    expect(w.html()).toContain('height: 120px')
    w.unmount()
  })
})

describe('custom colors across every leaf', () => {
  beforeEach(() => {
    seed([makeEvent({ color: 'rebeccapurple' })])
  })

  it('month badge gets the class and the variable', () => {
    const w = render({ view: 'month' })
    const badge = w.element.querySelector(
      '[data-event-id="1"]:not([data-event-bullet])',
    ) as HTMLElement

    expect(badge.className).toContain('bc-event-custom-color')
    expect(badge.style.getPropertyValue('--bc-event-color')).toBe('rebeccapurple')
    w.unmount()
  })

  it('agenda card gets the class and the variable', () => {
    const w = render({ view: 'agenda' })
    const card = w.element.querySelector('[data-event-id="1"]') as HTMLElement

    expect(card.className).toContain('bc-event-custom-color')
    expect(card.style.getPropertyValue('--bc-event-color')).toBe('rebeccapurple')
    w.unmount()
  })

  it('the month EventBullet gets the class and the variable', () => {
    const w = render({ view: 'month' })
    const bullet = w.element.querySelector('.bc-event-bullet') as HTMLElement

    expect(bullet.className).toContain('bc-event-custom-color')
    expect(bullet.style.getPropertyValue('--bc-event-color')).toBe('rebeccapurple')
    w.unmount()
  })

  it('a legacy color leaves the bullet on its Tailwind class', () => {
    seed([makeEvent({ color: 'green' })])
    const w = render({ view: 'month' })
    const bullet = w.element.querySelector('.bc-event-bullet') as HTMLElement

    expect(bullet.className).toContain('bg-green-600')
    expect(bullet.className).not.toContain('bc-event-custom-color')
    w.unmount()
  })
})
