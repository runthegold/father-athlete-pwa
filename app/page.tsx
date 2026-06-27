'use client'

import { useState } from 'react'
import { week, todayIndex } from '@/lib/data'
import type { Session } from '@/lib/data'
import { useWorkout, type Readiness } from './providers'
import TodayRing from '@/components/TodayRing'
import DayRings from '@/components/DayRings'
import ReadinessCheck from '@/components/ReadinessCheck'
import CompletionScreen from '@/components/CompletionScreen'
import WorkoutMode from '@/components/WorkoutMode'
import AuthModal from '@/components/AuthModal'

function scaleSession(session: Session, readiness: Readiness): Session {
  if (readiness === 'moderate') {
    return { ...session, blocks: session.blocks.slice(0, 2), time: Math.ceil(session.time * 0.65) }
  }
  if (readiness === 'light') {
    return { ...session, blocks: session.blocks.slice(0, 1), time: 10 }
  }
  return session
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 6)  return 'Nachtdienst?'
  if (h < 12) return 'Goedemorgen'
  if (h < 18) return 'Goedemiddag'
  return 'Goedenavond'
}

function getStreakLabel(streak: number): string {
  if (streak === 0) return 'Start je streak vandaag'
  if (streak === 1) return 'Dag één — houd vast'
  if (streak < 7)   return `${streak} dagen op rij`
  if (streak < 14)  return `${streak} dagen — week 1 voltooid`
  if (streak < 21)  return `${streak} dagen — week 2`
  if (streak < 30)  return `${streak} dagen — week 3`
  return `${streak} dagen — je bent een atleet`
}

export default function TodayPage() {
  const { log, streak, completedToday, markComplete, readiness, setReadiness } = useWorkout()

  const [showReadiness, setShowReadiness] = useState(false)
  const [showWorkout, setShowWorkout] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [showAuth, setShowAuth] = useState(false)

  const todayIdx = todayIndex()
  const session = week[todayIdx]

  const now = new Date()
  const dateStr = now.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })

  function handleStartTap() {
    if (!readiness) {
      setShowReadiness(true)
    } else {
      setShowWorkout(true)
    }
  }

  function handleReadinessSelect(r: Readiness) {
    setReadiness(r)
    setShowReadiness(false)
    setShowWorkout(true)
  }

  async function handleWorkoutComplete() {
    setShowWorkout(false)
    await markComplete()
    setShowCompletion(true)
  }

  function handleCompletionDone() {
    setShowCompletion(false)
  }

  async function handleMarkDone() {
    await markComplete()
    setShowCompletion(true)
  }

  return (
    <>
      {showWorkout && (
        <WorkoutMode
          session={scaleSession(session, readiness)}
          onComplete={handleWorkoutComplete}
          onClose={() => setShowWorkout(false)}
        />
      )}

      {showReadiness && (
        <ReadinessCheck
          sessionTime={session.time}
          onSelect={handleReadinessSelect}
          onClose={() => setShowReadiness(false)}
        />
      )}

      {showCompletion && (
        <CompletionScreen
          streak={streak}
          log={log}
          onDone={handleCompletionDone}
        />
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      <main className="today-page page-enter">
        {/* Header */}
        <header className="today-header">
          <p className="today-date">{dateStr}</p>
          <p className="today-greeting">{getGreeting()}</p>
        </header>

        {/* Hero ring */}
        <section className="today-ring-section">
          <TodayRing session={session} complete={completedToday} />
        </section>

        {/* CTA */}
        <div className="today-cta">
          {completedToday ? (
            <button
              className="btn-primary today-start-btn"
              onClick={() => {
                setReadiness(null)
                handleStartTap()
              }}
            >
              Opnieuw trainen
            </button>
          ) : (
            <button className="btn-primary today-start-btn" onClick={handleStartTap}>
              Start workout
            </button>
          )}

          {!completedToday && (
            <button className="today-mark-btn" onClick={handleMarkDone}>
              Markeer als voltooid
            </button>
          )}
        </div>

        {/* Week rings */}
        <div className="today-week-section">
          <DayRings log={log} />
          <p className="today-streak-label">{getStreakLabel(streak)}</p>
        </div>

        {/* Auth nudge */}
        <div className="today-auth-nudge">
          <button className="auth-nudge-btn" onClick={() => setShowAuth(true)}>
            🔒 Sync voortgang
          </button>
        </div>
      </main>
    </>
  )
}
