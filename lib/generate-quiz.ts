export type QuizCard = {
  question: string;
  answer: string;
  color: string;
};

const CARD_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
  '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#3b82f6', '#06b6d4',
];

const WORKER_URL = process.env.EXPO_PUBLIC_WORKER_URL;

export async function generateQuiz(
  topic: string,
  language: string,
  promptType: string,
  mode: 'scored' | 'flip' | 'swipe'
): Promise<QuizCard[]> {
  const res = await fetch(`${WORKER_URL}/generate`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ topic, language, promptType, mode }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Worker error ${res.status}: ${err}`);
  }

  const cards: { question: string; answer: string }[] = await res.json();
  return cards.map((card, i) => ({
    ...card,
    color: CARD_COLORS[i % CARD_COLORS.length],
  }));
}
