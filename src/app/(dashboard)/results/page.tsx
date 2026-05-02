import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Target, Calendar, ChevronRight, Clock, Trophy } from "lucide-react";

export default async function AllResultsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const sessions = await db.interviewSession.findMany({
    where: { userId: session.user.id },
    include: { topic: true },
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: sessions.length,
    completed: sessions.filter(s => s.status === "COMPLETED").length,
    avgScore: sessions.length > 0 
      ? Math.round(sessions.reduce((acc, s) => acc + (s.totalScore || 0), 0) / sessions.length) 
      : 0
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="icon" className="rounded-xl border-zinc-800 hover:bg-zinc-800">
              <ArrowLeft className="w-5 h-5 text-zinc-400" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Interview History</h1>
            <p className="text-zinc-500">Track your progress and review past sessions</p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: "Total Sessions", value: stats.total, icon: Clock, color: "text-indigo-400", bg: "bg-indigo-500/10" },
          { title: "Completed", value: stats.completed, icon: Trophy, color: "text-green-400", bg: "bg-green-500/10" },
          { title: "Avg. Performance", value: `${stats.avgScore}%`, icon: Target, color: "text-yellow-400", bg: "bg-yellow-500/10" },
        ].map((stat) => (
          <Card key={stat.title} className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.title}</p>
                <p className="text-3xl font-black text-white">{stat.value}</p>
              </div>
              <div className={`${stat.bg} p-3 rounded-2xl`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {sessions.length === 0 ? (
          <Card className="bg-zinc-900/30 border-dashed border-zinc-800 py-20 text-center">
            <CardContent>
              <div className="bg-zinc-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-zinc-600" />
              </div>
              <h3 className="text-white font-bold text-xl">No sessions found</h3>
              <p className="text-zinc-500 mt-2 mb-8">You haven't completed any interviews yet.</p>
              <Link href="/interview">
                <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-8">
                  Start Your First Session
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {sessions.map((s) => (
              <Link 
                key={s.id} 
                href={s.status === "IN_PROGRESS" ? `/interview/${s.topicId}` : `/results/${s.id}`}
              >
                <Card className="bg-zinc-900/50 border-zinc-800/50 hover:bg-zinc-800/50 hover:border-indigo-500/30 transition-all group overflow-hidden rounded-2xl">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {s.topic.icon || "🎯"}
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg group-hover:text-indigo-400 transition-colors">
                          {s.topic.name}
                        </h3>
                        <div className="flex items-center gap-3 text-zinc-500 text-xs mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(s.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1 uppercase font-bold">
                            <div className={`w-1.5 h-1.5 rounded-full ${s.status === 'COMPLETED' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                            {s.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      {s.totalScore !== null && (
                        <div className="text-right hidden sm:block">
                          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Performance</p>
                          <p className="text-white font-black text-xl">{Math.round(s.totalScore)}%</p>
                        </div>
                      )}
                      <div className="bg-zinc-800/50 p-2 rounded-lg group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
