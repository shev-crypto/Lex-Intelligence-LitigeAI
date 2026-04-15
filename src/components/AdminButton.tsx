import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export function AdminButton({ variant = "icon" }: { variant?: "icon" | "link" | "sidebar" }) {
  const { user } = useAuth();
  const { isAdmin, loading } = useAdminRole();

  if (!user || loading || !isAdmin) return null;

  if (variant === "link") {
    return (
      <Link to="/admin" className="text-xs text-white/80 hover:text-gold transition-colors">
        Admin
      </Link>
    );
  }

  if (variant === "sidebar") {
    return (
      <Link
        to="/admin"
        className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
      >
        <Shield className="h-5 w-5 shrink-0 text-risk-red" />
        <span>Admin</span>
      </Link>
    );
  }

  return (
    <Link to="/admin">
      <Button variant="ghost" size="icon" title="Admin Dashboard">
        <Shield className="h-5 w-5 text-risk-red" />
      </Button>
    </Link>
  );
}
