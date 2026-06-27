'use client'

import { useEffect, useMemo, useState } from 'react'
import { getLevel, LEVEL_LABELS, LEVEL_THRESHOLDS } from '@/lib/data'
import { loadLog, getStreak, getLongestStreak, getThisWeekCount, getThisMonthCount } from '@/lib/storage'
import Heatmap from '@/components/Heatmap'

export default function StatsPage() {
  const [log, setLog] = useState<string[]>([])
  useEffect(() => { setLog(loadLog()) }, [])

  const streak     = useMemo(() => getStreak(log), [log])
  const longest    = useMemo(() => getLongestStreak(log), [log])
  const weekCount  = useMemo(() => getThisWeekCount(log), [log])
  const monthCount = useMemo(() => getThisMonthCount(log), [log])
  const total      = log.length
  const level      = getLevel(total)

  const nextLevel     = level === 'Base' ? 'Strong' : level === 'Strong' ? 'Beast' : null
  const nextThreshold = nextLevel ? LEVEL_THRESHOLDS[nextLevel] : null
  const curThreshold  = LEVEL_THRESHOLDS[level]
  const lvlProgress   = nextThreshold
    ? Math.min(1, (total - curThreshold) / (nextThreshold - curThreshold))
    : 1

  return (
    <main className="shell page-enter">
      <div className="page-header">
        <p className="eyebrow muted">Voortgang</p>
        <h1 className="section-title">Stats</h1>
      </div>

      {/* Big streak cards */}
      <div className="stats-big-row">
        <div className="sbc glass-card sbc-lime">
          <p className="sbc-label">Huidige streak</p>
          <div className="sbc-num">{streak}</div>
          <p className="sbc-sub">{streak === 1 ? 'dag' : 'dagen'} op rij</p>
        </div>
        <div className="sbc glass-card">
          <p className="sbc-label">Langste streak</p>
          <div className="sbc-num">{longest}</div>
          <p className="sbc-sub">persoonlijk record</p>
        </div>
      </div>

      {/* Mini stats */}
      <div className="mini-stats-row">
        {[
          { label: 'Totaal',      value: total,      sub: 'workouts' },
          { label: 'Maand',       value: monthCount, sub: 'sessies' },
          { label: 'Week',        value: weekCount,  sub: 'van 7' },
        ].map((s) => (
          <div key={s.label} className="sbc glass-card" style={{ padding: '18px 20px' }}>
            <p className="sbc-label">{s.label}</p>
            <div className="sbc-num" style={{ fontSize: 42 }}>{s.value}</div>
            <p className="sbc-sub">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Level progress */}
      <section className="level-progress-card glass-card">
        <div className="lp-header">
          <div>
            <p className="eyebrow">Level</p>
            <h2 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 800, letterSpacing: '-.05em', marginTop: 6 }}>
              {level === 'Beast' ? '🔥' : level === 'Strong' ? '⚡' : '🌱'} {LEVEL_LABELS[level]}
            </h2>
          </div>
          {nextLevel && (
            <p style={{ fontSize: 13, textAlign: 'right', color: 'var(--text-secondary)' }}>
              Nog <strong style={{ color: 'var(--text)' }}>{nextThreshold! - total}</strong>
              <br />naar {nextLevel}
            </p>
          )}
        </div>
        <div className="lp-bar-track">
          <div className="lp-bar-fill" style={{ width: `${lvlProgress * 100}%` }} />
        </div>
        <div className="lp-labels">
          {(['Base', 'Strong', 'Beast'] as const).map((l) => (
            <span key={l} className={level === l ? 'active' : ''}>{l}</span>
          ))}
        </div>
      </section>

      {/* Heatmap */}
      <section className="heatmap-section glass-card">
        <p className="eyebrow">Activiteit</p>
        <h2 style={{ fontSize: 'clamp(18px,3vw,24px)', fontWeight: 800, letterSpacing: '-.04em', margin: '8px 0 20px' }}>
          Afgelopen 13 weken
        </h2>
        <Heatmap log={log} />
        <p style={{ fontSize: 12, marginTop: 14, color: 'var(--text-tertiary)' }}>
          Elke groene cel = 1 voltooide workout
        </p>
      </section>
    </main>
  )
}
