# Production Deployment Fix

## Issue
Page creation works in development but fails in production after deployment.

## Root Cause
1. **Database Schema Mismatch**: Production database may not have the latest schema changes (slug field, display_order field)
2. **TypeScript Build Errors**: Build process failing due to TypeScript errors
3. **Environment Differences**: Different configurations between dev and production

## Solution Steps

### 1. Fix Database Schema in Production

Run the schema update script:
```bash
# If using Docker deployment
./scripts/update-production-schema.sh

# Or manually update the production database:
docker exec cid-postgres psql -U ciduser -d ciddb -c "
ALTER TABLE pages ADD COLUMN IF NOT EXISTS slug VARCHAR UNIQUE;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
"
```

### 2. Update Existing Pages with Slugs

```bash
# Generate slugs for existing pages without them
docker exec cid-postgres psql -U ciduser -d ciddb -c "
UPDATE pages 
SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
WHERE slug IS NULL OR slug = '';
"
```

### 3. Rebuild and Redeploy

```bash
# Rebuild the application with fixed TypeScript errors
docker-compose down
docker-compose build --no-cache app
docker-compose up -d

# Check logs for any errors
docker-compose logs app -f
```

### 4. Verify Deployment

1. Check that the application starts without errors
2. Test page creation in the admin interface
3. Verify database schema is correct:

```bash
docker exec cid-postgres psql -U ciduser -d ciddb -c "
\d pages;
\d videos;
"
```

## Prevention

To prevent future deployment issues:

1. **Always test schema changes in production-like environment**
2. **Run database migrations before code deployment**
3. **Use TypeScript strict mode and fix all errors before deployment**
4. **Implement proper CI/CD pipeline with build validation**

## Troubleshooting

If page creation still fails:

1. **Check application logs**:
   ```bash
   docker-compose logs app -f
   ```

2. **Check database connectivity**:
   ```bash
   docker exec cid-app node -e "console.log('DB URL:', process.env.DATABASE_URL)"
   ```

3. **Verify schema manually**:
   ```bash
   docker exec cid-postgres psql -U ciduser -d ciddb -c "SELECT column_name, data_type FROM information_schema.columns WHERE table_name='pages' ORDER BY ordinal_position;"
   ```

4. **Test API endpoint directly**:
   ```bash
   curl -X POST http://localhost:5000/api/admin/pages \
     -H "Content-Type: application/json" \
     -d '{"title":"Test Page","slug":"test-page","content":"Test content","isPublished":false}' \
     --cookie-jar cookies.txt
   ```