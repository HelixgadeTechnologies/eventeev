import axiosInstance from "../axios";

export class LinksService {
  async getLinks(eventId: string) {
    try {
      const response = await axiosInstance.get(`/api/link/event/${eventId}`);
      const rawData = response.data?.data || response.data;
      return Array.isArray(rawData) ? rawData : [];
    } catch (error: any) {
      const status = error.response?.status;
      const msg: string = error.response?.data?.message || '';
      if (status === 404 || msg.toLowerCase().includes('not found')) return [];
      console.error('Failed to fetch links:', error);
      throw error;
    }
  }

  async createLink(data: any) {
    try {
      const response = await axiosInstance.post('/api/link', data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create link:', error);
      throw error;
    }
  }

  async updateLink(id: string, data: any) {
    try {
      const response = await axiosInstance.patch(`/api/link/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to update link:', error);
      throw error;
    }
  }

  async deleteLink(id: string) {
    try {
      const response = await axiosInstance.delete(`/api/link/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to delete link:', error);
      throw error;
    }
  }
}

export const linksService = new LinksService();
export default linksService;
