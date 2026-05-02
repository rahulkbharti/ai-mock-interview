# 📖 MockMate Technical Documentation

## 1. Overview
MockMate is an AI-powered technical interview simulator. It aims to provide a realistic experience where candidates can practice answering technical questions and receive immediate, high-quality feedback.

## 2. Core Architecture

### AI Evaluation Engine
The heart of the project is the evaluation engine located in `src/app/api/interview/evaluate/route.ts`. 
- **Model**: `gemini-3-flash-preview`
- **Logic**: It takes the question context and the user's answer, then uses a specialized prompt to act as a "Senior Technical Interviewer".
- **Output**: Returns a JSON object containing a `score` (0-100), `feedback` (Markdown-supported), and a `tip`.

### Markdown & Syntax Highlighting
To ensure code blocks are readable:
- We use a custom `Markdown` component (`src/components/shared/Markdown.tsx`).
- It integrates `react-markdown` and `react-syntax-highlighter` with the `Prism` engine.
- Supports GitHub Flavored Markdown (GFM).

## 3. UI/UX Design System

### Glassmorphism
The app uses a custom "Deep Dark" design system:
- **Background**: `oklch(0.08 0 0)`
- **Glass Utilities**: `.glass` and `.glass-card` classes in `globals.css` provide the blur and border effects.
- **Color Palette**: Primary `indigo` accents for high contrast and modern feel.

### Animations
Animations are powered by `Framer Motion` through the `AnimatedWrapper` component.
- **Entrance Effects**: Slide-up, slide-down, and fade-in transitions.
- **Staggered Lists**: Delays are used to reveal grid items sequentially.

## 4. Key Features & Implementation

### Rate Limiting
Implemented using signed cookies to prevent rapid-fire requests to the AI.
- **Limit**: 1 question per 5 minutes.
- **Implementation**:
  ```typescript
  // API side (evaluate/route.ts)
  const lastTime = cookieStore.get("last_question_time")?.value;
  // ... check elapsed time ...
  response.cookies.set("last_question_time", Date.now().toString(), { maxAge: 300 });
  ```

### Immersive Interview Mode
- **Pause/Resume**: Users can pause their session, which is saved in the database, allowing them to resume later from the dashboard.
- **Progress Tracking**: A dynamic progress bar at the top updates in real-time as questions are answered.

## 5. Database Schema (Prisma)
- **User**: Standard user profile.
- **Topic**: Interview categories (e.g., React, Node.js).
- **InterviewSession**: Tracks a group of questions/answers.
- **Answer**: Stores the user's response and AI evaluation.

## 6. Future Roadmap
- **PWA Integration**: Enabling "Add to Home Screen" for a true app experience.
- **Voice-to-Text**: Allowing users to speak their answers.
- **Video Analysis**: Using AI to analyze body language (Future research).

---

© 2026 MockMate. All rights reserved.
