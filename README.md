# Career Compass AI

Career Compass AI is a React + TypeScript application that analyzes resume readiness for target roles and provides skill-gap insights and roadmap guidance.

## Project Setup

Prerequisites:

- Node.js 18+
- npm 9+

Install and run locally:

```sh
npm install
npm run dev
```

Build for production:

```sh
npm run build
```

Preview production build:

```sh
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run build:dev` - Build with development mode
- `npm run lint` - Run ESLint
- `npm run test` - Run test suite
- `npm run test:watch` - Run tests in watch mode

## Environment

Frontend `.env` values:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

Supabase Edge Function secrets:

- `OPENAI_API_KEY` (required)
- `OPENAI_MODEL` (optional, defaults to `gpt-4o-mini`)

## Tech Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase
