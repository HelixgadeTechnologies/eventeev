import axiosInstance from "../axios";

export class QuizzesService {
  async createQuiz(data: any) {
    const response = await axiosInstance.post('/api/game/quiz/create', data);
    return response.data;
  }

  async getQuiz(id: string) {
    const response = await axiosInstance.get(`/api/game/quiz/${id}`);
    return response.data;
  }

  async hostQuiz(id: string) {
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
    const response = await axiosInstance.get(`/api/game/quiz/session/${pin}/leaderboard`);
    return response.data;
  }
}

export const quizzesService = new QuizzesService();
export default quizzesService;
