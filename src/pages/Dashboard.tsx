import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { profile } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading">
          {greeting}, {profile?.full_name?.split(" ")[0] ?? "Counsel"}
        </h1>
        <p className="text-muted-foreground mt-1">Here's your legal intelligence overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active Matters", value: "—" },
          { label: "Pending Alerts", value: "—" },
          { label: "Contracts Audited", value: "—" },
          { label: "Upcoming Hearings", value: "—" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border-l-4 border-l-gold bg-card p-5 shadow-card">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-semibold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
