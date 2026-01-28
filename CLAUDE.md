# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Academic calendar application built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

## Commands

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Create production build
npm start        # Run production server
npm run lint     # Run ESLint
```

## Architecture

- **Framework**: Next.js 16 with App Router (React Server Components by default)
- **Styling**: Tailwind CSS v4 with dark mode support via `prefers-color-scheme`
- **Fonts**: Geist (sans and monospace) loaded via next/font

### Directory Structure

- `app/` - Next.js App Router directory (pages, layouts, API routes)
- `app/layout.tsx` - Root layout with font configuration and metadata
- `app/page.tsx` - Home page component
- `app/globals.css` - Global styles and Tailwind configuration
- `public/` - Static assets

## Code Patterns

### Path Aliases

Use `@/` for absolute imports from project root:
```typescript
import Component from '@/app/components/Component'
```

### Styling

Use Tailwind utility classes. Dark mode uses `dark:` prefix with system preference detection.

## Configuration Files

- `tsconfig.json` - TypeScript with strict mode, ES2017 target
- `eslint.config.mjs` - Flat config format with Next.js rules
- `next.config.ts` - Next.js configuration
- `postcss.config.mjs` - Tailwind CSS v4 integration
