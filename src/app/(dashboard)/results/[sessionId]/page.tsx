import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
      },
    },
  });

  if (!interviewSession || interviewSession.userId !== session.user.id) {
    redirect("/dashboard");
  }

  // Calculate score dynamically if totalScore is not yet set in DB
  const answers = interviewSession.answers;
  const calculatedScore =
    answers.length > 0
      ? answers.reduce((acc, curr) => acc + (curr.aiScore || 0), 0) /
        answers.length
      : 0;

  const score = Math.round(interviewSession.totalScore ?? calculatedScore);

  const formatUserAnswer = (ans: string) => {
    if (ans.includes("```")) return ans;
    // Auto-detect code to wrap in blocks for better UX
    if (ans.includes("{") || ans.includes(";") || ans.includes("=>") || ans.split("\n").length > 1) {
      return `\`\`\`javascript\n${ans}\n\`\`\``;
    }
    return ans;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-zinc-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">Interview Results</h1>
        </div>
      </div>

      {/* Score Overview */}
      <Card className="bg-zinc-900 border-zinc-800 border-t-4 border-t-indigo-500">
        <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
          <div className="relative w-32 h-32 flex items-center justify-center mb-4">
            <div className="absolute inset-0 border-8 border-zinc-800 rounded-full" />
            <div
              className="absolute inset-0 border-8 border-indigo-500 rounded-full"
              style={{
                clipPath: `inset(${100 - score}% 0 0 0)`,
              }}
            />
            <span className="text-4xl font-bold text-white">{score}%</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {score >= 70
              ? "Excellent Job!"
              : score >= 40
              ? "Good Effort!"
              : "Keep Practicing!"}
          </h2>
          <p className="text-zinc-400">
            You completed the{" "}
            <span className="text-white font-medium">
              {interviewSession.topic.name}
            </span>{" "}
            interview session.
          </p>
        </CardContent>
      </Card>

      {/* Answer Breakdown */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Answer Breakdown</h3>
        {interviewSession.answers.map((answer, index) => (
          <Card key={answer.id} className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <span className="bg-zinc-800 text-zinc-400 w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                    {index + 1}
                  </span>
                  <div className="text-white text-base leading-snug prose-dark max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {answer.question.content}
                    </ReactMarkdown>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    (answer.aiScore || 0) >= 70
                      ? "border-green-600 text-green-400"
                      : (answer.aiScore || 0) >= 40
                      ? "border-yellow-600 text-yellow-400"
                      : "border-red-600 text-red-400"
                  }
                >
                  {Math.round(answer.aiScore || 0)}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-zinc-950 p-3 rounded-md border border-zinc-800 prose-dark max-w-none">
                <p className="text-zinc-500 text-xs uppercase font-bold mb-2">
                  Your Answer
                </p>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {formatUserAnswer(answer.userAnswer)}
                </ReactMarkdown>
              </div>
              <div className="space-y-2 prose-dark max-w-none">
                <div className="flex items-center gap-2 text-indigo-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <p className="text-sm font-semibold mb-0">AI Feedback</p>
                </div>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {answer.aiFeedback || ""}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA */}
      <div className="flex justify-center pb-12">
        <Link href="/dashboard">
          <Button className="bg-indigo-600 hover:bg-indigo-700 px-8">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
