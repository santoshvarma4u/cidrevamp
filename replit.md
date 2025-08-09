# Replit.md

## Overview

This full-stack web application serves as a public information portal and content management system for the Crime Investigation Department (CID) of Telangana State. It supports law enforcement activities, including specialized wings for various crime types, citizen complaint management, and media galleries. The project aims to provide a streamlined, user-friendly platform for public engagement and internal content management for the CID.

## Recent Changes (February 2025)

- **Complete Senior Officers Directory**: Added all 13 senior officers with authentic photos and contact details, including Sri M. DHARMA TATA RAO (Director, FPB) and SMT VENKATA LAXMI KOLLI (SP, EOW)
- **CID Structure Pages**: Created comprehensive pages for all four specialized wings:
  - Economic Offences Wing (EOW) - handling financial frauds and economic crimes
  - Cyber Crimes - digital investigations and IT Act violations
  - Women & Child Protection - crimes against women and children
  - General Offences Wing - grave crimes with state-level ramifications
- **Navigation Structure**: Organized CID Structure as parent page with wing pages as children for proper menu hierarchy
- **Authentic Content**: All content extracted from original CID website HTML files for accuracy
- **Docker Deployment**: Complete containerization setup with PostgreSQL, multi-stage builds, Nginx proxy, and health checks
- **Database Export**: Updated database export (database_export.sql) with latest schema and data for Docker initialization
- **Enhanced Security**: Added comprehensive CAPTCHA support to admin login with svg-captcha, session management, and attempt limits
- **Loading Animations**: Replaced all loading spinners with pulsing police logo animation for consistent government branding
- **News Ticker Integration**: Successfully implemented and positioned news ticker between DGP message and Latest News Updates sections with authentic API data, optimized scrolling animations (120s cycle with immediate start), and red text with white outline for optimal readability
- **Admin UI Improvements**: Enhanced admin login with white placeholder text and removed demo credentials for professional appearance
- **Theme System Overhaul**: Complete theme switcher implementation with CSS variables, replaced all hardcoded teal colors with dynamic theme-aware classes
- **Mulberry Theme**: Replaced purple theme with user-requested Mulberry color (#4C0121) for professional government aesthetic
- **Three-Card Asymmetric Layout**: Successfully implemented asymmetric layout with flexbox approach:
  - Large Director Message card (2x width) with authentic DGP message and photo, featuring the complete official statement about CID's mission and specialized wings
  - Latest Videos card (larger, top-right) with embedded video player showing CID training programs
  - NCL card (smaller, bottom-right) displaying "National Criminal Laws" information
  - Consistent rounded styling (rounded-2xl) and theme-appropriate colors throughout all cards
  - Proper spacing with pt-24 to prevent header menu overlap

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