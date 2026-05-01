import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const topics = [
    {
      name: "React.js",
      description: "Components, Hooks, State Management",
      icon: "⚛️",
    },
    {
      name: "Node.js",
      description: "Runtime, APIs, Async Programming",
      icon: "🟢",
    },
    {
      name: "Next.js",
      description: "SSR, SSG, API Routes, Optimization",
      icon: "▲",
    },
    {
      name: "JavaScript",
      description: "Core concepts, ES6+, Async/Await",
      icon: "🟡",
    },
    {
      name: "TypeScript",
      description: "Types, Interfaces, Generics",
      icon: "🔷",
    },
    {
      name: "System Design",
      description: "Scalability, Architecture, Databases",
      icon: "🏗️",
    },
    {
      name: "DSA",
      description: "Arrays, Trees, Graphs, DP",
      icon: "🧠",
    },
    {
      name: "PostgreSQL",
      description: "Queries, Joins, Optimization",
      icon: "🐘",
    },
  ];

  for (const topic of topics) {
    await prisma.topic.upsert({
      where: { name: topic.name },
      update: {},
      create: topic,
    });
  }

  console.log("✅ Topics seeded!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
