# Big Calendar — Vue 3

A fully-featured calendar component for Vue 3, ported from [lramos33/big-calendar](https://github.com/lramos33/big-calendar) (React/Next.js). Built with shadcn-vue, Tailwind CSS, and date-fns.

## Origin & Attribution

This project is a Vue 3 port of the original [Big Calendar](https://github.com/lramos33/big-calendar) by [Leonardo Ramos](https://github.com/lramos33), licensed under MIT. The original was built with React 18, Next.js 14, and shadcn/ui. All credit for the original design, layout, and UX goes to Leonardo.

The Vue 3 port was created by [Steve McNiven-Scott](https://www.sitefinitysteve.com) with the assistance of [Claude Code](https://docs.anthropic.com/en/docs/claude-code) (Opus 4.6) for the React-to-Vue migration. The port preserves the original's design, layout, and functionality while rewriting all components using Vue 3 idioms (Composition API, Pinia, Vue Router, VeeValidate).

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

## Customization

- **Theming**: The library ships with default CSS variables (zinc palette). Override them in your own CSS — the defaults are in a low-priority `@layer big-calendar-base`.
- **Events**: Replace `store.initialize()` call with your own API data.
- **State**: Access `useCalendarStore()` to read/write calendar state (selectedDate, badgeVariant, workingHours, etc.).

## License

MIT — See [LICENSE](LICENSE) for details. Original work by [Leonardo Ramos](https://github.com/lramos33), Vue 3 port by [Steve McNiven-Scott](https://www.sitefinitysteve.com).

---

Made with :heart: by [sitefinitysteve](https://www.sitefinitysteve.com)
