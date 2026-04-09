import axiosInstance from "../axios";

export interface ProfileUpdateData {
  firstName: string;
  lastName: string;
  gender: string;
  tZone: string;
  country: string;
  avatar?: string;
}

export interface OrganisationUpdateData {
  orgName: string;
  orgWebsite: string;
  orgIndustry: string;
}

class ProfileService {
  /**
   * Update general user profile fields
   * @param userId The ID of the user to update
   * @param data Profile fields to update
   */
  async updateUserProfile(userId: string, data: ProfileUpdateData) {
    try {
      const response = await axiosInstance.put(`/api/user/updateuser/${userId}`, data);
      return { data: response.data, error: null };
    } catch (error: any) {
      console.error("Failed to update user profile:", error);
      return { 
        data: null, 
        error: error.response?.data || { message: "Failed to update profile" } 
      };
    }
  }

  /**
   * Update organisation details for the currently authenticated user
   * @param data Organisation fields to update
   */
  async updateOrganisationDetails(data: OrganisationUpdateData) {
    try {
      const response = await axiosInstance.put("/api/auth/organisation", data);
      return { data: response.data, error: null };
    } catch (error: any) {
      console.error("Failed to update organisation details:", error);
      return { 
        data: null, 
        error: error.response?.data || { message: "Failed to update organisation" } 
      };
    }
  }
}

export const profileService = new ProfileService();
