import { createClient } from '@/lib/supabase/client'

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
  private supabase = createClient()

  /**
   * Sign up a new user
   */
  async signUp(data: SignUpData) {
    const { email, password, fullName, phoneNumber } = data

    const { data: authData, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone_number: phoneNumber,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      return { user: null, error }
    }

    // Create user profile in the database
    if (authData.user) {
      await this.createUserProfile(authData.user.id, {
        email,
        full_name: fullName,
        phone_number: phoneNumber,
      })
    }

    return { user: authData.user, error: null }
  }

  /**
   * Sign in an existing user
   */
  async signIn(data: SignInData) {
    const { email, password } = data

    const { data: authData, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    })

    return { user: authData.user, session: authData.session, error }
  }

  /**
   * Sign out the current user
   */
  async signOut() {
    const { error } = await this.supabase.auth.signOut()
    return { error }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string) {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/sign-in/password-reset`,
    })
    return { error }
  }

  /**
   * Update user password
   */
  async updatePassword(newPassword: string) {
    const { error } = await this.supabase.auth.updateUser({
      password: newPassword,
    })
    return { error }
  }

  /**
   * Get current user
   */
  async getCurrentUser() {
    const { data: { user }, error } = await this.supabase.auth.getUser()
    return { user, error }
  }

  /**
   * Get current session
   */
  async getSession() {
    const { data: { session }, error } = await this.supabase.auth.getSession()
    return { session, error }
  }

  /**
   * Sign in with OAuth provider (Google, GitHub, etc.)
   */
  async signInWithOAuth(provider: 'google' | 'github' | 'facebook') {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    return { data, error }
  }

  /**
   * Create user profile in the database
   */
  private async createUserProfile(
    userId: string,
    profile: { email: string; full_name?: string; phone_number?: string }
  ) {
    const { error } = await this.supabase.from('profiles').insert({
      id: userId,
      email: profile.email,
      full_name: profile.full_name,
      phone_number: profile.phone_number,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error('Error creating user profile:', error)
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<{
    full_name: string
    phone_number: string
    avatar_url: string
  }>) {
    const { data, error } = await this.supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single()

    return { data, error }
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string) {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    return { data, error }
  }
}

export const authService = new AuthService()
