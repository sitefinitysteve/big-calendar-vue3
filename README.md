# Big Calendar — Vue 3

A fully-featured calendar component for Vue 3, ported from [lramos33/big-calendar](https://github.com/lramos33/big-calendar) (React/Next.js). Built with shadcn-vue, Tailwind CSS, and date-fns.

This is a **clone-and-customize** project — copy the calendar components into your own Vue 3 project and adapt them to your needs.

## Origin & Attribution

This project is a Vue 3 port of the original [Big Calendar](https://github.com/lramos33/big-calendar) by [Leonardo Ramos](https://github.com/lramos33), licensed under MIT. The original was built with React 18, Next.js 14, and shadcn/ui. All credit for the original design, layout, and UX goes to Leonardo.

The Vue 3 port was created by [Steve McNiven-Scott](https://www.sitefinitysteve.com) with the assistance of [Claude Code](https://docs.anthropic.com/en/docs/claude-code) (Opus 4.6) for the React-to-Vue migration. The port preserves the original's design, layout, and functionality while rewriting all components using Vue 3 idioms (Composition API, Pinia, Vue Router, VeeValidate).

### Feature Parity (as of February 14, 2026)

This port targets feature parity with the original React project at commit level as of the date above. The following features from the original are included:

- 5 calendar views: Month, Week, Day, Year, Agenda
- Event creation and editing dialogs with form validation
- User/responsible filtering
- Working hours customization (per-day with visual disabled-hour pattern)
- Visible hours adjustment (auto-expands for out-of-range events)
- Badge variant selection (colored, dot, mixed)
- Dark mode with localStorage persistence
- Live current-time indicator in week/day views
- Multi-day event spanning across cells
- Responsive design (mobile fallbacks for complex views)
- Mock data with 80+ generated events

**Intentionally deferred from v1:** Drag-and-drop (the original uses react-dnd). This may be added in a future version.

### Divergence & New Features

This project may diverge from the original to add new features, improve UX, or take advantage of Vue-specific patterns. Changes beyond the original scope will be documented here as they occur.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Vue 3.5+ (Composition API, `<script setup>`) |
| State | Pinia |
| Routing | Vue Router 4 |
| UI Components | shadcn-vue (Reka UI primitives) |
| Forms | VeeValidate + zod |
| Dates | date-fns 3 |
| Icons | lucide-vue-next |
| Styling | Tailwind CSS v4 |
| Build | Vite |
| Language | TypeScript (strict) |

## Getting Started

```bash
# Clone the repository
git clone <repo-url> big-calendar-vue3
cd big-calendar-vue3

# Install dependencies
npm install

# Start development server
npm run dev

# Type-check
npx vue-tsc --noEmit

# Build for production
npm run build
```

The dev server runs at `http://localhost:5173` by default. Navigate to any view:
- `/month-view` (default)
- `/week-view`
- `/day-view`
- `/year-view`
- `/agenda-view`

## Project Structure

```
src/
├── calendar/                    # Core calendar domain
│   ├── components/              # Calendar-specific Vue components
│   │   ├── header/              # Navigation, view switcher, user filter
│   │   ├── month-view/          # Month grid with event badges
│   │   ├── week-view/           # Time grid with event blocks
│   │   ├── day-view/            # Single day with sidebar
│   │   ├── year-view/           # 12-month mini-grid overview
│   │   ├── agenda-view/         # Chronological event list
│   │   ├── dialogs/             # Event details, edit, add forms
│   │   └── settings/            # Badge variant, hours config
│   ├── composables/             # Vue composables for calendar logic
│   ├── types.ts                 # Type aliases
│   ├── interfaces.ts            # Data interfaces
│   ├── helpers.ts               # Pure utility functions
│   ├── schemas.ts               # Zod validation schemas
│   └── mocks.ts                 # Demo mock data
├── components/ui/               # shadcn-vue components
├── stores/calendar.ts           # Pinia store
├── pages/                       # Route page components
├── layouts/                     # Layout wrapper
└── router/                      # Vue Router config
```

## Customization

This project follows the shadcn-vue philosophy — you own the code. To customize:

1. **Theming**: Edit CSS variables in `src/assets/styles/globals.css`
2. **Events**: Replace mock data in `CalendarLayout.vue` with your API calls
3. **Components**: Modify any component in `src/calendar/components/`
4. **Validation**: Update schemas in `src/calendar/schemas.ts`
5. **State**: Extend the Pinia store in `src/stores/calendar.ts`

## License

MIT — See [LICENSE](LICENSE) for details. Original work by [Leonardo Ramos](https://github.com/lramos33), Vue 3 port by [Steve McNiven-Scott](https://www.sitefinitysteve.com).

---

Made with :heart: by [sitefinitysteve](https://www.sitefinitysteve.com)
