export interface DemoQuestion {
  text: string;
  options: string[];
  correctAnswer: number[];
  timeLimit: number;
  mediaUrl?: string;
}

export interface DemoRelatedQuiz {
  id: string;
  title: string;
  questions: number;
  plays: string;
  thumbnail: string;
}

export interface DemoQuiz {
  id: string;
  _id: string;
  title: string;
  category: string;
  description: string;
  author: string;
  isVerified: boolean;
  thumbnail: string;
  avgTime: string;
  plays: string;
  level: string;
  questions: DemoQuestion[];
  relatedQuizzes?: DemoRelatedQuiz[];
}

export const demoQuizzes: Record<string, DemoQuiz> = {};

export function getFallbackQuiz(id: string): DemoQuiz | null {
  return null;
}

