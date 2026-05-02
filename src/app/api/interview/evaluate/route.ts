import { auth } from "@/auth";
import { db } from "@/lib/db";
import { google } from "@/lib/ai";
import { generateText } from "ai";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate Limit: 1 question per 5 minutes
    const cookieStore = await cookies();
    const lastTime = cookieStore.get("last_question_time")?.value;
    const now = Date.now();
    const FIVE_MINUTES = 5 * 60 * 1000;

    if (lastTime) {
      const timeElapsed = now - parseInt(lastTime);
      if (timeElapsed < FIVE_MINUTES) {
        const remainingMinutes = Math.ceil((FIVE_MINUTES - timeElapsed) / 1000 / 60);
        return NextResponse.json(
          { error: `Rate limit: Please wait ${remainingMinutes} more minute(s) before answering another question.` },
          { status: 429 }
        );
      }
    }

    const { sessionId, questionId, userAnswer, questionContent } = await req.json();

    if (!sessionId || !questionId || !userAnswer || !questionContent) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { text } = await generateText({
      model: google("gemini-3-flash-preview"),
      prompt: `You are an expert technical interviewer evaluating a candidate's answer.

Question: ${questionContent}
Candidate's Answer: ${userAnswer}

Rules:
1. Be fair but strict.
2. If the answer is completely wrong or unrelated, give a low score (0-40).
3. If it's correct but lacks depth, give a medium score (40-70).
4. If it's comprehensive and accurate, give a high score (70-100).

Return ONLY a valid JSON object like this, with no extra text or markdown outside the JSON. Use Markdown within the strings for formatting (like bold text or code blocks):
{
  "score": 85,
  "feedback": "Your explanation is good. Use **Markdown** for emphasis.",
  "tip": "Next time, try to use a code block for clarity."
}`,
    });

    const cleanText = text.replace(/```json|```/g, "").trim();
    const evaluation = JSON.parse(cleanText);

    // Save answer to DB
    await db.answer.create({
      data: {
        sessionId,
        questionId,
        userAnswer,
        aiFeedback: evaluation.feedback,
        aiScore: evaluation.score,
      },
    });

    // Check if session is complete
    const interviewSession = await db.interviewSession.findUnique({
      where: { id: sessionId },
      include: { questions: true },
    });

    const answers = await db.answer.findMany({ where: { sessionId } });
    
    const currentTotalScore =
      answers.reduce((acc, curr) => acc + (curr.aiScore || 0), 0) /
      answers.length;

    const isComplete = answers.length >= (interviewSession?.questions.length || 5);

    await db.interviewSession.update({
      where: { id: sessionId },
      data: {
        totalScore: currentTotalScore,
        ...(isComplete ? { status: "COMPLETED", completedAt: new Date() } : {}),
      },
    });

    const response = NextResponse.json(evaluation);
    
    // Set rate limit cookie (5 minutes)
    response.cookies.set("last_question_time", Date.now().toString(), {
      maxAge: 300, // 5 minutes in seconds
      httpOnly: true,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to evaluate answer" },
      { status: 500 }
    );
  }
}
