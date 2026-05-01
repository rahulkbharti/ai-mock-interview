"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Brain, Loader2, ChevronRight } from "lucide-react";

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

    try {
      const res = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          questionId: questions[currentIndex].id,
          userAnswer: answer,
          questionContent: questions[currentIndex].content,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setFeedback(data);
      setAnswers([...answers, { questionId: questions[currentIndex].id, ...data }]);
    } catch (error) {
      toast.error("Failed to evaluate answer");
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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <p className="text-zinc-400 text-sm">
          Question {currentIndex + 1} of {questions.length}
        </p>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-8 rounded-full transition-colors ${
                i < currentIndex
                  ? "bg-green-500"
                  : i === currentIndex
                  ? "bg-indigo-500"
                  : "bg-zinc-700"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg">
              {currentQuestion?.content}
            </CardTitle>
            <Badge
              variant="outline"
              className={difficultyColor[currentQuestion?.difficulty]}
            >
              {currentQuestion?.difficulty}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Type your answer here..."
            className="bg-zinc-800 border-zinc-700 text-white min-h-[150px] resize-none"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={!!feedback}
          />

          {!feedback ? (
            <Button
              onClick={handleSubmitAnswer}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  AI is evaluating...
                </>
              ) : (
                "Submit Answer"
              )}
            </Button>
          ) : (
            <div className="space-y-4">
              {/* AI Feedback */}
              <Card className="bg-zinc-800 border-zinc-700">
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-white font-semibold">AI Feedback</p>
                    <span className="text-2xl font-bold text-indigo-400">
                      {feedback.score}%
                    </span>
                  </div>
                  <p className="text-zinc-300 text-sm">{feedback.feedback}</p>
                  {feedback.tip && (
                    <div className="bg-indigo-950 border border-indigo-800 rounded-md p-3">
                      <p className="text-indigo-300 text-sm">
                        💡 <strong>Tip:</strong> {feedback.tip}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button
                onClick={handleNext}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {currentIndex < questions.length - 1 ? (
                  <>
                    Next Question
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  "View Results 🎉"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
