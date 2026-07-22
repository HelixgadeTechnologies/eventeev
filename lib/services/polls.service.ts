import axiosInstance from "../axios";

export class PollsService {
  async getPolls(eventId: string) {
    try {
      const response = await axiosInstance.get(`/api/poll/event/${eventId}`);
      const rawData = response.data?.data || response.data;
      return Array.isArray(rawData) ? rawData : [];
    } catch (error: any) {
      const status = error.response?.status;
      const msg: string = error.response?.data?.message || '';
      const isEmpty =
        status === 404 ||
        msg.toLowerCase().includes('no poll') ||
        msg.toLowerCase().includes('not found');
      if (isEmpty) return [];
      console.error('Failed to fetch polls:', error);
      throw error;
    }
  }

  async createPoll(data: any) {
    try {
      const response = await axiosInstance.post('/api/poll/create', data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create poll:', error);
      throw error;
    }
  }

  async getPollResults(id: string) {
    try {
      const response = await axiosInstance.get(`/api/poll/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch poll results:', error);
      throw error;
    }
  }

  async updateStatus(id: string, status: 'LIVE' | 'ENDED') {
    try {
      const response = await axiosInstance.patch(`/api/poll/${id}/status`, { status });
      return response.data;
    } catch (error: any) {
      console.error('Failed to update poll status:', error);
      throw error;
    }
  }

  async submitVote(id: string, data: { questionId: string; optionId: string }) {
    try {
      const response = await axiosInstance.post(`/api/poll/${id}/vote`, data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to submit vote:', error);
      throw error;
    }
  }

  async deletePoll(id: string) {
    try {
      const response = await axiosInstance.delete(`/api/poll/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to delete poll:', error);
      throw error;
    }
  }
}

export const pollsService = new PollsService();
export default pollsService;
