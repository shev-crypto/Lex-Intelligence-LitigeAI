
-- Create coupons table
CREATE TABLE public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL DEFAULT 'percentage',
  discount_value INTEGER NOT NULL DEFAULT 0,
  max_uses INTEGER DEFAULT NULL,
  current_uses INTEGER NOT NULL DEFAULT 0,
  plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read active coupons
CREATE POLICY "Authenticated users can view active coupons"
ON public.coupons FOR SELECT TO authenticated
USING (is_active = true);

-- Admins can do everything
CREATE POLICY "Admins can manage coupons"
ON public.coupons FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update subscriptions (assign plans)
CREATE POLICY "Admins can update any subscription"
ON public.subscriptions FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete subscriptions
CREATE POLICY "Admins can delete any subscription"
ON public.subscriptions FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can insert subscriptions for users
CREATE POLICY "Admins can insert subscriptions"
ON public.subscriptions FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can view all subscriptions
CREATE POLICY "Admins can view all subscriptions"
ON public.subscriptions FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Validation trigger for coupons
CREATE OR REPLACE FUNCTION public.validate_coupon()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.discount_type NOT IN ('percentage', 'fixed') THEN
    RAISE EXCEPTION 'Invalid discount type: %', NEW.discount_type;
  END IF;
  IF NEW.discount_value < 0 THEN
    RAISE EXCEPTION 'Discount value cannot be negative';
  END IF;
  IF NEW.discount_type = 'percentage' AND NEW.discount_value > 100 THEN
    RAISE EXCEPTION 'Percentage discount cannot exceed 100';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_coupon_trigger
BEFORE INSERT OR UPDATE ON public.coupons
FOR EACH ROW EXECUTE FUNCTION public.validate_coupon();
