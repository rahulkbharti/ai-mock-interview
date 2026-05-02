import { Code, Globe } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("border-t border-zinc-800 bg-zinc-950 py-12", className)}>
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <p className="text-zinc-400 font-bold text-lg">MockMate</p>
          <p className="text-zinc-500 text-sm max-w-xs text-center md:text-left">
            Empowering professionals to master their interview skills with AI-driven mock sessions.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
            >
              <Code className="w-4 h-4" />
              GitHub
            </Link>
            <Link
              href="#"
              className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
            >
              <Globe className="w-4 h-4" />
              LinkedIn
            </Link>
          </div>
          <p className="text-zinc-600 text-xs mt-2">
            © {new Date().getFullYear()} MockMate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
