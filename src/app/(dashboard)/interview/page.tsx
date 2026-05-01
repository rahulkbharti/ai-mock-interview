import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default async function InterviewPage() {
  const topics = await db.topic.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Choose a Topic</h1>
        <p className="text-zinc-400 mt-1">
          Select a topic to start your AI-powered mock interview
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic) => (
          <Card
            key={topic.id}
            className="bg-zinc-900 border-zinc-800 hover:border-indigo-500 transition-all cursor-pointer group"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-3xl">{topic.icon}</span>
                  <h3 className="text-white font-semibold text-lg mt-2">
                    {topic.name}
                  </h3>
                  <p className="text-zinc-400 text-sm mt-1">
                    {topic.description}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-indigo-400 transition-colors mt-1" />
              </div>
              <Link href={`/interview/${topic.id}`} className="mt-4 block">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                  Start Interview
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
