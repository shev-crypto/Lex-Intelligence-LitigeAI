
-- Subscription plans reference table
CREATE TABLE public.plans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  monthly_price integer NOT NULL,
  annual_price integer NOT NULL,
  matter_limit integer,
  audit_limit_monthly integer,
  trial_prep_limit_monthly integer,
  storage_limit_gb integer,
  team_member_limit integer,
  features jsonb NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- User subscriptions
CREATE TABLE public.subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan_id uuid REFERENCES public.plans(id) NOT NULL,
  status text DEFAULT 'trialing' NOT NULL,
  billing_cycle text DEFAULT 'monthly',
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  trial_end timestamp with time zone,
  paystack_customer_code text,
  paystack_subscription_code text,
  paystack_email_token text,
  flutterwave_customer_id text,
  flutterwave_subscription_id text,
  flutterwave_tx_ref text,
  payment_gateway text DEFAULT 'paystack',
  cancelled_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Validate subscription status via trigger
CREATE OR REPLACE FUNCTION public.validate_subscription_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status NOT IN ('trialing', 'active', 'past_due', 'cancelled', 'expired') THEN
    RAISE EXCEPTION 'Invalid subscription status: %', NEW.status;
  END IF;
  IF NEW.billing_cycle IS NOT NULL AND NEW.billing_cycle NOT IN ('monthly', 'annual') THEN
    RAISE EXCEPTION 'Invalid billing cycle: %', NEW.billing_cycle;
  END IF;
  IF NEW.payment_gateway IS NOT NULL AND NEW.payment_gateway NOT IN ('paystack', 'flutterwave') THEN
    RAISE EXCEPTION 'Invalid payment gateway: %', NEW.payment_gateway;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER validate_subscription_before_insert_update
BEFORE INSERT OR UPDATE ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION public.validate_subscription_status();

-- Payment transactions
CREATE TABLE public.payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subscription_id uuid REFERENCES public.subscriptions(id),
  amount integer NOT NULL,
  currency text DEFAULT 'NGN',
  status text NOT NULL,
  paystack_reference text UNIQUE,
  paystack_transaction_id text,
  flutterwave_reference text UNIQUE,
  flutterwave_transaction_id text,
  payment_gateway text DEFAULT 'paystack',
  description text,
  created_at timestamp with time zone DEFAULT now()
);

-- Validate payment status via trigger
CREATE OR REPLACE FUNCTION public.validate_payment_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status NOT IN ('pending', 'success', 'failed') THEN
    RAISE EXCEPTION 'Invalid payment status: %', NEW.status;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER validate_payment_before_insert_update
BEFORE INSERT OR UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.validate_payment_status();

-- Usage tracking
CREATE TABLE public.usage_tracking (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  month_year text NOT NULL,
  contract_audits_used integer DEFAULT 0,
  trial_prep_used integer DEFAULT 0,
  storage_used_mb integer DEFAULT 0,
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, month_year)
);

-- Team members
CREATE TABLE public.team_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  firm_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  member_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role text DEFAULT 'lawyer',
  invited_email text,
  status text DEFAULT 'pending',
  joined_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Validate team member fields via trigger
CREATE OR REPLACE FUNCTION public.validate_team_member()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role NOT IN ('admin', 'lawyer', 'paralegal') THEN
    RAISE EXCEPTION 'Invalid team member role: %', NEW.role;
  END IF;
  IF NEW.status NOT IN ('pending', 'active', 'removed') THEN
    RAISE EXCEPTION 'Invalid team member status: %', NEW.status;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER validate_team_member_before_insert_update
BEFORE INSERT OR UPDATE ON public.team_members
FOR EACH ROW EXECUTE FUNCTION public.validate_team_member();

-- Notifications
CREATE TABLE public.notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  link text,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Waitlist
CREATE TABLE public.waitlist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  name text,
  firm_name text,
  interest text,
  source text,
  created_at timestamp with time zone DEFAULT now()
);

-- Add onboarding and admin columns to profiles
ALTER TABLE public.profiles ADD COLUMN practice_name text;
ALTER TABLE public.profiles ADD COLUMN bar_number text;
ALTER TABLE public.profiles ADD COLUMN primary_practice_area text;
ALTER TABLE public.profiles ADD COLUMN years_of_practice text;
ALTER TABLE public.profiles ADD COLUMN preferred_courts text[];
ALTER TABLE public.profiles ADD COLUMN regulatory_interests text[];
ALTER TABLE public.profiles ADD COLUMN onboarding_completed boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN notification_preferences jsonb DEFAULT '{"email_regulatory_alerts": true, "email_hearing_reminders": true, "email_billing": true, "email_team": true, "inapp_all": true}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN is_admin boolean DEFAULT false;

-- Enable RLS on all new tables
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Plans: anyone can read
CREATE POLICY "Anyone can read plans" ON public.plans FOR SELECT USING (true);

-- Subscriptions: users see own
CREATE POLICY "Users can view own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscription" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Payments: users see own
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);

-- Usage tracking: users see own
CREATE POLICY "Users can view own usage" ON public.usage_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own usage" ON public.usage_tracking FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own usage" ON public.usage_tracking FOR UPDATE USING (auth.uid() = user_id);

-- Team members: firm owner or member can view
CREATE POLICY "Team members can view their team" ON public.team_members FOR SELECT USING (auth.uid() = firm_id OR auth.uid() = member_id);
CREATE POLICY "Firm owner can manage team" ON public.team_members FOR INSERT WITH CHECK (auth.uid() = firm_id);
CREATE POLICY "Firm owner can update team" ON public.team_members FOR UPDATE USING (auth.uid() = firm_id);
CREATE POLICY "Firm owner can remove team members" ON public.team_members FOR DELETE USING (auth.uid() = firm_id);

-- Notifications: users manage own
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- Waitlist: anyone can insert, only admins read (via service role)
CREATE POLICY "Anyone can join waitlist" ON public.waitlist FOR INSERT WITH CHECK (true);

-- Insert plan data
INSERT INTO public.plans (name, slug, monthly_price, annual_price, matter_limit, audit_limit_monthly, trial_prep_limit_monthly, storage_limit_gb, team_member_limit, features) VALUES
('Solo', 'solo', 15000, 150000, 5, 10, 10, 2, 1, '{"document_vault": true, "contract_auditor": true, "trial_prep": true, "regulatory_feed": "read_only", "team_access": false, "api_access": false}'),
('Chambers', 'chambers', 45000, 432000, null, 50, 50, 20, 10, '{"document_vault": true, "contract_auditor": true, "trial_prep": true, "regulatory_feed": "full", "team_access": true, "api_access": false}'),
('Enterprise', 'enterprise', 0, 0, null, null, null, null, null, '{"document_vault": true, "contract_auditor": true, "trial_prep": true, "regulatory_feed": "custom", "team_access": true, "api_access": true}');
