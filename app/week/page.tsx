'use client'

import { useEffect, useMemo, useState } from 'react'
import { week, todayIndex } from '@/lib/data'
import { loadLog, dateKey } from '@/lib/storage'

export default function WeekPage() {
  const [log, setLog] = useState<string[]>([])
  const [selected, setSelected] = useState(todayIndex())

  useEffect(() => { setLog(loadLog()) }, [])

  const todayIdx = todayIndex()
  const session = week[selected]

  const doneFlags = useMemo(() => {
    const today = new Date()
    return week.map((_, i) => {
      const d = new Date(today)
      const mondayOfWeek = new Date(today)
      mondayOfWeek.setDate(today.getDate() - todayIdx)
      const target = new Date(mondayOfWeek)
      target.setDate(mondayOfWeek.getDate() + i)
      return log.includes(dateKey(target))
    })
  }, [log, todayIdx])

  const totalDone = doneFlags.filter(Boolean).length

  return (
    <main className="shell page-enter">
      <div style={{ padding: '8px 0 20px' }}>
        <p className="eyebrow muted">Deze week</p>
        <h1 className="section-title">Weekschema</h1>
        <p style={{ fontSize: 14 }}>{totalDone} van 7 dagen voltooid</p>
      </div>

      {/* Week strip */}
      <div className="week-grid card" style={{ padding: 14 }}>
        {week.map((s, i) => (
          <button
            key={s.day}
            className={`week-day-btn${i === todayIdx ? ' today' : ''}${doneFlags[i] ? ' done' : ''}`}
            onClick={() => setSelected(i)}
            style={selected === i && i !== todayIdx ? { borderColor: 'var(--border-strong)', background: 'var(--surface-raised)' } : {}}
          >
            <span className="wd-short">{s.shortDay}</span>
            {doneFlags[i] && <span className="wd-check">✓</span>}
            <span className="wd-title">{s.title}</span>
            <span className="wd-time">{s.time} min</span>
          </button>
        ))}
      </div>

      {/* Session detail */}
      <section className="card session-detail" style={{ padding: 'clamp(18px,4vw,32px)' }}>
        <p className="eyebrow">{session.day} · {session.focus}</p>
        <h2>{session.title}</h2>
        <p style={{ marginTop: 8, fontSize: 15 }}>{session.intent}</p>

        <div className="sd-blocks">
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

        <div style={{ marginTop: 20 }}>
          <span style={{
            display: 'inline-block',
            padding: '6px 14px',
            background: 'var(--faint)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-pill)',
            fontSize: 13, fontWeight: 700,
          }}>
            ⏱ {session.time} minuten
          </span>
        </div>
      </section>
    </main>
  )
}
