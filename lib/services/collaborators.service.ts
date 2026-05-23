import axiosInstance from '@/lib/axios';

export interface ApiCollaborator {
  user: {
    id: string;
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  role: 'manager' | 'monitor';
  addedAt: string;
}

export class CollaboratorsService {
  /**
   * Get all collaborators for an event
   */
  async getCollaborators(eventId: string) {
    try {
      const response = await axiosInstance.get(`/api/event/${eventId}/collaborators`);
      const mappedData = (response.data as any[]).map((c) => ({
        ...c,
        user: c.user ? {
          ...c.user,
          id: c.user.id || c.user._id
        } : null
      }));
      return { data: mappedData as ApiCollaborator[], error: null };
    } catch (error: any) {
      console.error('Failed to fetch collaborators:', error);
      return { data: [], error: error.response?.data || { message: 'Failed to fetch collaborators' } };
    }
  }

  /**
   * Add or invite a collaborator to an event
   */
  async addCollaborator(eventId: string, email: string, role: 'manager' | 'monitor') {
    try {
      const response = await axiosInstance.post(`/api/event/${eventId}/collaborators`, { email, role });
      const data = response.data;
      if (data && data.collaborator) {
        data.collaborator = {
          ...data.collaborator,
          user: data.collaborator.user ? {
            ...data.collaborator.user,
            id: data.collaborator.user.id || data.collaborator.user._id
          } : null
        };
      }
      return { data, error: null };
    } catch (error: any) {
      console.error('Failed to add collaborator:', error);
      return { data: null, error: error.response?.data || { message: 'Failed to add collaborator' } };
    }
  }

  /**
   * Update collaborator role
   */
  async updateCollaborator(eventId: string, userId: string, role: 'manager' | 'monitor') {
    try {
      const response = await axiosInstance.patch(`/api/event/${eventId}/collaborators/${userId}`, { role });
      return { data: response.data, error: null };
    } catch (error: any) {
      console.error('Failed to update collaborator role:', error);
      return { data: null, error: error.response?.data || { message: 'Failed to update role' } };
    }
  }

  /**
   * Remove collaborator
   */
  async removeCollaborator(eventId: string, userId: string) {
    try {
      const response = await axiosInstance.delete(`/api/event/${eventId}/collaborators/${userId}`);
      return { data: response.data, error: null };
    } catch (error: any) {
      console.error('Failed to remove collaborator:', error);
      return { data: null, error: error.response?.data || { message: 'Failed to remove collaborator' } };
    }
  }
}

export const collaboratorsService = new CollaboratorsService();
