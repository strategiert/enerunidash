import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Calendar,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  Zap
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/calendar", icon: Calendar, label: "Jahresplaner" },
    { href: "/keywords", icon: Search, label: "Keyword Analyse" },
    { href: "/content", icon: FileText, label: "Content Strategie" },
    { href: "/campaigns", icon: Zap, label: "Kampagnen" },
    { href: "/settings", icon: Settings, label: "Einstellungen" },
  ];

  const NavContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      <nav className="px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href} onClick={onNavigate}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 mb-1 font-medium min-h-[44px]",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>
    </>
  );

  const SidebarFooter = () => (
    <div className="p-4 border-t border-sidebar-border">
      <div className="bg-sidebar-accent/50 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">Budget Q1</span>
          <span className="text-xs font-bold text-primary">45%</span>
        </div>
        <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
          <div className="h-full bg-primary w-[45%]" />
        </div>
      </div>
      <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive min-h-[44px]">
        <LogOut className="h-4 w-4" />
        Abmelden
      </Button>
    </div>
  );

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden md:flex w-64 border-r border-border bg-sidebar flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">enerunity</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Marketing Command Center</p>
        </div>

        <ScrollArea className="flex-1 py-4">
          <NavContent />
        </ScrollArea>

        <SidebarFooter />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 h-full">
          {/* Header */}
          <header className="h-14 md:h-16 border-b border-border bg-background/50 backdrop-blur flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
            {/* Mobile: Hamburger + Logo */}
            <div className="flex items-center gap-3 md:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <SheetHeader className="p-4 border-b border-border">
                    <SheetTitle className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                        <Zap className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <span className="font-bold text-lg tracking-tight">enerunity</span>
                    </SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="flex-1 py-4">
                    <NavContent onNavigate={() => setMobileMenuOpen(false)} />
                  </ScrollArea>
                  <SidebarFooter />
                </SheetContent>
              </Sheet>
              <span className="font-semibold text-lg">enerunity</span>
            </div>

            {/* Desktop: Page title */}
            <h1 className="hidden md:block text-xl font-semibold tracking-tight">
              {navItems.find(i => i.href === location)?.label || "Dashboard"}
            </h1>

            {/* Status & Avatar */}
            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden sm:flex text-sm text-muted-foreground items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                <span className="hidden lg:inline">System Status:</span> Online
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
                MK
              </div>
            </div>
          </header>

          <div className="p-4 md:p-6 container max-w-7xl mx-auto pb-10">
            {children}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
