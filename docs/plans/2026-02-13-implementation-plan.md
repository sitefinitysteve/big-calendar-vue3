# Big Calendar Vue 3 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Convert the React/Next.js Big Calendar into a Vue 3 SPA with shadcn-vue, preserving all 5 views (month, week, day, year, agenda), event CRUD, user filtering, working hours, and dark mode. No drag-and-drop in v1.

**Architecture:** Vue 3 SPA with Composition API (`<script setup>`), Pinia for state, Vue Router for navigation, shadcn-vue for UI, VeeValidate + zod for forms, date-fns for dates. Clone-and-customize distribution model. Includes a demo app that loads mock data.

**Tech Stack:** Vue 3.5+, Vue Router 4, Pinia, shadcn-vue, VeeValidate, zod, date-fns 3, lucide-vue-next, Tailwind CSS, Vite, TypeScript

**Original Project:** [Big Calendar](https://github.com/lramos33/big-calendar) by Leonardo Ramos (MIT License)

---

### Task 1: Scaffold Vue 3 + Vite Project

**Files:**
- Create: `/Users/steve/Apps/big-calendar-vue3/package.json`
- Create: `/Users/steve/Apps/big-calendar-vue3/vite.config.ts`
- Create: `/Users/steve/Apps/big-calendar-vue3/tsconfig.json`
- Create: `/Users/steve/Apps/big-calendar-vue3/tsconfig.app.json`
- Create: `/Users/steve/Apps/big-calendar-vue3/index.html`
- Create: `/Users/steve/Apps/big-calendar-vue3/src/main.ts`
- Create: `/Users/steve/Apps/big-calendar-vue3/src/App.vue`
- Create: `/Users/steve/Apps/big-calendar-vue3/env.d.ts`

**Step 1: Create the project with Vite**

```bash
cd /Users/steve/Apps/big-calendar-vue3
npm create vite@latest . -- --template vue-ts
```

Note: Since the directory already exists with docs/, answer "yes" to use existing directory. If the CLI doesn't allow it, create in a temp dir and move files.

**Step 2: Install core dependencies**

```bash
cd /Users/steve/Apps/big-calendar-vue3
npm install vue-router@4 pinia date-fns@3 zod class-variance-authority clsx tailwind-merge lucide-vue-next
npm install -D tailwindcss @tailwindcss/vite typescript
```

**Step 3: Install form dependencies**

```bash
cd /Users/steve/Apps/big-calendar-vue3
npm install vee-validate @vee-validate/zod
```

**Step 4: Verify dev server starts**

```bash
cd /Users/steve/Apps/big-calendar-vue3
npm run dev -- --port 3001
```

Expected: Dev server running on port 3001

**Step 5: Commit**

```bash
cd /Users/steve/Apps/big-calendar-vue3
git add -A
git commit -m "chore: scaffold Vue 3 + Vite project with dependencies"
```

---

### Task 2: Configure Tailwind CSS + shadcn-vue

**Files:**
- Create: `/Users/steve/Apps/big-calendar-vue3/src/assets/styles/globals.css`
- Create: `/Users/steve/Apps/big-calendar-vue3/src/lib/utils.ts`
- Create: `/Users/steve/Apps/big-calendar-vue3/components.json`
- Modify: `/Users/steve/Apps/big-calendar-vue3/src/main.ts` (import globals.css)
- Modify: `/Users/steve/Apps/big-calendar-vue3/vite.config.ts` (add tailwindcss plugin, path aliases)
- Modify: `/Users/steve/Apps/big-calendar-vue3/tsconfig.app.json` (add path aliases)

**Step 1: Configure Tailwind v4 via Vite plugin**

Update `vite.config.ts`:
```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

**Step 2: Create globals.css**

Port from the React version — identical CSS variables for light/dark themes. Use Tailwind v4 `@import "tailwindcss"` syntax instead of v3 `@tailwind` directives. Include the custom `--font-inter`, border-border base layer, bg-background/text-foreground body layer.

**Step 3: Create lib/utils.ts**

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Step 4: Initialize shadcn-vue**

```bash
cd /Users/steve/Apps/big-calendar-vue3
npx shadcn-vue@latest init
```

Choose: TypeScript, Default style, Zinc color, src/assets/styles/globals.css, CSS variables, `@/lib/utils`, `@/components/ui`, Reka UI

**Step 5: Add required shadcn-vue components**

```bash
cd /Users/steve/Apps/big-calendar-vue3
npx shadcn-vue@latest add button badge dialog select input textarea form popover scroll-area tooltip avatar accordion separator switch label calendar
```

**Step 6: Verify: import a Button in App.vue, run dev server, confirm it renders**

**Step 7: Commit**

```bash
cd /Users/steve/Apps/big-calendar-vue3
git add -A
git commit -m "chore: configure Tailwind CSS and shadcn-vue components"
```

---

### Task 3: Port Framework-Agnostic Files (types, interfaces, helpers, schemas, mocks)

**Files:**
- Create: `src/calendar/types.ts`
- Create: `src/calendar/interfaces.ts`
- Create: `src/calendar/helpers.ts`
- Create: `src/calendar/schemas.ts`
- Create: `src/calendar/mocks.ts`

**Step 1: Port types.ts**

Copy as-is — no React dependencies:
```ts
export type TCalendarView = 'day' | 'week' | 'month' | 'year' | 'agenda'
export type TEventColor = 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange' | 'gray'
export type TBadgeVariant = 'dot' | 'colored' | 'mixed'
export type TWorkingHours = { [key: number]: { from: number; to: number } }
export type TVisibleHours = { from: number; to: number }
```

**Step 2: Port interfaces.ts**

Change import path alias to match:
```ts
import type { TEventColor } from '@/calendar/types'
// Rest is identical
```

**Step 3: Port helpers.ts**

Copy as-is. Only change: update import paths from `@/calendar/interfaces` and `@/calendar/types` (same aliases, so these should work unchanged).

**Step 4: Port schemas.ts**

Copy as-is — zod has no framework dependency.

**Step 5: Port mocks.ts**

Copy as-is — pure JS data generation.

**Step 6: Verify TypeScript compiles**

```bash
cd /Users/steve/Apps/big-calendar-vue3
npx vue-tsc --noEmit
```

**Step 7: Commit**

```bash
cd /Users/steve/Apps/big-calendar-vue3
git add src/calendar/
git commit -m "feat: port framework-agnostic calendar types, helpers, schemas, and mocks"
```

---

### Task 4: Pinia Store + Composables

**Files:**
- Create: `src/stores/calendar.ts`
- Create: `src/calendar/composables/useCalendarGrid.ts`
- Create: `src/calendar/composables/useEventPositioning.ts`
- Create: `src/calendar/composables/useTimeGrid.ts`
- Create: `src/calendar/composables/useVisibleHours.ts`
- Create: `src/calendar/composables/useCurrentTime.ts`
- Create: `src/calendar/composables/useDisclosure.ts`
- Create: `src/calendar/composables/useUpdateEvent.ts`
- Create: `src/calendar/composables/useFilteredEvents.ts`

**Step 1: Create Pinia store**

```ts
// src/stores/calendar.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IEvent, IUser } from '@/calendar/interfaces'
import type { TBadgeVariant, TVisibleHours, TWorkingHours } from '@/calendar/types'

const DEFAULT_WORKING_HOURS: TWorkingHours = {
  0: { from: 0, to: 0 },
  1: { from: 8, to: 17 },
  2: { from: 8, to: 17 },
  3: { from: 8, to: 17 },
  4: { from: 8, to: 17 },
  5: { from: 8, to: 17 },
  6: { from: 8, to: 12 },
}

const DEFAULT_VISIBLE_HOURS: TVisibleHours = { from: 7, to: 18 }

export const useCalendarStore = defineStore('calendar', () => {
  const selectedDate = ref(new Date())
  const selectedUserId = ref<string | 'all'>('all')
  const badgeVariant = ref<TBadgeVariant>('colored')
  const users = ref<IUser[]>([])
  const events = ref<IEvent[]>([])
  const workingHours = ref<TWorkingHours>({ ...DEFAULT_WORKING_HOURS })
  const visibleHours = ref<TVisibleHours>({ ...DEFAULT_VISIBLE_HOURS })

  function setSelectedDate(date: Date | undefined) {
    if (!date) return
    selectedDate.value = date
  }

  function setEvents(newEvents: IEvent[]) {
    events.value = newEvents
  }

  function updateEvent(updatedEvent: IEvent) {
    const index = events.value.findIndex(e => e.id === updatedEvent.id)
    if (index === -1) return
    events.value = [
      ...events.value.slice(0, index),
      updatedEvent,
      ...events.value.slice(index + 1),
    ]
  }

  function initialize(initialUsers: IUser[], initialEvents: IEvent[]) {
    users.value = initialUsers
    events.value = initialEvents
  }

  return {
    selectedDate,
    selectedUserId,
    badgeVariant,
    users,
    events,
    workingHours,
    visibleHours,
    setSelectedDate,
    setEvents,
    updateEvent,
    initialize,
  }
})
```

**Step 2: Create composables**

`useCalendarGrid.ts` — wraps `getCalendarCells` in a computed:
```ts
import { computed } from 'vue'
import { useCalendarStore } from '@/stores/calendar'
import { getCalendarCells } from '@/calendar/helpers'

export function useCalendarGrid() {
  const store = useCalendarStore()
  const cells = computed(() => getCalendarCells(store.selectedDate))
  return { cells }
}
```

`useEventPositioning.ts` — wraps `calculateMonthEventPositions` in a computed.

`useTimeGrid.ts` — wraps `groupEvents` and `getEventBlockStyle`.

`useVisibleHours.ts` — wraps `getVisibleHours`.

`useCurrentTime.ts`:
```ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useCurrentTime() {
  const currentTime = ref(new Date())
  let timer: ReturnType<typeof setInterval>

  onMounted(() => {
    timer = setInterval(() => { currentTime.value = new Date() }, 60 * 1000)
  })

  onUnmounted(() => {
    clearInterval(timer)
  })

  return { currentTime }
}
```

`useDisclosure.ts`:
```ts
import { ref } from 'vue'

export function useDisclosure(defaultIsOpen = false) {
  const isOpen = ref(defaultIsOpen)
  const onOpen = () => { isOpen.value = true }
  const onClose = () => { isOpen.value = false }
  const onToggle = () => { isOpen.value = !isOpen.value }
  return { isOpen, onOpen, onClose, onToggle }
}
```

`useUpdateEvent.ts` — uses store's `updateEvent`.

`useFilteredEvents.ts` — ports `ClientContainer`'s filtering logic into a computed, returning `filteredEvents`, `singleDayEvents`, `multiDayEvents`, `eventStartDates`.

**Step 3: Register Pinia in main.ts**

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/styles/globals.css'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

**Step 4: Verify TypeScript compiles**

```bash
cd /Users/steve/Apps/big-calendar-vue3
npx vue-tsc --noEmit
```

**Step 5: Commit**

```bash
cd /Users/steve/Apps/big-calendar-vue3
git add src/stores/ src/calendar/composables/ src/main.ts
git commit -m "feat: add Pinia store and Vue composables for calendar logic"
```

---

### Task 5: Vue Router + Page Components + App Layout

**Files:**
- Create: `src/router/index.ts`
- Create: `src/pages/MonthView.vue`
- Create: `src/pages/WeekView.vue`
- Create: `src/pages/DayView.vue`
- Create: `src/pages/YearView.vue`
- Create: `src/pages/AgendaView.vue`
- Create: `src/layouts/CalendarLayout.vue`
- Create: `src/components/layout/AppHeader.vue`
- Create: `src/components/layout/ToggleTheme.vue`
- Modify: `src/App.vue`
- Modify: `src/main.ts` (register router)

**Step 1: Create router**

```ts
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/month-view' },
    {
      path: '/',
      component: () => import('@/layouts/CalendarLayout.vue'),
      children: [
        { path: 'month-view', component: () => import('@/pages/MonthView.vue') },
        { path: 'week-view', component: () => import('@/pages/WeekView.vue') },
        { path: 'day-view', component: () => import('@/pages/DayView.vue') },
        { path: 'year-view', component: () => import('@/pages/YearView.vue') },
        { path: 'agenda-view', component: () => import('@/pages/AgendaView.vue') },
      ],
    },
  ],
})

