import { supabase } from './supabase'

export async function fetchRemoteLog(userId: string): Promise<string[]> {
  if (!supabase) return []
  const { data } = await supabase
    .from('workout_completions')
    .select('workout_date')
    .eq('user_id', userId)
  return data?.map((r: { workout_date: string }) => r.workout_date) ?? []
}

export async function syncCompletion(userId: string, date: string, sessionKey: string): Promise<void> {
  if (!supabase) return
  await supabase
    .from('workout_completions')
    .upsert(
      { user_id: userId, workout_date: date, session_key: sessionKey, duration_minutes: 20 },
      { onConflict: 'user_id,workout_date' }
    )
}

export async function signInWithGoogle(): Promise<void> {
  if (!supabase) throw new Error('Supabase niet geconfigureerd')
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo:
        typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
    },
  })
  if (error) throw error
}

export async function sendMagicLink(email: string): Promise<void> {
  if (!supabase) throw new Error('Supabase niet geconfigureerd')
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo:
        typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
    },
  })
  if (error) throw error
}

export async function signOut(): Promise<void> {
  if (!supabase) return
  await supabase.auth.signOut()
}
