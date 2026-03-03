import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { Calendar, Home, Rss, User, Wallet } from "lucide-react";
import React from "react";

const tabs = [
  { to: "/", icon: Home, label: "home" },
  { to: "/bookings", icon: Calendar, label: "bookings" },
  { to: "/feed", icon: Rss, label: "feed" },
  { to: "/wallet", icon: Wallet, label: "wallet" },
  { to: "/profile", icon: User, label: "profile" },
];

export function BottomNav() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t"
      style={{
        background: "oklch(0.10 0.008 60)",
        borderColor: "oklch(0.22 0.01 60)",
      }}
      data-ocid="bottom_nav"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.to === "/"
              ? currentPath === "/"
              : currentPath.startsWith(tab.to);
          return (
            <Link
              key={tab.to}
              to={tab.to}
              data-ocid={`bottom_nav.${tab.label}.link`}
              className="flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[60px] active:scale-95"
            >
              <Icon
                className="w-[22px] h-[22px] transition-all duration-200"
                style={{
                  color: isActive
                    ? "oklch(0.72 0.12 75)"
                    : "oklch(0.60 0.008 60)",
                  strokeWidth: isActive ? 2.5 : 1.8,
                }}
              />
              <span
                className="text-[10px] font-medium tracking-wide transition-all duration-200"
                style={{
                  color: isActive
                    ? "oklch(0.72 0.12 75)"
                    : "oklch(0.55 0.008 60)",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