export default router
```

**Step 2: Create CalendarLayout.vue**

This replaces the React `(calendar)/layout.tsx`. Initializes the Pinia store with mock data, wraps `<router-view>` with the settings accordion below it.

**Step 3: Create page components**

Each is a thin wrapper like:
```vue
<!-- src/pages/MonthView.vue -->
<script setup lang="ts">
import CalendarContainer from '@/calendar/components/CalendarContainer.vue'
</script>

<template>
  <CalendarContainer view="month" />
</template>
```

**Step 4: Create AppHeader.vue**

Port the React Header component. Replace `<Link>` with `<a>` tags (external links) and update attribution text. Replace `useRouter` with Vue Router's `<RouterLink>`.

**Step 5: Create ToggleTheme.vue**

Port the React theme toggle. Instead of cookies, use localStorage + `document.documentElement.classList`.

**Step 6: Update App.vue**

```vue
<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
</script>

<template>
  <AppHeader />
  <router-view />
</template>
```

**Step 7: Register router in main.ts**

```ts
import router from './router'
app.use(router)
```

**Step 8: Verify: navigate to localhost:3001, confirm redirect to /month-view**

**Step 9: Commit**

```bash
cd /Users/steve/Apps/big-calendar-vue3
git add src/router/ src/pages/ src/layouts/ src/components/layout/ src/App.vue src/main.ts
git commit -m "feat: add Vue Router, page components, app layout with theme toggle"
```

---

### Task 6: Calendar Header Components

**Files:**
- Create: `src/calendar/components/header/CalendarHeader.vue`
- Create: `src/calendar/components/header/DateNavigator.vue`
- Create: `src/calendar/components/header/TodayButton.vue`
- Create: `src/calendar/components/header/UserSelect.vue`

**Step 1: Port TodayButton.vue**

Replace `useCalendar()` with `useCalendarStore()`. Replace onClick with `@click`. Replace JSX with `<template>`.

**Step 2: Port DateNavigator.vue**

Replace `useMemo` with `computed()`. Replace `useCalendar()` with store. Replace JSX with template.

**Step 3: Port UserSelect.vue**

Port the Select component. Replace `v-for` instead of `.map()`. Replace `onValueChange` with `@update:model-value`.

**Step 4: Port CalendarHeader.vue**

Replace `<Link>` with `<RouterLink>`. Replace `useRouter` with `useRoute` to determine active view from route path. Use `computed` to derive `view` from `route.path`.

**Step 5: Create custom AvatarGroup.vue component**

Port the React AvatarGroup. Use Vue `<slot>` and `useSlots()`.

**Step 6: Verify: header renders with navigation, view switcher buttons, user select**

**Step 7: Commit**

```bash
cd /Users/steve/Apps/big-calendar-vue3
git add src/calendar/components/header/ src/components/ui/avatar-group.vue
git commit -m "feat: port calendar header with navigation, view switcher, and user select"
```

---

### Task 7: CalendarContainer + Event Filtering

**Files:**
- Create: `src/calendar/components/CalendarContainer.vue`

**Step 1: Port ClientContainer**

This is the main orchestrator. Uses `useFilteredEvents` composable. Renders `CalendarHeader` + the active view component. No DnD wrapper needed (skip `DndProviderWrapper`).

```vue
<script setup lang="ts">
import { computed } from 'vue'
import type { TCalendarView } from '@/calendar/types'
import { useFilteredEvents } from '@/calendar/composables/useFilteredEvents'
import CalendarHeader from '@/calendar/components/header/CalendarHeader.vue'
import CalendarMonthView from '@/calendar/components/month-view/CalendarMonthView.vue'
// ... other view imports

