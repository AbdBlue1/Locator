# Pret A Manger UK Branch Finder

## Overview

This is a location finder application for Pret A Manger UK branches. It displays an interactive map showing all 491 Pret locations across the UK, with filtering capabilities, search functionality, and detailed location information including opening hours and contact details. The application uses real scraped data from Pret's official website.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server.

**UI Component Library**: Shadcn/UI with Radix UI primitives, following the "new-york" style variant. Components are built with accessibility in mind using Radix UI's unstyled, accessible component primitives.

**Styling**: Tailwind CSS with a custom design system based on Material Design principles integrated with Pret's brand colors (burgundy as primary). CSS variables are used extensively for theming with HSL color values. The design emphasizes clarity, minimalism, and responsive efficiency across devices.

**State Management**: React Query (@tanstack/react-query) for server state management, with local component state using React hooks. No global state management library is used - state is lifted to appropriate levels and passed via props.

**Routing**: Wouter is used as a lightweight client-side router.

**Key Design Patterns**:
- Component composition with a clear separation between presentational and container components
- Custom hooks for reusable logic (e.g., `use-mobile`, `use-toast`)
- Props-based component communication
- Controlled components for forms and inputs

### Backend Architecture

**Runtime**: Node.js with Express.js serving as the HTTP server.

**Build System**: TypeScript compiled with tsx for development and esbuild for production builds.

**API Design**: RESTful API with a single endpoint `/api/locations` that returns all Pret locations. The response includes success status and location array.

**Data Source**: Static data imported from `server/pret-locations-data.ts` containing 491 real Pret UK locations scraped from their official website. This includes full details: addresses, coordinates, opening hours, and phone numbers.

**Development Setup**: Vite middleware integration in development mode for hot module replacement. Static file serving in production from the `dist/public` directory.

**Error Handling**: Centralized error handling middleware that catches errors and returns appropriate HTTP status codes with JSON error messages.

### Data Storage

**Database ORM**: Drizzle ORM configured for PostgreSQL with schema definitions in `shared/schema.ts`.

**Current State**: The application currently uses in-memory storage (`MemStorage` class) for user data. Location data is served from static TypeScript files.

**Schema Design**:
- Users table with id, username, and password fields
- Location type definition with fields for id, name, address, city, postcode, latitude, longitude, status, openingHours, and phone
- Zod schemas for runtime validation of location data

**Migration Strategy**: Drizzle Kit is configured for database migrations with migrations stored in the `./migrations` directory. The `db:push` script can push schema changes to the database.

### Map Integration

**Map Provider**: Mapbox GL JS v3.0.1 for interactive mapping functionality.

**Implementation**: Custom `MapView` component that initializes Mapbox, creates markers for each location, handles marker clustering, and provides navigation controls. The map centers on the UK and adjusts zoom/center when filtering (e.g., London-only mode).

**Interaction**: Clicking markers triggers location selection, syncing with the sidebar location list. The map responds to filter changes by adjusting bounds to fit visible locations.

## External Dependencies

### Third-Party Services

**Mapbox**: Requires `VITE_MAPBOX_TOKEN` environment variable for map rendering. The token must be configured for the application to display the interactive map.

### Database

**PostgreSQL**: Configured via Neon serverless driver (@neondatabase/serverless). Requires `DATABASE_URL` environment variable. Currently not actively used as location data is static, but infrastructure is in place for future database integration.

### Data Scraping

**Web Scraping Tools**: Cheerio and Puppeteer were used to scrape Pret's official shop finder. The scraped data is stored in static JSON and TypeScript files. Multiple scraping approaches were attempted (network interception, DOM parsing, Next.js data extraction).

### UI Dependencies

**Component Libraries**:
- Radix UI: Comprehensive set of accessible, unstyled component primitives
- Shadcn/UI: Pre-styled components built on Radix UI
- Class Variance Authority: For variant-based component styling
- Tailwind CSS: Utility-first CSS framework

**Utility Libraries**:
- date-fns: Date manipulation and formatting
- clsx & tailwind-merge: Class name utilities
- zod: Runtime type validation
- react-hook-form with @hookform/resolvers: Form handling

### Build Tools

- Vite: Development server and build tool
- esbuild: Fast JavaScript bundler for production builds
- TypeScript: Type checking and compilation
- PostCSS with Autoprefixer: CSS processing

### Fonts

Google Fonts integration for Inter (primary font family) and JetBrains Mono (monospace for postcodes/times).