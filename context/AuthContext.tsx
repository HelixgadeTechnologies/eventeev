'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axios'

interface AuthContextType {
  user: any | null
  session: any | null
  loading: boolean
  signUp: (firstName: string, lastName: string, email: string, password: string) => Promise<{ error: any | null }>
  signIn: (email: string, password: string) => Promise<{ error: any | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any | null }>
  updatePassword: (newPassword: string) => Promise<{ error: any | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [session, setSession] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('x-auth-token')
      if (token) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[AuthContext] Session token found, verifying with server...');
        }
        try {
          // Fetch current user from backend
          const response = await axiosInstance.get('/api/user/me')
          const userData = response.data
          setUser(userData)
          setSession({ access_token: token, user: userData })
          if (process.env.NODE_ENV === 'development') {
            console.log('[AuthContext] Session verified successfully for:', userData.email);
          }
        } catch (error: any) {
          console.error('[AuthContext] Failed to verify session:', error.message);
          localStorage.removeItem('x-auth-token')
        }
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[AuthContext] No session token found in localStorage');
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const signUp = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      const response = await axiosInstance.post('/api/auth/register', {
        firstName,
        lastName,
        email,
        password,
      })
      
      const { token, user: newUser } = response.data
      
      if (token) {
        localStorage.setItem('x-auth-token', token)
        setUser(newUser)
        setSession({ access_token: token, user: newUser })
      }
      
      return { error: null }
    } catch (error: any) {
      console.error('Signup error:', error)
      if (error.response?.status === 500) {
        console.error('SERVER 500 ERROR DETAILS:', {
          data: error.response.data,
          headers: error.response.headers,
        });
      }
      return { error: error.response?.data || { message: 'An error occurred during signup' } }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', {
        email,
        password,
      })
      
      const { token, user: signedInUser } = response.data
      
      if (token) {
        localStorage.setItem('x-auth-token', token)
        setUser(signedInUser)
        setSession({ access_token: token, user: signedInUser })
      } else if (response.headers['x-auth-token']) {
        // Fallback for header-based token return
        const headerToken = response.headers['x-auth-token']
        localStorage.setItem('x-auth-token', headerToken)
        setUser(signedInUser || response.data)
        setSession({ access_token: headerToken, user: signedInUser || response.data })
      }
      
      return { error: null }
    } catch (error: any) {
      console.error('Signin error:', error)
      if (error.response?.status === 500) {
        console.error('SERVER 500 ERROR DETAILS:', {
          data: error.response.data,
          headers: error.response.headers,
        });
      }
      return { error: error.response?.data || { message: 'Invalid credentials' } }
    }
  }

  const signOut = async () => {
    localStorage.removeItem('x-auth-token')
    setUser(null)
    setSession(null)
    router.push('/sign-in')
  }

  const resetPassword = async (email: string) => {
    try {
      await axiosInstance.post('/api/auth/reset-password', { email })
      return { error: null }
    } catch (error: any) {
      return { error: error.response?.data || { message: 'Error resetting password' } }
    }
  }

  const updatePassword = async (newPassword: string) => {
    try {
      await axiosInstance.post('/api/auth/update-password', { password: newPassword })
      return { error: null }
    } catch (error: any) {
      return { error: error.response?.data || { message: 'Error updating password' } }
    }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

