
import axiosInstance from '@/lib/axios';

export interface ApiSpeaker {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  twitterHandle?: string;
  topic?: string;
  image?: string;
  eventId: string;
}

export class SpeakersService {
  /**
   * Get all speakers for an event
   */
  async getSpeakers(eventId: string) {
    try {
      const response = await axiosInstance.get(`/api/speaker/event/${eventId}`);
      return { data: response.data as ApiSpeaker[], error: null };
    } catch (error: any) {
      console.error('Failed to fetch speakers:', error);
      return { data: [], error: error.response?.data || { message: 'Failed to fetch speakers' } };
    }
  }

  /**
   * Create a new speaker
   */
  async createSpeaker(payload: {
    eventId: string;
    name: string;
    title: string;
    company: string;
    bio: string;
    twitterHandle?: string;
    topic?: string;
    image?: string;
  }) {
    try {
      const response = await axiosInstance.post('/api/speaker/create', payload);
      return { data: response.data, error: null };
    } catch (error: any) {
      console.error('Failed to create speaker:', error);
      return { data: null, error: error.response?.data || { message: 'Failed to create speaker' } };
    }
  }

  /**
   * Update an existing speaker
   */
  async updateSpeaker(id: string, payload: Partial<ApiSpeaker>) {
    try {
      const response = await axiosInstance.put(`/api/speaker/edit/${id}`, payload);
      return { data: response.data, error: null };
    } catch (error: any) {
      console.error('Failed to update speaker:', error);
      return { data: null, error: error.response?.data || { message: 'Failed to update speaker' } };
    }
  }
}

export const speakersService = new SpeakersService();
