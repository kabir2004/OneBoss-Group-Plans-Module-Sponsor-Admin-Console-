# OneBoss – Sterling Mutuals

OneBoss is a modern Sterling Mutuals advisor platform built with Vite, React, and TypeScript.  
It provides a streamlined workspace for advisors, featuring:

- Secure, branded sign-in experience with recovery flows  
- Dashboard for portfolio balances, client accounts, trades, and compliance indicators  
- KYP tooling, trade supervision, analytics, and other Sterling Mutuals workflows  
- Light-only interface designed with Tailwind CSS and shadcn UI components  
- Modular page structure with React Router and shared layout components  

## Getting Started

### Prerequisites
- Node.js (v18+) and npm

### Installation
```sh
git clone https://github.com/kabir2004/OneBoss----Sterling-Mutuals.git
cd "OneBoss - Sterling Mutuals"
npm install
```

### Development
```sh
npm run dev
```
The dev server runs on `http://localhost:5173/` (or the next available port).

### Build
```sh
npm run build
```
Production assets are emitted to the `dist/` directory.

### Preview Production Build
```sh
npm run preview
```

## Project Structure
- `src/pages` – Application routes (dashboard, KYP, analytics, etc.)
- `src/components` – Reusable UI and layout components
- `src/data` – Sample data for dashboards and KYP flows
- `src/context` – Auth provider for global sign-out
- `public` – Static assets

## Deployment
The project builds to a static bundle and can be hosted on any CDN or static host:

1. Run `npm run build`.
2. Upload the `dist/` directory to your hosting provider (Vercel, Netlify, Cloudflare Pages, etc.).
3. Configure the site root to serve from `dist/`.

For Git-based platforms (e.g., Vercel/Netlify), point the build command to `npm run build` and the output directory to `dist/`.

## Tech Stack
- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui component library
- lucide-react icon library
- next-themes (ThemeProvider)
- TanStack Query

## License
This project is proprietary to Sterling Mutuals. All rights reserved.
