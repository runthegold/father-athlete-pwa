'use client'

import { useState } from 'react'
import { useWorkout } from '@/app/providers'

type Props = { onClose: () => void }

export default function AuthModal({ onClose }: Props) {
  const { signIn, user } = useWorkout()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (user) {
    return (
      <div className="auth-backdrop" onClick={onClose}>
        <div className="auth-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="auth-handle" />
          <div className="auth-check">✓</div>
          <h2 className="auth-title">Ingelogd</h2>
          <p className="auth-sub">Je voortgang wordt bewaard op {user.email}.</p>
          <button className="btn-primary" style={{ width: '100%' }} onClick={onClose}>Sluiten</button>
        </div>
      </div>
    )
  }

  if (sent) {
    return (
      <div className="auth-backdrop" onClick={onClose}>
        <div className="auth-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="auth-handle" />
          <div className="auth-mail-icon">✉</div>
          <h2 className="auth-title">Check je email</h2>
          <p className="auth-sub">We stuurden een link naar <strong>{email}</strong>. Klik erop om in te loggen.</p>
          <button className="btn-ghost" style={{ width: '100%' }} onClick={onClose}>Sluiten</button>
        </div>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    try {
      await signIn(email.trim())
      setSent(true)
    } catch {
      setError('Kon geen link sturen. Probeer opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-backdrop" onClick={onClose}>
      <div className="auth-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="auth-handle" />
        <h2 className="auth-title">Bewaar je voortgang</h2>
        <p className="auth-sub">Je streak en workouts blijven bewaard — op elk apparaat.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            className="auth-input"
            type="email"
            placeholder="je@email.nl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            autoComplete="email"
            inputMode="email"
          />
          {error && <p className="auth-error">{error}</p>}
          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%' }}
            disabled={loading || !email.trim()}
          >
            {loading ? 'Versturen…' : 'Stuur magic link'}
          </button>
        </form>

        <button className="auth-skip" onClick={onClose}>
          Doorgaan zonder account
        </button>
      </div>
    </div>
  )
}
