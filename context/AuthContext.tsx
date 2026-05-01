'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/services/auth.service'

interface AuthContextType {
  user: any | null
  session: any | null
  loading: boolean
  signUp: (firstName: string, lastName: string, email: string, password: string) => Promise<{ error: any | null }>
  signIn: (email: string, password: string) => Promise<{ error: any | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any | null }>
  updatePassword: (token: string, newPassword: string) => Promise<{ error: any | null }>
  verifyOtp: (email: string, otp: string) => Promise<{ error: any | null }>
  resendOtp: (email: string) => Promise<{ error: any | null }>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [session, setSession] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initAuth = async () => {
      const { session: activeSession, error } = await authService.getSession()
      
      if (!error && activeSession) {
        setUser(activeSession.user)
        setSession(activeSession)
        if (process.env.NODE_ENV === 'development') {
          console.log('[AuthContext] Session verified successfully for:', activeSession.user.email);
        }
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[AuthContext] No valid session found');
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const signUp = async (firstName: string, lastName: string, email: string, password: string) => {
    const { user: newUser, error } = await authService.signUp({ firstName, lastName, email, password })
    
    if (!error && newUser) {
      setUser(newUser)
      // Since token was set in localStorage by service, we can fetch session
      const { session: newSession } = await authService.getSession()
      setSession(newSession)
      return { error: null }
    }
    
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { user: signedInUser, session: newSession, error } = await authService.signIn({ email, password })
    
    if (!error && signedInUser) {
      setUser(signedInUser)
      setSession(newSession)
      return { error: null }
    }
    
    return { error }
  }

  const signOut = async () => {
    await authService.signOut()
    setUser(null)
    setSession(null)
    router.push('/')
  }

  const resetPassword = async (email: string) => {
    const { error } = await authService.resetPassword(email)
    return { error }
  }

  const updatePassword = async (token: string, newPassword: string) => {
    const { error } = await authService.updatePassword(token, newPassword)
    return { error }
  }

  const verifyOtp = async (email: string, otp: string) => {
    const { user: verifiedUser, error } = await authService.verifyOtp(email, otp)
    if (!error && verifiedUser) {
      setUser(verifiedUser)
      const { session: newSession } = await authService.getSession()
      setSession(newSession)
      return { error: null }
    }
    return { error }
  }

  const resendOtp = async (email: string) => {
    const { error } = await authService.resendOtp(email)
    return { error }
  }

  const refreshUser = async () => {
    const { user: updatedUser, error } = await authService.getCurrentUser()
    if (!error && updatedUser) {
      setUser(updatedUser)
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
    verifyOtp,
    resendOtp,
    refreshUser,
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

