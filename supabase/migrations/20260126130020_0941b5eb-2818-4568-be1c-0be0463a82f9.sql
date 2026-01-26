-- Create enum for career domains
CREATE TYPE public.career_domain AS ENUM (
  'frontend_developer',
  'backend_developer',
  'fullstack_developer',
  'data_scientist',
  'data_analyst',
  'ml_engineer',
  'ai_engineer',
  'cybersecurity_analyst',
  'cloud_devops_engineer',
  'mobile_developer',
  'ui_ux_designer',
  'product_manager',
  'business_analyst',
  'digital_marketing',
  'finance_analyst',
  'mechanical_engineer',
  'electrical_engineer',
  'civil_engineer',
  'mba_management',
  'hr_professional',
  'operations_manager',
  'consultant',
  'healthcare_professional',
  'educator',
  'legal_professional'
);

-- Create enum for readiness status
CREATE TYPE public.readiness_status AS ENUM (
  'not_ready',
  'partially_ready',
  'job_ready'
);

-- Create career analyses table to store all user analyses
CREATE TABLE public.career_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  career_domain career_domain NOT NULL,
  readiness_score INTEGER NOT NULL CHECK (readiness_score >= 0 AND readiness_score <= 100),
  readiness_status readiness_status NOT NULL,
  matched_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  missing_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  extracted_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  ai_insights JSONB NOT NULL DEFAULT '{}'::jsonb,
  roadmap JSONB NOT NULL DEFAULT '{}'::jsonb,
  resume_text TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index on session_id for fast lookups
CREATE INDEX idx_career_analyses_session_id ON public.career_analyses(session_id);
CREATE INDEX idx_career_analyses_created_at ON public.career_analyses(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.career_analyses ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for anonymous users)
CREATE POLICY "Anyone can insert analyses"
ON public.career_analyses
FOR INSERT
WITH CHECK (true);

-- Allow anyone to read their own session analyses
CREATE POLICY "Anyone can read their session analyses"
ON public.career_analyses
FOR SELECT
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_career_analyses_updated_at
BEFORE UPDATE ON public.career_analyses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();