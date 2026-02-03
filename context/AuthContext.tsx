'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: any | null
  session: any | null
  loading: boolean
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any | null }>
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
    // Mock initial session
    const mockUser = {
      id: "mock-user-id",
      email: "demo@eventeev.com",
      user_metadata: {
        full_name: "Demo User",
      }
    }
    const mockSession = {
      access_token: "mock-token",
      user: mockUser
    }

    setSession(mockSession)
    setUser(mockUser)
    setLoading(false)
  }, [])

  const signUp = async (email: string, password: string, metadata?: any) => {
    // Mocking signup for direct navigation
    console.log('Mock signup with:', email, metadata)
    router.push('/sign-up/organization-registration')
    return { error: null }
  }


  const signIn = async (email: string, password: string) => {
    // Mocking signin for direct navigation
    console.log('Mock signin with:', email)
    router.push('/events')
    return { error: null }
  }

  const signOut = async () => {
    setUser(null)
    setSession(null)
    router.push('/sign-in')
  }

  const resetPassword = async (email: string) => {
    console.log('Mock reset password for:', email)
    return { error: null }
  }

  const updatePassword = async (newPassword: string) => {
    console.log('Mock update password')
    return { error: null }
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

