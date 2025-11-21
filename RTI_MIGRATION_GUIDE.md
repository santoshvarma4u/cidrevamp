# RTI Tables Migration Guide

This guide explains how to create the RTI (Right to Information) tables in your database.

## Overview

The RTI feature requires two new tables:
1. `rti_officers` - Stores RTI officer information
2. `rti_pay_scales` - Stores staff pay scale information

## Option 1: Using Drizzle Kit (Recommended - Automatic)

This is the easiest method as it automatically syncs your schema with the database.

### Steps:

1. **Make sure your DATABASE_URL is set** in your `.env` file:
   ```bash
   DATABASE_URL=postgresql://username:password@localhost:5432/dbname
   ```

2. **Run the Drizzle push command**:
   ```bash
   npm run db:push
   ```

   This will automatically:
   - Detect the new tables in `shared/schema.ts`
   - Create the tables in your database
   - Add all necessary columns and constraints

3. **Verify the tables were created**:
   ```bash
   # If using Docker
   docker exec cid-postgres psql -U ciduser -d ciddb -c "\dt rti_*"
   
   # Or connect to your database and run:
   \dt rti_*
   ```

## Option 2: Using SQL Script (Manual)

If you prefer to run SQL directly or if Drizzle push doesn't work:

### For Docker Environment:

```bash
# Make the script executable
chmod +x scripts/create-rti-tables.sh

# Run the script
./scripts/create-rti-tables.sh
```

### For Local PostgreSQL:

```bash
# If you have DATABASE_URL in .env
psql $DATABASE_URL -f scripts/create-rti-tables.sql

# Or with explicit connection
psql -h localhost -U your_username -d your_database -f scripts/create-rti-tables.sql
```

### For Production (Remote Database):

```bash
# Using connection string
psql "postgresql://user:password@host:5432/dbname" -f scripts/create-rti-tables.sql

# Or using environment variable
export DATABASE_URL="postgresql://user:password@host:5432/dbname"
psql $DATABASE_URL -f scripts/create-rti-tables.sql
```

## Option 3: Manual SQL Execution

If you have database access through a GUI tool (pgAdmin, DBeaver, etc.):

1. Open the SQL file: `scripts/create-rti-tables.sql`
2. Copy and paste the SQL into your database client
3. Execute the script

## What Gets Created

### Tables:

1. **rti_officers**
   - id (SERIAL PRIMARY KEY)
   - sno (Serial Number)
   - category (Officer Category)
   - name (Officer Name)
   - designation (Designation)
   - phone (Phone Number)
   - display_order (For ordering)
   - created_at, updated_at (Timestamps)

2. **rti_pay_scales**
   - id (SERIAL PRIMARY KEY)
   - sno (Serial Number)
   - category (Pay Scale Category)
   - basic_pay (Basic Pay Range)
   - sgp6 (6 Years SGP Scale)
   - spp12_18 (12 & 18 Years SPP Scale)
   - spp24 (24 Years SPP-II Scale)
   - display_order (For ordering)
   - created_at, updated_at (Timestamps)

### Indexes:
- Indexes on `sno` and `display_order` for both tables for better query performance

### Sample Data:
The SQL script includes sample data from the original hardcoded values. You can:
- Keep it to have initial data
- Remove the INSERT statements if you want to add data via the admin interface

## Verification

After running the migration, verify the tables exist:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'rti_%';

-- Check table structure
\d rti_officers
\d rti_pay_scales

-- Check if data was inserted (if you used the SQL script with INSERT statements)
SELECT COUNT(*) FROM rti_officers;
SELECT COUNT(*) FROM rti_pay_scales;
```

## Troubleshooting

### Error: "relation already exists"
- The tables already exist. You can either:
  - Drop them first: `DROP TABLE IF EXISTS rti_officers, rti_pay_scales CASCADE;`
  - Or use `CREATE TABLE IF NOT EXISTS` (already in the script)

### Error: "permission denied"
- Make sure your database user has CREATE TABLE permissions
- Check your DATABASE_URL credentials

### Error: "DATABASE_URL not set"
- Create a `.env` file in the project root
- Add: `DATABASE_URL=postgresql://user:password@host:5432/dbname`

### Drizzle push doesn't detect changes
- Make sure `shared/schema.ts` is saved
- Try: `npm run db:push --force`
- Check that `drizzle.config.ts` points to the correct schema file

## Next Steps

After creating the tables:

1. **Access the Admin Interface**: Navigate to `/admin/rti`
2. **Add/Edit Data**: Use the admin interface to manage RTI officers and pay scales
3. **View Public Page**: Check `/rti` to see the data displayed

## Notes

- The SQL script includes sample data from the original hardcoded values
- You can remove the INSERT statements if you prefer to add data via the admin interface
- The `display_order` field allows you to control the order of items in the public view
- All timestamps are automatically managed by the database

