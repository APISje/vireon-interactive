# Vireon Interactive — Script Protection & Licensing System

## Overview

Full-stack Roblox script protection and licensing system. Features an admin dashboard for managing premium keys and users, a user dashboard for uploading and protecting scripts, and a special protection endpoint that detects whether a request comes from a browser or executor.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React 18 + Vite + Tailwind CSS v4 + Framer Motion (dark neon cyberpunk theme)
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/          # Express API server
│   └── vireon/              # React frontend (preview path: /)
├── lib/
│   ├── api-spec/            # OpenAPI spec + Orval codegen config
│   ├── api-client-react/    # Generated React Query hooks
│   ├── api-zod/             # Generated Zod schemas
│   └── db/                  # Drizzle ORM schema + DB connection
└── ...
```

## Features

### Landing Page (/)
- Dark neon cyberpunk hero section with Vireon Interactive branding
- AI-generated hero image and logo
- "INITIATE PREMIUM ACCESS" button → opens WhatsApp (+62 813-3003-2894) with pre-filled message
- Feature cards: HWID Lock, Key System, Script Protection, Anti-Tamper

### Admin Dashboard (/admin, /admin/dashboard)
- **Login**: Single master code: `APIP`
- **Users tab**: View all users, ban/unban by ID, see status, last login, HWID, script count
- **Keys tab**: Generate premium keys with duration 1-1095 days (up to 3 years), revoke keys
- **Scripts tab**: Monitor all protected scripts and which user owns them
- **Dev Scripts tab**: Upload and store raw .lua development scripts

### User Premium Dashboard (/dashboard, /dashboard/home)
- **Login**: Enter premium key (e.g., `VIREON-XXXX-XXXX-XXXX`)
- **Script upload**: Paste .lua script content + name
- **Output**: Generates loadstring code: `script_key="KEY"; loadstring(game:HttpGet("URL"))()`
- **Script list**: All protected scripts with copy button for loadstring

### Script Protection Endpoint (GET /api/get)
- **Browser detection**: If accessed from a browser (User-Agent check), shows neon animated "Vireon Interactive Protected" page with particle effects and glitch animations
- **Executor access**: Validates key, checks HWID lock, checks expiry, returns script content
- **HWID locking**: First time key is used, HWID is locked. Subsequent uses from different HWIDs are rejected
- **Expiry notification**: Returns Roblox `StarterGui:SetCore("SendNotification")` format for expired/banned/invalid keys

## Database Schema

### `premium_keys` table
- id, key, username, expiresAt, createdAt, isActive, isBanned, hwid, lastLogin, notes, durationDays

### `protected_scripts` table
- id, name, content, userId, username, createdAt

### `dev_scripts` table
- id, name, content, createdAt

## Security Model

- Admin: localStorage key `vireon_admin_token` = `APIP_ADMIN_SESSION`
- Users: localStorage key `vireon_user_key` = their premium key
- HWID locking: First executor to use a key locks it to that HWID
- Browser detection: UA string analysis (no browser signals + no executor signals → serve page)

## API Routes

- `POST /api/admin/login` — admin login with code `APIP`
- `GET /api/admin/users` — list all users
- `POST /api/admin/users/:id/ban` — ban user
- `POST /api/admin/users/:id/unban` — unban user
- `GET /api/admin/keys` — list all keys
- `POST /api/admin/keys` — generate new key
- `POST /api/admin/keys/:id/revoke` — revoke key
- `GET /api/admin/scripts` — list all protected scripts
- `GET /api/admin/dev-scripts` — list dev scripts
- `POST /api/admin/dev-scripts` — upload dev script
- `POST /api/user/login` — user login with key
- `GET /api/user/scripts` — list user's scripts (header: x-user-key)
- `POST /api/user/scripts` — protect new script (header: x-user-key)
- `DELETE /api/user/scripts/:id` — delete script (header: x-user-key)
- `GET /api/get?key=&script_id=&hwid=` — serve protected script or browser protection page
