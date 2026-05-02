"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Brain, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar({ session }: { session: any }) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="bg-indigo-600/20 p-1.5 rounded-lg group-hover:bg-indigo-600/30 transition-colors">
            <Brain className="w-6 h-6 text-indigo-400" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">MockMate</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/dashboard"
            className="text-zinc-400 hover:text-white text-sm font-medium transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/interview"
            className="text-zinc-400 hover:text-white text-sm font-medium transition-colors"
          >
            Practice
          </Link>
          <Link
            href="/results"
            className="text-zinc-400 hover:text-white text-sm font-medium transition-colors"
          >
            Results
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer w-9 h-9 ring-2 ring-zinc-800 ring-offset-2 ring-offset-zinc-950 hover:ring-indigo-500/50 transition-all">
                <AvatarImage src={session?.user?.image || ""} />
                <AvatarFallback className="bg-indigo-600 text-white text-sm">
                  {session?.user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-zinc-900 border-zinc-800 text-zinc-300"
            >
              <div className="px-2 py-1.5 border-b border-zinc-800 mb-1">
                <p className="text-sm font-medium text-white truncate">
                  {session?.user?.name}
                </p>
                <p className="text-xs text-zinc-500 truncate">
                  {session?.user?.email}
                </p>
              </div>
              <DropdownMenuItem className="cursor-pointer hover:bg-zinc-800">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-red-400 cursor-pointer hover:bg-red-500/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