const props = defineProps<{ view: TCalendarView }>()

const { filteredEvents, singleDayEvents, multiDayEvents, eventStartDates } = useFilteredEvents(
  computed(() => props.view)
)
</script>

<template>
  <div class="overflow-hidden rounded-xl border">
    <CalendarHeader :view="view" :events="filteredEvents" />
    <CalendarMonthView v-if="view === 'month'" :single-day-events="singleDayEvents" :multi-day-events="multiDayEvents" />
    <!-- other views -->
  </div>
</template>
```

**Step 2: Verify: month-view route shows header + empty calendar area**

**Step 3: Commit**

```bash
cd /Users/steve/Apps/big-calendar-vue3
git add src/calendar/components/CalendarContainer.vue
git commit -m "feat: add CalendarContainer with event filtering and view routing"
```

---

### Task 8: Month View

**Files:**
- Create: `src/calendar/components/month-view/CalendarMonthView.vue`
- Create: `src/calendar/components/month-view/DayCell.vue`
- Create: `src/calendar/components/month-view/MonthEventBadge.vue`
- Create: `src/calendar/components/month-view/EventBullet.vue`

**Step 1: Port EventBullet.vue**

Simple component with cva color variants. Direct port.

**Step 2: Port MonthEventBadge.vue**

Port the cva variants and position logic. Remove `DraggableEvent` wrapper (no DnD in v1). Replace `EventDetailsDialog` wrapping with a `@click` that opens a dialog. Replace `onKeyDown` with `@keydown`.

**Step 3: Port DayCell.vue**

Replace `useRouter().push` with `router.push`. Replace `useMemo` with `computed`. Remove `DroppableDayCell` wrapper (no DnD). Replace JSX array map with `v-for`.

**Step 4: Port CalendarMonthView.vue**

Replace `useMemo` with `computed`. Replace JSX grid with `<template v-for>`.

**Step 5: Verify: navigate to /month-view, confirm grid renders with events**

**Step 6: Commit**

```bash
cd /Users/steve/Apps/big-calendar-vue3
git add src/calendar/components/month-view/
git commit -m "feat: port month view with day cells, event badges, and bullet indicators"
```

---

### Task 9: Event Details + Edit Dialogs

**Files:**
- Create: `src/calendar/components/dialogs/EventDetailsDialog.vue`
- Create: `src/calendar/components/dialogs/EditEventDialog.vue`
- Create: `src/calendar/components/dialogs/AddEventDialog.vue`
- Create: `src/components/ui/time-input.vue` (custom — replaces react-aria TimeInput)
- Create: `src/components/ui/single-day-picker.vue` (custom — replaces react-day-picker)

**Step 1: Create TimeInput.vue**

The React version uses `react-aria-components` TimeField. For Vue, build a simple time input using two `<select>` dropdowns for hour and minute, styled to match shadcn-vue. Supports `v-model` with `{ hour: number, minute: number }`, `hourCycle` prop (12/24), and `granularity` prop.

**Step 2: Create SingleDayPicker.vue**

Uses shadcn-vue's `Calendar` inside a `Popover`. Supports `v-model` with a `Date`. Port logic from the React SingleDayPicker.

**Step 3: Port EventDetailsDialog.vue**

Replace `DialogTrigger` children pattern with Vue's `v-model:open` pattern. The dialog receives an `event` prop and displays its details.

**Step 4: Port EditEventDialog.vue**

Replace `react-hook-form` with `useForm` from vee-validate + `toTypedSchema` from `@vee-validate/zod`. Replace render-prop `FormField` with shadcn-vue's `FormField` v-slot pattern.

**Step 5: Port AddEventDialog.vue**

Same form pattern as EditEventDialog but for creation. Remove the TODO comment about use-add-event hook (same stub behavior).

**Step 6: Verify: click an event badge in month view, details dialog opens. Click edit, edit dialog opens with populated form.**

**Step 7: Commit**

```bash
cd /Users/steve/Apps/big-calendar-vue3
git add src/calendar/components/dialogs/ src/components/ui/time-input.vue src/components/ui/single-day-picker.vue
git commit -m "feat: port event details, edit, and add dialogs with VeeValidate forms"
```

---

### Task 10: Week View

**Files:**
- Create: `src/calendar/components/week-view/CalendarWeekView.vue`
- Create: `src/calendar/components/week-view/EventBlock.vue`
- Create: `src/calendar/components/week-view/CalendarTimeline.vue`
- Create: `src/calendar/components/week-view/WeekViewMultiDayEventsRow.vue`

**Step 1: Port EventBlock.vue**

Port cva variants. Remove `DraggableEvent` wrapper. Replace `EventDetailsDialog` wrapping with `@click` to open dialog.

**Step 2: Port CalendarTimeline.vue**

Replace `useState`/`useEffect` with `useCurrentTime` composable.

**Step 3: Port WeekViewMultiDayEventsRow.vue**

Replace `useMemo` with `computed`. Replace `.map()` with `v-for`.

**Step 4: Port CalendarWeekView.vue**

The largest component. Remove `DroppableTimeBlock` wrappers (no DnD). Keep `AddEventDialog` triggers on time slots. Replace all JSX patterns with Vue template equivalents.

**Step 5: Register week view in CalendarContainer**

**Step 6: Verify: navigate to /week-view, confirm time grid renders with events, timeline shows**

**Step 7: Commit**

```bash
cd /Users/steve/Apps/big-calendar-vue3
git add src/calendar/components/week-view/
git commit -m "feat: port week view with time grid, event blocks, and timeline"
```

---

### Task 11: Day View

**Files:**
- Create: `src/calendar/components/day-view/CalendarDayView.vue`
- Create: `src/calendar/components/day-view/DayViewMultiDayEventsRow.vue`

**Step 1: Port DayViewMultiDayEventsRow.vue**

Direct port, same pattern as week view multi-day row.

**Step 2: Port CalendarDayView.vue**

Port the time grid (shares logic with week view). Port the right sidebar with mini calendar (use shadcn-vue Calendar component) and "happening now" section. Remove `DroppableTimeBlock` wrappers.

**Step 3: Register day view in CalendarContainer**

**Step 4: Verify: navigate to /day-view, confirm renders with sidebar mini calendar**

**Step 5: Commit**

```bash
cd /Users/steve/Apps/big-calendar-vue3
git add src/calendar/components/day-view/
git commit -m "feat: port day view with time grid, sidebar calendar, and current events"
```

---

### Task 12: Year View

**Files:**
- Create: `src/calendar/components/year-view/CalendarYearView.vue`
- Create: `src/calendar/components/year-view/YearViewMonth.vue`
- Create: `src/calendar/components/year-view/YearViewDayCell.vue`

**Step 1: Port YearViewDayCell.vue**

Replace `useRouter().push` with `router.push`. Replace inline cn() color logic with a cva variant or computed class.

**Step 2: Port YearViewMonth.vue**

Replace `useMemo` with `computed`. Replace `useRouter().push` with `router.push`.

**Step 3: Port CalendarYearView.vue**

Simple grid of 12 YearViewMonth components.

**Step 4: Register year view in CalendarContainer**

**Step 5: Verify: navigate to /year-view, confirm 12 months render with event dots**

**Step 6: Commit**

```bash
cd /Users/steve/Apps/big-calendar-vue3
git add src/calendar/components/year-view/
git commit -m "feat: port year view with monthly mini-grids and event indicators"
```

---

### Task 13: Agenda View

**Files:**
- Create: `src/calendar/components/agenda-view/CalendarAgendaView.vue`
- Create: `src/calendar/components/agenda-view/AgendaDayGroup.vue`
- Create: `src/calendar/components/agenda-view/AgendaEventCard.vue`

**Step 1: Port AgendaEventCard.vue**

Port cva variants. Remove `DraggableEvent`. Replace JSX with template.

**Step 2: Port AgendaDayGroup.vue**

Replace `.map()` with `v-for`.

**Step 3: Port CalendarAgendaView.vue**

Replace `useMemo` with `computed`. Port the eventsByDay grouping logic.

**Step 4: Register agenda view in CalendarContainer**

**Step 5: Verify: navigate to /agenda-view, confirm chronological event list renders**

**Step 6: Commit**

```bash
cd /Users/steve/Apps/big-calendar-vue3
git add src/calendar/components/agenda-view/
git commit -m "feat: port agenda view with day groups and event cards"
```

---

### Task 14: Settings Components (Badge Variant, Visible Hours, Working Hours)

**Files:**
- Create: `src/calendar/components/settings/ChangeBadgeVariantInput.vue`
- Create: `src/calendar/components/settings/ChangeVisibleHoursInput.vue`
- Create: `src/calendar/components/settings/ChangeWorkingHoursInput.vue`

**Step 1: Port ChangeBadgeVariantInput.vue**

Simple Select component bound to `store.badgeVariant`.

**Step 2: Port ChangeVisibleHoursInput.vue**

Replace `useState` with `ref()`. Replace `TimeInput` with our custom Vue TimeInput.

**Step 3: Port ChangeWorkingHoursInput.vue**

Port the day-by-day working hours editor. Replace `useState` with `ref()`. Replace JSX array iteration with `v-for`.

**Step 4: Wire settings into CalendarLayout.vue**

Add the Accordion with all three settings components below `<router-view>`.

**Step 5: Verify: expand settings accordion, change badge variant, confirm calendar updates**

**Step 6: Commit**

```bash
cd /Users/steve/Apps/big-calendar-vue3
git add src/calendar/components/settings/ src/layouts/CalendarLayout.vue
git commit -m "feat: port settings panel with badge variant, visible hours, and working hours"
```

---

### Task 15: Dark Mode + Tailwind Config Polish

**Files:**
- Modify: `src/assets/styles/globals.css` (ensure dark mode variables are correct)
- Modify: `src/components/layout/ToggleTheme.vue` (ensure localStorage persistence)

**Step 1: Verify dark mode toggle works**

Click the theme button, confirm all components switch themes correctly. Verify:
- Calendar grid borders
- Event badge colors in dark mode
- Working hours disabled pattern
- Dialog backgrounds
- Settings panel

**Step 2: Verify custom Tailwind classes work**

- `text-xxs` (0.625rem)
- `w-18` (4.5rem spacing)
- `size-6.5`, `size-4.5`, `size-5.5`
- `bg-calendar-disabled-hour` pattern
- Custom `xs` breakpoint (460px)

If using Tailwind v4, these custom values need to be defined via `@theme` in globals.css rather than a tailwind.config.ts.

**Step 3: Commit**

```bash
cd /Users/steve/Apps/big-calendar-vue3
git add -A
git commit -m "fix: ensure dark mode and custom Tailwind classes work correctly"
```

---

### Task 16: LICENSE + README + Attribution

**Files:**
- Create: `LICENSE`
- Create: `README.md`

**Step 1: Create LICENSE**

```
MIT License

