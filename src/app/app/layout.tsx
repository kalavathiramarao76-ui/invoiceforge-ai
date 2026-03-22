"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  BarChart3,
  FileText,
  Send,
  Shield,
  Layers,
  Zap,
  Home,
  Star,
  Settings,
} from "lucide-react";
import OnboardingTour from "@/components/OnboardingTour";
import ErrorBoundary from "@/components/ErrorBoundary";
import ThemeToggle from "@/components/ThemeToggle";
import { getFavoriteCount } from "@/components/FavoriteButton";

const navItems = [
  { href: "/app", label: "Dashboard", icon: BarChart3 },
  { href: "/app/invoice", label: "Invoice", icon: FileText },
  { href: "/app/proposal", label: "Proposal", icon: Send },
  { href: "/app/contract", label: "Contract", icon: Shield },
  { href: "/app/templates", label: "Templates", icon: Layers },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    setFavCount(getFavoriteCount());
    const handler = () => setFavCount(getFavoriteCount());
    window.addEventListener("favorites-changed", handler);
    return () => window.removeEventListener("favorites-changed", handler);
  }, []);

  return (
    <div className="min-h-screen bg-bg flex">
      <OnboardingTour />
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-border bg-surface/50 backdrop-blur-xl z-40 hidden lg:flex flex-col">
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-accent" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              InvoiceForge
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/app" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-textMuted hover:text-text hover:bg-surfaceHover"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}

          {/* Favorites count */}
          {favCount > 0 && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-amber-400/80">
              <Star className="w-4 h-4 fill-amber-400/60" />
              <span>Favorites</span>
              <span className="ml-auto px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold tabular-nums">
                {favCount}
              </span>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <div className="px-4 py-2">
            <ThemeToggle />
          </div>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-textDim hover:text-text hover:bg-surfaceHover transition-all"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-border bg-bg/90 backdrop-blur-xl">
        <nav className="flex justify-around p-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/app" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs ${
                  isActive
                    ? "text-accent"
                    : "text-textDim hover:text-textMuted"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main */}
      <main role="main" className="flex-1 lg:ml-64 pb-20 lg:pb-0">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
    </div>
  );
}
