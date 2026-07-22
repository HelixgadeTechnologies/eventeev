import axiosInstance from "../axios";

export class QuizzesService {
  async createQuiz(data: any) {
    try {
      const response = await axiosInstance.post('/api/game/quiz/create', data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create quiz:', error);
      throw error;
    }
  }

  async getQuiz(id: string) {
    try {
      const response = await axiosInstance.get(`/api/game/quiz/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch quiz:', error);
      throw error;
    }
  }

  async hostQuiz(id: string) {
    try {
      const response = await axiosInstance.post(`/api/game/quiz/${id}/session`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to host quiz:', error);
      throw error;
    }
  }

  async joinSession(pin: string, nickname: string, userId?: string) {
    try {
      const response = await axiosInstance.post('/api/game/quiz/session/join', { pin, nickname, userId });
      return response.data;
    } catch (error: any) {
      console.error('Failed to join session:', error);
      throw error;
    }
  }

  async submitAnswer(pin: string, data: { userId: string; questionIndex: number; answerIndex: number; timeTaken: number }) {
    try {
      const response = await axiosInstance.patch(`/api/game/quiz/session/${pin}/submit`, data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to submit answer:', error);
      throw error;
    }
  }

  async getLeaderboard(pin: string) {
    try {
      const response = await axiosInstance.get(`/api/game/quiz/session/${pin}/leaderboard`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch leaderboard:', error);
      throw error;
    }
  }

  async getQuizzesByEvent(eventId: string) {
    try {
      const response = await axiosInstance.get(`/api/game/quiz/event/${eventId}`);
      const rawData = response.data?.data || response.data;
      return Array.isArray(rawData) ? rawData : [];
    } catch (error: any) {
      const status = error.response?.status;
      const msg: string = error.response?.data?.message || '';
      if (status === 404 || msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('no quiz')) return [];
      console.error('Failed to fetch quizzes:', error);
      throw error;
    }
  }
}

export const quizzesService = new QuizzesService();
export default quizzesService;

