-- Add flow_ids column as UUID array to bots table
ALTER TABLE bots ADD COLUMN IF NOT EXISTS flow_ids UUID[] DEFAULT '{}';

-- Optional: Update RLS if needed, but usually not required for a new column
-- POLICY logic remains the same.
