-- User activity / history tracking
CREATE TABLE public.user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  page_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity" ON public.user_activity
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity" ON public.user_activity
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own activity" ON public.user_activity
FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_user_activity_user_id ON public.user_activity(user_id, created_at DESC);

-- Saved work sessions (auto-save / continue where left off)
CREATE TABLE public.saved_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  session_type TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled',
  session_data JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'in_progress',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.saved_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions" ON public.saved_sessions
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON public.saved_sessions
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON public.saved_sessions
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions" ON public.saved_sessions
FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_saved_sessions_user_id ON public.saved_sessions(user_id, updated_at DESC);

-- Add trigger for updated_at
CREATE TRIGGER update_saved_sessions_updated_at
BEFORE UPDATE ON public.saved_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Validation trigger for session status
CREATE OR REPLACE FUNCTION public.validate_session_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status NOT IN ('in_progress', 'completed', 'archived') THEN
    RAISE EXCEPTION 'Invalid session status: %', NEW.status;
  END IF;
  IF NEW.session_type NOT IN ('contract_audit', 'trial_prep', 'document_review', 'regulatory_research') THEN
    RAISE EXCEPTION 'Invalid session type: %', NEW.session_type;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_session_status_trigger
BEFORE INSERT OR UPDATE ON public.saved_sessions
FOR EACH ROW
EXECUTE FUNCTION public.validate_session_status();
