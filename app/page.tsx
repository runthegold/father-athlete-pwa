'use client'

import { useEffect, useMemo, useState } from 'react'
import { week, todayIndex, getLevel, LEVEL_LABELS } from '@/lib/data'
import { loadLog, markComplete, getStreak, getThisWeekCount, dateKey } from '@/lib/storage'
import WorkoutMode from '@/components/WorkoutMode'

export default function TodayPage() {
  const [log, setLog] = useState<string[]>([])
  const [showWorkout, setShowWorkout] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)

  const todayIdx = todayIndex()
  const session = week[todayIdx]

  useEffect(() => { setLog(loadLog()) }, [])
  useEffect(() => { setSeconds(session.time * 60) }, [session.time])

  useEffect(() => {
    if (!timerRunning) return
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [timerRunning])

  const streak = useMemo(() => getStreak(log), [log])
  const weekCount = useMemo(() => getThisWeekCount(log), [log])
  const totalWorkouts = log.length
  const level = getLevel(totalWorkouts)
  const completedToday = log.includes(dateKey())

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  const timerProgress = seconds / (session.time * 60)
  const timerAngle = (1 - timerProgress) * 360

  function handleComplete() {
    const next = markComplete(log)
    setLog(next)
    setShowWorkout(false)
  }

  const now = new Date()
  const dayName = now.toLocaleDateString('nl-NL', { weekday: 'long' })
  const dateStr = now.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' })

  return (
    <main className="shell page-enter">
      {showWorkout && (
        <WorkoutMode
          session={session}
          onComplete={handleComplete}
          onClose={() => setShowWorkout(false)}
        />
      )}

      {/* Hero */}
      <section className="today-hero card" style={{ marginBottom: 10 }}>
        <div className="hero-text">
          <p className="eyebrow">{dayName} · {dateStr}</p>
          <h1>Blijf 365 dagen per jaar fysiek capabel.</h1>
          <p className="lead">{session.intent}</p>
          <div className="btn-row mt-lg">
            <button className="btn-primary" onClick={() => setShowWorkout(true)}>
              {completedToday ? '🔥 Opnieuw trainen' : '▶ Start workout'}
            </button>
            {!completedToday && (
              <button className="btn-ghost" onClick={handleComplete}>
                Markeer voltooid
              </button>
            )}
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className={`level-badge ${level}`}>
              {level === 'Beast' ? '🔥' : level === 'Strong' ? '⚡' : '🌱'} {LEVEL_LABELS[level]}
            </span>
            {completedToday && (
              <span className="level-badge Beast">✓ Vandaag done</span>
            )}
          </div>
        </div>
        <div className="streak-orb">
          <span className="num">{streak}</span>
          <span className="lbl">streak</span>
        </div>
      </section>

      {/* Quick stats */}
      <div className="stats-row">
        <div className="stat-card card">
          <small>Vandaag</small>
          <strong>{session.time} min</strong>
          <span>{session.title}</span>
        </div>
        <div className="stat-card card">
          <small>Deze week</small>
          <strong>{weekCount}/7</strong>
          <span>sessies</span>
        </div>
        <div className="stat-card card">
          <small>Totaal</small>
          <strong>{totalWorkouts}</strong>
          <span>workouts</span>
        </div>
      </div>

      {/* Workout card */}
      <section className="workout-card card">
        <div className="wc-header">
          <div className="wc-meta">
            <p className="eyebrow">Workout van de dag</p>
            <h2 style={{ fontSize: 'clamp(22px, 4vw, 34px)', marginBottom: 6 }}>
              {session.day} · {session.title}
            </h2>
            <p style={{ fontSize: 14 }}>{session.focus}</p>
          </div>
          <div
            className="wc-timer"
            style={{ ['--timer-angle' as string]: `${timerAngle}deg` }}
          >
            <div className="wc-timer-inner">
              <strong>{mm}:{ss}</strong>
              <small>timer</small>
            </div>
          </div>
        </div>

        <div className="btn-row mt-md">
          <button className="btn-primary" onClick={() => setTimerRunning((v) => !v)}>
            {timerRunning ? '⏸ Pauze' : '▶ Timer'}
          </button>
          <button className="btn-ghost" onClick={() => { setSeconds(session.time * 60); setTimerRunning(false) }}>
            Reset
          </button>
        </div>

        <div className="wc-blocks">
          {session.blocks.map((block) => (
            <div className="wc-block" key={block.label}>
              <span className="bl-label">{block.label}</span>
              <strong className="bl-work">{block.work}</strong>
              <ul>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="card" style={{
        padding: 'clamp(18px,4vw,32px)', marginTop: 10,
        background: 'linear-gradient(135deg, rgba(212,252,90,.10), rgba(255,255,255,.04))',
      }}>
        <p className="eyebrow">Regel van het systeem</p>
        <h2 style={{ fontSize: 'clamp(22px, 4vw, 38px)', maxWidth: 720, margin: '6px 0 10px' }}>
          Niet perfect trainen. Nooit verdwijnen.
        </h2>
        <p style={{ maxWidth: 680, fontSize: 16 }}>
          Op zware dagen telt 12 minuten mobility. Op goede dagen mag je uitbreiden.
          De streak beloont aanwezigheid, niet ego.
        </p>
      </section>
    </main>
  )
}
