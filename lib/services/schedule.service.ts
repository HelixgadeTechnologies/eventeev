import axiosInstance from "../axios";

export class ScheduleService {
  async getSchedule(eventId: string) {
    try {
      const response = await axiosInstance.get(`/api/schedule/event/${eventId}`);
      const rawData = response.data?.data || response.data;
      return Array.isArray(rawData) ? rawData : [];
    } catch (error: any) {
      const status = error.response?.status;
      const msg: string = error.response?.data?.message || '';
      const isEmpty = status === 404 || msg.toLowerCase().includes('no schedule') || msg.toLowerCase().includes('not found');
      if (isEmpty) return [];
      console.error('Failed to fetch schedule:', error);
      throw error;
    }
  }

  async createItem(data: any) {
    try {
      const response = await axiosInstance.post('/api/schedule', data);
      return response.data;
    } catch (error: any) {
      const backendMsg = error.response?.data?.message || error.response?.data?.error || error.message;
      const status = error.response?.status;
      console.error(`Failed to create schedule item [${status}]:`, backendMsg, '\nPayload:', JSON.stringify(data));
      throw error;
    }
  }

  async updateItem(id: string, data: any) {
    try {
      const response = await axiosInstance.put(`/api/schedule/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to update schedule item:', error);
      throw error;
    }
  }

  async deleteItem(id: string) {
    try {
      const response = await axiosInstance.delete(`/api/schedule/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to delete schedule item:', error);
      throw error;
    }
  }

  async reorderItems(eventId: string, orderedIds: string[]) {
    try {
      const response = await axiosInstance.put(`/api/schedule/reorder`, { eventId, orderedIds });
      return response.data;
    } catch (error: any) {
      console.error('Failed to reorder schedule items:', error);
      throw error;
    }
  }
}

export const scheduleService = new ScheduleService();
export default scheduleService;
