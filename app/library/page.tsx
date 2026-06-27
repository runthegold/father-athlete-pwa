'use client'

import { useState } from 'react'
import { exercises, Group, Level, GROUP_COLORS } from '@/lib/data'
import ExerciseModal from '@/components/ExerciseModal'
import type { Exercise } from '@/lib/data'

const GROUPS: ('All' | Group)[] = ['All', 'Push', 'Pull', 'Legs', 'Core', 'Mobility', 'Conditioning']
const LEVELS: ('All' | Level)[] = ['All', 'Base', 'Strong', 'Beast']

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
        <p className="eyebrow">Bewegingen</p>
        <h1 className="section-title">Library</h1>
      </div>

      <div className="filter-row">
        {GROUPS.map((g) => (
          <button key={g} className={`filter-chip${activeGroup === g ? ' active' : ''}`} onClick={() => setActiveGroup(g)}>
            {g}
          </button>
        ))}
      </div>

      <div className="filter-row" style={{ paddingTop: 0 }}>
        {LEVELS.map((l) => (
          <button key={l} className={`filter-chip${activeLevel === l ? ' active' : ''}`} onClick={() => setActiveLevel(l)}>
            {l}
          </button>
        ))}
      </div>

      <p style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 16 }}>
        {filtered.length} oefening{filtered.length !== 1 ? 'en' : ''}
      </p>

      <div className="ex-grid">
        {filtered.map((ex) => {
          const accentColor = ex.gradient[0]
          return (
            <button key={ex.id} className="ex-card" onClick={() => setSelected(ex)}>
              {/* Tile: dark background, subtle color tint from group — not loud */}
              <div
                className="ex-tile"
                style={{ background: `radial-gradient(circle at 50% 50%, ${accentColor}18, var(--s-inset) 70%)` }}
              >
                <span className={`ex-symbol anim-${ex.animation}`} style={{ color: accentColor }}>
                  {ex.symbol}
                </span>
              </div>
              <div className="ex-info">
                <small style={{ color: GROUP_COLORS[ex.group][0] }}>{ex.group} · {ex.level}</small>
                <strong>{ex.name}</strong>
                <p>{ex.cue}</p>
              </div>
              <em className="ex-duration">{ex.durationLabel}</em>
            </button>
          )
        })}
      </div>

      {selected && <ExerciseModal exercise={selected} onClose={() => setSelected(null)} />}
    </main>
  )
}
