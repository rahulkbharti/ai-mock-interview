import { Mail, ExternalLink, Code, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("border-t border-zinc-800 bg-zinc-950 py-16", className)}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo and Description */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <p className="text-white font-bold text-xl tracking-tight">MockMate</p>
            </div>
            <p className="text-zinc-500 text-sm max-w-xs text-center md:text-left leading-relaxed">
              Empowering professionals to master their interview skills with AI-driven mock sessions. Practice anytime, anywhere.
            </p>
          </div>

          {/* Quick Links / Socials */}
          <div className="flex flex-col items-center gap-6">
            <p className="text-zinc-400 font-semibold text-sm uppercase tracking-wider">Connect with me</p>
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com/rahulkbharti"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 hover:bg-zinc-800 transition-all duration-300"
                title="GitHub Profile"
              >
                <Code className="w-5 h-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/rahul-kbharti/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 hover:bg-zinc-800 transition-all duration-300"
                title="LinkedIn Profile"
              >
                <User className="w-5 h-5" />
              </Link>
              <Link
                href="mailto:rahul.kbharti2002@gmail.com"
                className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 hover:bg-zinc-800 transition-all duration-300"
                title="Email Me"
              >
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Project Info */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <p className="text-zinc-400 font-semibold text-sm uppercase tracking-wider">Project Source</p>
            <Link
              href="https://github.com/rahulkbharti/ai-mock-interview.git"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-zinc-500 hover:text-indigo-400 transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              View Repository
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-zinc-600 text-xs">
            © {new Date().getFullYear()} MockMate. Created with precision.
          </p>
          <div className="flex items-center gap-1 text-zinc-500 text-sm">
            <span>Built by</span>
            <Link 
              href="https://github.com/rahulkbharti" 
              className="text-zinc-300 hover:text-indigo-400 font-medium transition-colors"
            >
              Rahul Bharti
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
