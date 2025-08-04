# Replit.md

## Overview

This full-stack web application serves as a public information portal and content management system for the Criminal Investigation Department (CID) of Telangana State. It supports law enforcement activities, including specialized wings for various crime types, citizen complaint management, and media galleries. The project aims to provide a streamlined, user-friendly platform for public engagement and internal content management for the CID.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library, incorporating a modern teal design theme with glass-morphism elements.
- **State Management**: Zustand for local state, TanStack Query for server state
- **Build Tool**: Vite

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Authentication**: Custom local authentication using Passport.js with secure password hashing (scrypt).
- **Session Management**: Express sessions with PostgreSQL store.
- **File Uploads**: Multer for handling multipart form data.

### Database Architecture
- **Primary Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Drizzle Kit for migrations.

### Key Features & Design Decisions
- **Authentication System**: Secure local authentication with role-based access control (user, admin, super_admin) and PostgreSQL-backed sessions.
- **Content Management System (CMS)**:
    - Dynamic page creation with slug-based routing and SEO metadata.
    - Comprehensive media management (video, photo) with CRUD operations.
    - News article management with auto-scrolling display on the homepage.
    - Dynamic menu system with database-driven navigation.
    - Rich text editing capabilities for content.
- **Specialized Wings System**: Dedicated sections for Economic Offences, Cyber Crimes, Women & Child Protection, and General Offences.
- **Complaint Management**: Public submission system with status tracking and an admin review dashboard.
- **File Upload System**: Local storage for images, videos, and documents with validation.
- **UI/UX**: Consistent modern teal design theme with white card sections, responsive layouts, auto-scrolling photo sliders, and auto-scrolling news panels.
- **Monorepo Structure**: Shared TypeScript types between frontend and backend for type safety.

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, Wouter
- **UI Libraries**: Radix UI primitives, shadcn/ui components
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **Forms**: React Hook Form, Hookform Resolvers

### Backend Dependencies
- **Server**: Express.js
- **Database**: Drizzle ORM, @neondatabase/serverless
- **Authentication**: Passport.js
- **File Handling**: Multer
- **Session Management**: express-session, connect-pg-simple

### Development Tools
- **Build**: Vite, esbuild
- **TypeScript**
- **Schema Validation**: Zod, drizzle-zod