import axiosInstance from "../axios";

export class ChecklistService {
  async getChecklist(eventId: string) {
    const response = await axiosInstance.get(`/api/checklist/event/${eventId}`);
    return response.data;
  }

  async createItem(data: any) {
    const response = await axiosInstance.post('/api/checklist', data);
    return response.data;
  }

  async updateItem(id: string, data: any) {
    const response = await axiosInstance.patch(`/api/checklist/${id}`, data);
    return response.data;
  }

  async deleteItem(id: string) {
    const response = await axiosInstance.delete(`/api/checklist/${id}`);
    return response.data;
  }

  async initializeChecklist(eventId: string, templateType: string) {
    const response = await axiosInstance.post('/api/checklist/initialize', { eventId, templateType });
    return response.data;
  }
}

export const checklistService = new ChecklistService();
export default checklistService;
