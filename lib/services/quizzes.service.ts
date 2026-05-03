import axiosInstance from "../axios";

export const SPACE_TRIVIA_QUIZ = {
  id: "space-trivia",
  title: "The Ultimate Space Trivia",
  description: "Test your knowledge of the cosmos! From the Red Planet to the far reaches of the Milky Way.",
  category: "Science",
  questionsCount: 10,
  author: "SARAH J.",
  thumbnail: "/thumbnails/space_trivia.png",
  avgTime: "5m",
  plays: "1.2k",
  level: "Beginner",
  isVerified: true,
  questions: [
    {
      text: "Which planet is known as the 'Red Planet'?",
      options: ["Mars", "Jupiter", "Venus", "Saturn"],
      correctAnswer: [0],
      timeLimit: 20,
      mediaUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1000&auto=format&fit=crop"
    },
    {
      text: "What is the largest planet in our solar system?",
      options: ["Neptune", "Saturn", "Jupiter", "Uranus"],
      correctAnswer: [2],
      timeLimit: 20,
      mediaUrl: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bac4?q=80&w=1000&auto=format&fit=crop"
    },
    {
      text: "Which galaxy is home to the Solar System?",
      options: ["Andromeda", "Milky Way", "Sombrero", "Triangulum"],
      correctAnswer: [1],
      timeLimit: 20,
      mediaUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000&auto=format&fit=crop"
    },
    {
      text: "What is the hottest planet in our solar system?",
      options: ["Mercury", "Venus", "Mars", "Jupiter"],
      correctAnswer: [1],
      timeLimit: 20,
      mediaUrl: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?q=80&w=1000&auto=format&fit=crop"
    },
    {
      text: "Which planet has the most famous rings?",
      options: ["Jupiter", "Uranus", "Neptune", "Saturn"],
      correctAnswer: [3],
      timeLimit: 20,
      mediaUrl: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=1000&auto=format&fit=crop"
    },
    {
      text: "Who was the first human to travel into space?",
      options: ["Neil Armstrong", "Yuri Gagarin", "Buzz Aldrin", "John Glenn"],
      correctAnswer: [1],
      timeLimit: 20,
      mediaUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1000&auto=format&fit=crop"
    },
    {
      text: "What is the name of the largest moon of Saturn?",
      options: ["Titan", "Europa", "Ganymede", "Callisto"],
      correctAnswer: [0],
      timeLimit: 20,
      mediaUrl: "https://images.unsplash.com/photo-1614732484003-ef9881555dc3?q=80&w=1000&auto=format&fit=crop"
    },
    {
      text: "What celestial body was reclassified as a dwarf planet in 2006?",
      options: ["Eris", "Ceres", "Pluto", "Makemake"],
      correctAnswer: [2],
      timeLimit: 20,
      mediaUrl: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=1000&auto=format&fit=crop"
    },
    {
      text: "What is the closest star to Earth?",
      options: ["Proxima Centauri", "Sirius", "The Sun", "Alpha Centauri"],
      correctAnswer: [2],
      timeLimit: 20,
      mediaUrl: "https://images.unsplash.com/photo-1532386230698-ac21440c9667?q=80&w=1000&auto=format&fit=crop"
    },
    {
      text: "What phenomenon occurs when the Moon passes between the Earth and the Sun?",
      options: ["Lunar Eclipse", "Solar Eclipse", "Supermoon", "New Moon"],
      correctAnswer: [1],
      timeLimit: 20,
      mediaUrl: "https://images.unsplash.com/photo-1532386230698-ac21440c9667?q=80&w=1000&auto=format&fit=crop"
    }
  ],
  relatedQuizzes: [
    { id: "modern-art", title: "Modern Art Masterpieces", category: "Art", questions: 12, author: "ALEX RIVERS", thumbnail: "/thumbnails/modern_art.png" },
    { id: "pop-hits", title: "2000s Pop Hits Quiz", category: "Music", questions: 20, author: "DJ MIKE", thumbnail: "/thumbnails/pop_hits.png" }
  ]
};

export class QuizzesService {
  async createQuiz(data: any) {
    const response = await axiosInstance.post('/api/game/quiz/create', data);
    return response.data;
  }

  async getQuiz(id: string) {
    if (id === "space-trivia") {
      return SPACE_TRIVIA_QUIZ;
    }
    const response = await axiosInstance.get(`/api/game/quiz/${id}`);
    return response.data;
  }

  async hostQuiz(id: string) {
    if (id === "space-trivia") {
      return { pin: "452901" };
    }
    const response = await axiosInstance.post(`/api/game/quiz/${id}/session`);
    return response.data;
  }

  async joinSession(pin: string, nickname: string, userId?: string) {
    const response = await axiosInstance.post('/api/game/quiz/session/join', { pin, nickname, userId });
    return response.data;
  }

  async submitAnswer(pin: string, data: { userId: string; questionIndex: number; answerIndex: number; timeTaken: number }) {
    const response = await axiosInstance.patch(`/api/game/quiz/session/${pin}/submit`, data);
    return response.data;
  }

  async getLeaderboard(pin: string) {
    if (pin === "452901") {
      return [
        { nickname: "SARAH_J", score: 0, isQuizMaster: true },
        { nickname: "SpaceExplorer", score: 0 },
        { nickname: "RocketMan", score: 0 },
        { nickname: "StarGazer", score: 0 },
        { nickname: "Cosmo", score: 0 },
      ];
    }
    const response = await axiosInstance.get(`/api/game/quiz/session/${pin}/leaderboard`);
    return response.data;
  }

  async getQuizzesByEvent(eventId: string) {
    const response = await axiosInstance.get(`/api/game/quiz/event/${eventId}`);
    return response.data;
  }
}

export const quizzesService = new QuizzesService();
export default quizzesService;
