import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Brain, Trophy, Target, Zap, Shield, Star, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-indigo-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">MockMate</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-zinc-400 hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-zinc-400 hover:text-white transition-colors">How it Works</Link>
            <Link href="/login">
              <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-800">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8 animate-fade-in">
            <Zap className="w-4 h-4" />
            <span>AI-Powered Interview Prep</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Master Your Next <br />
            <span className="text-gradient">Interview with AI</span>
          </h1>
          <p className="text-zinc-400 text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Practice realistic mock interviews tailored to your role. Get real-time feedback, improve your confidence, and land your dream job.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-2xl shadow-indigo-500/30 rounded-2xl font-bold group">
                Start Practicing Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#features" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 text-lg border-zinc-800 bg-white/5 hover:bg-zinc-900 text-white rounded-2xl font-bold backdrop-blur-sm transition-all">
                See Features
              </Button>
            </Link>
          </div>

          {/* Social Proof/Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-zinc-800/50 pt-12">
            {[
              { label: "Mock Interviews", value: "10,000+" },
              { label: "Success Rate", value: "94%" },
              { label: "User Rating", value: "4.9/5" },
              { label: "Tech Roles", value: "50+" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-zinc-500 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 bg-zinc-900/30">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Why choose MockMate?</h2>
            <p className="text-zinc-400 text-lg">Everything you need to sharpen your skills and ace your professional journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Realistic Scenarios",
                desc: "AI-generated questions based on actual job descriptions and company profiles.",
              },
              {
                icon: Trophy,
                title: "Performance Insights",
                desc: "Detailed scoring on communication, technical accuracy, and confidence.",
              },
              {
                icon: Shield,
                title: "Safe Environment",
                desc: "Practice without pressure. Make mistakes here so you don't make them there.",
              },
              {
                icon: Zap,
                title: "Real-time Feedback",
                desc: "Instant suggestions on how to structure your answers better.",
              },
              {
                icon: Star,
                title: "Role Specific",
                desc: "From Frontend Engineer to Product Manager, we cover it all.",
              },
              {
                icon: Brain,
                title: "Adaptive Learning",
                desc: "Questions get harder as you improve, keeping you on your toes.",
              },
            ].map((feature, i) => (
              <div key={i} className="glass-card p-8 rounded-3xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="container mx-auto">
          <div className="glass p-12 md:p-24 rounded-[3rem] text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[80px] rounded-full -mr-32 -mt-32" />
            <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to land your <br /><span className="text-gradient">dream job?</span></h2>
            <p className="text-zinc-400 text-lg md:text-xl mb-12 max-w-xl mx-auto">
              Join thousands of professionals who improved their interview performance with MockMate.
            </p>
            <Link href="/register">
              <Button size="lg" className="h-16 px-10 text-xl bg-indigo-600 hover:bg-indigo-700 shadow-2xl shadow-indigo-500/40">
                Start Practicing Now
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-zinc-900 bg-zinc-950">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-indigo-400" />
            <span className="text-xl font-bold">MockMate</span>
          </div>
          <p className="text-zinc-500 text-sm">© 2024 MockMate AI. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-zinc-500 hover:text-white transition-colors">Twitter</Link>
            <Link href="#" className="text-zinc-500 hover:text-white transition-colors">GitHub</Link>
            <Link href="#" className="text-zinc-500 hover:text-white transition-colors">LinkedIn</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
