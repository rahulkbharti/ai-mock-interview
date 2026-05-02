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

    // Check for existing IN_PROGRESS sessions for this topic and user
    const existingSessions = await db.interviewSession.findMany({
      where: {
        userId: session.user.id,
        topicId,
        status: "IN_PROGRESS",
      },
      include: {
        questions: {
          orderBy: { createdAt: "asc" },
        },
        answers: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (existingSessions.length > 0) {
      const mostRecent = existingSessions[0];
      
      // Mark others as ABANDONED to keep DB clean
      if (existingSessions.length > 1) {
        await db.interviewSession.updateMany({
          where: {
            id: { in: existingSessions.slice(1).map(s => s.id) }
          },
          data: { status: "ABANDONED" }
        });
      }

      if (mostRecent.questions.length > 0) {
        return NextResponse.json({
          sessionId: mostRecent.id,
          questions: mostRecent.questions,
          existingAnswers: mostRecent.answers,
        });
      }
    }

    // Mark ALL previous IN_PROGRESS sessions for this topic as ABANDONED before creating new
    await db.interviewSession.updateMany({
      where: {
        userId: session.user.id,
        topicId,
        status: "IN_PROGRESS",
      },
      data: { status: "ABANDONED" },
    });

    // Create new interview session
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
      prompt: `You are a Senior Technical Interviewer at a top-tier tech company (like Google or Meta). 
Generate 5 high-quality, realistic interview questions for the topic: "${topic.name}".

Topic Context: ${topic.description}

Guidelines for Questions:
1. SCENARIO-BASED: Instead of "What is X?", ask "You are building a system that needs X. How would you handle Y?".
2. DEPTH: Test deep understanding of patterns, trade-offs, and edge cases.
3. MODERN: Use real-world industry standards and modern best practices.
4. VARIETY: Mix 2 Easy (fundamental), 2 Medium (application), and 1 Hard (architectural/complex).
5. FORMATTING: Use Markdown (bold, backticks, or code blocks) to make questions clear and professional.

Return ONLY a valid JSON array of objects:
[
  {"content": "Question with **scenario** and \`code\`", "difficulty": "MEDIUM"},
  ...
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
      existingAnswers: [],
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 },
    );
  }
}
