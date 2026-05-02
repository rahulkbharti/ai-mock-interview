import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Trophy, Target, Brain, Share2, Download, Sparkles, ChevronRight } from "lucide-react";
import { Markdown } from "@/components/shared/Markdown";

export default async function ResultsPage(props: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await props.params;
  const session = await auth();
  if (!session) redirect("/login");

  const interviewSession = await db.interviewSession.findUnique({
    where: { id: sessionId },
    include: {
      topic: true,
      answers: {
        include: { question: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!interviewSession || interviewSession.userId !== session.user.id) {
    redirect("/dashboard");
  }

  const answers = interviewSession.answers;
  const calculatedScore =
    answers.length > 0
      ? answers.reduce((acc, curr) => acc + (curr.aiScore || 0), 0) /
      answers.length
      : 0;

  const score = Math.round(interviewSession.totalScore ?? calculatedScore);

  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-green-400";
    if (s >= 60) return "text-indigo-400";
    if (s >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBg = (s: number) => {
    if (s >= 80) return "bg-green-500/10 border-green-500/20";
    if (s >= 60) return "bg-indigo-500/10 border-indigo-500/20";
    if (s >= 40) return "bg-yellow-500/10 border-yellow-500/20";
    return "bg-red-500/10 border-red-500/20";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon" className="rounded-xl border-zinc-800 hover:bg-zinc-800">
            <Link href="/dashboard">
              <ArrowLeft className="w-5 h-5 text-zinc-400" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Interview Report</h1>
            <p className="text-zinc-500 text-sm">Session ID: {sessionId.slice(0, 8)}...</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-zinc-800 text-zinc-400 hover:text-white">
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Main Score Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-zinc-900/50 border-zinc-800/50 backdrop-blur-md rounded-[2.5rem] overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full -mr-32 -mt-32 group-hover:bg-indigo-600/20 transition-all duration-1000" />
          <CardContent className="p-10 flex flex-col md:flex-row items-center gap-10">
            {/* Radial Score */}
            <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90 transform">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-zinc-800"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeDasharray={553}
                  strokeDashoffset={553 - (553 * score) / 100}
                  strokeLinecap="round"
                  className={`${getScoreColor(score)} transition-all duration-1000 ease-out`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-white">{score}</span>
                <span className="text-zinc-500 text-sm font-bold tracking-widest uppercase">Score</span>
              </div>
            </div>

            <div className="flex-1 space-y-6 text-center md:text-left">
              <div className="space-y-2">
                <Badge className={`${getScoreBg(score)} ${getScoreColor(score)} border-none px-4 py-1.5 text-sm font-bold rounded-full`}>
                  {score >= 80 ? "MASTERED" : score >= 60 ? "PROFICIENT" : score >= 40 ? "DEVELOPING" : "BEGINNER"}
                </Badge>
                <h2 className="text-4xl font-bold text-white tracking-tight">
                  {score >= 80 ? "Stunning Performance!" : score >= 60 ? "Great Progress!" : "Keep Pushing!"}
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed">
                  You've successfully completed the <span className="text-white font-bold">{interviewSession.topic.name}</span> track. Here's your detailed performance analysis.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm rounded-3xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-indigo-500/10 p-3 rounded-2xl">
                <Target className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Questions</p>
                <p className="text-white font-bold text-xl">{answers.length}</p>
              </div>
            </div>
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full w-full" />
            </div>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm rounded-3xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-500/10 p-3 rounded-2xl">
                <Trophy className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Strength</p>
                <p className="text-white font-bold text-xl">
                  {score >= 60 ? "Communication" : "Knowledge"}
                </p>
              </div>
            </div>
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full w-[85%]" />
            </div>
          </Card>
        </div>
      </div>

      {/* Answer Breakdown */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <Brain className="w-6 h-6 text-zinc-500" />
          <h3 className="text-2xl font-bold text-white">Answer Breakdown</h3>
        </div>

        <div className="grid gap-6">
          {answers.map((answer, index) => (
            <Card key={answer.id} className="bg-zinc-900/30 border-zinc-800/50 hover:border-zinc-700/50 transition-all rounded-[2rem] overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                {/* Score Sidebar */}
                <div className={`lg:w-24 flex lg:flex-col items-center justify-center p-6 border-b lg:border-b-0 lg:border-r border-zinc-800/50 ${getScoreBg(answer.aiScore || 0)}`}>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1 lg:mb-2">Score</p>
                  <p className={`text-3xl font-black ${getScoreColor(answer.aiScore || 0)}`}>
                    {Math.round(answer.aiScore || 0)}
                  </p>
                </div>

                <div className="flex-1 p-8 space-y-6">
                  {/* Question */}
                  <div className="space-y-2">
                    <p className="text-indigo-400 text-xs font-black uppercase tracking-widest">Question {index + 1}</p>
                    <div className="text-white text-xl font-medium leading-relaxed prose-invert prose-p:leading-relaxed max-w-none">
                      <Markdown content={answer.question.content} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    {/* User Answer */}
                    <div className="space-y-3">
                      <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Your Response</p>
                      <div className="bg-zinc-950/50 p-5 rounded-2xl border border-zinc-800/50 text-zinc-300 text-sm leading-relaxed prose-invert prose-p:leading-relaxed max-w-none">
                        <Markdown content={answer.userAnswer} />
                      </div>
                    </div>

                    {/* AI Feedback */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-yellow-400" />
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">AI Feedback</p>
                      </div>
                      <div className="text-zinc-400 text-sm leading-relaxed prose-invert prose-p:leading-relaxed max-w-none">
                        <Markdown content={answer.aiFeedback || ""} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Final Action */}
      <div className="flex flex-col items-center justify-center gap-4 pt-10">
        <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 h-14 px-10 text-lg font-bold rounded-2xl shadow-xl shadow-indigo-600/20 group cursor-pointer">
          <Link href="/dashboard">
            Continue Journey
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
        <p className="text-zinc-500 text-sm">Practice makes perfect. Start another session to improve!</p>
      </div>
    </div>
  );
}
