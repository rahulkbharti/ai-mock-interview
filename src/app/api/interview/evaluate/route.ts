import { auth } from "@/auth";
import { db } from "@/lib/db";
import { google } from "@/lib/ai";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId, questionId, userAnswer, questionContent } = await req.json();

    if (!sessionId || !questionId || !userAnswer || !questionContent) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Evaluate answer via Gemini AI
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

Return ONLY a valid JSON object like this, with no extra text or markdown:
{
  "score": 85,
  "feedback": "Your explanation is good but misses some detail.",
  "tip": "Next time, try to mention the specific algorithm used."
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

    // Check if session is complete (all 5 questions answered)
    const answers = await db.answer.findMany({ where: { sessionId } });
    
    // Always update totalScore if answers exist, and mark COMPLETED if 5 or more
    const currentTotalScore =
      answers.reduce((acc, curr) => acc + (curr.aiScore || 0), 0) /
      answers.length;

    await db.interviewSession.update({
      where: { id: sessionId },
      data: {
        totalScore: currentTotalScore,
        ...(answers.length >= 5 ? { status: "COMPLETED", completedAt: new Date() } : {}),
      },
    });

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to evaluate answer" },
      { status: 500 }
    );
  }
}
