'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    if (!supabase) {
      router.replace('/')
      return
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.replace('/')
      }
    })
    const fallback = setTimeout(() => router.replace('/'), 5000)
    return () => {
      subscription.unsubscribe()
      clearTimeout(fallback)
    }
  }, [router])

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 20, background: '#000',
    }}>
      <div className="auth-spinner" />
      <p style={{ color: 'var(--t3)', fontSize: 15, letterSpacing: '-.01em' }}>Inloggen…</p>
    </div>
  )
}
