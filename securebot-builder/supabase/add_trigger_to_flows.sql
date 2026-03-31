-- Migration: Add trigger_config and trigger_type to flows table
-- This supports the modular flow architecture where flows are independent entities.

DO $$ 
BEGIN
    -- Add trigger_type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'flows' AND column_name = 'trigger_type') THEN
        ALTER TABLE flows ADD COLUMN trigger_type TEXT DEFAULT 'keyword';
    END IF;

    -- Add trigger_config column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'flows' AND column_name = 'trigger_config') THEN
        ALTER TABLE flows ADD COLUMN trigger_config JSONB DEFAULT '{}'::jsonb;
    END IF;

    -- Refreshing the PostgREST schema cache might be needed after this.
    -- In Supabase dashboard, you can do this by running 'NOTIFY pgrst, ''reload schema'';'
END $$;
