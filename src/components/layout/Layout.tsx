import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  FileSearch,
  FolderOpen,
  Scale,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { TrialBanner } from "@/components/TrialBanner";
import { NotificationBell } from "@/components/NotificationBell";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Regulatory Feed", url: "/regulatory-feed", icon: Newspaper },
  { title: "Contract Auditor", url: "/contract-auditor", icon: FileSearch },
  { title: "Document Vault", url: "/document-vault", icon: FolderOpen },
  { title: "Trial Prep Studio", url: "/trial-prep", icon: Scale },
  { title: "Settings", url: "/settings", icon: Settings },
];

function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <div className="flex h-16 items-center px-4 border-b border-sidebar-border">
        {!collapsed && (
          <span className="font-heading text-xl bg-gradient-to-r from-gold via-gold/90 to-white bg-clip-text text-transparent tracking-tight">
            LitigeAI
          </span>
        )}
        {collapsed && (
          <span className="font-heading text-xl text-gold">L</span>
        )}
      </div>
      <SidebarContent className="pt-4">
        {/* Trial banner */}
        {!collapsed && <TrialBanner />}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      activeClassName="border-l-[3px] border-gold text-gold bg-sidebar-accent"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { profile, signOut } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top Navbar */}
          <header className="h-16 flex items-center justify-between border-b bg-card px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
            </div>
            <div className="flex items-center gap-4">
              <NotificationBell />
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gold/20 flex items-center justify-center">
                  <span className="text-sm font-semibold text-gold">
                    {profile?.full_name?.charAt(0) ?? "U"}
                  </span>
                </div>
                <span className="text-sm font-medium hidden sm:inline">
                  {profile?.full_name ?? "User"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut()}
                title="Sign out"
              >
                <LogOut className="h-5 w-5 text-steel" />
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-platinum p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
