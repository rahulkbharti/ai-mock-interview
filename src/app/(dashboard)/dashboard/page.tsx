import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Brain, Trophy, Target, Clock } from "lucide-react";

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
    },
    {
      title: "Completed",
      value: completedSessions,
      icon: Trophy,
      color: "text-green-400",
    },
    {
      title: "Avg Score",
      value: avgScore._avg.totalScore
        ? `${Math.round(avgScore._avg.totalScore)}%`
        : "N/A",
      icon: Target,
      color: "text-yellow-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {session?.user?.name?.split(" ")[0] || "User"} 👋
          </h1>
          <p className="text-zinc-400 mt-1">
            Ready to crush your next interview?
          </p>
        </div>
        <Link href="/interview">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            Start Practice
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-zinc-400">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Sessions */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">
          Recent Sessions
        </h2>
        {sessions.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Brain className="w-12 h-12 text-zinc-600 mb-4" />
              <p className="text-zinc-400 text-center">
                No sessions yet. Start your first mock interview!
              </p>
              <Link href="/interview" className="mt-4">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Start Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <Link key={session.id} href={`/results/${session.id}`}>
                <Card className="bg-zinc-900 border-zinc-800 hover:border-indigo-500 transition-all cursor-pointer">
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-zinc-500" />
                      <div>
                        <p className="text-white font-medium">
                          {session.topic.name}
                        </p>
                        <p className="text-zinc-500 text-sm">
                          {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {session.totalScore && (
                        <span className="text-white font-bold">
                          {Math.round(session.totalScore)}%
                        </span>
                      )}
                      <Badge
                        variant="outline"
                        className={
                          session.status === "COMPLETED"
                            ? "border-green-600 text-green-400"
                            : session.status === "IN_PROGRESS"
                            ? "border-yellow-600 text-yellow-400"
                            : "border-zinc-600 text-zinc-400"
                        }
                      >
                        {session.status}
                      </Badge>
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
