# Father Athlete OS

A mobile-first Next.js PWA for a daily 20-minute athlete maintenance routine: streaks, workout timer, week rotation, exercise library, scaling options and installable app shell.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy to Vercel

```bash
vercel login
vercel deploy --prod
```

Or import this folder/repository in Vercel and use the default Next.js settings.

## Supabase

The current MVP stores streaks locally in the browser so the app works immediately without login. For synced accounts, create a Supabase project and apply:

```bash
supabase db push
```

Migration: `supabase/migrations/001_father_athlete_schema.sql`.

Required env vars once auth/sync is added:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

## Product direction

This is not positioned as a generic fitness app. It is an operating system for staying physically capable as a father and entrepreneur: minimum viable daily movement, visible streaks, recovery-safe scaling, and no dependency on the gym.
