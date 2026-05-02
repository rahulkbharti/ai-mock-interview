# 🤖 MockMate: AI-Powered Interview Excellence

MockMate is a premium, AI-driven platform designed to transform your interview preparation. Built with a "native-like" mobile-first approach, it leverages Google's Gemini AI to provide realistic technical assessments, real-time feedback, and deep performance insights.

![Banner](https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=2070)

## ✨ Features

- **🧠 Smart AI Interrogator**: Adaptive questioning based on your selected technology stack.
- **✨ Premium UI/UX**: Immersive glassmorphism design with fluid `framer-motion` animations.
- **📝 Markdown Support**: Full support for code syntax highlighting in both questions and answers.
- **📊 Performance Dashboard**: Track your progress, scores, and activity history in a beautiful grid layout.
- **🕒 Rate Limiting**: Built-in 5-minute cooldown between evaluations to ensure focused preparation.
- **📱 Native-Like Navigation**: Floating glass-pill navigation optimized for mobile and desktop.

## 🚀 Tech Stack

- **Framework**: [Next.js 16+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with Custom Glassmorphism
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **AI Engine**: [Google Gemini AI](https://deepmind.google/technologies/gemini/) (via Vercel AI SDK)
- **Database**: [Prisma ORM](https://www.prisma.io/) with PostgreSQL
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL Database
- Gemini API Key

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/mockmate.git
   cd mockmate
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/mockmate"
   NEXTAUTH_SECRET="your-secret"
   GEMINI_API_KEY="your-gemini-key"
   ```

4. **Database Setup**:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 📂 Project Structure

```text
src/
├── app/               # Next.js App Router (Pages & APIs)
│   ├── (auth)/        # Login & Registration
│   ├── (dashboard)/   # Core Application (Dashboard, Interview, Results)
│   └── api/           # Serverless API Routes (AI Logic)
├── components/        # Reusable UI Components
│   ├── shared/        # Markdown, Nav, Animations
│   └── ui/            # Shadcn UI primitives
├── lib/               # Utility configurations (Prisma, AI, Auth)
└── hooks/             # Custom React Hooks
```

## 🔒 Security

- **Environment Isolation**: API keys are strictly server-side and never exposed to the client.
- **Rate Limiting**: Cookie-based throttling (1 question/5 min) to prevent abuse.
- **Auth**: Secure session management via NextAuth.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ by the MockMate Team
