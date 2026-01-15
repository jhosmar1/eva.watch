# eva.watch - Copilot Instructions

## Project Overview
A luxury web clock PWA with 48 skins (24 digital + 24 analog), world clock support, and embeddable widgets. Built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, and Zustand.

## Architecture

### Core Data Flow
- **State**: Single Zustand store at [lib/store/clockStore.ts](lib/store/clockStore.ts) manages all app state (skins, cities, UI toggles) with localStorage persistence
- **Time**: `useTime(timezone?)` hook uses `requestAnimationFrame` for smooth 60fps clock updates with millisecond precision
- **Skins**: CSS custom properties in [app/globals.css](app/globals.css) define HSL color values; skin class applied to `<html>` element (e.g., `skin-oled-night`)

### Component Structure
```
components/
├── clock/       # Clock rendering (Clock, DigitalClock, AnalogClock, HeroClock, WorldGrid)
├── ui/          # Chrome/UI (SkinsDrawer, CitySearch, EmbedModal, KeyboardShortcuts)
└── ClockApp.tsx # Main orchestrator with wake lock, cursor hiding, skin application
```

### Layout Modes
- **Hero mode**: Large centered clock + horizontal scrollable world clock row below
- **Grid mode**: Responsive grid of clock tiles with drag-and-drop reordering (@dnd-kit)

## Key Patterns

### Skin System
Skins defined in [types/clock.ts](types/clock.ts) as `ClockSkin` objects with HSL colors, fonts, glow/motion levels. Add new skins to `DIGITAL_SKINS` or `ANALOG_SKINS` arrays.
```typescript
// Skin CSS variables pattern (globals.css):
.skin-{id} {
  --clock-background: H S% L%;
  --clock-foreground: H S% L%;
  --clock-accent: H S% L%;
}
```

### Clock Sizes
Responsive sizing via Tailwind classes in `RESPONSIVE_CLASSES` maps: `hero | large | medium | small | mini | grid`. SVG viewBox stays constant; container scales.

### City Management
Cities stored in Zustand with `{ id, name, timezone, country, flag }`. City database at [config/cities.ts](config/cities.ts) includes aliases for fuzzy search (e.g., "nyc" → "New York").

### Embed System
Route at `/embed` accepts query params: `?skin=oled-night&city=tokyo&type=digital&size=medium`. Renders standalone clock widget for iframes.

## Development Commands
```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run lint     # ESLint
```

## Conventions

### File Organization
- Export components via barrel files: `components/clock/index.ts`, `components/ui/index.ts`
- Types consolidated in [types/clock.ts](types/clock.ts)
- Use `@/` path alias for imports

### Styling
- Use `cn()` utility from [lib/utils.ts](lib/utils.ts) for conditional class merging
- Reference skin colors via HSL variables: `hsl(var(--clock-foreground))`
- Framer Motion for animations (drawer slides, transitions)

### State Updates
```typescript
// Access store in components:
const { activeSkin, setSkin, toggleSkinsDrawer } = useClockStore();
```

### Client Components
All interactive components require `"use client"` directive. Layout components in `app/` are server components.

## Adding New Features

### New Skin
1. Add `ClockSkin` object to `DIGITAL_SKINS` or `ANALOG_SKINS` in [types/clock.ts](types/clock.ts)
2. Add corresponding `.skin-{id}` CSS block in [app/globals.css](app/globals.css)

### New City
Add to `CITY_DATABASE` array in [config/cities.ts](config/cities.ts) with valid IANA timezone.

### New Keyboard Shortcut
Add hotkey in [components/ui/KeyboardShortcuts.tsx](components/ui/KeyboardShortcuts.tsx) using `react-hotkeys-hook`.
