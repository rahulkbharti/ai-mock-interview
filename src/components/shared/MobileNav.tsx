"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Brain, History, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Home",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Practice",
    href: "/interview",
    icon: Brain,
  },
  {
    label: "Results",
    href: "/results",
    icon: History,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: User,
  },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
      <nav className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-800/50 rounded-3xl shadow-2xl shadow-black/50 px-2">
        <div className="flex justify-around items-center h-20">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300",
                  isActive ? "text-indigo-400" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {/* Active Indicator Glow */}
                {isActive && (
                  <div className="absolute top-0 w-12 h-1 bg-indigo-500 rounded-full blur-[4px] opacity-50" />
                )}
                
                <div className={cn(
                  "p-2 rounded-2xl transition-all duration-300",
                  isActive && "bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                )}>
                  <item.icon className={cn(
                    "w-6 h-6 transition-transform duration-300",
                    isActive && "scale-110"
                  )} />
                </div>
                
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest transition-all duration-300",
                  isActive ? "opacity-100 translate-y-0" : "opacity-60"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
      {/* Safe Area Spacer for very bottom */}
      <div className="h-[env(safe-area-inset-bottom,0px)]" />
    </div>
  );
}
