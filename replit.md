# AI Pay - Autonomous Supply Chain Payments Platform

## Overview

AI Pay is a fintech web application for autonomous supply chain payments. The core workflow is: suppliers upload invoices, AI extracts and verifies invoice data, delivery proof is submitted and AI-verified, and payments are processed. The app features a dashboard with analytics, invoice management (create, list, detail views), AI-powered document extraction, delivery verification, and an AI chat assistant. It also includes simulated NEAR blockchain wallet integration for RWA (Real World Asset) tokenization concepts.

This is a full-stack TypeScript application using a monorepo-style structure with shared code between client and server.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Project Structure
- `client/` — React frontend (SPA)
- `server/` — Express.js backend
- `shared/` — Shared types, schemas, and route definitions used by both client and server
- `server/replit_integrations/` — Pre-built integration modules (auth, chat, audio, image, batch processing)
- `migrations/` — Drizzle ORM database migrations

### Frontend Architecture
- **Framework**: React with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router, not React Router)
- **State Management**: TanStack React Query for server state; no global client state library
- **UI Components**: shadcn/ui (new-york style) with Radix UI primitives, Tailwind CSS for styling
- **Charts**: Recharts for dashboard analytics
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Fonts**: Inter (sans-serif body) + Outfit (display headings)
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend Architecture
- **Framework**: Express.js running on Node.js with TypeScript (via tsx)
- **API Design**: REST API with routes defined in `shared/routes.ts` using Zod schemas for input validation and type safety. Both client and server import from this shared route definition.
- **Authentication**: Replit Auth (OpenID Connect) with Passport.js, session-based auth stored in PostgreSQL via `connect-pg-simple`
- **Build Process**: Custom build script (`script/build.ts`) — Vite builds the client, esbuild bundles the server into a single CJS file for production

### Database
- **Database**: PostgreSQL (required, via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema-to-Zod validation
- **Schema location**: `shared/schema.ts` (main), `shared/models/auth.ts` (users/sessions), `shared/models/chat.ts` (conversations/messages)
- **Key tables**: `users`, `sessions`, `invoices`, `deliveries`, `payments`, `conversations`, `messages`
- **Schema push**: `npm run db:push` (uses drizzle-kit)

### Data Flow Pattern
1. Shared route definitions (`shared/routes.ts`) define paths, methods, Zod input/output schemas
2. Server implements these routes in `server/routes.ts`
3. Client hooks (`client/src/hooks/`) consume APIs using React Query, referencing the same shared route definitions
4. A `buildUrl` helper constructs parameterized URLs from route path templates

### Authentication Flow
- Replit Auth via OpenID Connect (`server/replit_integrations/auth/`)
- Login redirects to `/api/login`, logout to `/api/logout`
- User info available at `/api/auth/user`
- Sessions stored in PostgreSQL `sessions` table
- `req.isAuthenticated()` middleware protects API routes
- Client uses `useAuth()` hook for auth state

### AI Integration Points
- **Invoice Extraction**: AI parses uploaded PDF invoices to extract structured data (invoice number, line items, amounts)
- **Delivery Verification**: AI analyzes proof-of-delivery images for verification
- **Chat Assistant**: Built-in AI assistant using OpenAI API (via Replit AI Integrations)
- **Voice/Audio**: Voice chat capabilities with recording, streaming, and playback
- **Image Generation**: Image generation endpoint using gpt-image-1
- **Batch Processing**: Utility for rate-limited parallel AI processing

### Key Design Decisions
- **Shared route contracts**: The `shared/routes.ts` pattern ensures client and server stay in sync on API shapes without code generation
- **Replit integrations as modules**: Auth, chat, audio, image, and batch features are organized as self-contained modules under `server/replit_integrations/`
- **Storage pattern**: `IStorage` interface in `server/storage.ts` abstracts database operations, extending `IAuthStorage` for auth-specific operations
- **Protected routes**: Client-side `ProtectedRoute` component redirects unauthenticated users; server-side `isAuthenticated` middleware guards API endpoints

## External Dependencies

### Required Services
- **PostgreSQL**: Primary database (must be provisioned, connection via `DATABASE_URL`)
- **Replit Auth**: OpenID Connect authentication (requires `ISSUER_URL`, `REPL_ID`, `SESSION_SECRET`)
- **OpenAI API** (via Replit AI Integrations): Powers chat, voice, image generation, and invoice/delivery AI features (requires `AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`)

### Key NPM Packages
- `drizzle-orm` + `drizzle-kit` — Database ORM and migration tooling
- `express` + `express-session` — HTTP server and session management
- `passport` + `openid-client` — Authentication
- `@tanstack/react-query` — Server state management
- `wouter` — Client-side routing
- `zod` + `drizzle-zod` — Schema validation
- `recharts` — Dashboard charts
- `framer-motion` — Animations
- `date-fns` — Date formatting
- `shadcn/ui` ecosystem (Radix UI, Tailwind CSS, class-variance-authority, clsx, tailwind-merge)

### NEAR Wallet
- Currently simulated/mocked in the frontend (`client/src/components/near-wallet.tsx`) — not connected to a real blockchain