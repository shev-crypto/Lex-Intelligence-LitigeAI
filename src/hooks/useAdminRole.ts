import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const SUPER_ADMIN_EMAIL = "shevowinda@gmail.com";

export function useAdminRole() {
  const { user } = useAuth();
  const [state, setState] = useState<{ isAdmin: boolean; isSuperAdmin: boolean; loading: boolean }>({
    isAdmin: false,
    isSuperAdmin: false,
    loading: true,
  });

  useEffect(() => {
    if (!user) {
      setState({ isAdmin: false, isSuperAdmin: false, loading: false });
      return;
    }

    const superAdmin = user.email?.toLowerCase() === SUPER_ADMIN_EMAIL;

    if (superAdmin) {
      setState({ isAdmin: true, isSuperAdmin: true, loading: false });
      return;
    }

    const check = async () => {
      const { data } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      setState({ isAdmin: !!data, isSuperAdmin: false, loading: false });
    };

    check();
  }, [user]);

  return state;
}
