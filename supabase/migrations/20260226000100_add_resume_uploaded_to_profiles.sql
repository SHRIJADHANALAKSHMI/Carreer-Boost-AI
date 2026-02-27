-- Add mandatory resume completion flag to user profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS resume_uploaded BOOLEAN NOT NULL DEFAULT false;
