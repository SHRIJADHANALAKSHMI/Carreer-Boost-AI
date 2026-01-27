-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Anyone can read their session analyses" ON public.career_analyses;
DROP POLICY IF EXISTS "Anyone can insert analyses" ON public.career_analyses;

-- Create a function to get session_id from request headers
CREATE OR REPLACE FUNCTION public.get_session_id()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NULLIF(current_setting('request.headers', true)::json->>'x-session-id', '')::text;
$$;

-- Create restrictive SELECT policy - users can only read their own session data
CREATE POLICY "Users can read own session analyses"
ON public.career_analyses
FOR SELECT
USING (
  session_id = public.get_session_id()
);

-- Create restrictive INSERT policy - users can only insert with their own session_id
CREATE POLICY "Users can insert own session analyses"
ON public.career_analyses
FOR INSERT
WITH CHECK (
  session_id = public.get_session_id()
);