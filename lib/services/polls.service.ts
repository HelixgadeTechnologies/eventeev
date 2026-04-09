import axiosInstance from "../axios";

export class PollsService {
  async getPolls(eventId: string) {
    const response = await axiosInstance.get(`/api/poll/event/${eventId}`);
    return response.data;
  }

  async createPoll(data: any) {
    const response = await axiosInstance.post('/api/poll/create', data);
    return response.data;
  }

  async getPollResults(id: string) {
    const response = await axiosInstance.get(`/api/poll/${id}`);
    return response.data;
  }

  async updateStatus(id: string, status: 'LIVE' | 'ENDED') {
    const response = await axiosInstance.patch(`/api/poll/${id}/status`, { status });
    return response.data;
  }

  async submitVote(id: string, data: { questionId: string; optionId: string }) {
    const response = await axiosInstance.post(`/api/poll/${id}/vote`, data);
    return response.data;
  }

  async deletePoll(id: string) {
    const response = await axiosInstance.delete(`/api/poll/${id}`);
    return response.data;
  }
}

export const pollsService = new PollsService();
export default pollsService;
