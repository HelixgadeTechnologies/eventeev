import axiosInstance from "../axios";

export class ChecklistService {
  async getChecklist(eventId: string) {
    try {
      const response = await axiosInstance.get(`/api/checklist/event/${eventId}`);
      const rawData = response.data?.data || response.data;
      return Array.isArray(rawData) ? rawData : [];
    } catch (error: any) {
      const status = error.response?.status;
      const msg: string = error.response?.data?.message || '';
      if (status === 404 || msg.toLowerCase().includes('not found')) return [];
      console.error('Failed to fetch checklist:', error);
      throw error;
    }
  }

  async createItem(data: any) {
    try {
      const response = await axiosInstance.post('/api/checklist', data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create checklist item:', error);
      throw error;
    }
  }

  async updateItem(id: string, data: any) {
    try {
      const response = await axiosInstance.patch(`/api/checklist/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to update checklist item:', error);
      throw error;
    }
  }

  async deleteItem(id: string) {
    try {
      const response = await axiosInstance.delete(`/api/checklist/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to delete checklist item:', error);
      throw error;
    }
  }

  async initializeChecklist(eventId: string, templateType: string) {
    try {
      const response = await axiosInstance.post('/api/checklist/initialize', { eventId, templateType });
      return response.data;
    } catch (error: any) {
      console.error('Failed to initialize checklist:', error);
      throw error;
    }
  }
}

export const checklistService = new ChecklistService();
export default checklistService;
