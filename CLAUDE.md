# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build, Test & Lint Commands

### Project-wide
- Build: Not applicable for root project
- Lint: `npm run lint`
- Format: `npm run format`
- Test: `npm run test`
- Test (watch mode): `npm run test:watch`
- Run single test: `npx vitest path/to/test.ts`
- Local AWS services: `npm run localstack:start`
- Database setup: `npm run db:setup`
- Seed test data: `npm run db:seed`

### Frontend (in frontend/ directory)
- Dev server: `npm run dev` or `npm run dev:https` (HTTPS)
- Build: `npm run build`
- Lint: `npm run lint`
- Test: `npm run test`
- Format: `npm run format`

## Code Style Guidelines

### TypeScript & React
- Use TypeScript strict mode with explicit types (avoid `any` type)
- Follow React Hooks best practices
- Use functional components with hooks
- Use Next.js App Router conventions
- File naming: PascalCase for components, camelCase for utilities

### Imports & Project Structure
- Use path aliases (`@/*`) for imports
- Group imports: React/Next.js, third-party, internal
- Follow src/ directory organization:
  - components/ for React components
  - hooks/ for custom hooks
  - lib/ for utilities

### Error Handling & Validation
- Use Zod for validation
- Handle errors explicitly, avoid silent failures
- Use proper TypeScript error typing

### Database & API
- Follow DynamoDB access patterns in docs
- Validate all inputs with Zod
- Structure API responses consistently

## Project Structure
- docs/ contains all design documents
- frontend/ contains Next.js frontend
- scripts/ contains setup and utility scripts