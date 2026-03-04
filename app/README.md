# Superteam Academy

A gamified, multilingual learning platform for Solana developers. Built with **Next.js 15**, **Drizzle ORM**, **Solana on-chain programs**, and **next-intl** for i18n across 5 locales.

## Features

- **Course Management** — CMS-driven courses, modules, and lessons with Markdown content
- **On-Chain Enrollment** — Wallet-signed Anchor transactions for course enrollment
- **XP & Leveling** — Earn XP from lesson completion and challenges; level up automatically
- **Streak Tracking** — Daily activity streaks with 7-day calendar visualization and milestone markers
- **Challenges** — Code challenges with difficulty levels and XP rewards
- **Achievements** — Configurable achievements with supply caps and on-chain minting
- **Credential NFTs** — Solana NFTs as verifiable course completion certificates
- **Leaderboard** — Global XP leaderboard with ranking
- **Admin Panel** — Full user management, content administration, and audit logging
- **Internationalization** — 5 locales: English, Spanish, Portuguese, Portuguese (BR), Hindi
- **Dark/Light Theme** — System-aware theming via shadcn/ui

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Database | PostgreSQL + Drizzle ORM |
| Auth | Custom session-based (email + OAuth + wallet) |
| Blockchain | Solana (Anchor programs) |
| Styling | Tailwind CSS + shadcn/ui |
| i18n | next-intl (5 locales) |
| State | Zustand + TanStack Query |
| Editor | Monaco (code challenges) |

## Getting Started

```bash
# 1. Clone the repository
git clone <repo-url>
cd superteam-academy/app

# 2. Install dependencies
bun install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in DATABASE_URL, NEXT_PUBLIC_SOLANA_RPC, OAuth keys, etc.

# 4. Run database migrations
bunx drizzle-kit push

# 5. Start dev server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_SOLANA_RPC` | Solana RPC endpoint (devnet/mainnet) |
| `SESSION_SECRET` | Session encryption key |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth |
| `ANCHOR_PROGRAM_ID` | Deployed Anchor program public key |

## Project Structure

```
app/
├── src/
│   ├── app/
│   │   ├── [locale]/(web)/     # Public pages (courses, challenges, leaderboard)
│   │   ├── [locale]/(user)/    # Authenticated pages (dashboard, profile, certificates)
│   │   ├── [locale]/(admin)/   # Admin panel
│   │   └── api/                # API routes
│   ├── components/             # Reusable UI components
│   ├── lib/
│   │   ├── db/                 # Drizzle schema & connection
│   │   ├── services/           # Business logic (LearningProgressService, etc.)
│   │   └── api/                # API client hooks (useAPIQuery, useAPIMutation)
│   ├── store/                  # Zustand stores
│   └── i18n/                   # Internationalization config
├── messages/                   # Locale JSON files (en, es, pt, pt-BR, hi)
└── drizzle/                    # Migration files
```

## Scripts

```bash
bun run dev          # Start development server
bun run build        # Production build
bun run lint         # ESLint
bunx drizzle-kit push # Push schema changes to database
```

## License

MIT
