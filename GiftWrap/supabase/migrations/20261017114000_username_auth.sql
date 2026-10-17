CREATE TABLE IF NOT EXISTS public."AppUser" (
  id UUID PRIMARY KEY,
  user_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS app_user_username_lower_unique
  ON public."AppUser" (lower(user_name));

CREATE TABLE IF NOT EXISTS public."AppSession" (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public."AppUser"(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS app_session_user_expiry_idx
  ON public."AppSession" (user_id, expires_at);

CREATE TABLE IF NOT EXISTS public."AppLoginAttempt" (
  username_key TEXT NOT NULL,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS app_login_attempt_username_time_idx
  ON public."AppLoginAttempt" (username_key, attempted_at);
CREATE INDEX IF NOT EXISTS app_login_attempt_time_idx
  ON public."AppLoginAttempt" (attempted_at);

ALTER TABLE public."AppUser" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."AppSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."AppLoginAttempt" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."AppUser" FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public."AppSession" FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public."AppLoginAttempt" FROM PUBLIC, anon, authenticated;
GRANT ALL ON public."AppUser" TO service_role;
GRANT ALL ON public."AppSession" TO service_role;
GRANT ALL ON public."AppLoginAttempt" TO service_role;

CREATE OR REPLACE FUNCTION public.check_username_login_limit(p_username_key TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  attempts INTEGER;
BEGIN
  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_username_key, 0));
  DELETE FROM public."AppLoginAttempt"
    WHERE attempted_at < pg_catalog.now() - INTERVAL '15 minutes';
  SELECT pg_catalog.count(*) INTO attempts
    FROM public."AppLoginAttempt"
    WHERE username_key = p_username_key
      AND attempted_at >= pg_catalog.now() - INTERVAL '15 minutes';
  IF attempts >= 10 THEN
    RETURN FALSE;
  END IF;
  INSERT INTO public."AppLoginAttempt" (username_key) VALUES (p_username_key);
  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.check_username_login_limit(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_username_login_limit(TEXT) TO service_role;
