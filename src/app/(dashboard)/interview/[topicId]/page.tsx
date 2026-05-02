"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Brain, Loader2, ChevronRight, Pause, Play, RotateCcw, ListChecks } from "lucide-react";
import { Markdown } from "@/components/shared/Markdown";

interface Question {
  id: string;
  content: string;
  difficulty: string;
}

export default function InterviewSessionPage() {
  const { topicId } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    generateQuestions();
  }, []);

  const generateQuestions = async () => {
    try {
      const res = await fetch("/api/interview/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSessionId(data.sessionId);
      setQuestions(data.questions);

      // Handle resuming session
      if (data.existingAnswers && data.existingAnswers.length > 0) {
        const formattedAnswers = data.existingAnswers.map((a: any) => ({
          questionId: a.questionId,
          score: a.aiScore,
          feedback: a.aiFeedback,
          tip: a.tip || "", // Tip might be missing in DB if not stored
        }));
        setAnswers(formattedAnswers);

        // If the session is not completed, check where we are
        if (data.existingAnswers.length < data.questions.length) {
          // Check if we should show feedback for the last answer or move to next
          // For now, let's move to the next question as it's simpler
          // and usually what users expect when resuming.
          setCurrentIndex(data.existingAnswers.length);
        } else {
          // All questions answered but session might still be IN_PROGRESS in DB
          setCurrentIndex(data.questions.length - 1);
          // Load the last feedback
          const lastAnswer = data.existingAnswers[data.existingAnswers.length - 1];
          setFeedback({
            score: lastAnswer.aiScore,
            feedback: lastAnswer.aiFeedback,
            tip: lastAnswer.tip
          });
        }
        toast.info(`Resuming session from question ${Math.min(data.existingAnswers.length + 1, data.questions.length)}`);
      }
    } catch (error) {
      toast.error("Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      toast.error("Please write an answer first!");
      return;
    }

    setSubmitting(true);

    // Auto-detect code and wrap in markdown if necessary
    let processedAnswer = answer;
    if (!answer.includes("```")) {
      const codePatterns = [/[{}]/, /;$/, /\bfunction\b/, /\bconst\b/, /=>/, /<[a-zA-Z]+.*>/m];
      if (codePatterns.some(p => p.test(answer))) {
        processedAnswer = `\`\`\`\n${answer}\n\`\`\``;
      }
    }

    try {
      const res = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          questionId: questions[currentIndex].id,
          userAnswer: processedAnswer,
          questionContent: questions[currentIndex].content,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429) {
          toast.error(data.error || "Rate limit exceeded. Please wait.");
          return;
        }
        throw new Error(data.error);
      }

      setFeedback(data);
      setAnswers([...answers, { questionId: questions[currentIndex].id, ...data, userAnswer: processedAnswer }]);
    } catch (error: any) {
      toast.error(error.message || "Failed to evaluate answer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnswer("");
      setFeedback(null);
    } else {
      router.push(`/results/${sessionId}`);
    }
  };

  const difficultyColor: any = {
    EASY: "border-green-600 text-green-400",
    MEDIUM: "border-yellow-600 text-yellow-400",
    HARD: "border-red-600 text-red-400",
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Brain className="w-12 h-12 text-indigo-400 animate-pulse" />
        <p className="text-zinc-400 text-lg">AI is generating your questions...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-6 relative">
      {/* Pause Overlay */}
      {isPaused && (
        <div className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 p-10 rounded-[2rem] shadow-2xl text-center max-w-sm w-full mx-4">
            <div className="bg-indigo-600/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Pause className="w-10 h-10 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Session Paused</h2>
            <p className="text-zinc-400 mb-8">Take a breather. We'll be right here when you're ready to continue.</p>
            <div className="space-y-3">
              <Button
                onClick={() => setIsPaused(false)}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-lg font-semibold rounded-xl"
              >
                <Play className="w-5 h-5 mr-2" />
                Resume Session
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
                className="w-full h-12 border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-xl"
              >
                Exit to Dashboard
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Progress & Controls */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-zinc-400 text-sm font-medium">
            Question <span className="text-white">{currentIndex + 1}</span> of {questions.length}
          </p>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-6 rounded-full transition-all duration-500 ${i < currentIndex
                    ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                    : i === currentIndex
                      ? "bg-indigo-500 w-10 shadow-[0_0_10px_rgba(99,102,241,0.3)]"
                      : "bg-zinc-800"
                  }`}
              />
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsPaused(true)}
          className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-400 h-10 px-4 rounded-xl"
        >
          <Pause className="w-4 h-4 mr-2" />
          Pause
        </Button>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm overflow-hidden rounded-[2rem] shadow-2xl">
        <CardHeader className="bg-zinc-800/30 border-b border-zinc-800/50 py-6 px-8">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-white text-xl leading-relaxed prose-invert prose-p:leading-relaxed max-w-none">
              <Markdown content={currentQuestion?.content || ""} />
            </CardTitle>
            <Badge
              variant="outline"
              className={`${difficultyColor[currentQuestion?.difficulty]} px-3 py-1 rounded-lg border-2`}
            >
              {currentQuestion?.difficulty}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <Textarea
            placeholder="Structure your thoughts here..."
            className="bg-zinc-800/50 border-zinc-700/50 text-white min-h-[200px] p-6 rounded-2xl resize-none text-lg focus:ring-2 focus:ring-indigo-500/50 transition-all"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={!!feedback || isPaused}
          />

          {!feedback ? (
            <Button
              onClick={handleSubmitAnswer}
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-lg font-bold rounded-2xl shadow-xl shadow-indigo-600/20 group"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  AI is analyzing...
                </>
              ) : (
                <>
                  Submit Answer
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <Card className="bg-indigo-500/5 border-indigo-500/20 rounded-2xl overflow-hidden">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-indigo-400" />
                      <p className="text-white font-bold text-lg">AI Analysis</p>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">
                        {feedback.score}
                      </span>
                      <span className="text-zinc-500 text-sm font-bold">%</span>
                    </div>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">{feedback.feedback}</p>
                  {feedback.tip && (
                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                      <p className="text-indigo-300 text-sm leading-relaxed">
                        <strong className="text-indigo-200">Pro Tip:</strong> {feedback.tip}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button
                onClick={handleNext}
                className="w-full h-14 bg-green-600 hover:bg-green-700 text-lg font-bold rounded-2xl shadow-xl shadow-green-600/20 group"
              >
                {currentIndex < questions.length - 1 ? (
                  <>
                    Next Question
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                ) : (
                  "View Final Results 🎉"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {answers.length > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 px-2">
            <ListChecks className="w-5 h-5 text-zinc-500" />
            Session History
          </h2>
          <div className="space-y-4">
            {answers.map((ans, i) => {
              const q = questions.find(q => q.id === ans.questionId);
              return (
                <Card key={i} className="bg-zinc-900/30 border-zinc-800/50 rounded-2xl overflow-hidden">
                  <CardHeader className="py-4 px-6 border-b border-zinc-800/50">
                    <div className="flex items-center justify-between">
                      <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Question {i + 1}</p>
                      <Badge className="bg-indigo-500/10 text-indigo-400 border-none">{ans.score}%</Badge>
                    </div>
                    <div className="text-white font-medium mt-2 text-sm prose-invert prose-p:leading-relaxed max-w-none">
                      <Markdown content={q?.content || ""} />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-3">
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Your Answer</p>
                    <div className="text-zinc-300 text-sm leading-relaxed prose-invert prose-p:leading-relaxed max-w-none">
                      <Markdown content={ans.userAnswer || "..."} />
                    </div>
                    <div className="pt-2">
                      <p className="text-indigo-400/80 text-xs font-bold uppercase tracking-widest mb-1">AI Feedback</p>
                      <p className="text-zinc-400 text-sm leading-relaxed">{ans.feedback}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            }).reverse()}
          </div>
        </div>
      )}
    </div>
  );
}
