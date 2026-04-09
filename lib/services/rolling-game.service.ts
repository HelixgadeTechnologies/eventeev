import axiosInstance from "../axios";

export class RollingGameService {
  async getSettings(eventId: string) {
    const response = await axiosInstance.get(`/api/game/${eventId}/rolling/settings`);
    return response.data;
  }

  async updateSettings(eventId: string, data: any) {
    const response = await axiosInstance.patch(`/api/game/${eventId}/rolling/settings`, data);
    return response.data;
  }

  async getParticipants(eventId: string) {
    const response = await axiosInstance.get(`/api/game/${eventId}/rolling/participants`);
    return response.data;
  }

  async recordWinner(eventId: string, data: { userId: string; prizeWon: string }) {
    const response = await axiosInstance.post(`/api/game/${eventId}/rolling/winner`, data);
    return response.data;
  }

  async getWinners(eventId: string) {
    const response = await axiosInstance.get(`/api/game/${eventId}/rolling/winners`);
    return response.data;
  }

  async resetGame(eventId: string) {
    const response = await axiosInstance.post(`/api/game/${eventId}/rolling/reset`);
    return response.data;
  }
}

export const rollingGameService = new RollingGameService();
export default rollingGameService;
