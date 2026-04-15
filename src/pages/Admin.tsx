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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Shield,
  BarChart3,
  UserPlus,
  Trash2,
  Search,
  Loader2,
  ArrowLeft,
  CreditCard,
  FolderOpen,
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

export default function Admin() {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useAdminRole();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [search, setSearch] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<string>("editor");
  const [addingRole, setAddingRole] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate("/dashboard");
    }
  }, [roleLoading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [profilesRes, rolesRes] = await Promise.all([
        supabase.rpc("get_all_profiles_admin"),
        supabase.from("user_roles").select("*"),
      ]);

      if (profilesRes.data) setUsers(profilesRes.data as UserProfile[]);
      if (rolesRes.data) setRoles(rolesRes.data as UserRole[]);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoadingData(false);
    }
  };

  const getUserRoles = (userId: string) => {
    return roles.filter((r) => r.user_id === userId);
  };

  const handleAddRole = async () => {
    if (!newEmail.trim()) return;
    setAddingRole(true);

    try {
      // Find user by email from loaded profiles
      const targetUser = users.find(
        (u) => u.email?.toLowerCase() === newEmail.toLowerCase()
      );
      if (!targetUser) {
        toast({
          title: "User not found",
          description: "This email is not registered yet. They need to sign up first.",
          variant: "destructive",
        });
        setAddingRole(false);
        return;
      }

      const { error } = await supabase.from("user_roles").insert({
        user_id: targetUser.id,
        role: newRole as any,
        granted_by: user?.id,
      });

      if (error) {
        if (error.code === "23505") {
          toast({ title: "Already assigned", description: "This user already has this role." });
        } else {
          throw error;
        }
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
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Role removed" });
      fetchData();
    }
  };

  const toggleSelectUser = (userId: string) => {
    setSelectedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map((u) => u.id)));
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

  return (
    <div className="min-h-screen bg-platinum">
      {/* Header */}
      <header className="h-16 flex items-center justify-between border-b bg-card px-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-gold" />
            <h1 className="text-lg font-heading">Admin Dashboard</h1>
          </div>
        </div>
        <span className="text-sm text-muted-foreground">
          Signed in as <span className="font-medium text-foreground">{user?.email}</span>
        </span>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Users", value: totalUsers, icon: Users, color: "text-gold" },
            { label: "Admins", value: adminCount, icon: Shield, color: "text-risk-red" },
            { label: "Onboarded", value: onboardedCount, icon: BarChart3, color: "text-risk-green" },
            { label: "Subscriptions", value: "—", icon: CreditCard, color: "text-primary" },
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
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="roles">Role Management</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <span className="text-sm text-muted-foreground">
                {selectedUsers.size > 0 && `${selectedUsers.size} selected`}
              </span>
            </div>

            <Card className="shadow-card">
              {loadingData ? (
                <CardContent className="p-6 space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </CardContent>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <Checkbox
                          checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Practice Area</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No users found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedUsers.has(u.id)}
                              onCheckedChange={() => toggleSelectUser(u.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{u.full_name || "—"}</TableCell>
                          <TableCell className="text-sm">{u.email}</TableCell>
                          <TableCell className="text-sm">{u.primary_practice_area || "—"}</TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {getUserRoles(u.id).map((r) => (
                                <Badge key={r.id} className={`${roleColor[r.role] || ""} border-0 text-xs capitalize`}>
                                  {r.role}
                                </Badge>
                              ))}
                              {getUserRoles(u.id).length === 0 && (
                                <span className="text-xs text-muted-foreground">user</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(u.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={u.onboarding_completed ? "text-risk-green" : "text-risk-amber"}
                            >
                              {u.onboarding_completed ? "Active" : "Pending"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </Card>
          </TabsContent>

          {/* Role Management Tab */}
          <TabsContent value="roles" className="mt-6 space-y-6">
            {/* Add Role */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-gold" /> Assign Role
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    placeholder="User email address"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={newRole} onValueChange={setNewRole}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleAddRole}
                    disabled={addingRole || !newEmail}
                    className="bg-gold text-ink hover:bg-gold/90 font-semibold"
                  >
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

            {/* Current Roles */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-gold" /> Current Role Assignments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingData ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-10 w-full" />
                    ))}
                  </div>
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
                            <TableCell>
                              <Badge className={`${roleColor[r.role] || ""} border-0 capitalize`}>{r.role}</Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(r.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveRole(r.id)}
                                className="text-destructive hover:text-destructive/80"
                              >
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
        </Tabs>
      </main>
    </div>
  );
}
