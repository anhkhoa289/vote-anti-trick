# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is an infrastructure voting system built with Next.js 16 App Router, PostgreSQL, and Prisma ORM. Users can vote on various infrastructure technologies and add new ones to the list.

## Common Development Commands

### Setup and Database
```bash
# Install dependencies
npm install

# Setup database (PostgreSQL must be running)
createdb vote_infrastructure

# Setup environment
cp .env.example .env
# Then edit .env with your PostgreSQL credentials

# Run migrations
npx prisma migrate dev --name init

# Generate Prisma Client (required after schema changes)
npx prisma generate

# Open Prisma Studio (database GUI at http://localhost:5555)
npx prisma studio
```

### Development
```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

### Database Management
```bash
# Create a new migration
npx prisma migrate dev --name <migration_name>

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Deploy migrations to production
npx prisma migrate deploy

# Check database connection
pg_isready
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router (React Server Components)
- **Database**: PostgreSQL with Prisma ORM
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4

### Directory Structure
- `app/` - Next.js App Router pages and API routes
  - `app/api/infrastructures/` - REST API endpoints for infrastructures and votes
- `components/` - React client components (all use 'use client')
- `lib/` - Shared utilities
  - `lib/prisma.ts` - Prisma client singleton (prevents hot reload issues in dev)
- `prisma/` - Database schema and migrations
- `types/` - TypeScript type definitions

### Data Model
Two main entities with a one-to-many relationship:
- **Infrastructure**: Represents infrastructure technologies (name, description, imageUrl)
- **Vote**: Records votes for infrastructures (tracks voter info and IP)

The relationship uses cascading deletes - deleting an infrastructure removes all its votes.

### API Architecture
RESTful API using Next.js Route Handlers:
- `GET /api/infrastructures` - Lists all infrastructures with vote counts (ordered by newest first)
- `POST /api/infrastructures` - Creates new infrastructure (requires name and description)
- `GET /api/infrastructures/[id]` - Gets single infrastructure details
- `POST /api/infrastructures/[id]/vote` - Records a vote (captures IP address from headers)

All API routes use try-catch error handling and return appropriate HTTP status codes.

### Frontend Patterns
- All components use React client components ('use client')
- State management via React hooks (useState, useEffect)
- Data fetching from client components to API routes
- Real-time vote count updates after voting

## Key Implementation Details

### Prisma Client Singleton
The `lib/prisma.ts` file implements a singleton pattern to prevent multiple Prisma Client instances during hot reloading in development. Always import from `@/lib/prisma`, never create new `PrismaClient()` instances elsewhere.

### IP Address Tracking
Vote routes capture IP addresses using the waterfall: `x-forwarded-for` → `x-real-ip` → 'unknown'. This is handled in `app/api/infrastructures/[id]/vote/route.ts`.

### Type Definitions
TypeScript types in `types/index.ts` mirror Prisma models but handle the `_count` aggregation field from Prisma queries, which is used to display vote counts.

## Environment Variables

Required in `.env`:
- `DATABASE_URL` - PostgreSQL connection string format: `postgresql://user:password@localhost:5432/vote_infrastructure?schema=public`
- `NEXT_PUBLIC_APP_URL` - Application URL (optional)

## Troubleshooting

### Prisma Client Issues
If you see "Prisma Client not generated" errors:
```bash
npx prisma generate
```

### Database Connection Errors
1. Verify PostgreSQL is running: `pg_isready`
2. Check `DATABASE_URL` in `.env` matches your PostgreSQL credentials
3. Ensure database exists: `psql -l | grep vote_infrastructure`

### TypeScript Errors
After schema changes, regenerate Prisma Client to update TypeScript types:
```bash
npx prisma generate
```

## Development Workflow

When adding new features:
1. Update `prisma/schema.prisma` if database changes needed
2. Run `npx prisma migrate dev --name <descriptive_name>`
3. Update TypeScript types in `types/index.ts` if needed
4. Implement API routes in `app/api/`
5. Update components in `components/`
6. Test with development server (`npm run dev`)

When modifying the database schema:
- Always create migrations (don't use `prisma db push` in production)
- Migration files are stored in `prisma/migrations/`
- Run `npx prisma generate` after migrations to update TypeScript types
