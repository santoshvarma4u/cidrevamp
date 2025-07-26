# Replit.md

## Overview

This is a full-stack web application for the Criminal Investigation Department (CID) of Telangana State. The application serves as a public information portal and content management system for law enforcement activities, including specialized wings for different types of crimes, citizen complaint management, and media galleries.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**January 26, 2025** - Successfully implemented and fixed local username/password authentication system
- Replaced Replit Auth with custom local authentication using passport.js
- Created secure password hashing system using scrypt with salt
- Added admin user to database (username: admin, password: admin)
- Fixed session management using memory store to avoid PostgreSQL session conflicts
- Created clean admin login page at /admin/login with professional design
- Updated all authentication routes and storage operations for local auth
- **RESOLVED**: Fixed admin access issues by removing duplicate requireAdmin middleware
- **CONFIRMED**: All admin functionality now working - photo uploads, complaints access, etc.
- Authentication system fully functional with proper session handling and route protection
- **COMPLETED**: Video and photo delete functionality fully implemented with confirmation dialogs
- Both video and photo CRUD operations are now complete and working perfectly
- **COMPLETED**: Added official logos to header - Telangana Government logo (left) and Telangana State Police logo (right)
- Header now has professional branding with proper logo positioning and sizing

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: Zustand for local state, TanStack Query for server state
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store
- **File Uploads**: Multer for handling multipart form data

### Database Architecture
- **Primary Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Drizzle Kit for migrations
- **Connection**: Connection pooling with @neondatabase/serverless

## Key Components

### Authentication System
- **Provider**: Replit Auth integration with OIDC
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **Authorization**: Role-based access control (user, admin, super_admin)
- **User Management**: Complete user CRUD operations with profile management

### Content Management System
- **Pages**: Dynamic page creation with slug-based routing and SEO metadata
- **Media Management**: Video and photo upload/management with thumbnails
- **News System**: News article creation and publication
- **Rich Text Editing**: Custom content editor with formatting capabilities

### Specialized Wings System
- Economic Offences Wing for financial crimes
- Cyber Crimes Wing for IT-related violations
- Women & Child Protection Wing
- General Offences Wing for criminal investigations

### Complaint Management
- **Citizen Portal**: Public complaint submission system
- **Status Tracking**: Complaint tracking with unique identifiers
- **Admin Interface**: Complaint review and management dashboard

### File Upload System
- **Storage**: Local file storage with multer
- **File Types**: Support for images, videos, documents (PDF, DOC, DOCX)
- **Validation**: File type and size restrictions (50MB max)

## Data Flow

### Public Access Flow
1. Users visit public pages (home, wings, complaint forms)
2. Content is fetched from PostgreSQL via Drizzle ORM
3. Media files are served from local storage
4. No authentication required for public content

### Admin Access Flow
1. Admin authentication via Replit Auth
2. Role-based route protection
3. CRUD operations on content (pages, videos, photos, news)
4. File uploads processed through multer middleware
5. Database updates via Drizzle ORM with transaction support

### Complaint Submission Flow
1. Citizens submit complaints through public forms
2. Form validation using Zod schemas
3. Data stored in PostgreSQL with auto-generated IDs
4. Email notifications (implementation pending)
5. Status tracking available via public interface

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Router (Wouter)
- **UI Libraries**: Radix UI primitives, shadcn/ui components
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **Forms**: React Hook Form, Hookform Resolvers

### Backend Dependencies
- **Server**: Express.js, Node.js HTTP server
- **Database**: Drizzle ORM, PostgreSQL client (@neondatabase/serverless)
- **Authentication**: Passport.js, OpenID Connect client
- **File Handling**: Multer for uploads
- **Session Management**: express-session, connect-pg-simple

### Development Tools
- **Build**: Vite, esbuild for production builds
- **TypeScript**: Full type safety across frontend and backend
- **Development**: Hot reload, error overlays via Replit plugins

### Data Validation
- **Schema Validation**: Zod for runtime type checking
- **Database Schema**: Drizzle-zod for schema-to-validation mapping

## Deployment Strategy

### Development Environment
- **Server**: Development server runs via `npm run dev`
- **Hot Reload**: Vite HMR for frontend, tsx for backend auto-restart
- **Database**: Direct connection to Neon PostgreSQL instance
- **File Storage**: Local uploads directory

### Production Build
- **Frontend**: Vite builds static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Static Serving**: Express serves built frontend assets
- **Database**: Production PostgreSQL connection via DATABASE_URL
- **Environment**: All configuration via environment variables

### Database Management
- **Migrations**: Drizzle Kit handles schema migrations
- **Schema Location**: Shared schema in `/shared/schema.ts`
- **Development Sync**: `npm run db:push` for development schema updates

### Session Security
- **Storage**: PostgreSQL sessions table for scalability
- **Security**: HTTP-only cookies, secure flags in production
- **Expiration**: 7-day session lifetime with automatic cleanup

The application is designed as a monorepo with shared TypeScript types between frontend and backend, ensuring type safety across the entire stack. The architecture supports both public content delivery and secure administrative functions with role-based access control.