import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Plan {
  id: string;
  name: string;
  slug: string;
  monthly_price: number;
  annual_price: number;
  matter_limit: number | null;
  audit_limit_monthly: number | null;
  trial_prep_limit_monthly: number | null;
  storage_limit_gb: number | null;
  team_member_limit: number | null;
  features: unknown;
  is_active: boolean;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  billing_cycle: string;
  current_period_start: string | null;
  current_period_end: string | null;
  trial_end: string | null;
  payment_gateway: string;
  cancelled_at: string | null;
  created_at: string;
  plan?: Plan;
}

export interface UsageTracking {
  contract_audits_used: number;
  trial_prep_used: number;
  storage_used_mb: number;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [usage, setUsage] = useState<UsageTracking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [plansRes, subRes, usageRes] = await Promise.all([
          supabase.from("plans").select("*").eq("is_active", true).order("monthly_price"),
          supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", user.id)
            .in("status", ["trialing", "active", "past_due"])
            .order("created_at", { ascending: false })
            .limit(1),
          supabase
            .from("usage_tracking")
            .select("*")
            .eq("user_id", user.id)
            .eq("month_year", new Date().toISOString().slice(0, 7))
            .maybeSingle(),
        ]);

        if (plansRes.data) setPlans(plansRes.data as Plan[]);

        if (subRes.data && subRes.data.length > 0) {
          const sub = subRes.data[0] as Subscription;
          const plan = plansRes.data?.find((p: Plan) => p.id === sub.plan_id);
          if (plan) sub.plan = plan as Plan;
          setSubscription(sub);
        }

        if (usageRes.data) {
          setUsage({
            contract_audits_used: usageRes.data.contract_audits_used ?? 0,
            trial_prep_used: usageRes.data.trial_prep_used ?? 0,
            storage_used_mb: usageRes.data.storage_used_mb ?? 0,
          });
        }
      } catch (err) {
        console.error("Failed to fetch subscription data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const trialDaysRemaining = subscription?.trial_end
    ? Math.max(0, Math.ceil((new Date(subscription.trial_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  const isTrialing = subscription?.status === "trialing";
  const isActive = subscription?.status === "active";
  const isPastDue = subscription?.status === "past_due";
  const hasActiveSubscription = isTrialing || isActive;

  const canCreateMatter = () => {
    if (!subscription?.plan) return true;
    const limit = subscription.plan.matter_limit;
    return limit === null; // null = unlimited
  };

  const canRunAudit = () => {
    if (!subscription?.plan || !usage) return true;
    const limit = subscription.plan.audit_limit_monthly;
    return limit === null || usage.contract_audits_used < limit;
  };

  const canRunTrialPrep = () => {
    if (!subscription?.plan || !usage) return true;
    const limit = subscription.plan.trial_prep_limit_monthly;
    return limit === null || usage.trial_prep_used < limit;
  };

  return {
    subscription,
    plans,
    usage,
    loading,
    trialDaysRemaining,
    isTrialing,
    isActive,
    isPastDue,
    hasActiveSubscription,
    canCreateMatter,
    canRunAudit,
    canRunTrialPrep,
  };
}
