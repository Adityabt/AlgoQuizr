import { Request, Response } from 'express';
import { Topic } from '../models/Topics'
import { Question } from '../models/Question';
import { QuizAttempt } from '../models/QuizAttempt';
import { AuthRequest } from '../types/express';

export async function getTopics(req: Request, res: Response) {
  const DIFFICULTY_ORDER: Record<string, number> = { Beginner: 0, Intermediate: 1, Advanced: 2 };
  
  const topics = await Topic.find();
  topics.sort((a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]);
  
  return res.json(topics);
}

// GET /api/quiz/topics/:slug/questions
export async function getQuestions(req: Request, res: Response) {
  const { slug } = req.params;

  const topic = await Topic.findOne({ slug });
  if (!topic) return res.status(404).json({ message: 'Topic not found' });

  const questions = await Question.find({ topicSlug: slug });
  return res.json({ topic, questions });
}

// POST /api/quiz/attempts — record a finished quiz
export async function createAttempt(req: AuthRequest, res: Response) {
  try {
    const { topic, score, total } = req.body;

    if (!topic || score == null || !total) {
      return res.status(400).json({ message: 'topic, score, and total are required' });
    }
    if (score < 0 || score > total) {
      return res.status(400).json({ message: 'score must be between 0 and total' });
    }

    const attempt = await QuizAttempt.create({
      user: req.user!.userId,
      topic,
      score,
      total,
    });

    return res.status(201).json(attempt);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
}

// GET /api/quiz/attempts — most recent attempts first
export async function getAttempts(req: AuthRequest, res: Response) {
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const attempts = await QuizAttempt.find({ user: req.user!.userId })
    .sort({ createdAt: -1 })
    .limit(limit);

  return res.json(
    attempts.map(a => ({
      id: a.id,
      topic: a.topic,
      score: a.score,
      total: a.total,
      date: a.createdAt,
    }))
  );
}

// GET /api/quiz/progress — per-topic best score + attempt count, plus summary stats
export async function getProgress(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;

  const attempts = await QuizAttempt.find({ user: userId }).sort({ createdAt: 1 });

  // Per-topic aggregation: best score (%) and attempt count
  const topicMap = new Map<string, { bestPct: number; attempts: number }>();
  for (const a of attempts) {
    const pct = Math.round((a.score / a.total) * 100);
    const existing = topicMap.get(a.topic);
    if (existing) {
      existing.attempts += 1;
      existing.bestPct = Math.max(existing.bestPct, pct);
    } else {
      topicMap.set(a.topic, { bestPct: pct, attempts: 1 });
    }
  }

  const topicProgress = Array.from(topicMap.entries()).map(([topic, data]) => ({
    topic,
    score: data.bestPct,
    attempts: data.attempts,
  }));

  // Summary stats
  const quizzesTaken = attempts.length;
  const avgScore = quizzesTaken
    ? Math.round(
        attempts.reduce((sum, a) => sum + (a.score / a.total) * 100, 0) / quizzesTaken
      )
    : 0;
  const bestScore = quizzesTaken
    ? Math.max(...attempts.map(a => Math.round((a.score / a.total) * 100)))
    : 0;
  const topicsStarted = topicMap.size;

  // Day streak: consecutive days (including today) with at least one attempt
  const daySet = new Set(
    attempts.map(a => a.createdAt.toISOString().slice(0, 10)) // YYYY-MM-DD
  );
  let streak = 0;
  const cursor = new Date();
  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (daySet.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  // Recent scores (last 10, oldest -> newest, for chart display)
  const recent = attempts.slice(-10).map((a, i) => ({
    label: `${a.topic} #${i + 1}`,
    score: Math.round((a.score / a.total) * 100),
  }));

  return res.json({
    summary: {
      quizzesTaken,
      avgScore,
      bestScore,
      topicsStarted,
      dayStreak: streak,
    },
    topicProgress,
    recentScores: recent,
  });
}