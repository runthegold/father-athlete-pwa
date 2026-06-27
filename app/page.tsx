'use client'

import { useEffect, useMemo, useState } from 'react'
import { week, todayIndex, getLevel, LEVEL_LABELS } from '@/lib/data'
import { loadLog, markComplete, getStreak, getThisWeekCount, dateKey } from '@/lib/storage'
import WorkoutMode from '@/components/WorkoutMode'

// Streak ring: thin SVG ring like Apple Fitness / Whoop
function StreakRing({ streak, maxStreak = 30 }: { streak: number; maxStreak?: number }) {
  const r = 64
  const c = 2 * Math.PI * r
  const progress = Math.min(1, streak / maxStreak)
  const offset   = c * (1 - progress)
  const active   = streak > 0

  return (
    <div className={`streak-counter${active ? ' active' : ''}`}>
      <svg className="streak-ring-svg" viewBox="0 0 144 144">
        <circle cx="72" cy="72" r={r} className="streak-ring-track" />
        {active && (
          <circle
            cx="72" cy="72" r={r}
            className="streak-ring-fill"
            style={{ strokeDasharray: c, strokeDashoffset: offset }}
          />
        )}
      </svg>
      <div className="streak-inner">
        <span className="streak-num">{streak}</span>
        <span className="streak-lbl">streak</span>
      </div>
    </div>
  )
}

// Workout timer as Apple Fitness-style ring
function TimerRing({
  seconds, totalSeconds, running,
}: { seconds: number; totalSeconds: number; running: boolean }) {
  const r = 46
  const c = 2 * Math.PI * r
  const progress = totalSeconds > 0 ? seconds / totalSeconds : 0
  const offset   = c * progress          // offset decreases as time runs
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  const color = running ? 'var(--lime)' : 'var(--t3)'

  return (
    <div className="wc-timer-wrap">
      <svg className="wc-timer-svg" viewBox="0 0 108 108">
        <circle cx="54" cy="54" r={r} className="wc-ring-track" />
        <circle
          cx="54" cy="54" r={r}
          className="wc-ring-fill"
          style={{
            stroke: color,
            strokeDasharray: c,
            strokeDashoffset: c - offset,
            filter: running ? `drop-shadow(0 0 6px rgba(200,241,53,.45))` : 'none',
          }}
        />
      </svg>
      <div className="wc-timer-inner">
        <strong style={{ color: running ? 'var(--t1)' : 'var(--t2)' }}>{mm}:{ss}</strong>
        <small>{running ? 'loopt' : 'timer'}</small>
      </div>
    </div>
  )
}

export default function TodayPage() {
  const [log, setLog] = useState<string[]>([])
  const [showWorkout, setShowWorkout] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)

  const todayIdx = todayIndex()
  const session  = week[todayIdx]

  useEffect(() => { setLog(loadLog()) }, [])
  useEffect(() => { setSeconds(session.time * 60) }, [session.time])

  useEffect(() => {
    if (!timerRunning) return
    const id = setInterval(() => setSeconds((s) => { if (s <= 1) { setTimerRunning(false); return 0 } return s - 1 }), 1000)
    return () => clearInterval(id)
  }, [timerRunning])

  const streak         = useMemo(() => getStreak(log), [log])
  const weekCount      = useMemo(() => getThisWeekCount(log), [log])
  const totalWorkouts  = log.length
  const level          = getLevel(totalWorkouts)
  const completedToday = log.includes(dateKey())

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
      <section className="today-hero card" style={{ marginBottom: 12 }}>
        <div className="hero-text">
          <p className="eyebrow">{dayName} · {dateStr}</p>
          <h1 className="hero-title">Blijf 365 dagen<br />per jaar capabel.</h1>
          <p className="hero-lead">{session.intent}</p>

          <div className="btn-row" style={{ marginTop: 24 }}>
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
            {completedToday && <span className="level-badge done">✓ Vandaag done</span>}
          </div>
        </div>

        <StreakRing streak={streak} maxStreak={Math.max(30, streak)} />
      </section>

      {/* ── Stats row ── */}
      <div className="stats-row">
        {[
          { label: 'Vandaag',   value: `${session.time} min`, sub: session.title },
          { label: 'Week',      value: `${weekCount}/7`,       sub: 'sessies' },
          { label: 'Totaal',    value: String(totalWorkouts),  sub: 'workouts' },
        ].map((s) => (
          <div key={s.label} className="stat-card card">
            <span className="sc-label">{s.label}</span>
            <span className="sc-value">{s.value}</span>
            <span className="sc-sub">{s.sub}</span>
          </div>
        ))}
      </div>

      {/* ── Workout card ── */}
      <section className="workout-card card" style={{ marginBottom: 12 }}>
        <div className="wc-header">
          <div className="wc-meta">
            <p className="eyebrow">{session.day}</p>
            <h2 style={{ fontSize: 'clamp(20px,4vw,28px)', fontWeight: 800, letterSpacing: '-.05em', margin: '6px 0 6px' }}>
              {session.title}
            </h2>
            <p style={{ fontSize: 14 }}>{session.focus}</p>
          </div>
          <TimerRing seconds={seconds} totalSeconds={session.time * 60} running={timerRunning} />
        </div>

        <div className="btn-row" style={{ marginTop: 20 }}>
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
      <section className="mission-section card" style={{ marginBottom: 12 }}>
        <p className="eyebrow">Regel van het systeem</p>
        <h2>Niet perfect trainen.<br />Nooit verdwijnen.</h2>
        <p style={{ fontSize: 16, maxWidth: 620, marginTop: 10 }}>
          Op zware dagen telt 12 minuten mobility. Op goede dagen mag je uitbreiden.
          De streak beloont aanwezigheid, niet ego.
        </p>
      </section>
    </main>
  )
}
