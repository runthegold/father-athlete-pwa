'use client'

import { useEffect, useMemo, useState } from 'react'
import { week, todayIndex } from '@/lib/data'
import { loadLog, dateKey } from '@/lib/storage'

export default function WeekPage() {
  const [log, setLog] = useState<string[]>([])
  const [selected, setSelected] = useState(todayIndex())

  useEffect(() => { setLog(loadLog()) }, [])

  const todayIdx = todayIndex()
  const session  = week[selected]

  const doneFlags = useMemo(() => {
    const today = new Date()
    const mondayOfWeek = new Date(today)
    mondayOfWeek.setDate(today.getDate() - todayIdx)
    return week.map((_, i) => {
      const target = new Date(mondayOfWeek)
      target.setDate(mondayOfWeek.getDate() + i)
      return log.includes(dateKey(target))
    })
  }, [log, todayIdx])

  const totalDone = doneFlags.filter(Boolean).length

  return (
    <main className="shell page-enter">
      <div className="page-header">
        <p className="eyebrow muted">Deze week</p>
        <h1 className="section-title">Weekschema</h1>
        <p style={{ fontSize: 14 }}>{totalDone} van 7 dagen voltooid</p>
      </div>

      {/* Day strip */}
      <div className="glass-card" style={{ marginBottom: 12 }}>
        <div className="week-grid">
          {week.map((s, i) => (
            <button
              key={s.day}
              className={[
                'week-day-btn',
                i === todayIdx ? 'today' : '',
                doneFlags[i]   ? 'done' : '',
                selected === i  ? 'selected' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => setSelected(i)}
            >
              <span className="wd-short">{s.shortDay}</span>
              {doneFlags[i] && <span className="wd-check">✓</span>}
              <span className="wd-title">{s.title}</span>
              <span className="wd-time">{s.time} min</span>
            </button>
          ))}
        </div>
      </div>

      {/* Session detail */}
      <section className="session-panel glass-card">
        <p className="eyebrow">{session.day} · {session.focus}</p>
        <h2 style={{ fontSize: 'clamp(24px,5vw,38px)', fontWeight: 800, letterSpacing: '-.05em', margin: '8px 0 8px' }}>
          {session.title}
        </h2>
        <p style={{ fontSize: 15 }}>{session.intent}</p>

        <div className="sd-blocks">
          {session.blocks.map((block) => (
            <div className="wc-block" key={block.label}>
              <span className="bl-label">{block.label}</span>
              <strong className="bl-work">{block.work}</strong>
              <ul>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20 }}>
          <span style={{
            display: 'inline-block',
            padding: '6px 14px',
            background: 'rgba(255,255,255,.07)',
            border: '1px solid rgba(255,255,255,.12)',
            borderRadius: 999,
            fontSize: 13, fontWeight: 600,
            color: 'var(--text-secondary)',
          }}>
            ⏱ {session.time} minuten
          </span>
        </div>
      </section>
    </main>
  )
}
