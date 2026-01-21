-- Make title and content nullable in news table
-- This allows news items to have either English OR Telugu content, not requiring both

ALTER TABLE news 
ALTER COLUMN title DROP NOT NULL,
ALTER COLUMN content DROP NOT NULL;

-- Verify the changes
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'news' 
AND column_name IN ('title', 'content', 'title_telugu', 'content_telugu');
