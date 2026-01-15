# Contributing to eva.watch

Thanks for your interest in contributing! This project welcomes contributions of all kinds.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/superzero11/eva.watch.git`
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run linting: `npm run lint`
4. Build to verify: `npm run build`
5. Commit with a descriptive message
6. Push and open a Pull Request

## Adding New Skins

1. Add a `ClockSkin` object to `DIGITAL_SKINS` or `ANALOG_SKINS` in `types/clock.ts`
2. Add corresponding CSS variables in `app/globals.css`:
   ```css
   .skin-your-skin-id {
     --clock-background: H S% L%;
     --clock-foreground: H S% L%;
     --clock-accent: H S% L%;
   }
   ```
3. Test both light and dark environments

## Adding New Cities

Add to `CITY_DATABASE` in `config/cities.ts` with a valid [IANA timezone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

## Code Style

- Use TypeScript strict mode
- Use `cn()` utility for conditional classes
- All interactive components need `"use client"` directive
- Reference colors via CSS variables: `hsl(var(--clock-foreground))`
- Export components through barrel files (`index.ts`)

## Pull Request Guidelines

- Keep PRs focused on a single feature or fix
- Update documentation if adding new features
- Ensure `npm run build` passes
- Add screenshots for visual changes

## Questions?

Open an issue or start a discussion. We're happy to help!
