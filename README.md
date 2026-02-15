# Big Calendar: Vue 3

[![Netlify Status](https://api.netlify.com/api/v1/badges/e87caded-ade9-4687-8b76-50ec662acf39/deploy-status)](https://app.netlify.com/projects/big-calendar-vue3/deploys)

A fully-featured calendar component for Vue 3, ported from [lramos33/big-calendar](https://github.com/lramos33/big-calendar) (React/Next.js). Built with shadcn-vue, Tailwind CSS, and date-fns.

**[Live Demo](https://big-calendar-vue3.netlify.app/month-view)**

<p align="center">
  <b>Buy Steve a coffee</b><br>
  <a href="https://buymeacoffee.com/stevewgw" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Steve A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>
</p>
<p align="center">
  <b>Buy the OG a coffee</b><br>
  <a href="https://www.buymeacoffee.com/lramos33" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Leonardo A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>
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
- Responsive design (mobile fallbacks for complex views)

**Intentionally deferred from v1:** Drag-and-drop (the original uses react-dnd). This may be added in a future version.

## Getting Started

### Install from npm

```bash
npm install big-calendar-vue3 date-fns@3
```

> If you already use [shadcn-vue](https://www.shadcn-vue.com/), most peer dependencies are already in your project. The only new one is `date-fns`.

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
| pinia ^3 | Yes |
| date-fns ^3 | No |
| reka-ui ^2 | Yes |
| @internationalized/date ^3 | Yes (via reka-ui) |
| @vueuse/core ^14 | Yes |
| lucide-vue-next >=0.400 | Yes |
| clsx ^2 | Yes |
| tailwind-merge ^3 | Yes |
| class-variance-authority ^0.7 | Yes |
| vue-router ^4 | Optional |
| vee-validate ^4 | Optional (for event dialogs) |
| @vee-validate/zod ^4 | Optional (for event dialogs) |
| zod ^3 | Optional (for event dialogs) |

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
| Dates | date-fns 3 |
| Icons | lucide-vue-next |
| Styling | Tailwind CSS v4 |
| Build | Vite |
| Language | TypeScript (strict) |

## Events

| Event | Payload | When |
|-------|---------|------|
| `@event-created` | `IEvent` | User submits the Add Event dialog |
| `@event-updated` | `IEvent` | User submits the Edit Event dialog |
| `@event-deleted` | `IEvent` | User clicks Delete in the Event Details dialog |
| `@update:view` | `TCalendarView` | User clicks a view button in the header |

All CRUD events fire **after** the local store is updated, so the UI reflects the change immediately. Use these hooks to persist changes to your backend.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model:view` | `TCalendarView` | — | Current calendar view |
| `canAdd` | `boolean` | `true` | Show/hide "Add Event" button and time slot click-to-create |
| `canEdit` | `boolean` | `true` | Show/hide Edit button in event details dialog |
| `canDelete` | `boolean` | `true` | Show/hide Delete button in event details dialog |
| `availableViews` | `TCalendarView[]` | All 5 views | Restrict which view buttons appear in the header |
| `showUserSelect` | `boolean` | `true` | Show/hide the user/resource filter dropdown |

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

The Vue 3 port was created by [Steve McNiven-Scott](https://www.sitefinitysteve.com) with the assistance of [Claude Code](https://docs.anthropic.com/en/docs/claude-code) (Opus 4.6) for the React-to-Vue migration. The port preserves the original's design, layout, and functionality while rewriting all components using Vue 3 idioms (Composition API, Pinia, Vue Router, VeeValidate).

## License

MIT — See [LICENSE](LICENSE) for details. Original work by [Leonardo Ramos](https://github.com/lramos33), Vue 3 port by [Steve McNiven-Scott](https://www.sitefinitysteve.com).

---

Made with :heart: by [sitefinitysteve](https://www.sitefinitysteve.com)
