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
- **COMPLETED**: Removed Emergency and Lodge Complaint buttons from header for cleaner appearance
- Header layout now streamlined with logos, title, and user controls only
- **COMPLETED**: Implemented auto-scrolling photo slider for homepage gallery section
- Slider auto-advances every 3 seconds with manual navigation controls and responsive design
- **COMPLETED**: Added Director General message and News section before Specialized Wings
- Features Ms. Charu Sinha IPS profile with mission statement and cybercrime news updates
- **COMPLETED**: Added Ms. Charu Sinha's official photo and implemented auto-scrolling news
- Reduced section height and added 4-second auto-scroll with smooth transitions in news panel
- **COMPLETED**: Integrated news management into CMS with full CRUD operations
- News articles can be created, edited, published, and deleted through admin panel at /admin/content/news
- Homepage now displays database-driven news content in auto-scrolling format
- **COMPLETED**: Reorganized homepage layout per user request
- Moved Director General content to hero section alongside video for better integration
- Positioned photo gallery in main content area where DGP content was previously located
- Maintained consistent UI aesthetics with glass-morphism design and responsive layout
- **COMPLETED**: Dynamic menu system implementation
- Added menu configuration fields to pages schema (showInMenu, menuTitle, menuParent, menuOrder, menuDescription)
- Enhanced admin pages interface with menu assignment controls and group selection
- Created dynamic header navigation that fetches pages from database and organizes by menu groups
- Header now displays database-driven menu items alongside existing static navigation elements
- **COMPLETED**: Fixed critical routing and database issues
- Resolved route priority conflict where /:slug was interfering with /admin routes
- Fixed Drizzle ORM query issues that prevented pages from loading in admin panel
- Corrected API endpoints and storage functions for proper page data retrieval
- Dynamic page routing now works correctly at slug URLs without blocking admin access
- **COMPLETED**: Fixed navigation menu dropdown positioning by replacing NavigationMenu with DropdownMenu
- Successfully replaced problematic Radix UI NavigationMenu component with reliable DropdownMenu components
- Fixed all TypeScript errors and removed conflicting CSS that was breaking the navigation functionality
- Each dropdown menu now works independently with proper positioning under its respective parent menu item
- Navigation system now uses standard dropdown components that are more reliable and easier to maintain
- **COMPLETED**: Complete menu system restructure to 10 parent-only menus (January 29, 2025)
- Removed all existing dropdown submenus and associated pages from database
- Created new simplified menu structure: ABOUT, CIG, MEDIA, CASES, ALERTS, RTI, LINKS, CONTACT, NCL, DUTY MEET
- Updated Header component to display only parent menu items without dropdowns
- Fixed API data property mapping issues (camelCase vs snake_case) for proper menu rendering
- All 10 menu items now display correctly in both desktop and mobile navigation
- **COMPLETED**: Links page implementation with authentic content from old CID website (August 4, 2025)
- Recreated complete Links page using content extracted from original https://cid.tspolice.gov.in/cid/linksinfo
- Organized links into 4 categories: Central Agencies, Other States - CID, Telangana State, Other States - Police
- Included all authentic government links from original site with proper descriptions and URLs
- Applied modern teal design theme with white card sections, consistent with site's visual guidelines
- Added responsive grid layout with 4-column display on larger screens for optimal organization
- Integrated page into routing system at /links path for direct navigation access
- **COMPLETED**: Comprehensive official logo integration across all link categories (August 4, 2025)
- Added 30+ authentic government logos to enhance visual appeal and credibility
- Central Agencies: 9 official logos (BPRD, CBI, MHA, NCB, NIA, NCRB, etc.)
- Other States CID: 5 state CID department logos with professional branding
- Telangana State: 4 official logos (Police, Government, Cyberabad, Hyderabad departments)
- Other States Police: 12 state police department logos across major Indian states
- All logos displayed in gray background containers with consistent modern card design

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