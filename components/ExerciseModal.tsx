'use client'

import { Exercise } from '@/lib/data'

type Props = { exercise: Exercise; onClose: () => void }

export default function ExerciseModal({ exercise, onClose }: Props) {
  const accentColor = exercise.gradient[0]

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Sluiten">✕</button>

        <div
          className="modal-graphic"
          style={{ background: `radial-gradient(circle at 50% 50%, ${accentColor}22, var(--s-inset) 70%)` }}
        >
          <span className={`ex-symbol anim-${exercise.animation}`} style={{ color: accentColor, fontSize: 80 }}>
            {exercise.symbol}
          </span>
        </div>

        <p className="eyebrow" style={{ marginTop: 16, color: accentColor }}>
          {exercise.group} · {exercise.level}
        </p>
        <h2 className="modal-title">{exercise.name}</h2>

        <div className="modal-meta">
          <span className="meta-chip">⏱ {exercise.durationLabel}</span>
          <span className="meta-chip" style={
            exercise.level === 'Beast'  ? { color: 'var(--lime)',  borderColor: 'rgba(200,241,53,.25)',  background: 'rgba(200,241,53,.08)' } :
            exercise.level === 'Strong' ? { color: '#5ab0ff',      borderColor: 'rgba(10,132,255,.25)',  background: 'rgba(10,132,255,.08)' } :
            {}
          }>{exercise.level}</span>
        </div>

        <div className="modal-section">
          <p className="modal-label">Uitvoering</p>
          <p style={{ fontSize: 16, lineHeight: 1.55, color: 'var(--t2)' }}>{exercise.cue}</p>
        </div>
        <div className="modal-section" style={{ marginBottom: 8 }}>
          <p className="modal-label">Schaaloptie</p>
          <p style={{ fontSize: 15, color: 'var(--t2)' }}>{exercise.scale}</p>
        </div>
      </div>
    </div>
  )
}
