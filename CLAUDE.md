# CLAUDE.md - Project Guidelines

## Project Overview
Next.js 16 application using App Router, React 19, TypeScript, and Tailwind CSS 4.

## Commands
```bash
pnpm dev      # Start development server
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Project Structure
```
app/              # Next.js App Router pages and layouts
components/       # Reusable React components (one component per file)
  ui/             # Base UI components (Button, Input, Card, etc.)
  features/       # Feature-specific components
lib/              # Utility functions and shared logic
hooks/            # Custom React hooks
types/            # TypeScript type definitions
public/           # Static assets
```

## Component Guidelines

### One Component Per File
- Each React component MUST have its own file
- File name matches component name: `Button.tsx` exports `Button`
- Co-locate component-specific types in the same file
- Co-locate component-specific hooks only if used exclusively by that component

### Component File Structure
```tsx
// 1. Imports
import { useState } from 'react';

// 2. Types (component-specific)
interface ButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
}

// 3. Component (named export preferred)
export function Button({ variant, children }: ButtonProps) {
  return <button className={variant}>{children}</button>;
}
```

### Naming Conventions
- Components: PascalCase (`UserProfile.tsx`)
- Hooks: camelCase with `use` prefix (`useAuth.ts`)
- Utilities: camelCase (`formatDate.ts`)
- Types: PascalCase (`User`, `ApiResponse`)

## 12-Factor App Principles

### 1. Codebase
- Single codebase tracked in Git
- Deploy same codebase to all environments

### 2. Dependencies
- All dependencies explicitly declared in `package.json`
- Use `pnpm` for deterministic installs
- Never rely on system-wide packages

### 3. Config
- Store config in environment variables
- Use `.env.local` for local development (never commit)
- Required env vars documented in `.env.example`
- Access via `process.env.NEXT_PUBLIC_*` (client) or `process.env.*` (server)

### 4. Backing Services
- Treat databases, caches, APIs as attached resources
- Connection strings via environment variables
- No hardcoded URLs or credentials

### 5. Build, Release, Run
- Strict separation between build and run stages
- `pnpm build` produces immutable build artifacts
- Same build artifact deployed to all environments

### 6. Processes
- App executes as stateless processes
- No sticky sessions - use external session store
- Store persistent data in backing services

### 7. Port Binding
- Export services via port binding
- `PORT` environment variable for production

### 8. Concurrency
- Scale out via process model
- Design for horizontal scaling
- No in-memory state between requests

### 9. Disposability
- Fast startup and graceful shutdown
- Handle SIGTERM gracefully
- Design for crash-only software

### 10. Dev/Prod Parity
- Keep development, staging, and production similar
- Use same backing services in all environments
- Deploy frequently to reduce divergence

### 11. Logs
- Treat logs as event streams
- Write to stdout/stderr
- Never manage log files in application

### 12. Admin Processes
- Run admin tasks as one-off processes
- Use same codebase and config as app
- Scripts in `scripts/` directory

## Code Style

### TypeScript
- Strict mode enabled
- Prefer interfaces over types for object shapes
- Use `unknown` over `any`
- Explicit return types on exported functions

### React
- Functional components only
- Prefer named exports over default exports
- Use Server Components by default, add `'use client'` only when needed
- Colocate data fetching with components using Server Components

### Styling
- Use Tailwind CSS utility classes
- Extract repeated patterns to components, not CSS
- Mobile-first responsive design

### Imports
- Use `@/*` path alias for absolute imports
- Group imports: external, internal, relative, styles

## Environment Variables

### Required
```
# Example - document actual required vars here
DATABASE_URL=
NEXT_PUBLIC_API_URL=
```

### Conventions
- `NEXT_PUBLIC_` prefix for client-accessible vars
- No prefix for server-only vars
- Never commit secrets to repository
