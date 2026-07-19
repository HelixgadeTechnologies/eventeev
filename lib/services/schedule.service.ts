import axiosInstance from "../axios";

export class ScheduleService {
  async getSchedule(eventId: string) {
    const response = await axiosInstance.get(`/api/schedule/event/${eventId}`);
    return response.data;
  }

  async createItem(data: any) {
    const response = await axiosInstance.post('/api/schedule', data);
    return response.data;
  }

  async updateItem(id: string, data: any) {
    const response = await axiosInstance.put(`/api/schedule/${id}`, data);
    return response.data;
  }

  async deleteItem(id: string) {
    const response = await axiosInstance.delete(`/api/schedule/${id}`);
    return response.data;
  }

  async reorderItems(eventId: string, orderedIds: string[]) {
    const response = await axiosInstance.put(`/api/schedule/reorder`, { eventId, orderedIds });
    return response.data;
  }
}

export const scheduleService = new ScheduleService();
export default scheduleService;
