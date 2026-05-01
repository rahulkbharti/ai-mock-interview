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
import { Brain } from "lucide-react";

export default function Navbar({ session }: { session: any }) {
  return (
    <nav className="border-b border-zinc-800 bg-zinc-900">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-indigo-400" />
          <span className="text-white font-bold text-xl">MockMate</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-zinc-400 hover:text-white text-sm transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/interview"
            className="text-zinc-400 hover:text-white text-sm transition-colors"
          >
            Practice
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer w-8 h-8">
                <AvatarImage src={session?.user?.image || ""} />
                <AvatarFallback className="bg-indigo-600 text-white text-sm">
                  {session?.user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-zinc-900 border-zinc-800"
            >
              <DropdownMenuItem className="text-zinc-300 text-sm">
                {session?.user?.email}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-red-400 cursor-pointer"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
