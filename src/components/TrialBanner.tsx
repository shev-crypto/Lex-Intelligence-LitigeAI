import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

export function TrialBanner() {
  const { isTrialing, trialDaysRemaining } = useSubscription();

  if (!isTrialing) return null;

  return (
    <div className="mx-2 mb-2 rounded-lg bg-gold/10 border border-gold/20 px-3 py-2.5 text-xs">
      <div className="flex items-center gap-2 text-gold">
        <Zap className="h-3.5 w-3.5 shrink-0" />
        <span className="font-medium">
          Free trial — {trialDaysRemaining} day{trialDaysRemaining !== 1 ? "s" : ""} remaining
        </span>
      </div>
      <Link
        to="/pricing"
        className="mt-1 block text-gold/80 hover:text-gold underline underline-offset-2 transition-colors"
      >
        Upgrade now
      </Link>
    </div>
  );
}
