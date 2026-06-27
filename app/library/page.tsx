'use client'

import { useState } from 'react'
import { exercises, Group, Level, GROUP_COLORS } from '@/lib/data'
import ExerciseModal from '@/components/ExerciseModal'
import type { Exercise } from '@/lib/data'

const GROUPS: ('All' | Group)[] = ['All', 'Push', 'Pull', 'Legs', 'Core', 'Mobility', 'Conditioning']
const LEVELS: ('All' | Level)[] = ['All', 'Base', 'Strong', 'Beast']

const LEVEL_CHIP_STYLE: Record<Level, React.CSSProperties> = {
  Beast:  { background: 'rgba(212,252,90,.16)', borderColor: 'rgba(212,252,90,.4)', color: 'var(--lime)' },
  Strong: { background: 'rgba(10,132,255,.15)', borderColor: 'rgba(10,132,255,.4)', color: '#4da6ff' },
  Base:   { background: 'rgba(255,255,255,.08)', borderColor: 'rgba(255,255,255,.14)', color: 'var(--text-secondary)' },
}

export default function LibraryPage() {
  const [activeGroup, setActiveGroup] = useState<'All' | Group>('All')
  const [activeLevel, setActiveLevel] = useState<'All' | Level>('All')
  const [selected, setSelected] = useState<Exercise | null>(null)

  const filtered = exercises.filter((ex) => {
    if (activeGroup !== 'All' && ex.group !== activeGroup) return false
    if (activeLevel !== 'All' && ex.level !== activeLevel) return false
    return true
  })

  return (
    <main className="shell page-enter">
      <div className="page-header">
        <p className="eyebrow muted">Bewegingen</p>
        <h1 className="section-title">Oefenbibliotheek</h1>
      </div>

      <div className="filter-row">
        {GROUPS.map((g) => (
          <button
            key={g}
            className={`filter-chip${activeGroup === g ? ' active' : ''}`}
            onClick={() => setActiveGroup(g)}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="filter-row" style={{ paddingTop: 0 }}>
        {LEVELS.map((l) => (
          <button
            key={l}
            className={`filter-chip${activeLevel === l ? ' active' : ''}`}
            style={activeLevel === l && l !== 'All' ? LEVEL_CHIP_STYLE[l as Level] : {}}
            onClick={() => setActiveLevel(l)}
          >
            {l}
          </button>
        ))}
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 16, letterSpacing: '.02em' }}>
        {filtered.length} oefening{filtered.length !== 1 ? 'en' : ''}
      </p>

      <div className="ex-grid">
        {filtered.map((ex) => {
          const [from, to] = ex.gradient
          return (
            <button key={ex.id} className="ex-card" onClick={() => setSelected(ex)}>
              <div
                className="ex-tile"
                style={{ background: `linear-gradient(135deg, ${from}40, ${to}80)` }}
              >
                {/* Subtle radial center glow */}
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: 'inherit',
                  background: `radial-gradient(circle at 40% 35%, ${from}30, transparent 65%)`,
                  pointerEvents: 'none',
                }} />
                <span className={`ex-symbol anim-${ex.animation}`} style={{ color: from }}>
                  {ex.symbol}
                </span>
              </div>
              <div className="ex-info">
                <small style={{ color: GROUP_COLORS[ex.group][0] }}>{ex.group} · {ex.level}</small>
                <strong>{ex.name}</strong>
                <p>{ex.cue}</p>
              </div>
              <em className="ex-duration" style={{ color: from }}>{ex.durationLabel}</em>
            </button>
          )
        })}
      </div>

      {selected && <ExerciseModal exercise={selected} onClose={() => setSelected(null)} />}
    </main>
  )
}
