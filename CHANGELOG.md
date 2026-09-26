# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.1] - 2026-09-26

Parity with big-calendar-react 1.3.0 + 1.3.1: one packaging fix, one validation fix, and four
display/interaction fixes. No prop removals and no breaking changes. (There is no separate
1.3.0 release of the Vue port; both sets of changes ship here so the version numbers line up.)

### Fixed — packaging

- **`vee-validate`, `@vee-validate/zod` and `zod` are no longer marked optional.** They were
  declared in `peerDependenciesMeta` as `optional: true`, but `BigCalendar` imports
  `AddEventDialog` / `EditEventDialog` at the top of `CalendarContainer.vue`. Those imports are
  static, so a bundler resolves them whether or not the dialogs render: setting `can-add` /
  `can-edit` to `false` skips the render, not the import. All three are now plain required peers.
  zod stays on `^3` because `@vee-validate/zod` 4.x pins `zod ^3.24`.
- **`createEventSchema` uses `message` instead of `required_error`.** zod 4 silently ignores
  `required_error` and replaces custom/localized validation copy with its own English text;
  `message` is honoured by zod 3 and zod 4 alike. No change in output on zod 3.

### Changed — peer ranges

- **`pinia` now accepts `^3 || ^4`** and **`@vueuse/core` accepts `^14 || ^15`**, so apps on
  the newer majors no longer hit peer conflicts. Verified with the library build, demo build
  and full test suite on pinia 4, @vueuse/core 15 and lucide-vue-next 1.0 (already covered by
  the existing `>=0.400.0` range).

### Fixed — display & interaction

- **The week view header now stays pinned while you scroll.** The calendar root used
  `overflow-hidden`, which makes it a scroll container, so the header's `sticky top-0` stuck to
  the root instead of the page; a plain wrapper around the header was also acting as its
  containing block. The root now uses `overflow-clip` (same rounded clipping, not a scroll
  container) and the wrapper is `display: contents`.
- **Clicking the already-selected event now clears the selection.** `update:selectedEventId`
  emits `null` when the selected event is clicked again, so `v-model:selected-event-id` toggles off.
- **A selected slot-rendered event block now sits above its neighbours.** The `z-10` applied to a
  selected block had no effect on a static box; the block is now `relative`.
- **`#event` / `#month-event` slots in the week and day all-day strips receive the right `view`.**
  The badge those strips reuse always reported `view: 'month'`; it now reports `'week'` or `'day'`.

### Upgrading

If you already install `vee-validate`, `@vee-validate/zod` and `zod`, no action is needed;
otherwise your package manager now resolves them as required peers. If your app worked around
the week header by passing `:class-names="{ root: '… overflow-clip' }"`, you can drop that
override. Hosts using `v-model:selected-event-id` should expect `null` on a second click.

## [1.2.1] - 2026-08-17

Bug fixes plus one additive prop. Existing markup is unchanged except where the previous
output was wrong (agenda heading date, stale timeline, all-day strip order/casing).

### Fixed

- **Agenda day headings** were built with `new Date('yyyy-MM-dd')`, which parses as UTC and
  rendered the previous day in every timezone west of Greenwich. Now uses `parseISO`. This also
  fixes agenda groups appearing to spill into the neighbouring month.
- **Current-time line** no longer renders on a week that does not contain today, or on a day
  view showing anything other than today.
- **Month view below `lg`** rendered event bullets with no click handler, leaving events
  unreachable on small screens. Bullets are now wrapped in a `role="button"` / `data-event-id`
  element that fires the details handler on click or Enter/Space. They additionally carry
  `data-event-bullet` so `[data-event-id]` queries can exclude them.
- **Agenda day headings** use `first-letter:uppercase` instead of `capitalize`, which was
  uppercasing every word of a long date.
- **Week all-day strip** now renders BELOW the day-name header row (previously above it), and
  the header row is sticky.

### Added

- **`allDayMaxRows`** — caps the week all-day strip at N badge rows; beyond that the strip
  scrolls internally instead of pushing the grid down. Unset keeps the uncapped behaviour.