Copyright (c) 2025 Leonardo Ramos (original React implementation)
Copyright (c) 2026 Steve McNiven-Scott (Vue 3 port)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

Note: Update "Steve McNiven-Scott" to the user's actual name if different.

**Step 2: Create README.md**

Include: project description, screenshots placeholder, credit to original project, tech stack, getting started, project structure, how to customize.

**Step 3: Commit**

```bash
cd /Users/steve/Apps/big-calendar-vue3
git add LICENSE README.md
git commit -m "docs: add LICENSE with attribution and README"
```

---

### Task 17: Final Integration Test + Polish

**Step 1: Full smoke test of all views**

Navigate through all 5 views and verify:
- [ ] Month view: grid renders, events show, click day navigates to day view
- [ ] Week view: time grid, event blocks positioned correctly, timeline visible
- [ ] Day view: sidebar mini calendar, "happening now", time grid
- [ ] Year view: 12 mini months, event dots, click month navigates
- [ ] Agenda view: chronological list, empty state

**Step 2: Test interactions**

- [ ] Add event dialog opens and form validates
- [ ] Edit event dialog populates with existing data
- [ ] Event details dialog shows correct info
- [ ] User filter changes displayed events
- [ ] Date navigation (prev/next) works in all views
- [ ] Today button navigates to current date
- [ ] Badge variant changes update all event displays
- [ ] Working hours pattern shows in week/day views
- [ ] Visible hours adjustment works
- [ ] Dark mode toggle persists

