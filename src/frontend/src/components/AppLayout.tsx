import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Archive,
  Building2,
  Calculator,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Shield,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCallerProfile, useIsAdmin } from "../hooks/useQueries";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/documents", label: "Saved Documents", icon: Archive },
  { to: "/calculator", label: "RCN Calculator", icon: Calculator },
  { to: "/profile", label: "My Profile", icon: User },
];

const adminNavItem = { to: "/admin", label: "Admin Panel", icon: Shield };

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { clear } = useInternetIdentity();
  const { data: profile } = useCallerProfile();
  const { data: isAdmin } = useIsAdmin();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const allNavItems = isAdmin ? [...navItems, adminNavItem] : navItems;

  const handleLogout = () => {
    clear();
    window.location.href = "/login";
  };

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "SBZ";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden w-full border-0"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-sidebar shadow-nav transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gold text-sidebar-primary-foreground">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display font-bold text-lg text-sidebar-foreground leading-none">
              SBZ TradeDesk
            </div>
            <div className="text-[11px] text-sidebar-foreground/60 mt-0.5">
              SBZ Enterprises
            </div>
          </div>
          <button
            type="button"
            className="ml-auto lg:hidden text-sidebar-foreground/60 hover:text-sidebar-foreground"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {allNavItems.map(({ to, label, icon: Icon }) => {
              const active = currentPath === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setSidebarOpen(false)}
                  data-ocid={`nav.${label.toLowerCase().replace(/\s+/g, "-")}.link`}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 flex-shrink-0",
                      active ? "text-gold" : "",
                    )}
                  />
                  {label}
                  {active && (
                    <ChevronRight className="w-3 h-3 ml-auto text-gold" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Quick generate section */}
          <div className="mt-6">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 mb-2">
              Quick Generate
            </p>
            <div className="space-y-1">
              {[
                { id: "proforma-invoice", label: "Proforma Invoice" },
                { id: "sales-contract", label: "Sales Contract" },
                { id: "lc-draft", label: "LC Draft (MT700)" },
              ].map(({ id, label }) => (
                <Link
                  key={id}
                  to="/generate/$docType"
                  params={{ docType: id }}
                  onClick={() => setSidebarOpen(false)}
                  data-ocid={`nav.quick-${id}.link`}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* User section */}
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gold text-sidebar-primary-foreground text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-sidebar-foreground truncate">
                {profile?.name || "Trader"}
              </p>
              <p className="text-[11px] text-sidebar-foreground/50 truncate">
                {isAdmin ? "Administrator" : "Trader"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              data-ocid="nav.logout.button"
              className="p-1.5 rounded text-sidebar-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <header className="flex items-center justify-between px-4 py-3 border-b bg-background lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            data-ocid="nav.menu.button"
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded bg-gold">
              <Building2 className="w-4 h-4 text-sidebar-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">
              SBZ TradeDesk
            </span>
          </div>
          <div className="w-8" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
