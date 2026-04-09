import axiosInstance from "../axios";

export class LinksService {
  async getLinks(eventId: string) {
    const response = await axiosInstance.get(`/api/link/event/${eventId}`);
    return response.data;
  }

  async createLink(data: any) {
    const response = await axiosInstance.post('/api/link', data);
    return response.data;
  }

  async updateLink(id: string, data: any) {
    const response = await axiosInstance.patch(`/api/link/${id}`, data);
    return response.data;
  }

  async deleteLink(id: string) {
    const response = await axiosInstance.delete(`/api/link/${id}`);
    return response.data;
  }
}

export const linksService = new LinksService();
export default linksService;
