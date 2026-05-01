import { Code, Globe } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-900 py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-zinc-500 text-sm">
          Built by{" "}
          <span className="text-white font-medium">YOUR NAME HERE</span>
        </p>

        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/YOUR_GITHUB"
            target="_blank"
            className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1 text-sm"
          >
            <Code className="w-4 h-4" />
            GitHub
          </Link>
          <Link
            href="https://linkedin.com/in/YOUR_LINKEDIN"
            target="_blank"
            className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1 text-sm"
          >
            <Globe className="w-4 h-4" />
            LinkedIn
          </Link>
        </div>

        <p className="text-zinc-600 text-xs">
          © {new Date().getFullYear()} MockMate. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
