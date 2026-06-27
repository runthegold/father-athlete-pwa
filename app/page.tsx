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

  const streak       = useMemo(() => getStreak(log), [log])
  const weekCount    = useMemo(() => getThisWeekCount(log), [log])
  const totalWorkouts = log.length
  const level        = getLevel(totalWorkouts)
  const completedToday = log.includes(dateKey())

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  const timerProgress = seconds / (session.time * 60)
  const timerAngle    = (1 - timerProgress) * 360

  function handleComplete() {
    setLog(markComplete(log))
    setShowWorkout(false)
  }

  const now     = new Date()
  const dayName = now.toLocaleDateString('nl-NL', { weekday: 'long' })
  const dateStr = now.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' })

  return (
    <main className="shell page-enter">
      {showWorkout && (
        <WorkoutMode session={session} onComplete={handleComplete} onClose={() => setShowWorkout(false)} />
      )}

      {/* ── Hero ── */}
      <section className="today-hero glass-card glass-card-tinted">
        <div className="hero-glow" />
        <div className="hero-text">
          <p className="eyebrow">{dayName} · {dateStr}</p>
          <h1 className="hero-title">Blijf 365 dagen<br />per jaar capabel.</h1>
          <p className="hero-lead">{session.intent}</p>

          <div className="btn-row mt-md">
            <button className="btn-primary" onClick={() => setShowWorkout(true)}>
              {completedToday ? 'Opnieuw trainen' : '▶ Start workout'}
            </button>
            {!completedToday && (
              <button className="btn-ghost" onClick={handleComplete}>Markeer voltooid</button>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 16, flexWrap: 'wrap' }}>
            <span className={`level-badge ${level}`}>
              {level === 'Beast' ? '🔥' : level === 'Strong' ? '⚡' : '🌱'} {LEVEL_LABELS[level]}
            </span>
            {completedToday && <span className="level-badge Beast">✓ Vandaag done</span>}
          </div>
        </div>

        <div className="streak-orb">
          <span className="num">{streak}</span>
          <span className="lbl">streak</span>
        </div>
      </section>

      {/* ── Stats row ── */}
      <div className="stats-row">
        {[
          { label: 'Vandaag',     value: `${session.time} min`, sub: session.title },
          { label: 'Deze week',   value: `${weekCount}/7`,       sub: 'sessies' },
          { label: 'Totaal',      value: String(totalWorkouts),  sub: 'workouts' },
        ].map((s) => (
          <div key={s.label} className="stat-card glass-card">
            <span className="sc-label">{s.label}</span>
            <span className="sc-value">{s.value}</span>
            <span className="sc-sub">{s.sub}</span>
          </div>
        ))}
      </div>

      {/* ── Workout card ── */}
      <section className="workout-card glass-card">
        <div className="wc-header">
          <div className="wc-meta">
            <p className="eyebrow">Workout van de dag</p>
            <h2 style={{ fontSize: 'clamp(20px,4vw,30px)', fontWeight: 800, letterSpacing: '-.05em', margin: '6px 0 6px' }}>
              {session.day} · {session.title}
            </h2>
            <p style={{ fontSize: 14 }}>{session.focus}</p>
          </div>

          <div
            className="wc-timer"
            style={{
              background: `conic-gradient(${timerAngle < 10 ? 'rgba(212,252,90,.3)' : 'var(--lime)'} ${timerAngle}deg, rgba(255,255,255,.06) 0deg)`,
            }}
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
              <ul>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="mission-section glass-card glass-card-tinted">
        <p className="eyebrow">Regel van het systeem</p>
        <h2>Niet perfect trainen.<br />Nooit verdwijnen.</h2>
        <p style={{ fontSize: 16, maxWidth: 640 }}>
          Op zware dagen telt 12 minuten mobility. Op goede dagen mag je uitbreiden.
          De streak beloont aanwezigheid, niet ego.
        </p>
      </section>
    </main>
  )
}
