# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Start dev server (Vite)
npm run build        # Type-check + production build
npm run type-check   # TypeScript check only (tsc --noEmit)
npm run lint         # ESLint
npm run format       # Prettier format all files
npm run preview      # Preview production build locally
```

### InstantDB Schema Management

```bash
npm run instant:login   # Authenticate with InstantDB CLI
npm run instant:push    # Push schema and permissions to InstantDB
npm run instant:pull    # Pull schema from InstantDB
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:
- `VITE_INSTANT_APP_ID` - InstantDB application ID
- `INSTANT_CLI_AUTH_TOKEN` - InstantDB CLI auth token
- `VITE_SENTRY_DSN` - Sentry DSN for error tracking
- `SENTRY_AUTH_TOKEN` - Sentry auth token for sourcemap uploads
- `VITE_BACKEND_API_URL` - Backend API URL (empty for local dev, proxied to localhost:8080)

## Architecture Overview

### Tech Stack
- **React 19** with Vite 7
- **InstantDB** (`@instantdb/react`) - Real-time database with offline support
- **Chakra UI v3** - Component library with `@emotion/react`
- **TipTap v3** - Rich text editor
- **wouter** - Lightweight routing
- **react-dnd** - Drag and drop for kanban boards
- **Sentry** - Error tracking and performance monitoring

### Data Layer (InstantDB)

The app uses InstantDB as the primary database. Key files:
- `instant.schema.ts` - Database schema definition with entities and links
- `instant.perms.ts` - Permission rules
- `src/instantdb.ts` - DB client initialization

**Core entities**: teams, memberships, boards, columns, tasks, statuses, contributors, approves, issues, replies, smartParams, events, invites

All database operations use `db.transact()` for mutations and `db.useQuery()` for reactive queries.

### Transaction Pattern

Database mutations should use `runTransaction()` from `src/core/instantdb-transaction.ts`:
```typescript
runTransaction(
  () => db.transact([...]),  // The mutation
  (result) => { /* success */ },
  (error) => { /* error */ }
);
```

### Application Structure

```
src/
├── components/         # Shared UI components
│   ├── ui/            # Chakra UI wrapper components (provider, dialog, button, etc.)
│   └── Editor/        # TipTap rich text editor
├── features/          # Feature modules (domain logic + UI)
│   ├── account/       # User account context and layout
│   ├── auth/          # OTP authentication flows
│   ├── board/         # Kanban board (Board, Column, CreateBoardDialog)
│   ├── task/          # Task management
│   ├── issue/         # Task issues/comments
│   ├── team/          # Team management
│   ├── smart-params/  # Custom parameters for boards/tasks
│   ├── events/        # Activity event system
│   └── web-storage/   # localStorage utilities
├── pages/             # Route pages
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
└── core/              # Core infrastructure (errors, transactions)
```

### Authentication Flow

Uses InstantDB's built-in OTP (email code) authentication via `db.useAuth()` and `db.auth.sendMagicCode()` / `db.auth.signInWithMagicCode()`.

### Account Context

`AccountContext` (`src/features/account/AccountContext.tsx`) provides `currentTeamId` across the app. Access via `useAccount()` hook.

### Routing

Uses wouter for client-side routing. Routes are defined in `App.tsx`:
- `/` - Landing page
- `/auth` - Authentication
- `/workspace` - Team workspace
- `/boards` - Board list
- `/board/:boardId` - Single board view
- `/task/:taskId` - Task detail view
- `/search` - Search page
- `/settings` - User settings

### Path Aliases

TSConfig path alias: `@/*` maps to `src/*`
