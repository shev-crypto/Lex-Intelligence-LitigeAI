import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const SUPER_ADMIN_EMAIL = "shevowinda@gmail.com";

export function useAdminRole() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setIsSuperAdmin(false);
      setLoading(false);
      return;
    }

    // Super admin by email — always granted
    const superAdmin = user.email?.toLowerCase() === SUPER_ADMIN_EMAIL;
    setIsSuperAdmin(superAdmin);

    if (superAdmin) {
      setIsAdmin(true);
      setLoading(false);
      return;
    }

    const check = async () => {
      const { data } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      setIsAdmin(!!data);
      setLoading(false);
    };

    check();
  }, [user]);

  return { isAdmin, isSuperAdmin, loading };
}
