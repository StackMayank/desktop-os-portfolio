# Portfolio OS

Interactive macOS-style portfolio built with React, TanStack Start, Framer Motion, and GSAP. Features draggable windows, a dock, desktop widgets, and a Finder-style project browser.

## Requirements

- Node.js 20+
- npm 10+

## Scripts

From this directory (`desktop-os-portfolio/`):

```bash
npm install
npm run dev          # local development
npm run build        # production build (optimizes wallpaper first)
npm run preview      # preview production build
npm run lint         # ESLint
npm run format       # Prettier
```

## Project structure

```
src/
  apps/           # Window applications (lazy-loaded)
  components/     # Shell UI (desktop, dock, windows, intro)
  context/        # React context providers
  hooks/          # Shared hooks (drag, resize, layout, clock)
  lib/            # Content, routing helpers, wallpaper, APIs
  routes/         # TanStack Router pages
  store/          # Zustand window/desktop state
  widgets/        # Desktop widget panels
  assets/         # Images, PDF, wallpaper sources
scripts/          # Build-time wallpaper optimization
```

## Deployment

Production builds use Vite with the Cloudflare adapter (`wrangler.jsonc`). Run `npm run build` and deploy the output per your Cloudflare Pages / Workers setup.
