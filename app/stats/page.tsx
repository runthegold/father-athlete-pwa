'use client'

import { useEffect, useMemo, useState } from 'react'
import { getLevel, LEVEL_LABELS, LEVEL_THRESHOLDS } from '@/lib/data'
import {
  loadLog, getStreak, getLongestStreak,
  getThisWeekCount, getThisMonthCount,
} from '@/lib/storage'
import Heatmap from '@/components/Heatmap'

export default function StatsPage() {
  const [log, setLog] = useState<string[]>([])
  useEffect(() => { setLog(loadLog()) }, [])

  const streak = useMemo(() => getStreak(log), [log])
  const longest = useMemo(() => getLongestStreak(log), [log])
  const weekCount = useMemo(() => getThisWeekCount(log), [log])
  const monthCount = useMemo(() => getThisMonthCount(log), [log])
  const total = log.length
  const level = getLevel(total)

  const nextLevel = level === 'Base' ? 'Strong' : level === 'Strong' ? 'Beast' : null
  const nextThreshold = nextLevel ? LEVEL_THRESHOLDS[nextLevel] : null
  const currentThreshold = LEVEL_THRESHOLDS[level]
  const levelProgress = nextThreshold
    ? Math.min(1, (total - currentThreshold) / (nextThreshold - currentThreshold))
    : 1

  return (
    <main className="shell page-enter">
      <div style={{ padding: '8px 0 20px' }}>
        <p className="eyebrow muted">Voortgang</p>
        <h1 className="section-title">Stats</h1>
      </div>

      {/* Big streak + longest */}
      <div className="stats-big-row">
        <div className="stats-big-card" style={{
          background: 'linear-gradient(135deg, rgba(212,252,90,.12), rgba(255,255,255,.04))',
          borderColor: 'rgba(212,252,90,.25)',
        }}>
          <p className="sbc-label">Huidige streak</p>
          <div className="sbc-num" style={{ color: 'var(--lime)' }}>{streak}</div>
          <p className="sbc-sub">{streak === 1 ? 'dag' : 'dagen'} op rij</p>
        </div>
        <div className="stats-big-card">
          <p className="sbc-label">Langste streak</p>
          <div className="sbc-num">{longest}</div>
          <p className="sbc-sub">persoonlijk record</p>
        </div>
      </div>

      {/* Mini stats */}
      <div className="mini-stats-row" style={{ marginBottom: 12 }}>
        {[
          { label: 'Totaal', value: total, sub: 'workouts' },
          { label: 'Deze maand', value: monthCount, sub: 'sessies' },
          { label: 'Deze week', value: weekCount, sub: 'van 7' },
        ].map((s) => (
          <div key={s.label} className="stats-big-card">
            <p className="sbc-label">{s.label}</p>
            <div className="sbc-num" style={{ fontSize: 44 }}>{s.value}</div>
            <p className="sbc-sub">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Level progress */}
      <section className="card level-progress" style={{ marginBottom: 12 }}>
        <div className="lp-header">
          <div>
            <p className="eyebrow">Level</p>
            <h2 style={{ fontSize: 'clamp(22px, 4vw, 32px)' }}>
              {level === 'Beast' ? '🔥' : level === 'Strong' ? '⚡' : '🌱'} {LEVEL_LABELS[level]}
            </h2>
          </div>
          {nextLevel && (
            <p style={{ fontSize: 13, textAlign: 'right' }}>
              Nog <strong style={{ color: 'var(--text)' }}>{nextThreshold! - total}</strong><br />
              workouts naar {nextLevel}
            </p>
          )}
        </div>
        <div className="lp-bar-wrap">
          <div className="lp-bar-fill" style={{ width: `${levelProgress * 100}%` }} />
        </div>
        <div className="lp-labels">
          {(['Base', 'Strong', 'Beast'] as const).map((l) => (
            <span key={l} className={level === l ? 'active' : ''}>{l}</span>
          ))}
        </div>
      </section>

      {/* Heatmap */}
      <section className="card heatmap-section">
        <p className="eyebrow">Activiteit</p>
        <h2 style={{ fontSize: 'clamp(18px, 3vw, 26px)', marginBottom: 20 }}>
          Afgelopen 13 weken
        </h2>
        <Heatmap log={log} />
        <p style={{ fontSize: 12, marginTop: 12, color: 'var(--muted)' }}>
          Elke groene cel = 1 voltooide workout
        </p>
      </section>
    </main>
  )
}
