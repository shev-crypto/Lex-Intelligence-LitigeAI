import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminRole } from "@/hooks/useAdminRole";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Users, Shield, BarChart3, UserPlus, Trash2, Search, Loader2,
  CreditCard, Tag, Gift, Crown, Ban, AlertTriangle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  created_at: string;
  onboarding_completed: boolean | null;
  primary_practice_area: string | null;
  practice_name: string | null;
}

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

interface Plan {
  id: string;
  name: string;
  slug: string;
  monthly_price: number;
}

interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  billing_cycle: string | null;
  trial_end: string | null;
  current_period_end: string | null;
}

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  max_uses: number | null;
  current_uses: number;
  plan_id: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export default function Admin() {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useAdminRole();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [search, setSearch] = useState("");

  // Role assignment
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<string>("editor");
  const [addingRole, setAddingRole] = useState(false);

  // Plan assignment dialog
  const [planDialogUser, setPlanDialogUser] = useState<UserProfile | null>(null);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [assigningPlan, setAssigningPlan] = useState(false);

  // Coupon creation
  const [couponCode, setCouponCode] = useState("");
  const [couponType, setCouponType] = useState("percentage");
  const [couponValue, setCouponValue] = useState("");
  const [couponMaxUses, setCouponMaxUses] = useState("");
  const [couponPlanId, setCouponPlanId] = useState("all");
  const [couponExpiry, setCouponExpiry] = useState("");
  const [creatingCoupon, setCreatingCoupon] = useState(false);

  // Delete user confirmation
  const [deleteUser, setDeleteUser] = useState<UserProfile | null>(null);
  const [deletingUser, setDeletingUser] = useState(false);

  useEffect(() => {
    if (!roleLoading && !isAdmin) navigate("/dashboard");
  }, [roleLoading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) fetchData();
  }, [isAdmin]);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [profilesRes, rolesRes, plansRes, subsRes, couponsRes] = await Promise.all([
        supabase.rpc("get_all_profiles_admin"),
        supabase.from("user_roles").select("*"),
        supabase.from("plans").select("id, name, slug, monthly_price").eq("is_active", true),
        supabase.from("subscriptions").select("*"),
        supabase.from("coupons").select("*"),
      ]);
      if (profilesRes.data) setUsers(profilesRes.data as UserProfile[]);
      if (rolesRes.data) setRoles(rolesRes.data as UserRole[]);
      if (plansRes.data) setPlans(plansRes.data as Plan[]);
      if (subsRes.data) setSubscriptions(subsRes.data as Subscription[]);
      if (couponsRes.data) setCoupons(couponsRes.data as Coupon[]);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoadingData(false);
    }
  };

  const getUserRoles = (userId: string) => roles.filter((r) => r.user_id === userId);
  const getUserSubscription = (userId: string) => subscriptions.find((s) => s.user_id === userId);
  const getPlanName = (planId: string) => plans.find((p) => p.id === planId)?.name || "—";

  const handleAddRole = async () => {
    if (!newEmail.trim()) return;
    setAddingRole(true);
    try {
      const targetUser = users.find((u) => u.email?.toLowerCase() === newEmail.toLowerCase());
      if (!targetUser) {
        toast({ title: "User not found", description: "This email is not registered yet.", variant: "destructive" });
        return;
      }
      const { error } = await supabase.from("user_roles").insert({
        user_id: targetUser.id, role: newRole as any, granted_by: user?.id,
      });
      if (error) {
        if (error.code === "23505") toast({ title: "Already assigned", description: "User already has this role." });
        else throw error;
      } else {
        toast({ title: "Role assigned", description: `${newRole} role assigned to ${newEmail}` });
        setNewEmail("");
        fetchData();
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setAddingRole(false);
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    const { error } = await supabase.from("user_roles").delete().eq("id", roleId);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Role removed" }); fetchData(); }
  };

  const handleAssignPlan = async () => {
    if (!planDialogUser || !selectedPlan) return;
    setAssigningPlan(true);
    try {
      const existingSub = getUserSubscription(planDialogUser.id);
      if (existingSub) {
        const { error } = await supabase.from("subscriptions").update({
          plan_id: selectedPlan,
          status: "active",
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        }).eq("id", existingSub.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("subscriptions").insert({
          user_id: planDialogUser.id,
          plan_id: selectedPlan,
          status: "active",
          billing_cycle: "monthly",
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        });
        if (error) throw error;
      }
      toast({ title: "Plan assigned", description: `${getPlanName(selectedPlan)} assigned to ${planDialogUser.full_name || planDialogUser.email}` });
      setPlanDialogUser(null);
      setSelectedPlan("");
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setAssigningPlan(false);
    }
  };

  const handleCreateCoupon = async () => {
    if (!couponCode.trim() || !couponValue) return;
    setCreatingCoupon(true);
    try {
      const { error } = await supabase.from("coupons").insert({
        code: couponCode.toUpperCase().trim(),
        discount_type: couponType,
        discount_value: parseInt(couponValue),
        max_uses: couponMaxUses ? parseInt(couponMaxUses) : null,
        plan_id: couponPlanId === "all" ? null : couponPlanId,
        expires_at: couponExpiry || null,
        created_by: user?.id,
      } as any);
      if (error) throw error;
      toast({ title: "Coupon created", description: `Code: ${couponCode.toUpperCase()}` });
      setCouponCode("");
      setCouponValue("");
      setCouponMaxUses("");
      setCouponExpiry("");
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setCreatingCoupon(false);
    }
  };

  const handleToggleCoupon = async (couponId: string, currentActive: boolean) => {
    const { error } = await supabase.from("coupons").update({ is_active: !currentActive } as any).eq("id", couponId);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else fetchData();
  };

  const handleDeleteCoupon = async (couponId: string) => {
    const { error } = await supabase.from("coupons").delete().eq("id", couponId);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Coupon deleted" }); fetchData(); }
  };

  const handleRemoveUser = async () => {
    if (!deleteUser) return;
    setDeletingUser(true);
    try {
      // Remove roles, subscription, then profile-level cleanup
      await supabase.from("user_roles").delete().eq("user_id", deleteUser.id);
      const sub = getUserSubscription(deleteUser.id);
      if (sub) await supabase.from("subscriptions").delete().eq("id", sub.id);
      toast({ title: "User removed", description: `Removed roles & subscription for ${deleteUser.email}` });
      setDeleteUser(null);
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setDeletingUser(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      (u.full_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (u.email?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const roleColor: Record<string, string> = {
    admin: "bg-risk-red/10 text-risk-red",
    editor: "bg-risk-amber/10 text-risk-amber",
    viewer: "bg-risk-green/10 text-risk-green",
  };

  if (roleLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-platinum">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }
  if (!isAdmin) return null;

  const totalUsers = users.length;
  const adminCount = roles.filter((r) => r.role === "admin").length;
  const onboardedCount = users.filter((u) => u.onboarding_completed).length;
  const activeSubCount = subscriptions.filter((s) => s.status === "active" || s.status === "trialing").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Users", value: totalUsers, icon: Users, color: "text-gold" },
          { label: "Admins", value: adminCount, icon: Shield, color: "text-risk-red" },
          { label: "Onboarded", value: onboardedCount, icon: BarChart3, color: "text-risk-green" },
          { label: "Subscriptions", value: activeSubCount, icon: CreditCard, color: "text-primary" },
        ].map((stat) => (
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

      <Tabs defaultValue="users">
        <TabsList className="flex-wrap">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="plans">Plans & Subscriptions</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
        </TabsList>

        {/* ── Users Tab ── */}
        <TabsContent value="users" className="mt-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
          </div>
          <Card className="shadow-card overflow-auto">
            {loadingData ? (
              <CardContent className="p-6 space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
              </CardContent>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No users found.</TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((u) => {
                      const sub = getUserSubscription(u.id);
                      return (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium">{u.full_name || "—"}</TableCell>
                          <TableCell className="text-sm">{u.email}</TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {getUserRoles(u.id).map((r) => (
                                <Badge key={r.id} className={`${roleColor[r.role] || ""} border-0 text-xs capitalize`}>{r.role}</Badge>
                              ))}
                              {getUserRoles(u.id).length === 0 && <span className="text-xs text-muted-foreground">user</span>}
                            </div>
                          </TableCell>
                          <TableCell>
                            {sub ? (
                              <Badge variant="outline" className="text-xs">
                                {getPlanName(sub.plan_id)} ({sub.status})
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">None</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={u.onboarding_completed ? "text-risk-green" : "text-risk-amber"}>
                              {u.onboarding_completed ? "Active" : "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(u.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" title="Assign Plan" onClick={() => { setPlanDialogUser(u); setSelectedPlan(sub?.plan_id || ""); }}>
                                <Crown className="h-4 w-4 text-gold" />
                              </Button>
                              <Button variant="ghost" size="icon" title="Remove User" onClick={() => setDeleteUser(u)} className="text-destructive hover:text-destructive/80">
                                <Ban className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            )}
          </Card>
        </TabsContent>

        {/* ── Roles Tab ── */}
        <TabsContent value="roles" className="mt-6 space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-gold" /> Assign Role
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input placeholder="User email address" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="flex-1" />
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleAddRole} disabled={addingRole || !newEmail} className="bg-gold text-ink hover:bg-gold/90 font-semibold">
                  {addingRole ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4 mr-1" />}
                  Assign
                </Button>
              </div>
              <div className="mt-4 text-xs text-muted-foreground space-y-1">
                <p><strong>Admin</strong> — Full access: manage users, roles, billing, and all content.</p>
                <p><strong>Editor</strong> — Can create and edit matters, documents, and contracts.</p>
                <p><strong>Viewer</strong> — Read-only access. Can view but not edit or delete.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-gold" /> Current Role Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingData ? (
                <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
              ) : roles.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No roles assigned yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Assigned</TableHead>
                      <TableHead className="w-20">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map((r) => {
                      const userProfile = users.find((u) => u.id === r.user_id);
                      return (
                        <TableRow key={r.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{userProfile?.full_name || "—"}</p>
                              <p className="text-xs text-muted-foreground">{userProfile?.email}</p>
                            </div>
                          </TableCell>
                          <TableCell><Badge className={`${roleColor[r.role] || ""} border-0 capitalize`}>{r.role}</Badge></TableCell>
                          <TableCell className="text-sm text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveRole(r.id)} className="text-destructive hover:text-destructive/80">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Plans & Subscriptions Tab ── */}
        <TabsContent value="plans" className="mt-6 space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-gold" /> Active Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingData ? (
                <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
              ) : subscriptions.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No subscriptions yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Cycle</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions.map((s) => {
                      const subUser = users.find((u) => u.id === s.user_id);
                      return (
                        <TableRow key={s.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{subUser?.full_name || "—"}</p>
                              <p className="text-xs text-muted-foreground">{subUser?.email}</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{getPlanName(s.plan_id)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              s.status === "active" ? "text-risk-green" :
                              s.status === "trialing" ? "text-risk-amber" : "text-risk-red"
                            }>
                              {s.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm capitalize">{s.billing_cycle || "—"}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {s.current_period_end ? new Date(s.current_period_end).toLocaleDateString() : "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => { setPlanDialogUser(subUser || null); setSelectedPlan(s.plan_id); }}>
                              Change Plan
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Coupons Tab ── */}
        <TabsContent value="coupons" className="mt-6 space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Gift className="h-5 w-5 text-gold" /> Create Coupon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input placeholder="Coupon code (e.g. WELCOME50)" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                <Select value={couponType} onValueChange={setCouponType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (₦)</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="number" placeholder={couponType === "percentage" ? "Discount %" : "Amount in ₦"} value={couponValue} onChange={(e) => setCouponValue(e.target.value)} />
                <Input type="number" placeholder="Max uses (leave empty = unlimited)" value={couponMaxUses} onChange={(e) => setCouponMaxUses(e.target.value)} />
                <Select value={couponPlanId} onValueChange={setCouponPlanId}>
                  <SelectTrigger><SelectValue placeholder="Applicable plan" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    {plans.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input type="date" placeholder="Expiry date" value={couponExpiry} onChange={(e) => setCouponExpiry(e.target.value)} />
              </div>
              <Button onClick={handleCreateCoupon} disabled={creatingCoupon || !couponCode || !couponValue} className="bg-gold text-ink hover:bg-gold/90 font-semibold">
                {creatingCoupon ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Tag className="h-4 w-4 mr-1" />}
                Create Coupon
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Tag className="h-5 w-5 text-gold" /> Existing Coupons
              </CardTitle>
            </CardHeader>
            <CardContent>
              {coupons.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No coupons created yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Uses</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coupons.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-mono font-semibold">{c.code}</TableCell>
                        <TableCell>{c.discount_type === "percentage" ? `${c.discount_value}%` : `₦${c.discount_value.toLocaleString()}`}</TableCell>
                        <TableCell>{c.current_uses}/{c.max_uses || "∞"}</TableCell>
                        <TableCell>{c.plan_id ? getPlanName(c.plan_id) : "All"}</TableCell>
                        <TableCell className="text-sm">{c.expires_at ? new Date(c.expires_at).toLocaleDateString() : "Never"}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={c.is_active ? "text-risk-green" : "text-risk-red"}>
                            {c.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleToggleCoupon(c.id, c.is_active)}>
                              {c.is_active ? "Disable" : "Enable"}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteCoupon(c.id)} className="text-destructive hover:text-destructive/80">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Assign Plan Dialog ── */}
      <Dialog open={!!planDialogUser} onOpenChange={(open) => !open && setPlanDialogUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Plan to {planDialogUser?.full_name || planDialogUser?.email}</DialogTitle>
            <DialogDescription>Select a plan to assign or upgrade this user to.</DialogDescription>
          </DialogHeader>
          <Select value={selectedPlan} onValueChange={setSelectedPlan}>
            <SelectTrigger><SelectValue placeholder="Select a plan" /></SelectTrigger>
            <SelectContent>
              {plans.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name} — ₦{p.monthly_price.toLocaleString()}/mo
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPlanDialogUser(null)}>Cancel</Button>
            <Button onClick={handleAssignPlan} disabled={assigningPlan || !selectedPlan} className="bg-gold text-ink hover:bg-gold/90">
              {assigningPlan ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Crown className="h-4 w-4 mr-1" />}
              Assign Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete User Confirmation ── */}
      <Dialog open={!!deleteUser} onOpenChange={(open) => !open && setDeleteUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" /> Remove User
            </DialogTitle>
            <DialogDescription>
              This will remove all roles and subscription for <strong>{deleteUser?.email}</strong>. The user account itself will remain but will lose all access. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUser(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRemoveUser} disabled={deletingUser}>
              {deletingUser ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Ban className="h-4 w-4 mr-1" />}
              Remove User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
