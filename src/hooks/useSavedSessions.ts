import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface SavedSession {
  id: string;
  session_type: string;
  title: string;
  session_data: Record<string, any>;
  status: string;
  created_at: string;
  updated_at: string;
}

export function useSavedSessions(sessionType: string) {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SavedSession[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("saved_sessions")
      .select("*")
      .eq("user_id", user.id)
      .eq("session_type", sessionType)
      .order("updated_at", { ascending: false });
    setSessions((data as SavedSession[]) || []);
    setLoading(false);
  }, [user, sessionType]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const saveSession = useCallback(
    async (title: string, data: Record<string, any>, existingId?: string) => {
      if (!user) return null;

      if (existingId) {
        const { data: updated } = await supabase
          .from("saved_sessions")
          .update({ title, session_data: data as any })
          .eq("id", existingId)
          .select()
          .single();
        fetchSessions();
        return updated;
      }

      const { data: created } = await supabase
        .from("saved_sessions")
        .insert({
          user_id: user.id,
          session_type: sessionType,
          title,
          session_data: data as any,
        })
        .select()
        .single();
      fetchSessions();
      return created;
    },
    [user, sessionType, fetchSessions]
  );

  const completeSession = useCallback(
    async (sessionId: string) => {
      await supabase
        .from("saved_sessions")
        .update({ status: "completed" })
        .eq("id", sessionId);
      fetchSessions();
    },
    [fetchSessions]
  );

  const deleteSession = useCallback(
    async (sessionId: string) => {
      await supabase.from("saved_sessions").delete().eq("id", sessionId);
      fetchSessions();
    },
    [fetchSessions]
  );

  return { sessions, loading, saveSession, completeSession, deleteSession, refetch: fetchSessions };
}
