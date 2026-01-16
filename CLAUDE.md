# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hotpot Tracker is a team collaboration and project management app with peer reviews, structured discussions, and AI-powered insights. Built with React 19, Fastify, and InstantDB (real-time database).

## Commands

```bash
# Install dependencies
pnpm install

# Development (runs all packages concurrently)
pnpm dev

# Run individual packages
pnpm --filter client dev      # Frontend on :5173
pnpm --filter server dev      # Backend on :8080
pnpm --filter @hotpot/shared dev  # Shared types watch

# Build
pnpm build                    # All packages (shared → client → server)
pnpm build:client             # Frontend + shared only

# Lint & Format
pnpm lint                     # ESLint (client only)
pnpm format                   # Prettier (all files)

# Database schema (requires InstantDB credentials)
pnpm instant:push             # Push schema & permissions to InstantDB
```

## Architecture

**Monorepo structure with pnpm workspaces:**

- `packages/client` - React 19 + Vite frontend with Chakra UI
- `packages/server` - Fastify API with OpenAI integration
- `packages/shared` - InstantDB schema and shared TypeScript types (`@hotpot/shared`)

**Key patterns:**

- All data flows through InstantDB with real-time sync
- Client uses `@instantdb/react` hooks for queries/mutations
- Server uses `@instantdb/admin` for privileged operations
- AI features use Vercel AI SDK (`@ai-sdk/openai` on server, `@ai-sdk/react` on client)

**Data model** (defined in `packages/shared/src/instant.schema.ts`):

- Teams → Boards → Columns → Tasks (Kanban hierarchy)
- Memberships link users to teams
- Issues/Replies provide discussion threads on tasks
- Contributors + Approves handle column-level peer review workflow

**Dev server proxy:** Vite proxies `/api` requests to `localhost:8080`

## Environment Variables

Server requires (copy from `packages/server/.env.example`):

- `INSTANT_APP_ID` - InstantDB app identifier
- `INSTANT_APP_ADMIN_TOKEN` - InstantDB admin token
- `OPENAI_API_KEY` - For AI features

## Tech Stack

| Layer    | Stack                                                                      |
| -------- | -------------------------------------------------------------------------- |
| Frontend | React 19, Vite, Chakra UI, Tiptap (rich text), wouter (routing), react-dnd |
| Backend  | Fastify, Vercel AI SDK, zod                                                |
| Database | InstantDB (real-time)                                                      |
| Tooling  | TypeScript 5.9, ESLint, Prettier, Husky + lint-staged                      |