**Step 3: Fix any issues found**

**Step 4: Final commit**

```bash
cd /Users/steve/Apps/big-calendar-vue3
git add -A
git commit -m "feat: complete Vue 3 port of Big Calendar with all 5 views"
```

---

## Summary

| Task | Description | Key Files |
|------|-------------|-----------|
| 1 | Scaffold Vue 3 + Vite | package.json, vite.config.ts |
| 2 | Tailwind + shadcn-vue | globals.css, components.json |
| 3 | Port types/helpers/schemas/mocks | calendar/*.ts |
| 4 | Pinia store + composables | stores/, composables/ |
| 5 | Router + pages + layout | router/, pages/, layouts/ |
| 6 | Calendar header components | header/*.vue |
| 7 | CalendarContainer | CalendarContainer.vue |
| 8 | Month view | month-view/*.vue |
| 9 | Event dialogs + forms | dialogs/*.vue, time-input, day-picker |
| 10 | Week view | week-view/*.vue |
| 11 | Day view | day-view/*.vue |
| 12 | Year view | year-view/*.vue |
| 13 | Agenda view | agenda-view/*.vue |
| 14 | Settings panel | settings/*.vue |
| 15 | Dark mode + Tailwind polish | globals.css, ToggleTheme.vue |
| 16 | LICENSE + README | LICENSE, README.md |
| 17 | Integration test + polish | All files |