- The all-day strip gains a leading gutter label driven by the existing `allDay` label key.

## [1.2.0] - 2026-08-17

Locale-aware date/time formatting plus an additive customization API. Every new prop, slot and
emit is optional; with none of them set the rendered markup and classes are unchanged from 1.1.0.

### Added — locale-aware date & time formatting

- **`src/calendar/date-format.ts`** — a framework-agnostic module that reads the *format patterns*
  from the date-fns locale (`locale.formatLong`, i.e. CLDR data) instead of hardcoding
  `'MMM d, yyyy'` / `'h:mm a'` / `'EEEE, MMMM d, yyyy'` / `'hh a'` at every call site. Passing
  `date-locale` now changes field ORDER and clock convention, not just the month/day words:
  a French calendar renders `1 déc. 2026` and `14:30` rather than `déc. 1, 2026` and `2:30 PM`.
- New exports: `datePattern`, `longDatePattern`, `timePattern`, `hourPattern`, `dateTimePattern`,
  `is24HourLocale`, `formatDate`, `formatLongDate`, `formatTime`, `formatHour`, `formatDateTime`.
- The hour axis in the week/day views is derived from the locale's own clock, so it always agrees
  with the event times printed beside it (`14` for a 24-hour locale, `02 PM` for a 12-hour one).
- The Add/Edit dialogs follow the locale too: `SingleDayPicker` gained a `locale` prop (trigger
  label + popover month/day names), and the `TimeInput` fields drop the AM/PM control for a
  24-hour locale.
- Callers passing no locale get the previously-hardcoded patterns verbatim, so output is unchanged.

### Added — customization API

- **Event slots** — `#event`, `#month-event`, `#agenda-event` scoped slots on `<BigCalendar>`.
  Each receives `{ event, view, selected, badgeVariant }`. `#month-event` / `#agenda-event` fall
  back to `#event`. Omitting a slot leaves the stock chip markup untouched.
- **Header control** — the `hide-header` prop and the `#header` slot, for bringing your own
  toolbar. `hide-header` wins when both are given.
- **Controlled selection** — the `selected-event-id` prop plus `@update:selectedEventId`, so
  `v-model:selected-event-id` round-trips. The library holds no selection state; the selected chip
  gets a `data-selected` attribute. A selected chip rendered through the `#event` slot switches
  from `height` to `min-height` (plus `z-10`) so it can expand in place.
- **Sizing** — `hour-height` (default 96), `height`, `auto-height` for the week/day grids.
- **Month density** — `max-events-per-day-cell` (default 3) and `@show-more`, which turns the
  "+N more" label into a real button emitting `yyyy-MM-dd`.
- **Styling hooks** — `class-names` (`root`, `header`, `dayCell`, `hourRow`, `eventBlock`,
  `timeline`) and `day-cell-class-name(date)`.
- **Open color system** — `TEventColor` is now `TLegacyEventColor | (string & {})`. The seven
  built-in names keep their Tailwind class maps; any other CSS color renders with the
  `.bc-event-custom-color` class and an inline `--bc-event-color` variable, derived with
  `color-mix()`. The rules ship in `dist/style.css` and are also documented in the README for
  consumers who do not import it.
- **`IEvent<TMeta>`** gains an optional `meta` payload, carried through untouched.
- New exports: `CALENDAR_CUSTOMIZATION_KEY`, `useCalendarCustomization`, `isLegacyColor`,
  `LEGACY_EVENT_COLORS`, `DEFAULT_CUSTOMIZATION`, and the types `TEventRenderer`,
  `TEventRenderView`, `IEventSlotProps`, `ICalendarClassNames`, `ICalendarCustomization`,
  `TLegacyEventColor`.
- Test suite (vitest + @vue/test-utils + jsdom): `npm run test`.

### Changed

- `calculateMonthEventPositions` and `useEventPositioning` take an optional trailing `maxVisible`
  argument (default 3), so existing calls are unaffected. `useEventPositioning` accepts either a
  plain number or a `Ref<number>`.
