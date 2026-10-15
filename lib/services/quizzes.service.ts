import axiosInstance from "../axios";

const isMongoObjectId = (id: string): boolean => /^[0-9a-fA-F]{24}$/.test(id);

export class QuizzesService {
  async createQuiz(data: any) {
    try {
      const response = await axiosInstance.post('/api/game/quiz/create', data);
      return response.data?.data || response.data;
    } catch (error: any) {
      console.error('Failed to create quiz:', error);
      throw error;
    }
  }

  async getQuiz(id: string) {
    if (!id || !isMongoObjectId(id)) {
      return null;
    }

    try {
      const response = await axiosInstance.get(`/api/game/quiz/${id}`);
      return response.data?.data || response.data || null;
    } catch (error: any) {
      console.warn(`[QuizzesService] Could not fetch quiz "${id}":`, error?.message || error);
      return null;
    }
  }

  async hostQuiz(id: string) {
    if (!id || !isMongoObjectId(id)) {
      throw new Error("Invalid quiz ID");
    }

    try {
      const response = await axiosInstance.post(`/api/game/quiz/${id}/session`);
      return response.data?.data || response.data;
    } catch (error: any) {
      console.error(`[QuizzesService] Failed to start host session for "${id}":`, error?.message || error);
      throw error;
    }
  }

  async joinSession(pin: string, nickname: string, userId?: string) {
    try {
      const response = await axiosInstance.post('/api/game/quiz/session/join', { pin, nickname, userId });
      return response.data?.data || response.data;
    } catch (error: any) {
      console.error(`[QuizzesService] Failed to join session ${pin}:`, error?.message || error);
      throw error;
    }
  }

  async submitAnswer(pin: string, data: { userId: string; questionIndex: number; answerIndex: number; timeTaken: number }) {
    try {
      const response = await axiosInstance.patch(`/api/game/quiz/session/${pin}/submit`, data);
      return response.data?.data || response.data;
    } catch (error: any) {
      console.error(`[QuizzesService] Failed to submit answer for ${pin}:`, error?.message || error);
      throw error;
    }
  }

  async getLeaderboard(pin: string) {
    if (!pin) return [];

    try {
      const response = await axiosInstance.get(`/api/game/quiz/session/${pin}/leaderboard`);
      const raw = response.data?.data || response.data;
      return Array.isArray(raw) ? raw : [];
    } catch (error: any) {
      console.warn(`[QuizzesService] Could not fetch leaderboard for pin "${pin}":`, error?.message || error);
      return [];
    }
  }

  async getQuizzesByEvent(eventId: string) {
    if (!eventId || !isMongoObjectId(eventId)) {
      return [];
    }

    try {
      const response = await axiosInstance.get(`/api/game/quiz/event/${eventId}`);
      const rawData = response.data?.data || response.data;
      return Array.isArray(rawData) ? rawData : [];
    } catch (error: any) {
      const status = error.response?.status;
      const msg: string = error.response?.data?.message || '';
      if (status === 404 || status === 500 || msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('no quiz')) {
        return [];
      }
      console.warn('Failed to fetch event quizzes:', error?.message || error);
      return [];
    }
  }
}

export const quizzesService = new QuizzesService();
export default quizzesService;



