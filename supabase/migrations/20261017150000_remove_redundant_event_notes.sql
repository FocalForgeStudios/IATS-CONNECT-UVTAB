-- The short event notes field duplicated the full description and is no longer used.
-- Drop the redundant column after the application stops reading/writing it.
ALTER TABLE public.catchups DROP COLUMN IF EXISTS notes;
