# Big Calendar Vue 3

Vue 3 port of [lramos33/big-calendar](https://github.com/lramos33/big-calendar) (React/Next.js). A clone-and-customize calendar component with 5 views, event CRUD, user filtering, and dark mode.

## Source Project

- **Original**: https://github.com/lramos33/big-calendar by Leonardo Ramos (MIT License)
- **Original stack**: React 18, Next.js 14, shadcn/ui, react-dnd, date-fns
- **Feature parity**: Targets parity as of February 14, 2026. This port may diverge to add new features or leverage Vue-specific patterns beyond the original scope.
- **React source**: Available at `/Users/steve/Apps/big-calendar-vue/` for reference during porting

## Commands

```bash
npm run dev          # Start dev server (Vite)
npm run build        # Type-check (vue-tsc) then build
npm run preview      # Preview production build
npx vue-tsc --noEmit # Type-check only
npm run test         # Run the vitest suite once (vitest + @vue/test-utils + jsdom)
npm run test:watch   # Watch mode
```

Tests live in `src/calendar/__tests__/*.test.ts` and are excluded from `tsconfig.app.json`.
`vitest.config.ts` pins `TZ=America/Toronto` on purpose — UTC-negative, so `new Date('yyyy-MM-dd')`
off-by-one bugs surface.

## Tech Stack

- **Vue 3.5+** with `<script setup lang="ts">` (Composition API only)
- **Pinia** for state management (setup store syntax with `defineStore('name', () => {})`)
- **Vue Router 4** with lazy-loaded routes
- **shadcn-vue** (new-york style, Reka UI primitives, zinc base color)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (no tailwind.config — use `@theme` in globals.css)
- **date-fns v3** for date manipulation
- **VeeValidate + zod** for form validation
- **lucide-vue-next** for icons
- **TypeScript** with strict mode

## Project Structure

```
src/
├── calendar/                    # Core calendar domain
│   ├── components/              # Calendar-specific Vue components
│   │   ├── header/              # CalendarHeader, DateNavigator, TodayButton, UserSelect
│   │   ├── month-view/          # CalendarMonthView, DayCell, MonthEventBadge, EventBullet
│   │   ├── week-view/           # CalendarWeekView, EventBlock, CalendarTimeline, MultiDayRow
│   │   ├── day-view/            # CalendarDayView, DayViewMultiDayEventsRow
│   │   ├── year-view/           # CalendarYearView, YearViewMonth, YearViewDayCell
│   │   ├── agenda-view/         # CalendarAgendaView, AgendaDayGroup, AgendaEventCard
│   │   ├── dialogs/             # EventDetailsDialog, EditEventDialog, AddEventDialog
│   │   └── settings/            # BadgeVariant, VisibleHours, WorkingHours inputs
│   ├── composables/             # Vue composables for calendar logic
│   ├── types.ts                 # Type aliases (TCalendarView, TEventColor, TLegacyEventColor, etc.)
│   ├── date-format.ts           # Locale-derived date/time patterns (pure TS, no Vue)
│   ├── customization.ts         # ICalendarCustomization, injection key, useCalendarCustomization()
│   ├── interfaces.ts            # Interfaces (IEvent, IUser, ICalendarCell)
│   ├── helpers.ts               # Pure utility functions (no Vue dependency)
│   ├── labels.ts                # ICalendarLabels interface, DEFAULT_LABELS, injection keys
│   ├── schemas.ts               # Zod validation schemas (createEventSchema factory)
│   └── mocks.ts                 # Mock data for demo
├── composables/
│   └── useLocale.ts             # Demo locale composable (EN/FR/ES) — not exported from library
├── components/
│   ├── layout/                  # AppHeader, ToggleTheme, ToggleLanguage
│   └── ui/                      # shadcn-vue components (generated, do not hand-edit)
├── stores/calendar.ts           # Pinia store
├── layouts/CalendarLayout.vue   # Initializes store with mock data, wraps router-view
├── pages/                       # Route page components (thin wrappers)
├── router/index.ts              # Vue Router config
├── lib/utils.ts                 # cn() utility
└── assets/styles/globals.css    # Tailwind v4 theme, CSS variables, custom utilities
```

## Code Conventions

### Vue Components
- Always use `<script setup lang="ts">` — never Options API
- Props: `defineProps<{ ... }>()` with TypeScript interface (no runtime validation)
- Emits: `defineEmits<{ ... }>()` with TypeScript
- Template-first rendering — no JSX or render functions
- Use `computed()` for derived state, `ref()` for local state
- Import shadcn-vue components from their barrel exports: `import { Button } from '@/components/ui/button'`

### Naming
- Components: PascalCase filenames (`CalendarHeader.vue`)
- Composables: `use` prefix, camelCase (`useCalendarGrid.ts`)
- Types: `T` prefix (`TCalendarView`), Interfaces: `I` prefix (`IEvent`)
- Props in templates: kebab-case (`:single-day-events`)
- Store: `useCalendarStore` (singular)

### Imports
- Path alias: `@/` maps to `src/`
- Import types with `import type` when possible
- Calendar domain imports: `@/calendar/types`, `@/calendar/interfaces`, `@/calendar/helpers`
- Store: `@/stores/calendar`
- UI components: `@/components/ui/<component>`

### Styling
- Tailwind utility classes only — no scoped CSS unless absolutely necessary
- Use `cn()` from `@/lib/utils` for conditional class merging
- Use `cva` (class-variance-authority) for component variants
- Custom spacing/sizes defined in globals.css `@theme` block (e.g., `size-6.5`, `w-18`, `text-xxs`)
- Dark mode: class-based via `.dark` on `<html>`, toggled via localStorage
- Custom utility `bg-calendar-disabled-hour` for working hours pattern
- Key UI elements have `bc-*` CSS class hooks for external targeting (`.bc-header`, `.bc-event-badge`, `.bc-event-block`, `.bc-event-card`, `.bc-event-bullet`, `.bc-view-buttons`)

### State Management
- Pinia setup store syntax (not options syntax), store ID: `'big-calendar'`
- Store holds: selectedDate, selectedUserId, badgeVariant, users, events, workingHours, visibleHours
- Store actions: `initialize()`, `addEvent()`, `updateEvent()`, `deleteEvent()`, `setSelectedDate()`
- Composables derive filtered/computed data from store — views don't access store directly for complex logic
- CalendarContainer (BigCalendar) emits `@event-created`, `@event-updated`, `@event-deleted` for backend hooks
- CalendarContainer emits `@day-click` (payload: `yyyy-MM-dd` string, built with date-fns `format` so it is UTC-safe) when a day is clicked in month/year views, and `@event-click` (payload: `IEvent`) when an event chip is clicked in any view — for host apps that drive their own dialogs/routing
- CalendarContainer emits `@day-context-menu` and `@event-context-menu` on right-click (payload: `{ date | event, x, y, originalEvent }`) — handled via a single delegated `@contextmenu` listener on the calendar root that reads `data-date` (day cells) / `data-event-id` (event chips); the native browser menu is suppressed only when a listener is attached (detected via `getCurrentInstance().vnode.props`)
- CalendarContainer accepts `availableViews` (restrict visible view buttons), `showUserSelect` (toggle user dropdown), `labels` (Partial<ICalendarLabels>), and `showViewTooltips` props
- CalendarContainer accepts the v1.2.x customization props: `hideHeader`, `selectedEventId` (with `v-model:selected-event-id` via `@update:selectedEventId`, which emits `null` when the already-selected event is clicked again), `hourHeight` (default 96), `height`, `autoHeight`, `maxEventsPerDayCell` (default 3), `allDayMaxRows`, `classNames`, `dayCellClassName`; and emits `@show-more` (payload `yyyy-MM-dd`) — attaching a listener turns the month view's "+N more" label into a real button
- CalendarContainer exposes scoped slots `#header`, `#event`, `#month-event`, `#agenda-event`. The event slots receive `{ event, view, selected, badgeVariant }` and are threaded to deep children (EventBlock / MonthEventBadge / AgendaEventCard) through the customization injection. These replace React's `renderEvent` render props; the stock chip markup is the fallback when a slot is absent
- CalendarContainer accepts `navigateOnDayClick` (default `true`; set `false` so a day click only emits `@day-click` instead of switching to day view) and `openDetailsOnEventClick` (default `true`; set `false` so an event click only emits `@event-click` instead of opening the built-in details dialog) — together these enable a fully "events-only" integration

### Routing
- CalendarHeader emits `changeView` instead of using RouterLink — router-agnostic
- CalendarContainer supports `v-model:view` for view switching
- Demo app routes: `/month-view`, `/week-view`, `/day-view`, `/year-view`, `/agenda-view`
- Page components handle `@update:view` with `router.push()`

### Library Build
- Entry point: `src/index.ts` — exports BigCalendar, views, store, composables, types, helpers
- CSS entry: `src/calendar-lib.css` — Tailwind + CSS variable defaults in `@layer big-calendar-base`
- Vite lib config: `vite.config.lib.ts` — ESM output, externalizes peer deps, bundles shadcn-vue components
- Build command: `npm run build:lib` → `dist/big-calendar-vue3.js`, `dist/style.css`, `dist/index.d.ts`

### Date & Time Formatting
- Never hardcode `'MMM d, yyyy'`, `'h:mm a'`, `'EEEE, MMMM d, yyyy'` or `'hh a'` — use the helpers in `@/calendar/date-format`
- `formatDate`, `formatLongDate`, `formatTime`, `formatHour`, `formatDateTime` each take `(date, locale?)`
- The locale comes from `useDateLocale()` — a `ComputedRef<Locale | undefined>`; use `.value` in `<script setup>`, plain in `<template>`
- `is24HourLocale(locale)` drives `TimeInput`'s `hourCycle` so the inputs match the read-only labels
- Patterns are read from `locale.formatLong` (CLDR), so field ORDER and clock convention follow the locale; with no locale the previously-hardcoded en-US patterns are used verbatim

### Customization API
- `useCalendarCustomization()` returns a `ComputedRef<ICalendarCustomization>`, provided by CalendarContainer via `CALENDAR_CUSTOMIZATION_KEY` — same provide/inject shape as `useCalendarLabels()`
- Falls back to `DEFAULT_CUSTOMIZATION` (`hourHeight: 96`, `maxEventsPerDayCell: 3`) so standalone-exported views keep v1.1.0 behavior
- `TEventColor` is an open union (`TLegacyEventColor | (string & {})`). Use `isLegacyColor()` before indexing any Tailwind class map; non-legacy colors render with `.bc-event-custom-color` + an inline `--bc-event-color`
- The custom-color CSS lives in both `src/calendar-lib.css` and `src/assets/styles/globals.css` — keep the two blocks in sync
- Default output must stay byte-identical when no customization props are set (the week/day 15-minute slots keep literal Tailwind classes at the stock 96px hour and only switch to inline positioning when `hourHeight` differs)

### Multilingual Labels
- All user-facing text uses the label system — no hardcoded strings in calendar components
- `ICalendarLabels` interface defines all labels (flat structure, ~80 keys)
- `DEFAULT_LABELS` provides English defaults
- `BigCalendar` accepts `labels` prop (`Partial<ICalendarLabels>`) — override only what you need
- `BigCalendar` accepts `showViewTooltips` prop (default: `true`) — toggles view button tooltips
- `BigCalendar` accepts `dateLocale` prop (date-fns `Locale`) — localizes month/day names in `format()` calls
- Child components access labels via `useCalendarLabels()` composable (uses provide/inject)
- Child components access date locale via `useDateLocale()` composable
- Function-valued labels for interpolation: `eventsCount`, `moreEvents`, `dayOfTotal`
- Validation messages also use labels via `createEventSchema(labels)` factory
- When adding new user-facing strings, always add a key to `ICalendarLabels` + `DEFAULT_LABELS` first
- IMPORTANT: `useCalendarLabels()` returns `ComputedRef<ICalendarLabels>` — use `.value` in `<script setup>`, but NOT in `<template>` (Vue auto-unwraps refs in templates)

### All-Day Events
- All-day events must NEVER show time in any UI element
- Check `event.isAllDay` before rendering time strings
- Show `labels.allDay` text instead of time range for all-day events
- Pattern: `<template v-if="event.isAllDay">{{ labels.allDay }}</template>`

### View Button CSS Hooks
- Each view button has `data-view="day|week|month|year|agenda"` attribute
- Each view button has `bc-view-day`, `bc-view-week`, etc. CSS class
- Parent container has existing `bc-view-buttons` class

## React → Vue Conversion Patterns

When porting React components, reference the original at https://github.com/lramos33/big-calendar:
- `useState` → `ref()`
- `useMemo` → `computed()`
- `useEffect` → `watch()` / `watchEffect()` / `onMounted()`
- `useRouter().push` → `router.push()`
- `.map()` in JSX → `v-for` in template
- `className` → `class`
- `onClick` → `@click`
- Context providers → Pinia store
- `children` prop → `<slot />`
- DnD wrappers → skip (deferred to v2)
