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

    const { topicId } = await req.json();

    const topic = await db.topic.findUnique({ where: { id: topicId } });
    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // Create interview session
    const interviewSession = await db.interviewSession.create({
      data: {
        userId: session.user.id,
        topicId,
        status: "IN_PROGRESS",
      },
    });

    // Generate questions via Gemini AI
    const { text } = await generateText({
      model: google("gemini-3-flash-preview"),
      prompt: `You are an expert technical interviewer. Generate exactly 5 interview questions for: ${topic.name}.

Topic description: ${topic.description}

Rules:
- Mix difficulty: 2 easy, 2 medium, 1 hard
- Questions must be practical and real-world focused
- No numbering, just the questions

Return ONLY a valid JSON array like this:
[
  {"content": "question here", "difficulty": "EASY"},
  {"content": "question here", "difficulty": "MEDIUM"},
  {"content": "question here", "difficulty": "HARD"}
]`,
    });

    // Parse AI response
    const cleanText = text.replace(/```json|```/g, "").trim();
    const questions = JSON.parse(cleanText);

    // Save questions to DB
    const savedQuestions = await Promise.all(
      questions.map((q: any) =>
        db.question.create({
          data: {
            topicId,
            sessionId: interviewSession.id,
            content: q.content,
            difficulty: q.difficulty,
          },
        }),
      ),
    );

    return NextResponse.json({
      sessionId: interviewSession.id,
      questions: savedQuestions,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 },
    );
  }
}
