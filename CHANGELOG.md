# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
