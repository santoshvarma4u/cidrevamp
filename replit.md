# Replit.md

## Overview

This full-stack web application serves as a public information portal and content management system for the Crime Investigation Department (CID) of Telangana State. It supports law enforcement activities, including specialized wings for various crime types, citizen complaint management, and media galleries. The project aims to provide a streamlined, user-friendly platform for public engagement and internal content management for the CID.

## Recent Changes (August 2025)

- **Streamlined Theme System**: Simplified to two main themes - Ocean Blue (lighter professional blue) and Teal (custom gradient with #51EAEA, #00FFF0, #B8FFF9, #85F4FF colors)
- **Lighter Blue Ocean Theme**: Updated default Ocean Blue theme from dark navy (#161D6F) to lighter, more appealing blue (#3B4A9C) with enhanced visual harmony
- **Custom Teal Theme**: Added new Teal theme using specified colors (#51EAEA, #00FFF0, #B8FFF9, #85F4FF) with full gradient integration across header, hero section, and card headers
- **Theme-Aware Gradients**: All header gradients, hero section backgrounds, and card headers now automatically adapt to selected theme using CSS theme variables
- **Complete Senior Officers Directory**: Added all 13 senior officers with authentic photos and contact details, including Sri M. DHARMA TATA RAO (Director, FPB) and SMT VENKATA LAXMI KOLLI (SP, EOW)
- **CID Structure Pages**: Created comprehensive pages for all four specialized wings:
  - Economic Offences Wing (EOW) - handling financial frauds and economic crimes
  - Cyber Crimes - digital investigations and IT Act violations
  - Women & Child Protection - crimes against women and children
  - General Offences Wing - grave crimes with state-level ramifications
- **Navigation Structure**: Organized CID Structure as parent page with wing pages as children for proper menu hierarchy
- **Authentic Content**: All content extracted from original CID website HTML files for accuracy
- **Complete Docker Deployment** (Latest Update - August 2025):
  - **Production Setup**: Full containerization with PostgreSQL, multi-stage builds, Nginx reverse proxy, and comprehensive health checks
  - **Development Environment**: Separate development Docker setup with hot reload and isolated database
  - **Database Backup System**: Automated backup scripts with scheduled cron jobs, multiple backup formats (SQL and PostgreSQL custom), and restore functionality
  - **Management Scripts**: Comprehensive docker-run.sh script for easy container management (start, stop, backup, restore, logs, health checks)
  - **Security Features**: Nginx rate limiting, security headers, SSL/HTTPS ready configuration, and proper file permissions
  - **Multi-Environment Support**: Separate configurations for development (port 5001) and production (port 5000) environments
  - **Backup Automation**: Scripts for manual and automated backups with cleanup of old backups (30-day retention)
  - **Production Build Fix**: Custom build scripts to exclude Vite dependencies from production bundle, resolving "Cannot find package 'vite'" errors
  - **Build Testing**: Added test scripts for validating Docker builds and troubleshooting deployment issues
- **Database Export**: Updated database export (database_export.sql) with latest schema and data for Docker initialization
- **Menu Case Consistency**: Fixed all uppercase menu items to proper case (ABOUT → About, MEDIA → Media, etc.) for professional appearance
- **Hero Section Simplification**: Removed "Report a Crime" and "Learn More" buttons for cleaner professional look
- **Comprehensive Security Implementation** (Latest Update - August 2025):
  - **Multi-Layer Authentication Security**: Enhanced password hashing with bcrypt (12 salt rounds), strong password requirements, session security with httpOnly/sameSite strict cookies, and 5-attempt login lockout with 15-minute timeout
  - **HTTP Security Headers**: Complete Helmet.js integration with CSP, HSTS, X-Frame-Options, X-Content-Type-Options, and referrer policy
  - **Rate Limiting & DDoS Protection**: General API limiting (100 req/15min), authentication limiting (5 req/15min), and custom IP-based tracking
  - **Input Validation & File Security**: Express-validator integration, file upload restrictions (50MB, MIME validation), filename sanitization, and XSS protection
  - **Database Security**: Enhanced connection pooling, SSL enforcement in production, graceful shutdown handling, and SQL injection protection via Drizzle ORM
  - **Security Monitoring**: Comprehensive event logging, failed login tracking, audit trails, and security incident reporting
  - **CAPTCHA Protection**: SVG-based CAPTCHA on all authentication endpoints with session management and attempt limits
- **Loading Animations**: Replaced all loading spinners with pulsing police logo animation for consistent government branding
- **News Ticker Integration**: Successfully implemented and positioned news ticker between DGP message and Latest News Updates sections with authentic API data, optimized scrolling animations (120s cycle with immediate start), and red text with white outline for optimal readability
- **Admin UI Improvements**: Enhanced admin login with white placeholder text and removed demo credentials for professional appearance
- **Admin Interface Streamlining** (Latest Update - August 2025):
  - **Removed Complaints and Settings**: Eliminated complaints and settings sections from admin sidebar for simplified interface
  - **Theme System Integration**: Applied proper theme-aware styling to admin dashboard and sidebar using CSS custom properties
  - **Modernized Admin Sidebar**: Updated to use theme colors (background, foreground, primary, secondary, border) instead of hardcoded grays
  - **Dashboard Theme Compatibility**: Ensured admin dashboard background and components properly respond to theme selection
  - **Removed Complaints Dependencies**: Cleaned up all complaints-related code, queries, and components from admin dashboard
  - **Admin Contrast Fixes**: Fixed text visibility issues with dark sidebar (bg-gray-900) and white text for proper contrast
  - **Unified Logout Handler**: Fixed 404 errors by supporting both GET and POST logout requests with appropriate responses
- **Theme System Overhaul**: Complete theme switcher implementation with CSS variables, replaced all hardcoded teal colors with dynamic theme-aware classes
- **Mulberry Theme**: Replaced purple theme with user-requested Mulberry color (#4C0121) for professional government aesthetic
- **Three-Card Asymmetric Layout**: Successfully implemented asymmetric layout with flexbox approach:
  - Large Director Message card (2x width) with authentic DGP message and photo, featuring the complete official statement about CID's mission and specialized wings
  - Latest Videos card (larger, top-right) with embedded video player showing CID training programs
  - Consistent rounded styling (rounded-2xl) and theme-appropriate colors throughout all cards
  - Proper spacing with header-spacing class (300px) to prevent header menu overlap
- **Content Cleanup** (August 19, 2025):
  - **Removed NCL and Duty Meet Pages**: Eliminated NCL (National Criminal Laws) and Telangana Police First Duty Meet pages from database and UI as requested
  - **Streamlined Home Page**: Removed NCL card from homepage layout to focus on core CID services
  - **Database Cleanup**: Deleted pages with IDs 11 (NCL) and 12 (Duty Meet) from pages table
  - **Header Spacing Fix**: Updated all remaining pages with proper 300px header clearance using header-spacing class
- **Complete Gradient System**: Finalized purple-cyan gradient implementation with exact client specifications:
  - Full background gradient (#672676 to #020104 with cyan accent) applied to entire page
  - Selective header gradient application: contact bar and navigation menu with purple gradient
  - Clean title/logo area maintained with normal card background for professional branding
  - All cards feature matching diagonal gradients that blend seamlessly with background
  - Unified visual experience while preserving government website credibility
- **Application-Wide Consistent Styling** (Latest Update):
  - **Header Navigation**: Updated all menu items to use font-semibold for professional bold appearance
  - **Header Background**: Applied identical purple gradient to header matching hero section and card headers
  - **Page Headers**: Systematic application of consistent purple gradient styling to all page headers across the entire application
  - **Global CSS Classes**: Added standardized CSS classes for consistent styling:
    - `.page-hero-gradient` for hero sections
    - `.cid-page-header` for page headers
    - `.cid-card-header` for card headers
    - `.cid-nav-text` for navigation typography
  - **Complete Page Coverage**: Applied consistent styling to all pages including:
    - Dynamic pages, About/Mission, Wings pages, RTI page, Contact page, Alerts page, Links page
    - Economic Offences Wing, Photo Gallery, Video Gallery, Admin Dashboard
    - Specialized wing pages and all content management pages
  - **Typography Consistency**: Unified font-weight (600/semibold) and font-family across all navigation and header elements
  - **Visual Harmony**: Perfect alignment between header gradient, hero section gradient, and card header gradients throughout the application
  - **Professional Government Aesthetic**: Maintained professional appearance while ensuring visual consistency across all user-facing pages
  - **Theme Verification Complete**: Confirmed all pages use proper theme classes (cid-page-header, cid-nav-text) for Ocean Blue and Teal theme compatibility
- **Dynamic Director Management System** (Latest Update - August 2025):
  - **Database Schema**: Added director_info table with fields for name, title, message, photoPath, isActive status, and timestamps
  - **API Layer**: Comprehensive REST endpoints for CRUD operations on director information with file upload support
  - **Admin Interface**: Full management panel at /admin/director for creating, editing, and deleting director entries with photo upload
  - **Dynamic Homepage**: Homepage Director's Message card now pulls content from database, with fallback to original content if no active director exists
  - **Photo Management**: Integrated file upload system for director photos with proper path handling and display
  - **Admin Navigation**: Added Director Management section to admin sidebar for easy access to director content management

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