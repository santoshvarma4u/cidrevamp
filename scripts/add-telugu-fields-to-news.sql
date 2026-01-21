-- Add Telugu content fields to news table
-- Run this script to add title_telugu and content_telugu columns to the news table

ALTER TABLE news 
ADD COLUMN IF NOT EXISTS title_telugu TEXT,
ADD COLUMN IF NOT EXISTS content_telugu TEXT;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'news' 
AND column_name IN ('title_telugu', 'content_telugu');
