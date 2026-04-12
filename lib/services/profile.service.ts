import axiosInstance from "../axios";

export interface ProfileUpdateData {
  firstName: string;
  lastName: string;
  gender: string;
  tZone?: string;    // Frontend name
  timezone?: string; // Backend name
  country: string;
  avatar?: string;
  orgName?: string;        // Frontend name
  organisationName?: string; // Backend name
  orgWebsite?: string;        // Frontend name
  organisationWebsite?: string; // Backend name
  orgIndustry?: string;        // Frontend name
  organisationIndustry?: string; // Backend name
}

export interface OrganisationUpdateData {
  orgName?: string;
  orgWebsite?: string;
  orgIndustry?: string;
  organisationName?: string;
  organisationWebsite?: string;
  organisationIndustry?: string;
}

class ProfileService {
  /**
   * Update general user profile fields
   * @param userId The ID of the user to update
   * @param data Profile fields to update
   */
  async updateUserProfile(userId: string, data: ProfileUpdateData) {
    try {
      // Map frontend fields to backend expectations
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        timezone: data.timezone || data.tZone,
        country: data.country,
        avatar: data.avatar,
        organisationName: data.organisationName || data.orgName,
        organisationWebsite: data.organisationWebsite || data.orgWebsite,
        organisationIndustry: data.organisationIndustry || data.orgIndustry,
      };

      const response = await axiosInstance.put(`/api/user/updateuser/${userId}`, payload);
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
      // Map to backend fields
      const payload = {
        organisationName: data.organisationName || data.orgName,
        organisationWebsite: data.organisationWebsite || data.orgWebsite,
        organisationIndustry: data.organisationIndustry || data.orgIndustry,
      };

      const response = await axiosInstance.put("/api/auth/organisation", payload);
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
