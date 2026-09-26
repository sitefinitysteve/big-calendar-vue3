# Big Calendar: Vue 3

[![Netlify Status](https://api.netlify.com/api/v1/badges/e87caded-ade9-4687-8b76-50ec662acf39/deploy-status)](https://app.netlify.com/projects/big-calendar-vue3/deploys)

A fully-featured calendar component for Vue 3, ported from [lramos33/big-calendar](https://github.com/lramos33/big-calendar) (React/Next.js). Built with shadcn-vue, Tailwind CSS, and date-fns.

> **Using React?** Check out the sibling package [big-calendar-react](https://github.com/sitefinitysteve/big-calendar-react) ([npm](https://www.npmjs.com/package/big-calendar-react)) — a 1:1 feature-parity React 19 port of this library.

**[Live Demo](https://big-calendar-vue3.netlify.app/month-view)**

<p align="center">
  <b>Buy Steve a coffee</b><br>
  <a href="https://buymeacoffee.com/stevewgw" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Steve A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>
</p>

## Features

- 5 calendar views: Month, Week, Day, Year, Agenda
- Event CRUD — create, edit, delete with form validation
- User/responsible filtering
- Working hours customization (per-day with visual disabled-hour pattern)
- Visible hours adjustment (auto-expands for out-of-range events)
- Badge variant selection (colored, dot, mixed)
- Dark mode with localStorage persistence
- Live current-time indicator in week/day views
- Multi-day event spanning across cells
- i18n — all user-facing text customizable via labels prop, with date-fns locale support
- Responsive design (mobile fallbacks for complex views)

**Intentionally deferred from v1:** Drag-and-drop (the original uses react-dnd). This may be added in a future version.

## Getting Started

### Install from npm

```bash
npm install big-calendar-vue3 date-fns@4 vee-validate @vee-validate/zod zod@3
```

> If you already use [shadcn-vue](https://www.shadcn-vue.com/), most peer dependencies are already in your project. The new ones are usually `date-fns` plus the form stack (`vee-validate`, `@vee-validate/zod`, `zod`).

### Basic usage

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { BigCalendar, useCalendarStore } from 'big-calendar-vue3'
import type { TCalendarView, IEvent } from 'big-calendar-vue3'
import 'big-calendar-vue3/style.css'

const view = ref<TCalendarView>('month')
const store = useCalendarStore()

onMounted(() => {
  store.initialize(users, events) // your data
})

function onEventCreated(event: IEvent) {
  // POST to your API
}

function onEventUpdated(event: IEvent) {
  // PUT to your API
}

function onEventDeleted(event: IEvent) {
  // DELETE from your API
}
</script>

<template>
  <BigCalendar
    v-model:view="view"
    @event-created="onEventCreated"
    @event-updated="onEventUpdated"
    @event-deleted="onEventDeleted"
  />
</template>
```

The calendar manages all UI state internally. When the user creates, edits, or deletes an event, the local store is updated immediately and the corresponding event is emitted so you can sync with your backend.

### Peer dependencies

| Package | Already installed with shadcn-vue? |
|---------|-----------------------------------|
| vue ^3.5 | Yes |
| pinia ^3 \|\| ^4 | Yes |
| date-fns ^4 | No |
| reka-ui ^2 | Yes |
| @internationalized/date ^3 | Yes (via reka-ui) |
| @vueuse/core ^14 \|\| ^15 | Yes |
| lucide-vue-next >=0.400 | Yes |
| clsx ^2 | Yes |
| tailwind-merge ^3 | Yes |
| class-variance-authority ^0.7 | Yes |
| vue-router ^4 | Optional |
| vee-validate ^4 | No — required |
| @vee-validate/zod ^4 | No — required |
| zod ^3 | No — required |

`vee-validate`, `@vee-validate/zod` and `zod` were marked optional before 1.3.0, but `BigCalendar`
imports the Add/Edit dialogs unconditionally, so leaving them out broke the build even when the
dialogs were disabled via `can-add` / `can-edit`. Setting those props to `false` still skips
rendering the dialogs; it just cannot remove the import. zod stays on `^3` because
`@vee-validate/zod` 4.x requires it.

### Data shape

Initialize the store with your users and events:

```ts
interface IUser {
  id: string
  name: string
  picturePath: string | null
}

interface IEvent {
  id: number
  startDate: string   // ISO 8601 string
  endDate: string     // ISO 8601 string
  title: string
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange' | 'gray'
  description: string
  user: IUser
}
```

## Alternative: Clone and Customize

If you prefer full control over the source code, clone the repo and copy `src/calendar/` into your project:

```bash
git clone <repo-url> big-calendar-vue3
cd big-calendar-vue3
npm install
npm run dev
```

Copy `src/calendar/` and `src/stores/calendar.ts` into your project. See the `src/pages/` directory for examples of how each view is rendered.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Vue 3.5+ (Composition API, `<script setup>`) |
| State | Pinia |
| UI Components | shadcn-vue (Reka UI primitives) |
| Forms | VeeValidate + zod |
| Dates | date-fns 4 |
| Icons | lucide-vue-next |
| Styling | Tailwind CSS v4 |
| Build | Vite |
| Language | TypeScript (strict) |

## Events

### Built-in CRUD dialogs

| Event | Payload | When |
|-------|---------|------|
| `@event-created` | `IEvent` | User submits the built-in Add Event dialog |
| `@event-updated` | `IEvent` | User submits the built-in Edit Event dialog |
| `@event-deleted` | `IEvent` | User clicks Delete in the built-in Event Details dialog |
| `@update:view` | `TCalendarView` | User clicks a view button in the header |

All CRUD events fire **after** the local store is updated, so the UI reflects the change immediately. Use these hooks to persist changes to your backend.

## Interaction events (bring your own UI)

Prefer to drive your own dialogs? `BigCalendar` can run "events-only": it fires events and lets your app decide what to do, instead of opening its built-in dialogs.

| Event | Payload | Fires on |
|-------|---------|----------|
| `@day-click` | `string` — the local date as `yyyy-MM-dd` (built with date-fns `format`, so it is never shifted by UTC conversion) | Clicking a day in **month/year** views |
| `@event-click` | `IEvent` | Clicking an event chip in **any** view |

```vue
<BigCalendar
  v-model:view="view"
  :navigate-on-day-click="false"        <!-- day click emits instead of switching to the day view -->
  :open-details-on-event-click="false"  <!-- event click emits instead of opening the built-in dialog -->
  @day-click="date => openMyCreateDialog(date)"
  @event-click="event => openMyEditDialog(event.id)"
/>
```

- `navigateOnDayClick` (default `true`) — set `false` so a day click only emits `@day-click`.
- `openDetailsOnEventClick` (default `true`) — set `false` so an event click only emits `@event-click`.

### Right-click: draw your own menu

Listen for the raw context-menu events to render your own menu. They fire **only** when no commands are configured for that target (see below), and the native browser menu is left alone unless you attach a listener.

| Event | Payload |
|-------|---------|
| `@day-context-menu` | `{ date: string; x: number; y: number; originalEvent: MouseEvent }` |
| `@event-context-menu` | `{ event: IEvent; x: number; y: number; originalEvent: MouseEvent }` |

## Right-click command menu

Alternatively, let `BigCalendar` render the menu for you. Provide commands and it shows a built-in reka-ui context menu on right-click, emitting `@command` when an item is chosen — **the library never performs the action itself.**

```vue
<script setup lang="ts">
import type { ICalendarCommand, ICalendarCommandSelect } from 'big-calendar-vue3'
import { Copy, Clock } from 'lucide-vue-next'

// Define commands ONCE; scope any of them to specific views with `views`.
const eventCommands: ICalendarCommand[] = [
  { id: 'duplicate',  label: 'Duplicate',  icon: Copy },                          // every view
  { id: 'reschedule', label: 'Reschedule', icon: Clock, views: ['week', 'day'] }, // timed views only
]
const dayCommands: ICalendarCommand[] = [
  { id: 'new-log', label: 'New log entry' },                                      // month/year day cells
]

function onCommand(p: ICalendarCommandSelect) {
  // p.commandId, plus p.event (event menu) or p.date (day menu)
  if (p.commandId === 'edit') openMyEditDialog(p.event!.id)
}
</script>

<template>
  <BigCalendar
    v-model:view="view"
    :event-commands="eventCommands"
    :day-commands="dayCommands"
    show-edit-command                                 <!-- stock Edit on all views  -->
    :show-delete-command="['month', 'week', 'day']"   <!-- stock Delete, scoped      -->
    @command="onCommand"
  />
</template>
```

**`ICalendarCommand`**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Echoed back in the `@command` payload (e.g. `'edit'`, `'delete'`) |
| `label` | `string` | Menu text |
| `icon` | `Component` | Optional icon component (e.g. a lucide icon) |
| `destructive` | `boolean` | Red styling (used by stock Delete) |
| `separatorBefore` | `boolean` | Render a separator above this item |
| `disabled` | `boolean` | Dim & non-selectable |
| `views` | `TCalendarView[]` | Restrict to these views; omit to show on all |

- Stock **Edit**/**Delete** are opt-in via `showEditCommand` / `showDeleteCommand`, which accept `true` (all views) or a `TCalendarView[]` to scope them. They only emit `@command` (ids `'edit'` / `'delete'`).
- The menu opens **only** when at least one command applies to the right-clicked target and current view; otherwise the native browser menu is untouched (no blank menu).
- Event commands work wherever there are event chips (month/week/day/agenda); day commands work wherever there are day cells (month/year).

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model:view` | `TCalendarView` | — | Current calendar view |
| `canAdd` | `boolean` | `true` | Show/hide "Add Event" button and time slot click-to-create |
| `canEdit` | `boolean` | `true` | Show/hide Edit button in event details dialog |
| `canDelete` | `boolean` | `true` | Show/hide Delete button in event details dialog |
| `availableViews` | `TCalendarView[]` | All 5 views | Restrict which view buttons appear in the header |
| `showUserSelect` | `boolean` | `true` | Show/hide the user/resource filter dropdown |
| `labels` | `Partial<ICalendarLabels>` | `{}` | Override any user-facing text (see [Multilingual Labels](#multilingual-labels)) |
| `showViewTooltips` | `boolean` | `true` | Show/hide tooltips on view toggle buttons |
| `dateLocale` | `Locale` (date-fns) | `undefined` (en-US patterns) | Localizes every rendered date and time — month/day names **and** field order and clock convention. See [Date & time formatting](#date--time-formatting) |
| `navigateOnDayClick` | `boolean` | `true` | When `false`, a day click emits `@day-click` instead of switching to the day view |
| `openDetailsOnEventClick` | `boolean` | `true` | When `false`, an event click emits `@event-click` instead of opening the built-in details dialog |
| `eventCommands` | `ICalendarCommand[]` | `[]` | Right-click menu commands for events (see [Right-click command menu](#right-click-command-menu)) |
| `dayCommands` | `ICalendarCommand[]` | `[]` | Right-click menu commands for days (month/year) |
| `showEditCommand` | `boolean \| TCalendarView[]` | `false` | Add a stock "Edit" command — `true` (all views) or a list of views |
| `showDeleteCommand` | `boolean \| TCalendarView[]` | `false` | Add a stock "Delete" command — `true` (all views) or a list of views |
| `hideHeader` | `boolean` | `false` | Hide the built-in header entirely (bring your own toolbar) |
| `v-model:selectedEventId` | `number \| null` | `undefined` | Controlled selection; the matching chip gets `data-selected` |
| `hourHeight` | `number` | `96` | Pixel height of one hour row in week/day views |
| `height` | `number \| string` | stock (736px week / 800px day) | Week/day scroll-area height |
| `autoHeight` | `boolean` | `false` | Week/day grid sizes to content instead of scrolling |
| `maxEventsPerDayCell` | `number` | `3` | Month-view badge slots per day cell |
| `allDayMaxRows` | `number` | uncapped | Week all-day strip: max badge rows before the strip scrolls internally |
| `classNames` | `ICalendarClassNames` | `{}` | Extra classes for `root`, `header`, `dayCell`, `hourRow`, `eventBlock`, `timeline` |
| `dayCellClassName` | `(date: Date) => string \| undefined` | — | Per-day extra classes for month-view cells |

### Slots

| Slot | Slot props | Purpose |
|------|-----------|---------|
| `#header` | — | Replaces the built-in header (ignored when `hide-header`) |
| `#event` | `{ event, view, selected, badgeVariant }` | Replaces the inside of every event chip |
| `#month-event` | same | Month-view override; falls back to `#event` |
| `#agenda-event` | same | Agenda-view override; falls back to `#event` |

### Emits (v1.2.x additions)

| Emit | Payload | Fired when |
|------|---------|-----------|
| `@update:selectedEventId` | `number \| null` | An event chip is clicked (pairs with `v-model:selected-event-id`); `null` when the already-selected event is clicked again |
| `@show-more` | `yyyy-MM-dd` | The month view's "+N more" is activated. Attaching a listener turns the label into a real button |

Read-only example (all CRUD disabled):

```vue
<BigCalendar v-model:view="view" :can-add="false" :can-edit="false" :can-delete="false" />
```

Show only month and week views, no user filter:

```vue
<BigCalendar
  v-model:view="view"
  :available-views="['month', 'week']"
  :show-user-select="false"
/>

## Date & time formatting

`dateLocale` is the single option that controls how dates and times are rendered. It is optional —
omit it and the calendar renders US English.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BigCalendar } from 'big-calendar-vue3'
import { frCA } from 'date-fns/locale/fr-CA'

const view = ref('month')
</script>

<template>
  <BigCalendar v-model:view="view" :date-locale="frCA" />
</template>
```

The calendar takes the **format patterns themselves** from the locale (date-fns' `formatLong`, which
is CLDR data), so passing a locale changes field order and clock convention, not just the words:

| Surface | no locale | `enUS` | `frCA` | `ja` |
| --- | --- | --- | --- | --- |
| Header range, details dialog, day-view "today" chip | `Dec 1, 2026` | `Dec 1, 2026` | `1 déc. 2026` | `2026/12/01` |
| Agenda day heading | `Tuesday, December 1, 2026` | `Tuesday, December 1st, 2026` | `mardi 1 décembre 2026` | `2026年12月1日火曜日` |
| Event times (week/month/agenda/day) | `2:30 PM` | `2:30 PM` | `14:30` | `14:30` |
| Day & week hour axis | `02 PM` | `02 PM` | `14` | `14` |
| Date + time rows in the details dialog | `Dec 1, 2026 2:30 PM` | `Dec 1, 2026, 2:30 PM` | `1 déc. 2026, 14:30` | `2026/12/01 14:30` |

The hour axis follows the locale's own clock: a 24-hour locale labels it `14`, a 12-hour locale
`02 PM`, so the axis always agrees with the event times printed beside it.

The Add/Edit dialogs follow the same locale — the date field's trigger label and popover are
localized, and the time fields drop the AM/PM control for a 24-hour locale.

The pattern helpers are exported for use in your own components:
`datePattern`, `longDatePattern`, `timePattern`, `hourPattern`, `dateTimePattern`, `is24HourLocale`,
and the formatters `formatDate`, `formatLongDate`, `formatTime`, `formatHour`, `formatDateTime`.

**Known limitation:** the week grid always starts on Sunday. `dateLocale` does not yet move it, so
locales that start the week on Monday (`de`, `en-GB`) or Saturday (`ar`) still get a Sunday-first
grid. This is deliberate for now — the month view's weekday header is a fixed `Sun`–`Sat` label
list, and moving one view without the other would leave the calendar disagreeing with itself.

Omitting `dateLocale` is not the same as passing `enUS`. With no locale the calendar uses its
built-in US-English patterns, which is why the two English columns above differ on the agenda
heading (no ordinal) and the date+time row (no comma). Pass `enUS` explicitly to get true CLDR
US-English output.

> **Passing a locale is required for correct non-English output.** Without one you get English
> field order regardless of the `labels` you supply — `labels` translates the calendar's own strings
> (buttons, headings), while `dateLocale` governs everything date-fns renders.

## Customization API (v1.2.0)

All of these props and slots are optional. Omit them and the calendar renders exactly as it did in 1.1.0.

### Custom event chips

React's render-prop renderers become **scoped slots** here. The stock chip markup is the slot's
fallback, so omitting a slot leaves the built-in chip untouched.

```vue
<BigCalendar v-model:view="view">
  <template #event="{ event, view: v, selected }">
    <MyExpandedCard v-if="selected" :event="event" />
    <MyCompactCard v-else :event="event" :view="v" />
  </template>

  <template #month-event="{ event }">
    <MyCompactBadge :event="event" />
  </template>

  <template #agenda-event="{ event }">
    <MyAgendaRow :event="event" />
  </template>
</BigCalendar>
```

`#month-event` / `#agenda-event` fall back to `#event` when not given.
Slot props are `{ event, view, selected, badgeVariant }`.

### Selection

Selection is controlled: the library stores nothing.

```vue
<script setup lang="ts">
const selectedEventId = ref<number | null>(null)
</script>

<template>
  <BigCalendar
    v-model:view="view"
    v-model:selected-event-id="selectedEventId"
    :open-details-on-event-click="false"
  />
</template>
```

The matching chip gets `data-selected` (and only that one), so you can style it with
`[&[data-selected]]:outline-2` or a plain CSS rule. A selected chip rendered through the `#event`
slot switches from a fixed `height` to `min-height` and gains `z-10`, so it may grow past its slot.

### Your own toolbar

```vue
<BigCalendar v-model:view="view" hide-header />

<BigCalendar v-model:view="view">
  <template #header><MyToolbar /></template>
</BigCalendar>
```

`hide-header` wins when both are given.

### Sizing and density

| Prop / emit | Default | Effect |
| --- | --- | --- |
| `hourHeight` | `96` | Pixel height of one hour row in week/day views |
| `height` | stock (736px week / 800px day) | Week/day scroll-area height |
| `autoHeight` | `false` | Grid sizes to content instead of scrolling |
| `maxEventsPerDayCell` | `3` | Month-view badge slots per day |
| `@show-more` | none | Turns "+N more" into a button emitting `(yyyy-MM-dd)` |
| `allDayMaxRows` | uncapped | Week all-day strip: max badge rows before the strip scrolls internally |

The week view's all-day strip sits directly under the day-name header row (which is sticky) and
carries a gutter label taken from the `allDay` label key (`"All day"` by default), so a translated
calendar labels it too.

### Class hooks

```vue
<BigCalendar
  v-model:view="view"
  :class-names="{ root, header, dayCell, hourRow, eventBlock, timeline }"
  :day-cell-class-name="(date) => (isWeekend(date) ? 'bg-muted/40' : undefined)"
/>
```

### Open color system

`event.color` accepts the seven built-in names (`blue`, `green`, `red`, `yellow`, `purple`,
`orange`, `gray`) or **any CSS color string**. Built-ins keep their Tailwind class maps.
Anything else renders with the class `bc-event-custom-color` plus an inline
`--bc-event-color` variable, and the color is derived with `color-mix()`.

If you do **not** import `big-calendar-vue3/style.css`, copy these rules into your own
stylesheet or custom colors will render unstyled:

```css
.bc-event-custom-color {
  border-color: color-mix(in srgb, var(--bc-event-color, currentColor) 35%, transparent);
  background-color: color-mix(in srgb, var(--bc-event-color, currentColor) 12%, transparent);
  color: color-mix(in srgb, var(--bc-event-color, currentColor) 85%, black);
}
.dark .bc-event-custom-color {
  border-color: color-mix(in srgb, var(--bc-event-color, currentColor) 45%, transparent);
  background-color: color-mix(in srgb, var(--bc-event-color, currentColor) 22%, transparent);
  color: color-mix(in srgb, var(--bc-event-color, currentColor) 75%, white);
}
.bc-event-custom-color .event-dot { fill: var(--bc-event-color, currentColor); }
.bc-event-bullet.bc-event-custom-color {
  background-color: var(--bc-event-color, currentColor);
  border-color: transparent;
}
@media (min-width: 1024px) {
  .bc-day-cell-list { height: var(--bc-day-cell-list-height); flex-direction: column; }
}
```

(The last rule only matters when you set `maxEventsPerDayCell` to something other than 3.)

### Typed event metadata

```ts
type TripMeta = { sourceType: 'trip' | 'client'; sourceId: number }
const events: IEvent<TripMeta>[] = []
```

`meta` is optional and carried through untouched by the library.

### Reading the customization from your own component

```ts
import { useCalendarCustomization } from 'big-calendar-vue3'

const customization = useCalendarCustomization() // ComputedRef<ICalendarCustomization>
```

## Multilingual Labels

All user-facing text in the calendar is customizable via the `labels` prop. English is the default — override only the labels you need.

### Basic Usage

```vue
<BigCalendar v-model:view="view" :labels="frenchLabels" :date-locale="frLocale" />
```

```typescript
import type { ICalendarLabels } from 'big-calendar-vue3'
import { fr } from 'date-fns/locale/fr'

const frLocale = fr

const frenchLabels: Partial<ICalendarLabels> = {
  addEvent: 'Ajouter un événement',
  allDay: 'Toute la journée',
  viewDay: 'Jour',
  viewWeek: 'Semaine',
  viewMonth: 'Mois',
  viewYear: 'Année',
  viewAgenda: 'Agenda',
  buttonCancel: 'Annuler',
  buttonCreate: 'Créer',
  buttonSave: 'Enregistrer',
  buttonEdit: 'Modifier',
  buttonDelete: 'Supprimer',
  // ... override as many or as few as needed
}
```

### Dynamic Language Switching

Use a reactive ref to switch languages at runtime:

```vue
<script setup>
import { ref, computed } from 'vue'
import type { ICalendarLabels } from 'big-calendar-vue3'
import { fr } from 'date-fns/locale/fr'
import { es } from 'date-fns/locale/es'

const locale = ref('en')

const labelSets = {
  en: {},
  fr: { addEvent: 'Ajouter', allDay: 'Toute la journée', /* ... */ },
  es: { addEvent: 'Agregar evento', allDay: 'Todo el día', /* ... */ },
}

const dateLocales = { en: undefined, fr, es }

const labels = computed(() => labelSets[locale.value])
const dateLocale = computed(() => dateLocales[locale.value])
</script>

<template>
  <BigCalendar v-model:view="view" :labels="labels" :date-locale="dateLocale" />
</template>
```

### Interpolated Labels

Some labels are functions to handle dynamic values:

```typescript
const labels: Partial<ICalendarLabels> = {
  eventsCount: (n) => `${n} événements`,
  moreEvents: (n) => `${n} de plus...`,
  dayOfTotal: (d, t) => `Jour ${d} sur ${t}`,
}
```

### Accessing Default Labels

```typescript
import { DEFAULT_LABELS } from 'big-calendar-vue3'

console.log(DEFAULT_LABELS) // all ~80 keys with English defaults
```

> See `ICalendarLabels` in `src/calendar/labels.ts` for the complete list of all label keys.

### View Button Tooltips

View buttons display tooltips on hover by default. Disable with the `showViewTooltips` prop:

```vue
<BigCalendar v-model:view="view" :show-view-tooltips="false" />
```

Tooltip text is customizable via labels (`viewDayTooltip`, `viewWeekTooltip`, etc.).

### View Button CSS Hooks

Each view button has a `data-view` attribute and CSS class for external styling:

```css
.bc-view-day { /* ... */ }
.bc-view-week { /* ... */ }
button[data-view="month"] { /* ... */ }
.bc-view-buttons button { /* ... */ }
```

## Customization

- **Theming**: The library ships with default CSS variables (zinc palette). Override them in your own CSS — the defaults are in a low-priority `@layer big-calendar-base`.
- **Events**: Replace `store.initialize()` call with your own API data.
- **State**: Access `useCalendarStore()` to read/write calendar state (selectedDate, badgeVariant, workingHours, etc.).

### CSS Class Hooks

All major elements have `bc-*` classes for CSS targeting:

| Class | Element |
|-------|---------|
| `.bc-header` | Calendar header |
| `.bc-view-buttons` | View toggle button group |
| `.bc-event-badge` | Month view event badge |
| `.bc-event-block` | Week/day view timed event |
| `.bc-event-card` | Agenda view event card |
| `.bc-event-bullet` | Small color dot (mobile month view) |

Example — restyle event badges:

```css
/* Light mode */
.bc-event-badge {
  background-color: hsl(210 40% 96%);
  border-color: hsl(210 40% 86%);
}

/* Dark mode */
.dark .bc-event-badge {
  background-color: hsl(210 40% 15%);
  border-color: hsl(210 40% 25%);
}
```

## Origin & Attribution

This project is a Vue 3 port of the original [Big Calendar](https://github.com/lramos33/big-calendar) by [Leonardo Ramos](https://github.com/lramos33), licensed under MIT. The original was built with React 18, Next.js 14, and shadcn/ui. All credit for the original design, layout, and UX goes to Leonardo.

<p align="center">
  <b>Buy the OG a coffee</b><br>
  <a href="https://www.buymeacoffee.com/lramos33" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Leonardo A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>
</p>

The Vue 3 port was created by [Steve McNiven-Scott](https://www.sitefinitysteve.com) with the assistance of [Claude Code](https://docs.anthropic.com/en/docs/claude-code) (Opus 4.6) for the React-to-Vue migration. The port preserves the original's design, layout, and functionality while rewriting all components using Vue 3 idioms (Composition API, Pinia, Vue Router, VeeValidate).

A modern React 19 port of this library is also available: [big-calendar-react](https://github.com/sitefinitysteve/big-calendar-react) ([npm](https://www.npmjs.com/package/big-calendar-react)) — same features, built on shadcn/ui (Base UI), Zustand, and react-hook-form.

## License

MIT — See [LICENSE](LICENSE) for details. Original work by [Leonardo Ramos](https://github.com/lramos33), Vue 3 port by [Steve McNiven-Scott](https://www.sitefinitysteve.com).

---

Made with :heart: by [sitefinitysteve](https://www.sitefinitysteve.com)
