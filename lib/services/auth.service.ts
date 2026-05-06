import axiosInstance from "../axios"

export interface SignUpData {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface SignInData {
  email: string
  password: string
}

export class AuthService {
  /**
   * Sign up a new user
   */
  async signUp(data: SignUpData) {
    try {
      const response = await axiosInstance.post('/api/auth/register', data);
      const { user, token } = response.data;
      const mappedUser = user ? { ...user, id: user.id || user._id } : null;
      
      if (token) {
        localStorage.setItem('x-auth-token', token);
      }
      
      return { user: mappedUser, error: null }
    } catch (error: any) {
      return { user: null, error: error.response?.data?.message || 'Registration failed' }
    }
  }

  /**
   * Sign in an existing user
   */
  async signIn(data: SignInData) {
    try {
      const response = await axiosInstance.post('/api/auth/login', data);
      const { user, token } = response.data;
      const mappedUser = user ? { ...user, id: user.id || user._id } : null;
      
      if (token) {
        localStorage.setItem('x-auth-token', token);
      }

      return { user: mappedUser, session: { access_token: token, user: mappedUser }, error: null }
    } catch (error: any) {
      return { user: null, session: null, error: error.response?.data?.message || 'Login failed' }
    }
  }

  /**
   * Sign out the current user
   */
  async signOut() {
    localStorage.removeItem('x-auth-token');
    return { error: null }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string) {
    try {
      await axiosInstance.post('/api/auth/forgotpassword', { email });
      return { error: null }
    } catch (error: any) {
      return { error: error.response?.data?.message || 'Failed to send reset email' }
    }
  }

  /**
   * Update user password
   */
  async updatePassword(token: string, password: string) {
    try {
      await axiosInstance.post(`/api/auth/resetpassword/${token}`, { password });
      return { error: null }
    } catch (error: any) {
      return { error: error.response?.data?.message || 'Failed to update password' }
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser() {
    try {
      const response = await axiosInstance.get('/api/user/me');
      const user = response.data ? { ...response.data, id: response.data.id || response.data._id } : null;
      return { user, error: null }
    } catch (error: any) {
      return { user: null, error: error.response?.data?.message || 'Failed to get current user' }
    }
  }

  /**
   * Get current session
   */
  async getSession() {
    const token = localStorage.getItem('x-auth-token');
    if (!token) return { session: null, error: 'No session' };
    
    try {
      const { user, error } = await this.getCurrentUser();
      if (error) return { session: null, error };
      return { session: { access_token: token, user }, error: null };
    } catch (error: any) {
      return { session: null, error: 'Failed to get session' };
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: any) {
    try {
      const response = await axiosInstance.put(`/api/user/updateuser/${userId}`, updates);
      return { data: response.data, error: null }
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Update failed' }
    }
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string) {
    try {
      const response = await axiosInstance.get(`/api/user/${userId}`);
      return { data: response.data, error: null }
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Failed to get profile' }
    }
  }

  /**
   * Verify OTP
   */
  async verifyOtp(email: string, otp: string) {
    try {
      const response = await axiosInstance.post('/api/auth/verify-otp', { email, otp });
      const { user, token } = response.data;
      const mappedUser = user ? { ...user, id: user.id || user._id } : null;
      
      if (token) {
        localStorage.setItem('x-auth-token', token);
      }
      
      return { user: mappedUser, token, error: null }
    } catch (error: any) {
      return { user: null, token: null, error: error.response?.data?.message || 'Verification failed' }
    }
  }

  /**
   * Resend OTP
   */
  async resendOtp(email: string) {
    try {
      const response = await axiosInstance.post('/api/auth/resend-otp', { email });
      return { data: response.data, error: null }
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Failed to resend OTP' }
    }
  }

  /**
   * Login with Google
   */
  async googleLogin(idToken: string) {
    try {
      const response = await axiosInstance.post('/api/auth/google', { idToken });
      const { user, token } = response.data;
      const mappedUser = user ? { ...user, id: user.id || user._id } : null;
      
      if (token) {
        localStorage.setItem('x-auth-token', token);
      }
      
      return { user: mappedUser, token, error: null }
    } catch (error: any) {
      return { user: null, token: null, error: error.response?.data?.message || 'Google login failed' }
    }
  }
}

export const authService = new AuthService()

