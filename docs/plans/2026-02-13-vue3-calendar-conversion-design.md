# Big Calendar Vue 3 — Conversion Design

## Overview

Convert the [Big Calendar](https://github.com/lramos33/big-calendar) React/Next.js application into a Vue 3 SPA using shadcn-vue. The result is a clone-and-customize project where users copy calendar components into their own Vue projects.

## Original Project

- **Author**: Leonardo Ramos ([lramos33](https://github.com/lramos33))
- **License**: MIT
- **Stack**: Next.js 14, React 18, shadcn/ui, Tailwind CSS, date-fns, react-dnd
- **Features**: 5 calendar views (month, week, day, year, agenda), drag-and-drop, user filtering, working hours, badge variants, dark mode, event CRUD dialogs

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Vue 3 SPA (not Nuxt) | User preference, simplicity |
| Approach | Vue-idiomatic rewrite | Leverage Vue patterns (composables, provide/inject-capable Pinia, v-model, slots) |
| Distribution | Clone & customize | Matches shadcn-vue philosophy |
| DnD | Deferred to v2 | Hardest part to port, not needed for v1 |
| State | Pinia | Devtools, persistence plugin, cleaner than provide/inject at this scale |
| Forms | VeeValidate + zod | shadcn-vue's recommended approach |
| Build | Vite | Standard for Vue 3 |
| Icons | lucide-vue-next | Drop-in replacement for lucide-react |

## Tech Stack

- `vue` 3.5+, `vue-router` 4, `pinia`
- `shadcn-vue` (button, dialog, select, input, textarea, form, popover, scroll-area, badge, tooltip, avatar, accordion, separator, switch, label)
- `vee-validate`, `@vee-validate/zod`, `zod`
- `date-fns` 3
- `lucide-vue-next`
- `tailwindcss`, `@tailwindcss/vite`
- `typescript`, `vite`

## Project Structure

```
src/
├── App.vue
├── main.ts
├── router/
│   └── index.ts
├── stores/
│   └── calendar.ts                  # Pinia store
├── calendar/
│   ├── composables/
│   │   ├── useCalendarGrid.ts       # Month grid cell generation
│   │   ├── useEventPositioning.ts   # Event layout calculations
│   │   ├── useTimeGrid.ts           # Week/day time slot logic
│   │   ├── useVisibleHours.ts       # Visible hours calculation
│   │   └── useCurrentTime.ts        # Live time tracking
│   ├── components/
│   │   ├── header/
│   │   ├── month-view/
│   │   ├── week-view/
│   │   ├── day-view/
│   │   ├── year-view/
│   │   ├── agenda-view/
│   │   └── dialogs/
│   ├── helpers.ts                   # Pure utility functions (ported as-is)
│   ├── types.ts                     # TypeScript interfaces & types
│   ├── schemas.ts                   # Zod validation schemas (ported as-is)
│   └── mocks.ts                     # Mock data (ported as-is)
├── components/
│   └── ui/                          # shadcn-vue components
├── layouts/
│   └── CalendarLayout.vue
├── pages/
│   ├── MonthView.vue
│   ├── WeekView.vue
│   ├── DayView.vue
│   ├── YearView.vue
│   └── AgendaView.vue
├── lib/
│   └── utils.ts
└── assets/
    └── styles/
        └── globals.css
```

## State Management

```ts
// Pinia store
interface CalendarState {
  selectedDate: Date
  selectedUserId: string | 'all'
  badgeVariant: 'dot' | 'colored' | 'mixed'
  users: IUser[]
  events: IEvent[]
  workingHours: TWorkingHours
  visibleHours: TVisibleHours
}
```

Persistence: `badgeVariant`, `workingHours`, `visibleHours` persisted to localStorage. Everything else is runtime.

## Composables

| Composable | Input | Output |
|---|---|---|
| `useCalendarGrid` | `selectedDate` | `calendarCells: ComputedRef<ICalendarCell[]>` |
| `useEventPositioning` | `events, date` | `positions: ComputedRef<Map>` |
| `useTimeGrid` | `events, day` | `groupedEvents: ComputedRef<IGroupedEvent[]>` |
| `useVisibleHours` | `visibleHours, events` | `adjustedHours: ComputedRef<{from, to}>` |
| `useCurrentTime` | — | `currentTime: Ref<Date>` (updates every 60s) |
| `useDisclosure` | — | `{ isOpen, open, close, toggle }` |

## Vue-Idiomatic Patterns

- `<script setup>` in all components
- `v-model` for two-way bindings
- `computed()` replaces `useMemo`
- `ref()` replaces `useState`
- `watch`/`watchEffect` replaces `useEffect`
- `<template v-for>` replaces `.map()` JSX
- Scoped slots for customization points

## Attribution

LICENSE file includes both original author and port author copyrights. README credits and links to the original project.

## Scope (v1)

### Included
- All 5 calendar views (month, week, day, year, agenda)
- Event creation/editing dialogs
- User filtering
- Working hours customization
- Visible hours adjustment
- Badge variant selection
- Dark mode
- Responsive design
- Live time indicator

### Deferred
- Drag-and-drop (v2)
- SSR/Nuxt support
- npm package distribution
- Backend integration
