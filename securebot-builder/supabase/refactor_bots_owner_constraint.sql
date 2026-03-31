-- 1. Identify and Drop existing constraint if it points to agents
-- Replacing with reference to public.users table (not agents)
DO $$ 
BEGIN
    -- Drop the constraint if it exists (assuming default name)
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bots_owner_id_fkey') THEN
        ALTER TABLE bots DROP CONSTRAINT bots_owner_id_fkey;
    END IF;
END $$;

-- 2. Add new constraint pointing to the global users table
ALTER TABLE bots 
ADD CONSTRAINT bots_owner_id_fkey 
FOREIGN KEY (owner_id) 
REFERENCES public.users(id) 
ON DELETE CASCADE;

-- 3. Ensure RLS is active and use auth.uid() directly
CREATE POLICY IF NOT EXISTS "Users can manage their own bots" ON public.bots
  FOR ALL USING (auth.uid() = owner_id);
