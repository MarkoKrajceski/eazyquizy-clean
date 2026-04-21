export type QuizMode = 'scored' | 'flip' | 'swipe';

export type QuizType = {
  id: string;
  label: string;
  description: string;
  icon: string;
  mode: QuizMode;
  promptType: string;
};

export const QUIZ_TYPES: QuizType[] = [
  {
    id: 'yes-no',
    label: 'Yes / No',
    description: 'Swipe right for Yes, left for No. Get scored at the end.',
    icon: '✅',
    mode: 'scored',
    promptType: 'Yes/No questions',
  },
  {
    id: 'flashcard',
    label: 'Flashcards',
    description: 'Tap cards to reveal answers. Great for memorisation.',
    icon: '🃏',
    mode: 'flip',
    promptType: 'Wh- questions with concise answers',
  },
  {
    id: 'hypothetical',
    label: 'Hypothetical',
    description: 'Thought-provoking "what if" questions. Swipe to continue.',
    icon: '🤔',
    mode: 'swipe',
    promptType: 'Hypothetical questions',
  },
  {
    id: 'never',
    label: 'Never Have I Ever',
    description: 'Academic edition. Swipe through and reflect.',
    icon: '🙅',
    mode: 'swipe',
    promptType: 'Never Have I Ever statements related to the subject',
  },
  {
    id: 'open',
    label: 'Open-ended',
    description: 'Discussion starters with no right or wrong answer.',
    icon: '💬',
    mode: 'swipe',
    promptType: 'Open-ended discussion questions',
  },
];
