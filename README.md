# Hotpot Tracker

Alternative approach to project management with peer reviews, structured discussions, and AI-powered insights.

**[Live Demo](https://hotpot-tracker.app/)** · **[Blog Post (R&D)](https://www.ivklgn.blog/posts/hotpot-tracker/)**

> Built exclusively with [InstantDB](https://www.instantdb.com/) — a real-time database for modern apps.

## Tech Stack

| Layer    | Stack                             |
| -------- | --------------------------------- |
| Frontend | React 19, Vite, Chakra UI, Tiptap |
| Backend  | Fastify, OpenAI SDK               |
| Database | InstantDB                         |
| Monorepo | pnpm workspaces                   |

## Local Development

**Prerequisites:** Node.js 18+, pnpm

```bash
# Clone and install
git clone https://github.com/ivklgn/hotpot-tracker.git
cd hotpot-tracker
pnpm install

# Configure environment
cp packages/server/.env.example packages/server/.env
# Edit .env with your credentials (see below)

# Run development
pnpm dev
```

Client runs on `http://localhost:5173`, server on `http://localhost:8080`.

## Self-Hosted Deployment

### 1. InstantDB Setup

1. Sign up at [instantdb.com](https://www.instantdb.com/)
2. Create a new app in the dashboard
3. Copy your **App ID** and **Admin Token** from app settings

### 2. Environment Variables

| Variable                  | Description                            |
| ------------------------- | -------------------------------------- |
| `INSTANT_APP_ID`          | Your InstantDB app identifier          |
| `INSTANT_APP_ADMIN_TOKEN` | Server-side admin token from InstantDB |
| `OPENAI_API_KEY`          | OpenAI API key for AI features         |

### 3. Deploy to Vercel (Frontend + API)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Add environment variables in Vercel Dashboard → Settings → Environment Variables.

### 4. Alternative: Digital Ocean App Platform

1. Create new App from GitHub repo
2. Configure build command: `pnpm build`
3. Set run command: `pnpm --filter server start`
4. Add environment variables in App Settings
5. Deploy

## Contributors

[![Anton Smirnov](https://avatars.githubusercontent.com/u/73133515?v=4&s=80)](https://github.com/toxanski)

**[Anton Smirnov](https://github.com/toxanski)**

## Contributing

Contributions are welcome! Feel free to open issues and pull requests. Whether it's bug fixes, new features, or documentation improvements — all contributions are appreciated.

## License

MIT
