import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { getSupabase, isSupabaseConfigured } from './supabase'
import { normaliseAuMobile } from './phone'
import { queryClient } from './queryClient'
import { MAJALIS_QUERY_KEY } from '../hooks/useMajalis'
import { analytics } from './analytics'

interface AuthContextValue {
  /** Whether auth is available at all (Supabase env vars present). */
  enabled: boolean
  /** True while the persisted session is being restored on first load. */
  loading: boolean
  session: Session | null
  user: User | null
  /** E.164 phone of the signed-in user, e.g. +61412345678. */
  phone: string | null
  /** Sends an OTP SMS. Input must be an Australian mobile. */
  requestOtp: (rawPhone: string) => Promise<void>
  /** Verifies the 6-digit code and signs the user in. */
  verifyOtp: (rawPhone: string, token: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    const supabase = getSupabase()

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, nextSession) => {
        setSession(nextSession)
        // Signed-in users can read the contact/address columns, anonymous
        // users cannot — refetch so the list matches the new access level.
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          queryClient.invalidateQueries({ queryKey: MAJALIS_QUERY_KEY })
        }
      }
    )

    return () => subscription.subscription.unsubscribe()
  }, [])

  const value = useMemo<AuthContextValue>(() => {
    const user = session?.user ?? null
    return {
      enabled: isSupabaseConfigured,
      loading,
      session,
      user,
      phone: user?.phone ? normaliseAuMobile(user.phone) : null,

      async requestOtp(rawPhone: string) {
        const phone = normaliseAuMobile(rawPhone)
        if (!phone) {
          throw new Error('Please enter a valid Australian mobile number (04xx xxx xxx).')
        }
        const { error } = await getSupabase().auth.signInWithOtp({ phone })
        if (error) throw new Error(error.message)
        analytics.otpRequested()
      },

      async verifyOtp(rawPhone: string, token: string) {
        const phone = normaliseAuMobile(rawPhone)
        if (!phone) {
          throw new Error('Please enter a valid Australian mobile number (04xx xxx xxx).')
        }
        const { error } = await getSupabase().auth.verifyOtp({
          phone,
          token: token.trim(),
          type: 'sms',
        })
        if (error) throw new Error(error.message)
        analytics.signInSuccess()
      },

      async signOut() {
        const { error } = await getSupabase().auth.signOut()
        if (error) throw new Error(error.message)
        analytics.signOut()
      },
    }
  }, [session, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
