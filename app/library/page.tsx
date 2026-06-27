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
      <div style={{ padding: '8px 0 16px' }}>
        <p className="eyebrow muted">Oefenbibliotheek</p>
        <h1 className="section-title">Bewegingen die overal werken</h1>
      </div>

      {/* Group filter */}
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

      {/* Level filter */}
      <div className="filter-row" style={{ paddingTop: 0 }}>
        {LEVELS.map((l) => (
          <button
            key={l}
            className={`filter-chip${activeLevel === l ? ' active' : ''}`}
            onClick={() => setActiveLevel(l)}
            style={activeLevel === l && l !== 'All' ? {
              background: l === 'Beast' ? 'rgba(212,252,90,.2)' : l === 'Strong' ? 'rgba(147,197,253,.2)' : 'var(--faint)',
              borderColor: l === 'Beast' ? 'rgba(212,252,90,.5)' : l === 'Strong' ? 'rgba(147,197,253,.4)' : 'var(--border)',
              color: l === 'Beast' ? 'var(--lime)' : l === 'Strong' ? '#93c5fd' : 'var(--muted)',
            } : {}}
          >
            {l}
          </button>
        ))}
      </div>

      <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>
        {filtered.length} oefening{filtered.length !== 1 ? 'en' : ''}
      </p>

      <div className="ex-grid">
        {filtered.map((ex) => {
          const [from, to] = ex.gradient
          return (
            <button key={ex.id} className="ex-card" onClick={() => setSelected(ex)}>
              <div
                className="ex-tile"
                style={{ background: `linear-gradient(135deg, ${from}44, ${to}88)` }}
              >
                <span
                  className={`ex-symbol anim-${ex.animation}`}
                  style={{ color: from }}
                >
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

      {selected && (
        <ExerciseModal exercise={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  )
}
