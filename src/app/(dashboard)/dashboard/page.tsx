import { auth } from "@/auth";
import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Brain, Trophy, Target, Clock, ArrowRight, Sparkles } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  const sessions = await db.interviewSession.findMany({
    where: { userId: session?.user?.id },
    include: { topic: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const totalSessions = await db.interviewSession.count({
    where: { userId: session?.user?.id },
  });

  const completedSessions = await db.interviewSession.count({
    where: { userId: session?.user?.id, status: "COMPLETED" },
  });

  const avgScore = await db.interviewSession.aggregate({
    where: { userId: session?.user?.id, status: "COMPLETED" },
    _avg: { totalScore: true },
  });

  const stats = [
    {
      title: "Total Sessions",
      value: totalSessions,
      icon: Brain,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Completed",
      value: completedSessions,
      icon: Trophy,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      title: "Avg Score",
      value: avgScore._avg.totalScore
        ? `${Math.round(avgScore._avg.totalScore)}%`
        : "N/A",
      icon: Target,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Welcome back, <span className="text-gradient">{session?.user?.name?.split(" ")[0] || "User"}</span> 👋
          </h1>
          <p className="text-zinc-400 text-lg">
            Ready to sharpen your skills today?
          </p>
        </div>
        <Link href="/interview" className="w-full md:w-auto">
          <Button className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 h-12 px-6 shadow-lg shadow-indigo-500/20 group">
            Start New Session
            <Sparkles className="ml-2 w-4 h-4 group-hover:rotate-12 transition-transform" />
          </Button>
        </Link>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm hover:border-zinc-700 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-zinc-400">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bg} p-2 rounded-lg`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Sessions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              Recent Activity
            </h2>
            {sessions.length > 0 && (
              <Link href="/results" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                View all
              </Link>
            )}
          </div>

          {sessions.length === 0 ? (
            <Card className="bg-zinc-900/30 border-dashed border-zinc-800">
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-zinc-800/50 p-4 rounded-full mb-4">
                  <Brain className="w-8 h-8 text-zinc-600" />
                </div>
                <h3 className="text-white font-medium text-lg">No sessions yet</h3>
                <p className="text-zinc-500 max-w-[240px] mt-2 mb-6">
                  Your mock interview journey starts here. Take your first step!
                </p>
                <Link href="/interview">
                  <Button variant="outline" className="border-zinc-800 hover:bg-zinc-800">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {sessions.map((session) => (
                <Link
                  key={session.id}
                  href={session.status === "IN_PROGRESS"
                    ? `/interview/${session.topicId}`
                    : `/results/${session.id}`
                  }
                >
                  <Card className="bg-zinc-900/50 border-zinc-800/50 hover:bg-zinc-800/50 hover:border-indigo-500/30 transition-all group overflow-hidden">
                    <CardContent className="flex items-center justify-between py-5">
                      <div className="flex items-center gap-4">
                        <div className="bg-zinc-800 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                          <Target className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-white font-semibold group-hover:text-indigo-400 transition-colors">
                            {session.topic.name}
                          </p>
                          <p className="text-zinc-500 text-sm">
                            {new Date(session.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        {session.totalScore !== null && (
                          <div className="text-right hidden sm:block">
                            <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Score</p>
                            <p className="text-white font-bold text-lg">
                              {Math.round(session.totalScore)}%
                            </p>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={
                              session.status === "COMPLETED"
                                ? "bg-green-500/5 border-green-500/20 text-green-400 py-1"
                                : session.status === "IN_PROGRESS"
                                  ? "bg-yellow-500/5 border-yellow-500/20 text-yellow-400 py-1 animate-pulse"
                                  : "bg-zinc-500/5 border-zinc-500/20 text-zinc-400 py-1"
                            }
                          >
                            {session.status === "IN_PROGRESS" ? "RESUME" : session.status}
                          </Badge>
                          <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Side Card / Tips */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            Quick Tips
          </h2>
          <Card className="bg-linear-to-br from-indigo-600/20 to-purple-600/20 border-indigo-500/20 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-2xl rounded-full -mr-16 -mt-16" />
            <CardContent className="p-6 relative">
              <h3 className="text-white font-bold mb-2">Be Prepared!</h3>
              <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                Research common questions for your specific role before starting a session to maximize learning.
              </p>
              <Button variant="secondary" size="sm" className="w-full bg-white text-indigo-900 hover:bg-zinc-200">
                Read Guide
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800/50">
            <CardHeader>
              <CardTitle className="text-sm text-zinc-400">Next Recommended Topic</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-white font-medium">System Design</p>
                  <p className="text-xs text-zinc-500">Master architecture patterns</p>
                </div>
              </div>
              <Button variant="outline" className="w-full border-zinc-800">
                Explore More
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
