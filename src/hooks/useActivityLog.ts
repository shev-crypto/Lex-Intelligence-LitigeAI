import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useActivityLog() {
  const { user } = useAuth();

  const logActivity = useCallback(
    async (
      action_type: string,
      title: string,
      description?: string,
      metadata?: Record<string, any>
    ) => {
      if (!user) return;
      await supabase.from("user_activity").insert({
        user_id: user.id,
        action_type,
        title,
        description,
        metadata: metadata || {},
        page_url: window.location.pathname,
      });
    },
    [user]
  );

  return { logActivity };
}
