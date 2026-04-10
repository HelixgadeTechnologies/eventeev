
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
    firstName: string;
    lastName: string;
    title: string;
    company: string;
    bio: string;
    twitter?: string;
    companyTwitter?: string;
    topic?: string;
    photo?: string;
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

  /**
   * Get a single speaker by ID
   */
  async getSpeaker(id: string) {
    try {
      const response = await axiosInstance.get(`/api/speaker/${id}`);
      return { data: response.data, error: null };
    } catch (error: any) {
      console.error('Failed to fetch speaker:', error);
      return { data: null, error: error.response?.data || { message: 'Failed to fetch speaker' } };
    }
  }

  /**
   * Delete a speaker
   */
  async deleteSpeaker(id: string) {
    try {
      const response = await axiosInstance.delete(`/api/speaker/${id}`);
      return { data: response.data, error: null };
    } catch (error: any) {
      console.error('Failed to delete speaker:', error);
      return { data: null, error: error.response?.data || { message: 'Failed to delete speaker' } };
    }
  }

  /**
   * Manage speaker sessions
   */
  async manageSessions(id: string, sessions: any[]) {
    try {
      const response = await axiosInstance.post(`/api/speaker/${id}/sessions`, { sessions });
      return { data: response.data, error: null };
    } catch (error: any) {
      console.error('Failed to manage sessions:', error);
      return { data: null, error: error.response?.data || { message: 'Failed to manage sessions' } };
    }
  }
  /**
   * Get speaker statistics for an event
   */
  async getSpeakerStats(eventId: string) {
    try {
      const response = await axiosInstance.get(`/api/speaker/event/${eventId}/stats`);
      return { data: response.data, error: null };
    } catch (error: any) {
      console.error('Failed to fetch speaker stats:', error);
      return { data: null, error: error.response?.data || { message: 'Failed to fetch stats' } };
    }
  }
}

export const speakersService = new SpeakersService();
