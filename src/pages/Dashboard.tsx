import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FolderOpen,
  Bell,
  FileSearch,
  Calendar,
  Newspaper,
  Scale,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  History,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const stats = [
  { label: "Active Matters", value: "12", icon: FolderOpen, color: "text-gold" },
  { label: "Pending Alerts", value: "5", icon: Bell, color: "text-risk-amber" },
  { label: "Contracts Audited", value: "38", icon: FileSearch, color: "text-risk-green" },
  { label: "Upcoming Hearings", value: "3", icon: Calendar, color: "text-primary" },
];

const recentAlerts = [
  { body: "SEC Notice — New disclosure requirements for listed companies", severity: "high", time: "2h ago" },
  { body: "CBN Circular — Updated FX policy for commercial banks", severity: "medium", time: "5h ago" },
  { body: "FIRS — Tax filing deadline extension for Q1 2026", severity: "low", time: "1d ago" },
  { body: "CAC — Digital compliance certificate now required", severity: "high", time: "2d ago" },
];

const quickActions = [
  { label: "Regulatory Feed", description: "View latest alerts", url: "/regulatory-feed", icon: Newspaper },
  { label: "Audit a Contract", description: "Upload & analyze", url: "/contract-auditor", icon: FileSearch },
  { label: "Document Vault", description: "Manage matters", url: "/document-vault", icon: FolderOpen },
  { label: "Trial Prep", description: "Prepare for trial", url: "/trial-prep", icon: Scale },
];

const severityIcon = {
  high: <AlertTriangle className="h-4 w-4 text-risk-red" />,
  medium: <Clock className="h-4 w-4 text-risk-amber" />,
  low: <CheckCircle2 className="h-4 w-4 text-risk-green" />,
};

interface Activity {
  id: string;
  action_type: string;
  title: string;
  created_at: string;
  page_url: string | null;
}

export default function Dashboard() {
  const { profile, user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("user_activity")
      .select("id, action_type, title, created_at, page_url")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data) setRecentActivity(data as Activity[]);
      });
  }, [user]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-heading">
          {greeting}, {profile?.full_name?.split(" ")[0] ?? "Counsel"}
        </h1>
        <p className="text-muted-foreground mt-1">Here's your legal intelligence overview.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-card">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Alerts */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Recent Alerts</CardTitle>
            <Link to="/regulatory-feed">
              <Button variant="ghost" size="sm" className="text-gold hover:text-gold/80">
                View all <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAlerts.map((alert) => (
              <Link
                key={alert.body}
                to="/regulatory-feed"
                className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
              >
                {severityIcon[alert.severity as keyof typeof severityIcon]}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{alert.body}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{alert.time}</p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.url}
                className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="h-9 w-9 rounded-md bg-gold/10 flex items-center justify-center">
                  <action.icon className="h-4 w-4 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-medium">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="h-5 w-5 text-gold" /> Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentActivity.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                  <History className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{a.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.action_type.replace(/_/g, " ")} · {new Date(a.created_at).toLocaleDateString()}
                  </p>
                </div>
                {a.page_url && (
                  <Link to={a.page_url}>
                    <Button variant="ghost" size="sm" className="text-gold text-xs">
                      View
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
