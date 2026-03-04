# Architecture

## Overview

Superteam Academy follows a **layered architecture** within a Next.js 16 App Router monolith.

```
┌──────────────────────────────────────┐
│            Presentation              │
│  Pages (RSC) + Client Components     │
│  Zustand stores · TanStack Query     │
├──────────────────────────────────────┤
│            API Layer                 │
│  Route Handlers (app/api/*)          │
│  Zod validators · session guards     │
├──────────────────────────────────────┤
│           Service Layer              │
│  LearningProgressService (facade)    │
│  streak-service · xp-service         │
│  achievement-service · academy-client│
├──────────────────────────────────────┤
│            Data Layer                │
│  Drizzle ORM · PostgreSQL            │
│  Solana on-chain (Anchor)            │
└──────────────────────────────────────┘
```

## Key Patterns

### Service Facade

`LearningProgressService` is the central facade for all learning-related operations. It coordinates:

- Lesson completion → XP award → streak update → achievement evaluation
- Course progress queries
- This prevents API routes from doing direct DB mutations inconsistently.

### On-Chain Integration

Enrollment uses a 2-step flow:

1. **Prepare** (`/api/enrollment/sync`) — Backend builds an unsigned Anchor `enroll` instruction and returns it as base64
2. **Confirm** (`/api/enrollment/sync/confirm`) — Frontend signs + sends the transaction, then backend verifies it on-chain and mirrors to DB

Credential NFTs are parsed from the user's wallet via `academy-client.ts`.

### Authentication

Custom session-based auth with:
- Email/password registration
- Google and GitHub OAuth
- Solana wallet linking

Sessions are encrypted cookies. All API routes check `get_user_from_session()`.

### State Management

- **Zustand** for client-side state (auth, editor, theme)
- **TanStack Query** for server state (API data fetching, caching, invalidation)

### Internationalization

- `next-intl` with `[locale]` dynamic segment
- 5 locales: `en`, `es`, `pt`, `pt-BR`, `hi`
- All user-facing strings live in `messages/*.json`

### Admin Panel

Separate route group `[locale]/(admin)/` with role-based guards. Features:
- User management (role changes, soft delete)
- Challenge CRUD
- Achievement management with on-chain minting
- Leaderboard refresh controls
- Audit logging with rich summaries

## Database

PostgreSQL via Drizzle ORM. Key tables:

| Table | Purpose |
|-------|---------|
| `users` | Core user data |
| `user_sessions` | Session management |
| `enrollments` | Course enrollments |
| `lesson_completions` | Progress tracking |
| `user_xp` | XP totals and levels |
| `user_streaks` | Daily streak data |
| `achievements` | Achievement definitions |
| `user_achievements` | Award records |
| `challenges` | Code challenges |
| `challenge_submissions` | Submission history |
| `leaderboard_entries` | Materialized leaderboard |
| `admin_audit_logs` | Admin action history |
