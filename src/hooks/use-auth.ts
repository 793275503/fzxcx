import { useState, useEffect } from 'react'
import type { Session } from '@supabase/supabase-js'
import { getSession, onAuthStateChange, signIn, signOut } from '@/services/auth'

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSession().then((s) => {
      setSession(s)
      setLoading(false)
    })

    const { data } = onAuthStateChange((s) => {
      setSession(s)
      setLoading(false)
    })

    return () => {
      data.subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    const result = await signIn(email, password)
    setSession(result.session)
    return result
  }

  const logout = async () => {
    await signOut()
    setSession(null)
  }

  return {
    session,
    user: session?.user ?? null,
    isAuthenticated: !!session,
    loading,
    login,
    logout,
  }
}
