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
}

export const scheduleService = new ScheduleService();
export default scheduleService;
