
export interface SignUpData {
  email: string
  password: string
  fullName?: string
  phoneNumber?: string
}

export interface SignInData {
  email: string
  password: string
}

export class AuthService {
  /**
   * Sign up a new user (Mock)
   */
  async signUp(data: SignUpData) {
    const { email, fullName } = data
    
    // Mock successful signup
    const user = {
      id: "mock-user-id",
      email,
      user_metadata: {
        full_name: fullName,
      }
    }

    return { user, error: null }
  }

  /**
   * Sign in an existing user (Mock)
   */
  async signIn(data: SignInData) {
    const { email } = data

    // Mock successful signin
    const user = {
      id: "mock-user-id",
      email,
    }
    const session = {
      access_token: "mock-token",
      user,
    }

    return { user, session, error: null }
  }

  /**
   * Sign out the current user (Mock)
   */
  async signOut() {
    return { error: null }
  }

  /**
   * Send password reset email (Mock)
   */
  async resetPassword() {
    return { error: null }
  }

  /**
   * Update user password (Mock)
   */
  async updatePassword() {
    return { error: null }
  }

  /**
   * Get current user (Mock)
   */
  async getCurrentUser() {
    const user = {
      id: "mock-user-id",
      email: "demo@eventeev.com",
      user_metadata: {
        full_name: "Demo User",
      }
    }
    return { user, error: null }
  }

  /**
   * Get current session (Mock)
   */
  async getSession() {
    const session = {
      access_token: "mock-token",
      user: {
        id: "mock-user-id",
        email: "demo@eventeev.com",
      }
    }
    return { session, error: null }
  }

  /**
   * Sign in with OAuth provider (Mock)
   */
  async signInWithOAuth() {
    return { data: { url: '#' }, error: null }
  }

  /**
   * Update user profile (Mock)
   */
  async updateProfile(userId: string, updates: Partial<{
    full_name: string
    phone_number: string
    avatar_url: string
  }>) {
    const data = {
      id: userId,
      ...updates,
      updated_at: new Date().toISOString(),
    }

    return { data, error: null }
  }

  /**
   * Get user profile (Mock)
   */
  async getProfile(userId: string) {
    const data = {
      id: userId,
      email: "demo@eventeev.com",
      full_name: "Demo User",
      phone_number: "+1234567890",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    return { data, error: null }
  }
}

export const authService = new AuthService()

