# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Development Server
```bash
npm run dev          # Start Next.js dev server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
```

### Database Management
```bash
npm run db:generate  # Generate new Drizzle migrations after schema changes
npm run db:migrate   # Run migrations (use before first run)
npm run db:studio    # Open Drizzle Studio for database inspection
```

### Testing and Code Quality
```bash
npm run test         # Run Vitest in watch mode
npm run test:once    # Run tests once
npm run lint         # Run ESLint
```

## Architecture Overview

This is a Next.js 15 budget tracking application using:

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Clerk
- **UI**: Tailwind CSS + Radix UI components
- **State Management**: TanStack Query + Jotai
- **Testing**: Vitest + Testing Library

### Database Schema
Core entities are defined in `src/db/schema/schema.ts`:
- `categories` - Income/expense categories with icons and ordering
- `records` - Financial transactions linked to categories
- `exchangeRates` - Currency conversion rates
- `regularPayments` - Recurring payment definitions

### App Structure
- `/app/(protected)/` - Authenticated routes with bottom navigation
  - `/app/[year]/[month]/` - Monthly budget view (main interface)
  - `/charts/` - Data visualization
  - `/settings/` - App configuration
- `/api/` - REST endpoints organized by domain (services pattern)
- `/components/ui/` - Reusable UI components (shadcn/ui based)

### Key Patterns
- **Services Pattern**: Business logic in `/api/(services)/` files
- **Route Handlers**: API endpoints follow Next.js 15 app router conventions
- **Form Handling**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query with infinite cache (no automatic refetching)
- **Styling**: Tailwind with CSS variables for theming

### Environment Setup
The app supports both `DATABASE_URL` (preferred) and individual connection parameters. For local development, copy `.env.sample` to `.env.local` and configure database connection.

### Mobile-First Design
The UI is optimized for mobile with a bottom navigation pattern in the protected layout. Desktop users see the same mobile-optimized interface.