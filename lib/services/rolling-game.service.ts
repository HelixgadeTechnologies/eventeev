import axiosInstance from "../axios";

export class RollingGameService {
  async getSettings(eventId: string) {
    try {
      const response = await axiosInstance.get(`/api/game/${eventId}/rolling/settings`);
      return response.data;
    } catch (error: any) {
      const status = error.response?.status;
      if (status === 404) return null;
      console.error('Failed to fetch rolling game settings:', error);
      throw error;
    }
  }

  async updateSettings(eventId: string, data: any) {
    try {
      const response = await axiosInstance.patch(`/api/game/${eventId}/rolling/settings`, data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to update rolling game settings:', error);
      throw error;
    }
  }

  async getParticipants(eventId: string) {
    try {
      const response = await axiosInstance.get(`/api/game/${eventId}/rolling/participants`);
      const rawData = response.data?.data || response.data;
      return Array.isArray(rawData) ? rawData : [];
    } catch (error: any) {
      const status = error.response?.status;
      if (status === 404) return [];
      console.error('Failed to fetch rolling game participants:', error);
      throw error;
    }
  }

  async recordWinner(eventId: string, data: { userId: string; prizeWon: string }) {
    try {
      const response = await axiosInstance.post(`/api/game/${eventId}/rolling/winner`, data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to record winner:', error);
      throw error;
    }
  }

  async getWinners(eventId: string) {
    try {
      const response = await axiosInstance.get(`/api/game/${eventId}/rolling/winners`);
      const rawData = response.data?.data || response.data;
      return Array.isArray(rawData) ? rawData : [];
    } catch (error: any) {
      const status = error.response?.status;
      if (status === 404) return [];
      console.error('Failed to fetch winners:', error);
      throw error;
    }
  }

  async resetGame(eventId: string) {
    try {
      const response = await axiosInstance.post(`/api/game/${eventId}/rolling/reset`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to reset game:', error);
      throw error;
    }
  }
}

export const rollingGameService = new RollingGameService();
export default rollingGameService;
