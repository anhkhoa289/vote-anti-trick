# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Infrastructure voting system built with Next.js 16 App Router, PostgreSQL, and Prisma ORM. Users can vote on infrastructure technologies and add new ones.

## Common Development Commands

**IMPORTANT**: This project uses **yarn** as the package manager, not npm.

### Setup
```bash
# Install dependencies
yarn install

# Setup database with Docker
docker-compose up -d

# Setup environment (if .env doesn't exist)
cp .env.example .env

# Run migrations and generate Prisma client
yarn prisma migrate dev --name init
yarn prisma generate

# Or use the makefile shortcuts
make prisma-generate  # Generate Prisma client
make prisma-migrate   # Run migrations with --name init
```

### Development
```bash
# Start dev server (http://localhost:3000)
yarn dev
# or
make dev

# Run linting
yarn lint

# Build for production
yarn build

# Database GUI (http://localhost:5555)
yarn prisma studio
```

### Database Management
```bash
# Create migration after schema changes
yarn prisma migrate dev --name <migration_name>

# Generate Prisma client (required after schema changes or fresh install)
yarn prisma generate

# Reset database (WARNING: deletes all data)
yarn prisma migrate reset

# Deploy migrations to production
yarn prisma migrate deploy
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **Database**: PostgreSQL via Docker (port 6543)
- **ORM**: Prisma 7 (uses adapter pattern with `@prisma/adapter-pg`)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4

### Prisma 7 Configuration

**CRITICAL**: This project uses Prisma 7 with a custom client generation setup:

1. **Schema file** (`prisma/schema.prisma`):
   - Generator provider: `"prisma-client"` (Prisma 7 style, not `"prisma-client-js"`)
   - Generator output: `prisma/generated` (custom location, not `node_modules`)
   - The datasource block does NOT contain a `url` property
2. **Config file** (`prisma.config.ts` at project root): Defines `datasourceUrl` from environment variables
3. **Client initialization** (`lib/prisma.ts`):
   - Imports from `../prisma/generated/client` (not `@prisma/client`)
   - Uses the `@prisma/adapter-pg` adapter pattern with connection string from environment
   - Simplified singleton pattern using global variable

When working with Prisma:
- Always run `yarn prisma generate` after schema changes or fresh install
- The generated client is located at `prisma/generated/`, not in `node_modules`
- Import Prisma client from `../prisma/generated/client`, not `@prisma/client`
- The client is initialized with a database adapter using `PrismaPg`
- Required packages: `@prisma/client`, `@prisma/adapter-pg`, `pg`, `@types/pg`, `dotenv`

### Directory Structure
- `app/` - Next.js App Router pages and API routes
  - `app/api/infrastructures/` - REST API for infrastructures and votes
- `components/` - React client components (all use 'use client')
- `lib/prisma.ts` - Prisma client singleton (prevents hot reload issues)
- `prisma/` - Database schema, migrations, and generated client
  - `prisma/generated/` - Generated Prisma client (custom output location)
  - `prisma/migrations/` - Database migration files
  - `prisma/schema.prisma` - Database schema definition
- `prisma.config.ts` - Prisma 7 datasource configuration
- `types/` - TypeScript type definitions
- `makefile` - Development shortcuts for common commands

### Data Model
Two entities with one-to-many relationship:
- **Infrastructure**: Technologies (name, description, imageUrl)
- **Vote**: Vote records (voterName, voterEmail, ipAddress)

Cascading deletes: deleting an infrastructure removes all its votes.

### API Routes
RESTful API using Next.js Route Handlers:
- `GET /api/infrastructures` - List all with vote counts (newest first)
- `POST /api/infrastructures` - Create new (requires name, description)
- `GET /api/infrastructures/[id]` - Get single infrastructure
- `POST /api/infrastructures/[id]/vote` - Record vote (captures IP from headers)

All routes use try-catch with appropriate HTTP status codes.

### Frontend Patterns
- All components are client components ('use client')
- State management via React hooks (useState, useEffect)
- Client-side data fetching to API routes
- Real-time vote count updates after voting

## Key Implementation Details

### Prisma Client Singleton
`lib/prisma.ts` implements singleton pattern to prevent multiple instances during hot reload. The client:
- Imports from `../prisma/generated/client` (custom output location)
- Uses `PrismaPg` adapter with connection string from `DATABASE_URL`
- Stores instance in global object to survive hot reloads in development

Always import from `@/lib/prisma`, never create new `PrismaClient()` instances elsewhere.

### IP Address Tracking
Vote routes capture IP using waterfall: `x-forwarded-for` → `x-real-ip` → 'unknown'. Implemented in `app/api/infrastructures/[id]/vote/route.ts`.

### Type Definitions
TypeScript types in `types/index.ts` mirror Prisma models but handle the `_count` aggregation field from Prisma queries for displaying vote counts.

## Environment Variables

Required in `.env`:
- `DATABASE_URL` - PostgreSQL connection string (default: `postgresql://vote:vote123@localhost:6543/vote_infrastructure?schema=public`)
- `NEXT_PUBLIC_APP_URL` - Application URL (optional, default: `http://localhost:3000`)

Docker Compose provides PostgreSQL on port 6543 (not the default 5432) to avoid conflicts.

## Development Workflow

When adding features:
1. Update `prisma/schema.prisma` if database changes needed
2. Run `yarn prisma migrate dev --name <descriptive_name>`
3. Run `yarn prisma generate` to update TypeScript types
4. Update types in `types/index.ts` if needed
5. Implement API routes in `app/api/`
6. Update components in `components/`
7. Test with `yarn dev`

When modifying the database schema:
- Always create migrations (don't use `prisma db push` in production)
- Migration files stored in `prisma/migrations/`
- Run `yarn prisma generate` after migrations to update client and types

## Troubleshooting

### "Prisma Client not initialized" Error
This occurs when Prisma client hasn't been generated after installation or schema changes:
```bash
yarn prisma generate
```
The client will be generated to `prisma/generated/` (not `node_modules/@prisma/client`).

### "Module not found" for Prisma Client
If you see import errors for `@prisma/client`:
- This project uses a custom output location: `prisma/generated/`
- Always import from `../prisma/generated/client` (relative path), never from `@prisma/client`
- Check that `prisma/schema.prisma` has `output = "generated"` in the generator block
- Verify the import path matches the file's location relative to `prisma/generated/`

### Database Connection Errors
1. Verify Docker container is running: `docker-compose ps`
2. Check `DATABASE_URL` in `.env` (should use port 6543)
3. Ensure database exists in container: `docker-compose exec db psql -U vote -l`

### TypeScript Errors After Schema Changes
Regenerate Prisma client to update TypeScript types:
```bash
yarn prisma generate
```

### Migration Conflicts
If migrations are out of sync:
```bash
yarn prisma migrate reset  # WARNING: deletes all data
yarn prisma migrate dev
```
