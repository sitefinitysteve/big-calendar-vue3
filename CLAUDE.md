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
```

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
│   ├── types.ts                 # Type aliases (TCalendarView, TEventColor, etc.)
│   ├── interfaces.ts            # Interfaces (IEvent, IUser, ICalendarCell)
│   ├── helpers.ts               # Pure utility functions (no Vue dependency)
│   ├── schemas.ts               # Zod validation schemas
│   └── mocks.ts                 # Mock data for demo
├── components/
│   ├── layout/                  # AppHeader, ToggleTheme
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

### State Management
- Pinia setup store syntax (not options syntax)
- Store holds: selectedDate, selectedUserId, badgeVariant, users, events, workingHours, visibleHours
- Composables derive filtered/computed data from store — views don't access store directly for complex logic

### Routing
- Routes: `/month-view`, `/week-view`, `/day-view`, `/year-view`, `/agenda-view`
- Default redirect: `/` → `/month-view`
- All routes are children of CalendarLayout

## React → Vue Conversion Patterns

When porting React components, reference the original at https://github.com/lramos33/big-calendar:
- `useState` → `ref()`
- `useMemo` → `computed()`
- `useEffect` → `watch()` / `watchEffect()` / `onMounted()`
- `useRouter().push` → `router.push()` or `<RouterLink>`
- `.map()` in JSX → `v-for` in template
- `className` → `class`
- `onClick` → `@click`
- Context providers → Pinia store
- `children` prop → `<slot />`
- DnD wrappers → skip (deferred to v2)
