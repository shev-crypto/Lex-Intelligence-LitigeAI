import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { User, Bell, Shield, CreditCard } from "lucide-react";

export default function SettingsPage() {
  const { profile, user } = useAuth();

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <div>
        <h1 className="text-3xl font-heading">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><User className="h-5 w-5 text-gold" /> Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 rounded-full bg-gold/20 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-gold">{profile?.full_name?.charAt(0) ?? "U"}</span>
                </div>
                <Button variant="outline" size="sm">Change Photo</Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input defaultValue={profile?.full_name ?? ""} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue={user?.email ?? ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input defaultValue={profile?.role ?? "user"} disabled />
                </div>
              </div>
              <Button className="bg-gold text-ink hover:bg-gold/90 font-semibold">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Bell className="h-5 w-5 text-gold" /> Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Regulatory alerts", desc: "Get notified of new regulatory notices" },
                { label: "Hearing reminders", desc: "Reminders for upcoming court dates" },
                { label: "Contract audit results", desc: "Notifications when audits complete" },
                { label: "Weekly digest", desc: "Summary of activity every Monday" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6 space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Shield className="h-5 w-5 text-gold" /> Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" />
                <p className="text-xs text-muted-foreground">Min 12 characters with letters, numbers & symbols</p>
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" />
              </div>
              <Button className="bg-gold text-ink hover:bg-gold/90 font-semibold">Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-6 space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><CreditCard className="h-5 w-5 text-gold" /> Current Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gold/5 border border-gold/20">
                <div>
                  <p className="font-semibold">Free Trial</p>
                  <p className="text-xs text-muted-foreground">14 days remaining</p>
                </div>
                <Button className="bg-gold text-ink hover:bg-gold/90 font-semibold" size="sm">Upgrade Plan</Button>
              </div>
              <Separator />
              <p className="text-sm text-muted-foreground">Billing and plan management will be available soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
