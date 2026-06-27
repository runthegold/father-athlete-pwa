'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { loadLog, saveLog, markComplete as localMarkComplete, getStreak, dateKey } from '@/lib/storage'
import { fetchRemoteLog, syncCompletion, sendMagicLink, signOut as supabaseSignOut } from '@/lib/auth'
import { week, todayIndex } from '@/lib/data'

export type Readiness = 'full' | 'moderate' | 'light' | null

type WorkoutCtx = {
  user: User | null
  log: string[]
  streak: number
  loading: boolean
  completedToday: boolean
  readiness: Readiness
  setReadiness: (r: Readiness) => void
  markComplete: () => Promise<void>
  signIn: (email: string) => Promise<void>
  signOut: () => Promise<void>
}

const Ctx = createContext<WorkoutCtx | null>(null)

export function useWorkout() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useWorkout must be inside WorkoutProvider')
  return ctx
}

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [log, setLog] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [readiness, setReadiness] = useState<Readiness>(null)

  useEffect(() => {
    setLog(loadLog())
  }, [])

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        const remote = await fetchRemoteLog(u.id)
        const local = loadLog()
        const merged = Array.from(new Set([...local, ...remote])).sort()
        saveLog(merged)
        setLog(merged)
      }
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  const streak = useMemo(() => getStreak(log), [log])
  const completedToday = log.includes(dateKey())

  const markComplete = useCallback(async () => {
    const next = localMarkComplete(log)
    setLog(next)
    if (user && supabase) {
      const session = week[todayIndex()]
      await syncCompletion(user.id, dateKey(), session.day)
    }
  }, [log, user])

  const signIn = useCallback(async (email: string) => {
    await sendMagicLink(email)
  }, [])

  const handleSignOut = useCallback(async () => {
    await supabaseSignOut()
    setUser(null)
  }, [])

  return (
    <Ctx.Provider value={{
      user, log, streak, loading, completedToday,
      readiness, setReadiness,
      markComplete, signIn, signOut: handleSignOut,
    }}>
      {children}
    </Ctx.Provider>
  )
}