- `useCalendarCustomization()` returns a `ComputedRef<ICalendarCustomization>` and falls back to
  `DEFAULT_CUSTOMIZATION` when a view is used standalone with no `<BigCalendar>` above it, so the
  individually-exported views keep their v1.1.0 behavior.

## [1.1.0] - 2026-07-09

### Added — "events-only" integration API

`BigCalendar` now surfaces user interactions as plain events so host apps can
drive their own dialogs, routing, or API calls instead of the built-in dialogs.

- **`@day-click`** — emitted when a day is clicked in the month/year views.
  Payload is the local calendar date as a **`yyyy-MM-dd` string**, built with
  date-fns `format` so it is never shifted by UTC conversion.
- **`@event-click`** — emitted when an event chip is clicked in any view.
  Payload is the full `IEvent` (use `event.id` to open your own editor).
- **`@day-context-menu`** / **`@event-context-menu`** — emitted on right-click.
  Payload is `{ date | event, x, y, originalEvent }` (`x`/`y` are the cursor
  position for placing your own menu). The native browser context menu is
  suppressed **only** when a corresponding listener is attached.
- **`navigateOnDayClick`** prop (default `true`) — set `false` so a day click
  only emits `@day-click` instead of also switching to the day view.
- **`openDetailsOnEventClick`** prop (default `true`) — set `false` so an event
  click only emits `@event-click` instead of opening the built-in details dialog.
- `data-date` attributes on day cells and `data-event-id` on event chips, for
  targeting/automation.

Setting both new props to `false` yields a fully headless, events-only calendar
that never opens a built-in modal. Library prop defaults are unchanged, so
existing integrations behave exactly as before.

### Added — right-click command menu

- **`eventCommands`** / **`dayCommands`** props — supply `ICalendarCommand[]` and
  `BigCalendar` renders a built-in reka-ui context menu on right-click, emitting
  **`@command`** (`{ commandId, event?, date? }`) when an item is chosen. The
  library performs no action itself.
- **Stock Edit/Delete** via **`showEditCommand`** / **`showDeleteCommand`**, which
  accept `true` (all views) or a `TCalendarView[]` to scope them. They only emit
  `@command` (ids `'edit'` / `'delete'`) — the library never edits or deletes.
- **Per-view scoping** — each `ICalendarCommand` accepts an optional
  `views?: TCalendarView[]`, so one command list can be scoped per view without
  duplicating definitions. The menu opens only when a command applies to the
  right-clicked target and current view; otherwise the native menu is untouched.
- New exported types: **`ICalendarCommand`**, **`ICalendarCommandSelect`**.
- The command menu supersedes the raw `@day-context-menu` / `@event-context-menu`
  events per target: those still fire (for drawing your own menu) only when no
  commands are configured for that target.

### Changed — toolchain upgrade

- **Vite 7-era transitive → Vite 8** (`vite` is now a direct devDependency; it
  was previously only resolved transitively).
- Vue `3.5.39`, `@vitejs/plugin-vue` `6`, `vue-tsc` `3.3`, `vite-plugin-dts` `5`,
  Tailwind CSS `4.3`, `reka-ui` `2.10`, `@vueuse/core` `14.3`, `date-fns` `4.4`,
  `tailwind-merge` `3.6`, `@types/node` `26`.
- Library type declarations are now emitted as a per-file tree
  (`rollupTypes: false`) rather than a single bundled file; this avoids pulling
  in `@microsoft/api-extractor` and its (build-time-only) advisories.
  `dist/index.d.ts` still re-exports the full public API.

### Security

- `npm audit` reduced from **17 advisories (7 high, 9 moderate, 1 low)** to
  **0**, primarily by upgrading the build toolchain (Vite, esbuild, rollup,
  postcss) and dropping the `@microsoft/api-extractor` dependency chain.

### Notes

- `lucide-vue-next` is pinned to `0.577.x`. The package has been deprecated
  upstream in favor of `@lucide/vue`; all installed versions still ship the full
  icon set. Migrating to `@lucide/vue` is a planned follow-up (it changes the
  icon peer dependency, so it is deferred to avoid breaking consumers).
