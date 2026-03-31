-- Final Purge: Eliminating bot_id relationship from flows table
-- This makes flows completely independent entities.
DO $$ 
BEGIN
    -- Drop the foreign key constraint if it exists
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'flows_bot_id_fkey') THEN
        ALTER TABLE flows DROP CONSTRAINT flows_bot_id_fkey;
    END IF;

    -- Drop the column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'flows' AND column_name = 'bot_id') THEN
        ALTER TABLE flows DROP COLUMN bot_id;
    END IF;
END $$;
